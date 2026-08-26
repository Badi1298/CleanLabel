import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { z } from "zod";
import { ProductForm } from "#/components/ProductForm";
import { Card, CardContent } from "#/components/ui/card";
import {
	categoriesQueryOptions,
	productQueryOptions,
} from "#/queries/product-queries";
import { storesQueryOptions } from "#/queries/store-queries";
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
		const storesPromise = queryClient.ensureQueryData(storesQueryOptions());
		const productPromise = productId
			? queryClient.ensureQueryData(productQueryOptions(productId))
			: Promise.resolve(null);
		await Promise.all([categoriesPromise, storesPromise, productPromise]);
	},
});

function RouteComponent() {
	const { productId } = Route.useSearch();
	const { data: categories } = useSuspenseQuery({
		...categoriesQueryOptions(),
	});
	const { data: stores } = useSuspenseQuery({
		...storesQueryOptions(),
	});
	const { data: product } = useSuspenseQuery({
		...productQueryOptions(productId),
	});
	const addProductFn = useServerFn(addProduct);
	const updateProductFn = useServerFn(updateProduct);
	const router = useRouter();
	const queryClient = useQueryClient();

	return (
		<div className="flex justify-center px-4 mt-4 mb-12">
			<div
				className={`grid gap-8 justify-items-center w-full ${product ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
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
				<Card className="max-w-7xl w-full">
					<CardContent>
						<ProductForm
							isAdmin={true}
							categories={categories}
							stores={stores}
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
											storeIds:
												product.productStores?.map((ps: any) => ps.storeId) ||
												[],
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
												storeIds: values.storeIds,
											},
										});
										toast.success("Product updated successfully!");
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
												storeIds: values.storeIds,
											},
										});
										toast.success("Product created successfully!");
									}

									queryClient.invalidateQueries({ queryKey: ["homeData"] });
									queryClient.invalidateQueries({ queryKey: ["allProducts"] });
									if (product) {
										queryClient.invalidateQueries({
											queryKey: ["productDetails", product.id],
										});
										queryClient.invalidateQueries({
											queryKey: ["product", product.id],
										});
									}

									router.history.back();
								} catch (e) {
									console.error(e);
									toast.error("Failed to submit product.");
								}
							}}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
