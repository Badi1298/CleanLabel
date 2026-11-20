import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "#/db";
import {
	categories,
	offCategoryMappings,
	productCategories,
	productStores,
	products,
	unmappedOffTags,
} from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

const getCategoriesSchema = z.object({
	pageIndex: z.number().default(0),
	pageSize: z.number().default(10),
	globalFilter: z.string().optional(),
});

export const getCategories = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getCategoriesSchema>) => data)
	.handler(async ({ data }) => {
		const { pageIndex, pageSize, globalFilter } = data;
		const offset = pageIndex * pageSize;

		const whereClause = globalFilter
			? ilike(categories.name, `%${globalFilter}%`)
			: undefined;

		const parentCategories = alias(categories, "parent_categories");

		const [categoryRows, [{ totalCount }]] = await Promise.all([
			db
				.select({
					id: categories.id,
					name: categories.name,
					iconUrl: categories.iconUrl,
					parentId: categories.parentId,
					parentName: parentCategories.name,
				})
				.from(categories)
				.leftJoin(
					parentCategories,
					eq(categories.parentId, parentCategories.id),
				)
				.where(whereClause)
				.orderBy(categories.name)
				.limit(pageSize)
				.offset(offset),
			db
				.select({ totalCount: count(categories.id) })
				.from(categories)
				.where(whereClause),
		]);

		return {
			data: categoryRows,
			rowCount: totalCount,
		};
	});

const addCategorySchema = z.object({
	name: z.string().min(1, "Name is required"),
	iconUrl: z.string().optional(),
	parentId: z.string().optional(),
});

export const addCategory = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addCategorySchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [newCategory] = await db
			.insert(categories)
			.values({
				name: data.name,
				iconUrl: data.iconUrl || undefined,
				parentId: data.parentId || undefined,
			})
			.returning();

		return newCategory;
	});

export const getCategory = createServerFn({
	method: "GET",
})
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const [category] = await db
			.select()
			.from(categories)
			.where(eq(categories.id, data.id))
			.limit(1);

		if (!category) {
			throw new Error("Category not found");
		}

		return category;
	});

const updateCategorySchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	iconUrl: z.string().optional(),
	parentId: z.string().optional().nullable(),
});

export const updateCategory = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof updateCategorySchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [updatedCategory] = await db
			.update(categories)
			.set({
				name: data.name,
				iconUrl: data.iconUrl || undefined,
				parentId: data.parentId === null ? null : data.parentId || undefined,
			})
			.where(eq(categories.id, data.id))
			.returning();

		return updatedCategory;
	});

export const getUnmappedTags = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getCategoriesSchema>) => data)
	.handler(async ({ data }) => {
		const { pageIndex, pageSize, globalFilter } = data;
		const offset = pageIndex * pageSize;

		const whereClause = globalFilter
			? ilike(unmappedOffTags.tag, `%${globalFilter}%`)
			: undefined;

		const [tagRows, [{ totalCount }]] = await Promise.all([
			db
				.select()
				.from(unmappedOffTags)
				.where(whereClause)
				.orderBy(desc(unmappedOffTags.occurrences))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ totalCount: count(unmappedOffTags.tag) })
				.from(unmappedOffTags)
				.where(whereClause),
		]);

		return {
			data: tagRows,
			rowCount: totalCount,
		};
	});

const mapOffTagSchema = z.object({
	tag: z.string(),
	categoryId: z.string(),
});

export const mapOffTagToCategory = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof mapOffTagSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		await db
			.insert(offCategoryMappings)
			.values({
				offTag: data.tag,
				categoryId: data.categoryId,
			})
			.onConflictDoUpdate({
				target: offCategoryMappings.offTag,
				set: { categoryId: data.categoryId },
			});

		await db.delete(unmappedOffTags).where(eq(unmappedOffTags.tag, data.tag));

		const productsToUpdate = await db
			.select({ id: products.id })
			.from(products)
			.where(sql`${products.offTags} @> ${JSON.stringify([data.tag])}::jsonb`);

		for (const p of productsToUpdate) {
			await db
				.update(productCategories)
				.set({ categoryId: data.categoryId })
				.where(eq(productCategories.productId, p.id));
		}

		return { success: true, updatedCount: productsToUpdate.length };
	});

const deleteCategorySchema = z.object({
	id: z.string(),
});

export const deleteCategory = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof deleteCategorySchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		await db.delete(categories).where(eq(categories.id, data.id));

		return { success: true };
	});

const getActiveCategoriesSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
});

export const getActiveCategories = createServerFn({
	method: "GET",
})
	.validator((data: z.input<typeof getActiveCategoriesSchema>) =>
		getActiveCategoriesSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const { q, storeId, score } = data;
		const activeParentCategories = alias(
			categories,
			"active_parent_categories",
		);
		const topCategoryIdExpr = sql<string>`coalesce(${activeParentCategories.id}, ${categories.id})`;

		const whereConditions = [eq(products.status, "approved")];

		if (score) {
			whereConditions.push(eq(products.score, score));
		}

		if (storeId) {
			whereConditions.push(
				sql`EXISTS (SELECT 1 FROM ${productStores} WHERE ${productStores.productId} = ${products.id} AND ${productStores.storeId} = ${storeId})`,
			);
		}

		const trimmedQ = q?.trim();
		if (trimmedQ) {
			const searchTerm = `%${trimmedQ}%`;
			const searchCondition = or(
				ilike(products.name, searchTerm),
				ilike(products.brand, searchTerm),
				ilike(categories.name, searchTerm),
				ilike(activeParentCategories.name, searchTerm),
				ilike(products.rawIngredientsText, searchTerm),
			);
			if (searchCondition) {
				whereConditions.push(searchCondition);
			}
		}

		const whereClause = and(...whereConditions);

		const [topLevelRows, subCategoryRows, totalCountRows] = await Promise.all([
			db
				.select({
					id: topCategoryIdExpr,
					count: sql<number>`count(distinct ${products.id})::int`,
				})
				.from(productCategories)
				.innerJoin(products, eq(productCategories.productId, products.id))
				.innerJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					activeParentCategories,
					eq(categories.parentId, activeParentCategories.id),
				)
				.where(whereClause)
				.groupBy(topCategoryIdExpr),
			db
				.select({
					id: categories.id,
					count: sql<number>`count(distinct ${products.id})::int`,
				})
				.from(productCategories)
				.innerJoin(products, eq(productCategories.productId, products.id))
				.innerJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					activeParentCategories,
					eq(categories.parentId, activeParentCategories.id),
				)
				.where(and(whereClause, isNotNull(categories.parentId)))
				.groupBy(categories.id),
			db
				.select({
					totalCount: sql<number>`count(distinct ${products.id})::int`,
				})
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					activeParentCategories,
					eq(categories.parentId, activeParentCategories.id),
				)
				.where(whereClause),
		]);

		const countsById = new Map<string, number>();
		for (const row of subCategoryRows) {
			countsById.set(row.id, Number(row.count));
		}
		for (const row of topLevelRows) {
			countsById.set(row.id, Number(row.count));
		}

		return {
			categories: Array.from(countsById, ([id, count]) => ({ id, count })),
			totalProductsCount: Number(totalCountRows[0]?.totalCount ?? 0),
		};
	});
