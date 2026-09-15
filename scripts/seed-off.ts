import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, sql } from "drizzle-orm";
import * as appSchema from "../src/db/app-schema";

const { Pool } = pg;

// Fetch directly from the environment variables to bypass Vite-specific env handling
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("Missing DATABASE_URL in environment variables.");
	process.exit(1);
}

const pool = new Pool({
	connectionString: databaseUrl,
});

const db = drizzle(pool, { schema: appSchema });

const mapNutriscore = (score?: string): "gold" | "silver" | "bronze" | "none" => {
	if (!score) return "none";
	const lower = score.toLowerCase();
	if (lower === "a" || lower === "b") return "gold";
	if (lower === "c") return "silver";
	if (lower === "d" || lower === "e") return "bronze";
	return "none";
};

async function resolveOffCategory(categoriesHierarchy: string[]): Promise<string> {
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

async function main() {
	console.log("Fetching products from Open Food Facts API...");

	let response;
	let retries = 3;
	while (retries > 0) {
		response = await fetch(
			"https://world.openfoodfacts.net/api/v2/search?countries_tags_en=romania&fields=code,product_name,product_name_ro,brands,categories_tags,categories_hierarchy,ingredients_text_ro,ingredients_text,image_front_url,image_ingredients_url,stores_tags,nutriscore_grade,nova_group,additives_tags,ingredients&page_size=50&lc=ro&cc=ro",
			{
				headers: {
					"User-Agent": "CleanLabelApp - Web - Version 1.0 (serbandavid83@gmail.com)",
				},
			}
		);

		if (response.ok) break;

		console.warn(`API returned ${response.status}. Retries left: ${retries - 1}`);
		retries--;
		if (retries > 0) {
			console.log("Waiting 3 seconds before retrying...");
			await new Promise((resolve) => setTimeout(resolve, 3000));
		}
	}

	if (!response || !response.ok) {
		console.error("Failed to fetch from OFF API after retries. The OFF API might be rate limiting anonymous requests or experiencing high load.");
		process.exit(1);
	}

	const data = await response.json();
	const products = data.products || [];

	console.log(`Fetched ${products.length} products. Seeding database...`);

	for (const product of products) {
		// 1. Handle Category
		let categoriesHierarchy: string[] = [];
		if (Array.isArray(product.categories_hierarchy)) {
			categoriesHierarchy = product.categories_hierarchy;
		} else if (typeof product.categories_hierarchy === 'string') {
			categoriesHierarchy = product.categories_hierarchy.split(",").map((c: string) => c.trim());
		}

		const categoryId = await resolveOffCategory(categoriesHierarchy);

		// 2. Handle Product
		const brandName = product.brands?.split(",")[0]?.trim() || "Unknown Brand";
		const productName = product.product_name_ro || product.product_name || "Unknown Product";
		const ingredientsText = product.ingredients_text_ro || product.ingredients_text || null;
		
		const [productRecord] = await db.insert(appSchema.products).values({
			barcode: product.code || null,
			name: productName,
			brand: brandName,
			score: mapNutriscore(product.nutriscore_grade),
			imageFrontUrl: product.image_front_url || null,
			imageBackUrl: product.image_ingredients_url || null,
			rawIngredientsText: ingredientsText,
			status: "approved",
			offTags: categoriesHierarchy,
			isReviewed: false,
		}).returning();

		await db.insert(appSchema.productCategories).values({
			productId: productRecord.id,
			categoryId: categoryId,
		});

		console.log(`Inserted product: ${productName} (${brandName})`);

		// 3. Handle Ingredients
		if (Array.isArray(product.ingredients) && product.ingredients.length > 0) {
			for (const ing of product.ingredients) {
				if (!ing.text) continue;
				
				const ingName = ing.text.trim().toLowerCase();
				if (!ingName) continue;

				let ingredientRecord = await db.query.ingredients.findFirst({
					where: eq(appSchema.ingredients.name, ingName),
				});

				if (!ingredientRecord) {
					const [newIng] = await db.insert(appSchema.ingredients).values({
						name: ingName,
					}).returning();
					ingredientRecord = newIng;
				}

				// Create junction record
				try {
					await db.insert(appSchema.productIngredients).values({
						productId: productRecord.id,
						ingredientId: ingredientRecord.id,
					});
				} catch (e: any) {
					// Ignore duplicate key errors if the same ingredient is listed twice for a product
					if (e.code !== '23505' && e.cause?.code !== '23505') { 
						console.error(`Error linking ingredient ${ingName} to product ${productName}:`, e);
					}
				}
			}
		}
	}

	console.log("Seeding complete!");
	process.exit(0);
}

main().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
