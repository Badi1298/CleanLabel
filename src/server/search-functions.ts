import { createServerFn } from "@tanstack/react-start";
import { and, eq, ilike, or } from "drizzle-orm";
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
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
});

export const getSearchResults = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof searchOptionsSchema>) => data)
	.handler(async ({ data }) => {
		const { q, storeId, categoryId, score } = data;

		const whereConditions = [];

		// Only show approved products in public search
		whereConditions.push(eq(products.status, "approved"));

		if (score && score !== "none") {
			whereConditions.push(eq(products.score, score));
		}

		if (categoryId) {
			whereConditions.push(eq(productCategories.categoryId, categoryId));
		}

		if (q) {
			const searchTerm = `%${q}%`;
			whereConditions.push(
				or(
					ilike(products.name, searchTerm),
					ilike(products.brand, searchTerm),
					ilike(categories.name, searchTerm),
					ilike(products.rawIngredientsText, searchTerm),
				),
			);
		}

		if (storeId) {
			whereConditions.push(eq(productStores.storeId, storeId));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		let query = db
			.selectDistinct({
				id: products.id,
				createdAt: products.createdAt,
			})
			.from(products)
			.leftJoin(productCategories, eq(products.id, productCategories.productId))
			.leftJoin(categories, eq(productCategories.categoryId, categories.id));

		if (storeId) {
			query = query.innerJoin(
				productStores,
				eq(products.id, productStores.productId),
			) as any;
		}

		const productRows = await query
			.where(whereClause)
			.orderBy(products.createdAt);

		if (productRows.length === 0) return [];

		const fullProducts = await db.query.products.findMany({
			where: or(...productRows.map((p) => eq(products.id, p.id))),
			with: {
				productCategories: {
					with: { category: true },
				},
			},
			orderBy: (products, { asc }) => [asc(products.createdAt)],
		});

		const sortedProducts = productRows
			.map((pr) => fullProducts.find((fp) => fp.id === pr.id)!)
			.filter(Boolean);

		return sortedProducts.map((p) => ({
			product: p,
			category: p.productCategories?.[0]?.category || null,
		}));
	});
