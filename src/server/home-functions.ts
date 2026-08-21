import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { db } from "#/db";
import { categories, productStores, products, stores } from "#/db/app-schema";

export const getHomeData = createServerFn({
	method: "GET",
})
	.validator((data: { storeId?: string } | undefined) => data)
	.handler(async ({ data }) => {
		const storeId = data?.storeId;
		const allStores = await db.select().from(stores);

		let productsQuery = db
			.select({
				id: products.id,
				name: products.name,
				brand: products.brand,
				score: products.score,
				imageFrontUrl: products.imageFrontUrl,
				categoryName: categories.name,
				status: products.status,
				createdAt: products.createdAt,
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.$dynamic();

		if (storeId) {
			productsQuery = productsQuery
				.innerJoin(productStores, eq(products.id, productStores.productId))
				.where(eq(productStores.storeId, storeId));
		}

		const recentProducts = await productsQuery
			.orderBy(desc(products.createdAt))
			.limit(10);

		const popularCategories = await db
			.select({
				id: categories.id,
				name: categories.name,
				iconUrl: categories.iconUrl,
				productCount: count(products.id),
			})
			.from(categories)
			.leftJoin(products, eq(categories.id, products.categoryId))
			.groupBy(categories.id)
			.orderBy(desc(count(products.id)))
			.limit(6);

		return {
			stores: allStores,
			recentProducts,
			popularCategories,
		};
	});
