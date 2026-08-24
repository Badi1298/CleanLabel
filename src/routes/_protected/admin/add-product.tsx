import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ProductForm } from "#/components/ProductForm";
import { addProduct, getCategories } from "#/server/product-functions";

export const Route = createFileRoute("/_protected/admin/add-product")({
	component: RouteComponent,
	loader: async () => {
		const categories = await getCategories();
		return { categories };
	},
});

function RouteComponent() {
	const { categories } = Route.useLoaderData();
	const addProductFn = useServerFn(addProduct);
	const router = useRouter();

	return (
		<div className="px-4 mt-4 max-w-2xl mx-auto mb-12 bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
			<ProductForm
				isAdmin={true}
				categories={categories}
				onSubmit={async (values) => {
					try {
						await addProductFn({
							data: {
								barcode: values.barcode,
								name: values.name,
								brand: values.brand,
								categoryId: values.categoryId,
								score: values.score,
								status: values.status || "approved",
								rawIngredientsText: values.rawIngredientsText,
							},
						});
						alert("Product created successfully!");
						router.history.back();
					} catch (e) {
						console.error(e);
						alert("Failed to submit product.");
					}
				}}
			/>
		</div>
	);
}
