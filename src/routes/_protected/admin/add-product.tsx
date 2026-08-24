import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ProductForm } from "#/components/ProductForm";
import {
	addProduct,
	getCategories,
	getProductById,
	updateProduct,
} from "#/server/product-functions";

const searchSchema = z.object({
	productId: z.string().optional(),
});

const categoriesQueryOptions = () =>
	queryOptions({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});

const productQueryOptions = (productId?: string) =>
	queryOptions({
		queryKey: ["product", productId],
		queryFn: () => (productId ? getProductById({ data: productId }) : null),
	});

export const Route = createFileRoute("/_protected/admin/add-product")({
	component: RouteComponent,
	validateSearch: searchSchema,
	loaderDeps: ({ search: { productId } }) => ({ productId }),
	loader: async ({ context: { queryClient }, deps: { productId } }) => {
		const categoriesPromise = queryClient.ensureQueryData(
			categoriesQueryOptions(),
		);
		const productPromise = productId
			? queryClient.ensureQueryData(productQueryOptions(productId))
			: Promise.resolve(null);
		await Promise.all([categoriesPromise, productPromise]);
	},
});

function RouteComponent() {
	const { productId } = Route.useSearch();
	const { data: categories } = useSuspenseQuery({
		...categoriesQueryOptions(),
	});
	const { data: product } = useSuspenseQuery({
		...productQueryOptions(productId),
	});
	const addProductFn = useServerFn(addProduct);
	const updateProductFn = useServerFn(updateProduct);
	const router = useRouter();

	return (
		<div className="px-4 mt-4 max-w-2xl mx-auto mb-12 bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
			<h1 className="text-2xl font-bold mb-6">
				{product ? "Edit Product" : "Add Product"}
			</h1>
			<ProductForm
				isAdmin={true}
				categories={categories}
				defaultValues={
					product
						? {
								barcode: product.barcode || "",
								name: product.name,
								brand: product.brand,
								categoryId: product.categoryId,
								score: product.score,
								status: product.status,
								rawIngredientsText: product.rawIngredientsText || "",
							}
						: undefined
				}
				onSubmit={async (values) => {
					try {
						if (product) {
							await updateProductFn({
								data: {
									id: product.id,
									...values,
								},
							});
							alert("Product updated successfully!");
						} else {
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
						}
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
