import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
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
		const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=code,product_name,brands,categories,nutriscore_grade,image_front_url,image_ingredients_url,ingredients_text,ingredients`;
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

			if (!product || !product.product_name) {
				return { productId: null, source: "not_found" };
			}

			// 3. Map and insert into local DB
			const rawCategories =
				product.categories?.split(",").map((c: string) => c.trim()) || [];
			let categoryName =
				rawCategories.length > 0 ? rawCategories[0] : "Unknown";
			if (categoryName.startsWith("ro:"))
				categoryName = categoryName.substring(3);

			let categoryRecord = await db.query.categories.findFirst({
				where: eq(appSchema.categories.name, categoryName),
			});

			if (!categoryRecord) {
				const [newCat] = await db
					.insert(appSchema.categories)
					.values({ name: categoryName })
					.returning();
				categoryRecord = newCat;
			}

			const brandName =
				product.brands?.split(",")[0]?.trim() || "Unknown Brand";
			const productName = product.product_name;

			const [productRecord] = await db
				.insert(appSchema.products)
				.values({
					barcode: barcode,
					name: productName,
					brand: brandName,
					categoryId: categoryRecord.id,
					score: mapNutriscore(product.nutriscore_grade),
					imageFrontUrl: product.image_front_url || null,
					imageBackUrl: product.image_ingredients_url || null,
					rawIngredientsText: product.ingredients_text || null,
					status: "approved",
				})
				.returning();

			// Handle Ingredients
			if (
				Array.isArray(product.ingredients) &&
				product.ingredients.length > 0
			) {
				for (const ing of product.ingredients) {
					if (!ing.text) continue;
					const ingName = ing.text.trim().toLowerCase();
					if (!ingName) continue;

					let ingredientRecord = await db.query.ingredients.findFirst({
						where: eq(appSchema.ingredients.name, ingName),
					});

					if (!ingredientRecord) {
						const [newIng] = await db
							.insert(appSchema.ingredients)
							.values({ name: ingName })
							.returning();
						ingredientRecord = newIng;
					}

					try {
						await db.insert(appSchema.productIngredients).values({
							productId: productRecord.id,
							ingredientId: ingredientRecord.id,
						});
					} catch (e: any) {
						if (e.code !== "23505")
							console.error(`Error linking ingredient:`, e);
					}
				}
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
