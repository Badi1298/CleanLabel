import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ProductForm } from "#/components/ProductForm";

const searchSchema = z.object({
	barcode: z.string().optional(),
});

export const Route = createFileRoute("/_protected/_public/add-product")({
	component: AddProductRoute,
	validateSearch: (search) => searchSchema.parse(search),
});

function AddProductRoute() {
	const { barcode } = Route.useSearch();

	return (
		<div className="p-4 pt-12 max-w-md mx-auto mb-12">
			<h1 className="text-2xl font-bold mb-4">Add Product</h1>
			{barcode ? (
				<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
					We couldn't find the product with barcode{" "}
					<strong className="text-slate-900 dark:text-slate-100">
						{barcode}
					</strong>{" "}
					in our database. You can either just add an image of the front and the
					back of the product, and we will take care of the rest, or you can
					manually input the product data from the package along with the
					images, in order to speed up the process.
				</p>
			) : (
				<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
					Add a new product to our database.
				</p>
			)}

			<ProductForm
				isAdmin={false}
				defaultValues={{ barcode }}
				onSubmit={(values) => {
					console.log("Submit product photos/details:", values);
					alert("Product submission received!");
				}}
			/>
		</div>
	);
}
