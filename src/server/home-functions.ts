import { createServerFn } from "@tanstack/react-start";
import { and, countDistinct, desc, eq, or } from "drizzle-orm";
import { db } from "#/db";
import {
	categories,
	productCategories,
	productStores,
	products,
	stores,
} from "#/db/app-schema";

export const getHomeData = createServerFn({
	method: "GET",
})
	.validator((data: { storeId?: string } | undefined) => data)
	.handler(async ({ data }) => {
		const storeId = data?.storeId;
		const allStores = await db.select().from(stores);

		const recentProductRows = await db
			.select({
				id: products.id,
				createdAt: products.createdAt,
			})
			.from(products)
			.where(eq(products.status, "approved"))
			.orderBy(desc(products.createdAt))
			.limit(10);

		let recentProducts: any[] = [];
		if (recentProductRows.length > 0) {
			const fullProducts = await db.query.products.findMany({
				where: or(...recentProductRows.map((p) => eq(products.id, p.id))),
				with: {
					productCategories: {
						with: { category: true },
					},
					productStores: {
						with: { store: true },
					},
					productIngredients: true,
				},
			});

			recentProducts = recentProductRows
				.map((pr) => {
					const p = fullProducts.find((fp) => fp.id === pr.id);
					if (!p) return null;
					return {
						id: p.id,
						name: p.name,
						brand: p.brand,
						score: p.score,
						imageFrontUrl: p.imageFrontUrl,
						categoryName:
							p.productCategories?.[0]?.category?.name || "Uncategorized",
						storeName: p.productStores?.[0]?.store?.name || null,
						stores:
							p.productStores?.map((ps) => ps.store).filter(Boolean) || [],
						ingredientIds:
							p.productIngredients?.map((pi) => pi.ingredientId) || [],
						status: p.status,
						createdAt: p.createdAt,
					};
				})
				.filter(Boolean);
		}

		const popularCategories = storeId
			? await db
					.select({
						id: categories.id,
						name: categories.name,
						iconUrl: categories.iconUrl,
						productCount: countDistinct(products.id),
					})
					.from(categories)
					.innerJoin(
						productCategories,
						eq(categories.id, productCategories.categoryId),
					)
					.innerJoin(
						products,
						and(
							eq(productCategories.productId, products.id),
							eq(products.status, "approved"),
						),
					)
					.innerJoin(
						productStores,
						and(
							eq(products.id, productStores.productId),
							eq(productStores.storeId, storeId),
						),
					)
					.groupBy(categories.id)
					.orderBy(desc(countDistinct(products.id)))
					.limit(6)
			: await db
					.select({
						id: categories.id,
						name: categories.name,
						iconUrl: categories.iconUrl,
						productCount: countDistinct(products.id),
					})
					.from(categories)
					.leftJoin(
						productCategories,
						eq(categories.id, productCategories.categoryId),
					)
					.leftJoin(
						products,
						and(
							eq(productCategories.productId, products.id),
							eq(products.status, "approved"),
						),
					)
					.groupBy(categories.id)
					.orderBy(desc(countDistinct(products.id)))
					.limit(6);

		return {
			stores: allStores,
			recentProducts,
			popularCategories,
		};
	});
