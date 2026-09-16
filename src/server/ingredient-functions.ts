import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	ingredients,
	offIngredientMappings,
	productIngredients,
	products,
	unmappedOffIngredients,
} from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

const getIngredientsSchema = z.object({
	pageIndex: z.number().default(0),
	pageSize: z.number().default(10),
	globalFilter: z.string().optional(),
});

export const getIngredients = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getIngredientsSchema>) => data)
	.handler(async ({ data }) => {
		const { pageIndex, pageSize, globalFilter } = data;
		const offset = pageIndex * pageSize;

		const whereClause = globalFilter
			? ilike(ingredients.name, `%${globalFilter}%`)
			: undefined;

		const [ingredientRows, [{ totalCount }]] = await Promise.all([
			db
				.select()
				.from(ingredients)
				.where(whereClause)
				.orderBy(ingredients.name)
				.limit(pageSize)
				.offset(offset),
			db
				.select({ totalCount: count(ingredients.id) })
				.from(ingredients)
				.where(whereClause),
		]);

		return {
			data: ingredientRows,
			rowCount: totalCount,
		};
	});

const addIngredientSchema = z.object({
	name: z.string().min(1, "Name is required"),
	hazardLevel: z.string().optional(),
	description: z.string().optional(),
});

export const addIngredient = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addIngredientSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [newIngredient] = await db
			.insert(ingredients)
			.values({
				name: data.name,
				hazardLevel: data.hazardLevel || undefined,
				description: data.description || undefined,
			})
			.returning();

		return newIngredient;
	});

export const getIngredient = createServerFn({
	method: "GET",
})
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const [ingredient] = await db
			.select()
			.from(ingredients)
			.where(eq(ingredients.id, data.id))
			.limit(1);

		if (!ingredient) {
			throw new Error("Ingredient not found");
		}

		return ingredient;
	});

const updateIngredientSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	hazardLevel: z.string().optional(),
	description: z.string().optional(),
});

export const updateIngredient = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof updateIngredientSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [updatedIngredient] = await db
			.update(ingredients)
			.set({
				name: data.name,
				hazardLevel: data.hazardLevel || undefined,
				description: data.description || undefined,
			})
			.where(eq(ingredients.id, data.id))
			.returning();

		return updatedIngredient;
	});

export const getUnmappedIngredients = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getIngredientsSchema>) => data)
	.handler(async ({ data }) => {
		const { pageIndex, pageSize, globalFilter } = data;
		const offset = pageIndex * pageSize;

		const whereClause = globalFilter
			? ilike(unmappedOffIngredients.tag, `%${globalFilter}%`)
			: undefined;

		const [tagRows, [{ totalCount }]] = await Promise.all([
			db
				.select()
				.from(unmappedOffIngredients)
				.where(whereClause)
				.orderBy(desc(unmappedOffIngredients.occurrences))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ totalCount: count(unmappedOffIngredients.tag) })
				.from(unmappedOffIngredients)
				.where(whereClause),
		]);

		return {
			data: tagRows,
			rowCount: totalCount,
		};
	});

const mapOffIngredientSchema = z.object({
	tag: z.string(),
	ingredientId: z.string(),
});

export const mapOffIngredientToIngredient = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof mapOffIngredientSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		await db
			.insert(offIngredientMappings)
			.values({
				offTag: data.tag,
				ingredientId: data.ingredientId,
			})
			.onConflictDoUpdate({
				target: offIngredientMappings.offTag,
				set: { ingredientId: data.ingredientId },
			});

		await db.delete(unmappedOffIngredients).where(eq(unmappedOffIngredients.tag, data.tag));

		const productsToUpdate = await db
			.select({ id: products.id })
			.from(products)
			.where(sql`${products.offIngredients} @> ${JSON.stringify([data.tag])}::jsonb`);

		for (const p of productsToUpdate) {
			try {
				await db
					.insert(productIngredients)
					.values({ productId: p.id, ingredientId: data.ingredientId });
			} catch (e: any) {
				// Ignore unique constraint violation if product already has this ingredient
				if (e.code !== "23505" && e.cause?.code !== "23505") {
					console.error("Error updating product ingredient mapping:", e);
				}
			}
		}

		return { success: true, updatedCount: productsToUpdate.length };
	});
