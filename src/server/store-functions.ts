import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { productStores, products, stores } from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

export const getStores = createServerFn({
	method: "GET",
}).handler(async () => {
	return await db.select().from(stores).orderBy(stores.name);
});

const addStoreSchema = z.object({
	name: z.string().min(1, "Name is required"),
	logoUrl: z.string().optional(),
});

export const addStore = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addStoreSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [newStore] = await db
			.insert(stores)
			.values({
				name: data.name,
				logoUrl: data.logoUrl || undefined,
			})
			.returning();

		return newStore;
	});

const updateStoreSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	logoUrl: z.string().optional(),
});

export const updateStore = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof updateStoreSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [updatedStore] = await db
			.update(stores)
			.set({
				name: data.name,
				logoUrl: data.logoUrl || undefined,
			})
			.where(eq(stores.id, data.id))
			.returning();

		return updatedStore;
	});

const storeIdSchema = z.object({
	id: z.string(),
});

export const getStoreExclusiveProducts = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof storeIdSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const exclusiveProducts = await db
			.select({
				id: products.id,
				name: products.name,
				brand: products.brand,
			})
			.from(products)
			.innerJoin(productStores, eq(products.id, productStores.productId))
			.where(
				and(
					eq(productStores.storeId, data.id),
					sql`NOT EXISTS (
						SELECT 1 FROM ${productStores} ps2 
						WHERE ps2.product_id = ${products.id} 
						AND ps2.store_id != ${data.id}
					)`,
				),
			);

		return exclusiveProducts;
	});

const deleteStoreSchema = z.object({
	id: z.string(),
});

export const deleteStore = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof deleteStoreSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const exclusiveProducts = await db
			.select({
				id: products.id,
				name: products.name,
			})
			.from(products)
			.innerJoin(productStores, eq(products.id, productStores.productId))
			.where(
				and(
					eq(productStores.storeId, data.id),
					sql`NOT EXISTS (
						SELECT 1 FROM ${productStores} ps2 
						WHERE ps2.product_id = ${products.id} 
						AND ps2.store_id != ${data.id}
					)`,
				),
			);

		if (exclusiveProducts.length > 0) {
			throw new Error(
				`Cannot delete store because ${exclusiveProducts.length} product(s) are only available at this store. Please assign them to another store first.`,
			);
		}

		await db.delete(stores).where(eq(stores.id, data.id));

		return { success: true };
	});
