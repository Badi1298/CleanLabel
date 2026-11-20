import { createServerFn } from "@tanstack/react-start";
import {
	and,
	asc,
	countDistinct,
	eq,
	ilike,
	inArray,
	isNull,
	or,
	sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "#/db";
import {
	categories,
	productCategories,
	productStores,
	products,
} from "#/db/app-schema";

const searchOptionsSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
	categoryId: z.string().optional(),
	subCategoryIds: z.array(z.string()).optional(),
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
});

const paginatedSearchSchema = searchOptionsSchema.extend({
	limit: z.number().int().min(1).max(60).default(24),
	offset: z.number().int().min(0).default(0),
});

const categorySectionsSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
	limitPerCategory: z.number().int().min(1).max(24).default(8),
});

export const UNCATEGORIZED_CATEGORY_ID = "__uncategorized__";

const parentCategoriesAlias = alias(categories, "parent_categories_filter");

async function buildSearchWhereConditions(
	data: z.infer<typeof searchOptionsSchema>,
) {
	const { q, storeId, categoryId, subCategoryIds, score } = data;
	const whereConditions = [eq(products.status, "approved")];

	if (score) {
		whereConditions.push(eq(products.score, score));
	}

	if (subCategoryIds && subCategoryIds.length > 0) {
		whereConditions.push(inArray(productCategories.categoryId, subCategoryIds));
	} else if (categoryId === UNCATEGORIZED_CATEGORY_ID) {
		whereConditions.push(isNull(productCategories.categoryId));
	} else if (categoryId) {
		const subcats = await db
			.select({ id: categories.id })
			.from(categories)
			.where(eq(categories.parentId, categoryId));
		const catIds = [categoryId, ...subcats.map((c) => c.id)];
		whereConditions.push(inArray(productCategories.categoryId, catIds));
	}

	const trimmedQ = q?.trim();
	if (trimmedQ) {
		const searchTerm = `%${trimmedQ}%`;
		const searchCondition = or(
			ilike(products.name, searchTerm),
			ilike(products.brand, searchTerm),
			ilike(categories.name, searchTerm),
			ilike(parentCategoriesAlias.name, searchTerm),
			ilike(products.rawIngredientsText, searchTerm),
		);
		if (searchCondition) {
			whereConditions.push(searchCondition);
		}
	}

	if (storeId) {
		whereConditions.push(eq(productStores.storeId, storeId));
	}

	return and(...whereConditions);
}

async function hydrateProductsInOrder(productIds: string[]) {
	if (productIds.length === 0) return [];

	const fullProducts = await db.query.products.findMany({
		where: inArray(products.id, productIds),
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

	const byId = new Map(fullProducts.map((p) => [p.id, p]));
	return productIds.flatMap((id) => {
		const p = byId.get(id);
		return p ? [p] : [];
	});
}

function toSearchResultItem(
	p: Awaited<ReturnType<typeof hydrateProductsInOrder>>[number],
) {
	const stores = p.productStores?.map((ps) => ps.store).filter(Boolean) || [];
	return {
		product: {
			...p,
			ingredientIds: p.productIngredients?.map((pi) => pi.ingredientId) || [],
			stores,
		},
		category: p.productCategories?.[0]?.category || null,
		storeName: p.productStores?.[0]?.store?.name || null,
		stores,
	};
}

function toCompactSearchCardItem(
	p: Awaited<ReturnType<typeof hydrateProductsInOrder>>[number],
) {
	const stores = p.productStores?.map((ps) => ps.store).filter(Boolean) || [];
	return {
		product: {
			id: p.id,
			name: p.name,
			brand: p.brand,
			score: p.score,
			imageFrontUrl: p.imageFrontUrl,
			ingredientIds: p.productIngredients?.map((pi) => pi.ingredientId) || [],
			stores,
		},
		storeName: p.productStores?.[0]?.store?.name || null,
		stores,
	};
}

export const getSearchResults = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof searchOptionsSchema>) => data)
	.handler(async ({ data }) => {
		const whereClause = await buildSearchWhereConditions(data);

		const productRows = await db
			.selectDistinct({
				id: products.id,
				createdAt: products.createdAt,
			})
			.from(products)
			.leftJoin(productCategories, eq(products.id, productCategories.productId))
			.leftJoin(categories, eq(productCategories.categoryId, categories.id))
			.leftJoin(
				parentCategoriesAlias,
				eq(categories.parentId, parentCategoriesAlias.id),
			)
			.leftJoin(productStores, eq(products.id, productStores.productId))
			.where(whereClause)
			.orderBy(asc(products.createdAt), asc(products.id));

		const sortedProducts = await hydrateProductsInOrder(
			productRows.map((pr) => pr.id),
		);

		return sortedProducts.map(toSearchResultItem);
	});

export const getPaginatedSearchResults = createServerFn({
	method: "GET",
})
	.validator((data: z.input<typeof paginatedSearchSchema>) =>
		paginatedSearchSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const { limit, offset } = data;
		const whereClause = await buildSearchWhereConditions(data);

		const [productRows, countRows] = await Promise.all([
			db
				.selectDistinct({
					id: products.id,
					createdAt: products.createdAt,
				})
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					parentCategoriesAlias,
					eq(categories.parentId, parentCategoriesAlias.id),
				)
				.leftJoin(productStores, eq(products.id, productStores.productId))
				.where(whereClause)
				.orderBy(asc(products.createdAt), asc(products.id))
				.limit(limit)
				.offset(offset),
			db
				.select({ totalCount: countDistinct(products.id) })
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					parentCategoriesAlias,
					eq(categories.parentId, parentCategoriesAlias.id),
				)
				.leftJoin(productStores, eq(products.id, productStores.productId))
				.where(whereClause),
		]);

		const totalCount = Number(countRows[0]?.totalCount ?? 0);
		const hydrated = await hydrateProductsInOrder(
			productRows.map((row) => row.id),
		);
		const items = hydrated.map(toCompactSearchCardItem);
		const nextOffset =
			offset + items.length < totalCount ? offset + items.length : null;

		return {
			items,
			totalCount,
			nextOffset,
		};
	});

export const getSearchCategorySections = createServerFn({
	method: "GET",
})
	.validator((data: z.input<typeof categorySectionsSchema>) =>
		categorySectionsSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const { limitPerCategory } = data;
		const whereClause = await buildSearchWhereConditions(data);

		const topCategoryIdExpr = sql<string>`coalesce(${parentCategoriesAlias.id}, ${categories.id}, ${UNCATEGORIZED_CATEGORY_ID})`;

		const baseMatches = db.$with("base_matches").as(
			db
				.selectDistinct({
					productId: products.id,
					createdAt: products.createdAt,
					topCategoryId: topCategoryIdExpr.as("top_category_id"),
				})
				.from(products)
				.leftJoin(
					productCategories,
					eq(products.id, productCategories.productId),
				)
				.leftJoin(categories, eq(productCategories.categoryId, categories.id))
				.leftJoin(
					parentCategoriesAlias,
					eq(categories.parentId, parentCategoriesAlias.id),
				)
				.leftJoin(productStores, eq(products.id, productStores.productId))
				.where(whereClause),
		);

		const rankedMatches = db.$with("ranked_matches").as(
			db
				.select({
					productId: baseMatches.productId,
					topCategoryId: baseMatches.topCategoryId,
					totalCount:
						sql<number>`count(*) over (partition by ${baseMatches.topCategoryId})::int`.as(
							"total_count",
						),
					rn: sql<number>`row_number() over (partition by ${baseMatches.topCategoryId} order by ${baseMatches.createdAt} asc, ${baseMatches.productId} asc)::int`.as(
						"rn",
					),
				})
				.from(baseMatches),
		);

		const [sectionRows, totalCountRows, topLevelCategories] = await Promise.all(
			[
				db
					.with(baseMatches, rankedMatches)
					.select({
						productId: rankedMatches.productId,
						topCategoryId: rankedMatches.topCategoryId,
						totalCount: rankedMatches.totalCount,
					})
					.from(rankedMatches)
					.where(sql`${rankedMatches.rn} <= ${limitPerCategory}`)
					.orderBy(rankedMatches.topCategoryId, rankedMatches.rn),
				db
					.select({ totalCount: countDistinct(products.id) })
					.from(products)
					.leftJoin(
						productCategories,
						eq(products.id, productCategories.productId),
					)
					.leftJoin(categories, eq(productCategories.categoryId, categories.id))
					.leftJoin(
						parentCategoriesAlias,
						eq(categories.parentId, parentCategoriesAlias.id),
					)
					.leftJoin(productStores, eq(products.id, productStores.productId))
					.where(whereClause),
				db
					.select()
					.from(categories)
					.where(isNull(categories.parentId))
					.orderBy(asc(categories.name)),
			],
		);

		const totalProductsCount = Number(totalCountRows[0]?.totalCount ?? 0);
		if (sectionRows.length === 0) {
			return {
				sections: [],
				totalProductsCount,
			};
		}

		const uniqueProductIds = Array.from(
			new Set(sectionRows.map((row) => row.productId)),
		);
		const hydratedProducts = await hydrateProductsInOrder(uniqueProductIds);
		const compactProductById = new Map(
			hydratedProducts.map((p) => [p.id, toCompactSearchCardItem(p)]),
		);

		const groupedRows = new Map<
			string,
			{
				totalCount: number;
				products: ReturnType<typeof toCompactSearchCardItem>[];
			}
		>();

		for (const row of sectionRows) {
			const item = compactProductById.get(row.productId);
			if (!item) continue;

			const existing = groupedRows.get(row.topCategoryId);
			if (existing) {
				existing.products.push(item);
			} else {
				groupedRows.set(row.topCategoryId, {
					totalCount: Number(row.totalCount),
					products: [item],
				});
			}
		}

		const sections = topLevelCategories.flatMap((cat) => {
			const group = groupedRows.get(cat.id);
			if (!group || group.products.length === 0) return [];
			return [
				{
					category: {
						id: cat.id,
						name: cat.name,
						iconUrl: cat.iconUrl,
					},
					totalCount: group.totalCount,
					products: group.products,
				},
			];
		});

		const uncategorizedGroup = groupedRows.get(UNCATEGORIZED_CATEGORY_ID);
		if (uncategorizedGroup && uncategorizedGroup.products.length > 0) {
			sections.push({
				category: {
					id: UNCATEGORIZED_CATEGORY_ID,
					name: "Other",
					iconUrl: null,
				},
				totalCount: uncategorizedGroup.totalCount,
				products: uncategorizedGroup.products,
			});
		}

		return {
			sections,
			totalProductsCount,
		};
	});
