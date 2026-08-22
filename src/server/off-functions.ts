import { createServerFn } from "@tanstack/react-start";

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
				"User-Agent": "NutritionTracker/1.0 (dev@myproject.com)",
			},
		});

		if (!response.ok) {
			throw new Error(`OFF API error: ${response.status}`);
		}

		return await response.json();
	});
