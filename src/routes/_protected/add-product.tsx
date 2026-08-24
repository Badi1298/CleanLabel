import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	barcode: z.string().optional(),
});

export const Route = createFileRoute("/_protected/add-product")({
	component: AddProductRoute,
	validateSearch: (search) => searchSchema.parse(search),
});

function AddProductRoute() {
	const { barcode } = Route.useSearch();

	return (
		<div className="p-4 pt-12 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-4">Add Product</h1>
			{barcode ? (
				<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
					We couldn't find the product with barcode <strong className="text-slate-900 dark:text-slate-100">{barcode}</strong> in Open Food Facts. You can add it to our database here.
				</p>
			) : (
				<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
					Add a new product to our database.
				</p>
			)}
			
			<div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
				<span className="text-sm font-medium">Form coming soon...</span>
			</div>
		</div>
	);
}
