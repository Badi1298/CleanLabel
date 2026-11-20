import { createServerFn } from "@tanstack/react-start";
import { and, countDistinct, desc, eq, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
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
		const allStores = await db
			.select({
				id: stores.id,
				name: stores.name,
				logoUrl: stores.logoUrl,
				productCount: sql<number>`count(distinct ${products.id})::int`,
			})
			.from(stores)
			.leftJoin(productStores, eq(stores.id, productStores.storeId))
			.leftJoin(
				products,
				and(
					eq(productStores.productId, products.id),
					eq(products.status, "approved"),
				),
			)
			.groupBy(stores.id)
			.orderBy(stores.name);

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

		const popularParentCategories = alias(
			categories,
			"popular_parent_categories",
		);

		const popularCategories = storeId
			? await db
					.select({
						id: categories.id,
						name: categories.name,
						iconUrl: categories.iconUrl,
						parentId: categories.parentId,
						parentName: popularParentCategories.name,
						parentIconUrl: popularParentCategories.iconUrl,
						productCount: countDistinct(products.id),
					})
					.from(categories)
					.leftJoin(
						popularParentCategories,
						eq(categories.parentId, popularParentCategories.id),
					)
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
					.groupBy(
						categories.id,
						popularParentCategories.name,
						popularParentCategories.iconUrl,
					)
					.orderBy(desc(countDistinct(products.id)))
					.limit(6)
			: await db
					.select({
						id: categories.id,
						name: categories.name,
						iconUrl: categories.iconUrl,
						parentId: categories.parentId,
						parentName: popularParentCategories.name,
						parentIconUrl: popularParentCategories.iconUrl,
						productCount: countDistinct(products.id),
					})
					.from(categories)
					.leftJoin(
						popularParentCategories,
						eq(categories.parentId, popularParentCategories.id),
					)
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
					.groupBy(
						categories.id,
						popularParentCategories.name,
						popularParentCategories.iconUrl,
					)
					.orderBy(desc(countDistinct(products.id)))
					.limit(6);

		return {
			stores: allStores,
			recentProducts,
			popularCategories,
		};
	});
