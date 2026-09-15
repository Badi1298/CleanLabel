import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	categories,
	productCategories,
	productStores,
	products,
} from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

export const getCategories = createServerFn({
	method: "GET",
}).handler(async () => {
	return await db.select().from(categories).orderBy(categories.name);
});

const addProductSchema = z.object({
	barcode: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	brand: z.string().min(1, "Brand is required"),
	categoryIds: z.array(z.string()).min(1, "At least one category is required"),
	score: z.enum(["gold", "silver", "bronze", "none"]).default("none"),
	status: z
		.enum(["pending_review", "approved", "rejected"])
		.default("pending_review"),
	rawIngredientsText: z.string().optional(),
	imageFrontUrl: z.string().optional(),
	imageBackUrl: z.string().optional(),
	storeIds: z.array(z.string()).optional(),
});

export const addProduct = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addProductSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		const [newProduct] = await db
			.insert(products)
			.values({
				barcode: data.barcode || undefined,
				name: data.name,
				brand: data.brand,
				score: data.score,
				status: data.status,
				rawIngredientsText: data.rawIngredientsText || undefined,
				imageFrontUrl: data.imageFrontUrl || undefined,
				imageBackUrl: data.imageBackUrl || undefined,
				submittedById: session.user.id,
			})
			.returning();

		if (data.storeIds && data.storeIds.length > 0) {
			await db.insert(productStores).values(
				data.storeIds.map((storeId) => ({
					productId: newProduct.id,
					storeId,
				})),
			);
		}

		if (data.categoryIds && data.categoryIds.length > 0) {
			await db.insert(productCategories).values(
				data.categoryIds.map((categoryId) => ({
					productId: newProduct.id,
					categoryId,
				})),
			);
		}

		return newProduct;
	});

const getProductsSchema = z.object({
	pageIndex: z.number().default(0),
	pageSize: z.number().default(10),
	globalFilter: z.string().optional(),
	statusFilter: z.string().optional(),
});

export const getAllProducts = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getProductsSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();
		const { pageIndex, pageSize, globalFilter, statusFilter } = data;
		const offset = pageIndex * pageSize;

		const whereConditions = [];

		if (statusFilter && statusFilter !== "all") {
			whereConditions.push(eq(products.status, statusFilter as any));
		}

		if (globalFilter) {
			whereConditions.push(
				or(
					ilike(products.name, `%${globalFilter}%`),
					ilike(products.brand, `%${globalFilter}%`),
					ilike(categories.name, `%${globalFilter}%`),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const [productRows, [{ totalCount }]] = await Promise.all([
			db
				.selectDistinct({
					id: products.id,
					createdAt: products.createdAt,
				})
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.where(whereClause)
				.orderBy(products.createdAt)
				.limit(pageSize)
				.offset(offset),
			db
				.select({ totalCount: count(products.id) })
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.where(whereClause),
		]);

		const fullProducts = await db.query.products.findMany({
			where: or(...productRows.map((p) => eq(products.id, p.id))),
			with: {
				productCategories: {
					with: { category: true },
				},
			},
			orderBy: (products, { asc }) => [asc(products.createdAt)],
		});

		const sortedProducts = productRows
			.map((pr) => fullProducts.find((fp) => fp.id === pr.id)!)
			.filter(Boolean);

		return {
			data: sortedProducts.map((p) => ({
				product: p,
				categories: p.productCategories?.map(pc => pc.category).filter(Boolean) || [],
			})),
			rowCount: totalCount,
		};
	});

export const getProductById = createServerFn({
	method: "GET",
})
	.validator((productId: string) => productId)
	.handler(async ({ data: productId }) => {
		await ensureSession();
		const product = await db.query.products.findFirst({
			where: eq(products.id, productId),
			with: {
				productStores: true,
				productCategories: true,
			},
		});
		return product;
	});

const updateProductSchema = z.object({
	id: z.string().min(1),
	barcode: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	brand: z.string().min(1, "Brand is required"),
	categoryIds: z.array(z.string()).min(1, "At least one category is required"),
	score: z.enum(["gold", "silver", "bronze", "none"]).default("none"),
	status: z
		.enum(["pending_review", "approved", "rejected"])
		.default("pending_review"),
	rawIngredientsText: z.string().optional(),
	imageFrontUrl: z.string().optional(),
	imageBackUrl: z.string().optional(),
	storeIds: z.array(z.string()).optional(),
});

export const updateProduct = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof updateProductSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [updatedProduct] = await db
			.update(products)
			.set({
				barcode: data.barcode || undefined,
				name: data.name,
				brand: data.brand,
				score: data.score,
				status: data.status,
				rawIngredientsText: data.rawIngredientsText || undefined,
				imageFrontUrl: data.imageFrontUrl || undefined,
				imageBackUrl: data.imageBackUrl || undefined,
			})
			.where(eq(products.id, data.id))
			.returning();

		if (data.storeIds !== undefined) {
			await db
				.delete(productStores)
				.where(eq(productStores.productId, data.id));
			if (data.storeIds.length > 0) {
				await db.insert(productStores).values(
					data.storeIds.map((storeId) => ({
						productId: data.id,
						storeId,
					})),
				);
			}
		}

		if (data.categoryIds !== undefined) {
			await db
				.delete(productCategories)
				.where(eq(productCategories.productId, data.id));
			if (data.categoryIds.length > 0) {
				await db.insert(productCategories).values(
					data.categoryIds.map((categoryId) => ({
						productId: data.id,
						categoryId,
					})),
				);
			}
		}

		return updatedProduct;
	});

export const getProductDetailsById = createServerFn({
	method: "GET",
})
	.validator((productId: string) => productId)
	.handler(async ({ data: productId }) => {
		const product = await db.query.products.findFirst({
			where: (products, { eq }) => eq(products.id, productId),
			with: {
				productCategories: {
					with: { category: true },
				},
				submittedBy: true,
				productIngredients: {
					with: {
						ingredient: true,
					},
				},
				productStores: {
					with: {
						store: true,
					},
				},
			},
		});
		return product;
	});
