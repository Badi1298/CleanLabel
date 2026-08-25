import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { z } from "zod";
import { ProductForm } from "#/components/ProductForm";
import {
	categoriesQueryOptions,
	productQueryOptions,
} from "#/queries/product-queries";
import { addProduct, updateProduct } from "#/server/product-functions";

const searchSchema = z.object({
	productId: z.string().optional(),
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
		<div className="px-4 mt-4 max-w-7xl mx-auto mb-12">
			<h1 className="text-2xl font-bold mb-6">
				{product ? "Review Product" : "Add Product"}
			</h1>
			<div
				className={`grid gap-8 ${product ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"}`}
			>
				{product && (
					<div className="flex flex-col gap-6 sticky top-4 h-fit">
						{product.imageFrontUrl && (
							<div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm">
								<div className="p-2 font-medium border-b border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-300">
									Front Image (Pan & Zoom)
								</div>
								<TransformWrapper>
									<TransformComponent
										wrapperStyle={{ width: "100%", height: "100%" }}
									>
										<img
											src={product.imageFrontUrl}
											alt="Front"
											className="w-full h-auto object-contain max-h-[40vh]"
										/>
									</TransformComponent>
								</TransformWrapper>
							</div>
						)}
						{product.imageBackUrl && (
							<div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm">
								<div className="p-2 font-medium border-b border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-300">
									Back Image (Pan & Zoom)
								</div>
								<TransformWrapper>
									<TransformComponent
										wrapperStyle={{ width: "100%", height: "100%" }}
									>
										<img
											src={product.imageBackUrl}
											alt="Back"
											className="w-full h-auto object-contain max-h-[40vh]"
										/>
									</TransformComponent>
								</TransformWrapper>
							</div>
						)}
					</div>
				)}
				<div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-fit">
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
										imageFront: product.imageFrontUrl || undefined,
										imageBack: product.imageBackUrl || undefined,
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
											imageFrontUrl:
												typeof values.imageFront === "string"
													? values.imageFront
													: undefined,
											imageBackUrl:
												typeof values.imageBack === "string"
													? values.imageBack
													: undefined,
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
											imageFrontUrl:
												typeof values.imageFront === "string"
													? values.imageFront
													: undefined,
											imageBackUrl:
												typeof values.imageBack === "string"
													? values.imageBack
													: undefined,
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
			</div>
		</div>
	);
}
