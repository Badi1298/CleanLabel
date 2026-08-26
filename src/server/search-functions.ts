import { createServerFn } from "@tanstack/react-start";
import { and, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { categories, productStores, products } from "#/db/app-schema";

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
			whereConditions.push(eq(products.categoryId, categoryId));
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
			.select({
				product: products,
				category: categories,
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id));

		if (storeId) {
			query = query.innerJoin(productStores, eq(products.id, productStores.productId)) as any;
		}

		const results = await query.where(whereClause).orderBy(products.createdAt);
		
		return results;
	});
