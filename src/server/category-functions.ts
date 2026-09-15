import { createServerFn } from "@tanstack/react-start";
import { count, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { categories } from "#/db/app-schema";
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

		const [categoryRows, [{ totalCount }]] = await Promise.all([
			db
				.select()
				.from(categories)
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
			})
			.where(eq(categories.id, data.id))
			.returning();

		return updatedCategory;
	});
