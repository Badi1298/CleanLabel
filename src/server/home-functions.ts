import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "#/db";
import { categories, products, stores } from "#/db/app-schema";

export const getHomeData = createServerFn({
	method: "GET",
}).handler(async () => {
	const allStores = await db.select().from(stores);

	const recentProducts = await db
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
		.orderBy(desc(products.createdAt))
		.limit(10);

	return {
		stores: allStores,
		recentProducts,
	};
});
