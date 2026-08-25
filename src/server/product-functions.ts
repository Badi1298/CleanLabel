import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { categories, products } from "#/db/app-schema";
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
	categoryId: z.string().min(1, "Category is required"),
	score: z.enum(["gold", "silver", "bronze", "none"]).default("none"),
	status: z.enum(["pending_review", "approved", "rejected"]).default("pending_review"),
	rawIngredientsText: z.string().optional(),
	imageFrontUrl: z.string().optional(),
	imageBackUrl: z.string().optional(),
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
				categoryId: data.categoryId,
				score: data.score,
				status: data.status,
				rawIngredientsText: data.rawIngredientsText || undefined,
				imageFrontUrl: data.imageFrontUrl || undefined,
				imageBackUrl: data.imageBackUrl || undefined,
				submittedById: session.user.id,
			})
			.returning();

		return newProduct;
	});

export const getPendingProducts = createServerFn({
	method: "GET",
}).handler(async () => {
	await ensureSession();
	return await db
		.select({
			product: products,
			category: categories,
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.where(eq(products.status, "pending_review"))
		.orderBy(products.createdAt);
});

export const getProductById = createServerFn({
	method: "GET",
})
	.validator((productId: string) => productId)
	.handler(async ({ data: productId }) => {
		await ensureSession();
		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, productId));
		return product;
	});

const updateProductSchema = z.object({
	id: z.string().min(1),
	barcode: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	brand: z.string().min(1, "Brand is required"),
	categoryId: z.string().min(1, "Category is required"),
	score: z.enum(["gold", "silver", "bronze", "none"]).default("none"),
	status: z.enum(["pending_review", "approved", "rejected"]).default("pending_review"),
	rawIngredientsText: z.string().optional(),
	imageFrontUrl: z.string().optional(),
	imageBackUrl: z.string().optional(),
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
				categoryId: data.categoryId,
				score: data.score,
				status: data.status,
				rawIngredientsText: data.rawIngredientsText || undefined,
				imageFrontUrl: data.imageFrontUrl || undefined,
				imageBackUrl: data.imageBackUrl || undefined,
			})
			.where(eq(products.id, data.id))
			.returning();

		return updatedProduct;
	});
