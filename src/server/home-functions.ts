import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, or } from "drizzle-orm";
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

		let productsQuery = db
			.selectDistinct({
				id: products.id,
				createdAt: products.createdAt,
			})
			.from(products)
			.$dynamic();

		const filters = [eq(products.status, "approved")];

		if (storeId) {
			productsQuery = productsQuery.innerJoin(
				productStores,
				eq(products.id, productStores.productId),
			);
			filters.push(eq(productStores.storeId, storeId));
		}

		const recentProductRows = await productsQuery
			.where(and(...filters))
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
						status: p.status,
						createdAt: p.createdAt,
					};
				})
				.filter(Boolean);
		}

		const popularCategories = await db
			.select({
				id: categories.id,
				name: categories.name,
				iconUrl: categories.iconUrl,
				productCount: count(products.id),
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
			.orderBy(desc(count(products.id)))
			.limit(6);

		return {
			stores: allStores,
			recentProducts,
			popularCategories,
		};
	});
