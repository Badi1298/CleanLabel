import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { db } from "#/db";
import * as appSchema from "#/db/app-schema";

const mapNutriscore = (
	score?: string,
): "gold" | "silver" | "bronze" | "none" => {
	if (!score) return "none";
	const lower = score.toLowerCase();
	if (lower === "a" || lower === "b") return "gold";
	if (lower === "c") return "silver";
	if (lower === "d" || lower === "e") return "bronze";
	return "none";
};

async function resolveOffCategory(
	categoriesHierarchy: string[],
): Promise<string> {
	if (!categoriesHierarchy || categoriesHierarchy.length === 0) {
		return getOrCreateUncategorized();
	}

	for (let i = categoriesHierarchy.length - 1; i >= 0; i--) {
		const tag = categoriesHierarchy[i];
		const mapping = await db.query.offCategoryMappings.findFirst({
			where: eq(appSchema.offCategoryMappings.offTag, tag),
		});
		if (mapping) {
			return mapping.categoryId;
		}
	}

	for (const tag of categoriesHierarchy) {
		await db
			.insert(appSchema.unmappedOffTags)
			.values({ tag, occurrences: 1 })
			.onConflictDoUpdate({
				target: appSchema.unmappedOffTags.tag,
				set: { occurrences: sql`${appSchema.unmappedOffTags.occurrences} + 1` },
			});
	}

	return getOrCreateUncategorized();
}

async function getOrCreateUncategorized(): Promise<string> {
	let uncategorized = await db.query.categories.findFirst({
		where: eq(appSchema.categories.name, "Uncategorized"),
	});

	if (!uncategorized) {
		const [newCat] = await db
			.insert(appSchema.categories)
			.values({ name: "Uncategorized" })
			.returning();
		uncategorized = newCat;
	}

	return uncategorized.id;
}

export const processBarcodeScan = createServerFn({
	method: "POST",
})
	.validator((barcode: string) => barcode)
	.handler(async ({ data: barcode }) => {
		// 1. Check local DB
		const existingProduct = await db.query.products.findFirst({
			where: eq(appSchema.products.barcode, barcode),
			columns: { id: true },
		});

		if (existingProduct) {
			return { productId: existingProduct.id, source: "local" };
		}

		// 2. Fetch from OFF
		const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=code,product_name,product_name_ro,brands,categories_tags,categories_hierarchy,ingredients_text_ro,ingredients_text,image_front_url,image_ingredients_url,stores_tags,nutriscore_grade,nova_group,additives_tags,ingredients&lc=ro&cc=ro`;
		console.log("Fetching from OFF:", url);

		try {
			const response = await fetch(url, {
				headers: {
					"User-Agent":
						"CleanLabelApp - Web - Version 1.0 (serbandavid83@gmail.com)",
				},
			});

			if (!response.ok) {
				return { productId: null, source: "not_found" };
			}

			const data = await response.json();
			const product = data.product;

			if (!product || (!product.product_name && !product.product_name_ro)) {
				return { productId: null, source: "not_found" };
			}

			// 3. Map and insert into local DB
			let categoriesHierarchy: string[] = [];
			if (Array.isArray(product.categories_hierarchy)) {
				categoriesHierarchy = product.categories_hierarchy;
			} else if (typeof product.categories_hierarchy === "string") {
				categoriesHierarchy = product.categories_hierarchy
					.split(",")
					.map((c: string) => c.trim());
			}

			const categoryId = await resolveOffCategory(categoriesHierarchy);

			const brandName =
				product.brands?.split(",")[0]?.trim() || "Unknown Brand";
			const productName =
				product.product_name_ro || product.product_name || "Unknown Product";
			const ingredientsText =
				product.ingredients_text_ro || product.ingredients_text || null;

			const [productRecord] = await db
				.insert(appSchema.products)
				.values({
					barcode: barcode,
					name: productName,
					brand: brandName,
					score: mapNutriscore(product.nutriscore_grade),
					imageFrontUrl: product.image_front_url || null,
					imageBackUrl: product.image_ingredients_url || null,
					rawIngredientsText: ingredientsText,
					status: "approved",
					offTags: categoriesHierarchy,
					isReviewed: false,
				})
				.returning();

			await db.insert(appSchema.productCategories).values({
				productId: productRecord.id,
				categoryId: categoryId,
			});

			// Handle Ingredients
			const offIngredientsToStore: string[] = [];

			if (
				Array.isArray(product.ingredients) &&
				product.ingredients.length > 0
			) {
				for (const ing of product.ingredients) {
					if (!ing.text) continue;
					const ingName = ing.text.trim().toLowerCase();
					if (!ingName) continue;

					// 1. Check if it's already mapped
					const mapping = await db.query.offIngredientMappings.findFirst({
						where: eq(appSchema.offIngredientMappings.offTag, ingName),
					});

					if (mapping) {
						// Link directly
						try {
							await db.insert(appSchema.productIngredients).values({
								productId: productRecord.id,
								ingredientId: mapping.ingredientId,
							});
						} catch (e: any) {
							if (e.code !== "23505" && e.cause?.code !== "23505")
								console.error(`Error linking ingredient:`, e);
						}
					} else {
						// Store in unmapped and push to product's offIngredients array
						offIngredientsToStore.push(ingName);

						await db
							.insert(appSchema.unmappedOffIngredients)
							.values({ tag: ingName, occurrences: 1 })
							.onConflictDoUpdate({
								target: appSchema.unmappedOffIngredients.tag,
								set: {
									occurrences: sql`${appSchema.unmappedOffIngredients.occurrences} + 1`,
								},
							});
					}
				}
			}

			if (offIngredientsToStore.length > 0) {
				await db
					.update(appSchema.products)
					.set({ offIngredients: offIngredientsToStore })
					.where(eq(appSchema.products.id, productRecord.id));
			}

			return { productId: productRecord.id, source: "off_cached" };
		} catch (error) {
			console.error("Error in processBarcodeScan:", error);
			return { productId: null, source: "error" };
		}
	});

export const testFetchOffProduct = createServerFn({
	method: "GET",
})
	.validator((barcode?: string) => barcode)
	.handler(async ({ data: barcode }) => {
		const targetBarcode = barcode || "3017624010701";
		const url = `https://world.openfoodfacts.net/api/v2/product/${targetBarcode}?fields=product_name,nutriscore_data`;

		console.log("Fetching OFF product:", url);
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"CleanLabelApp - Web - Version 1.0 (serbandavid83@gmail.com)",
			},
		});

		if (!response.ok) {
			throw new Error(`OFF API error: ${response.status}`);
		}

		return await response.json();
	});
