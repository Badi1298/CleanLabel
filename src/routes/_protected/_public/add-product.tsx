import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { z } from "zod";
import { ProductForm } from "#/components/ProductForm";
import { categoriesQueryOptions } from "#/queries/product-queries";
import { addProduct } from "#/server/product-functions";

const searchSchema = z.object({
	barcode: z.string().optional(),
});

export const Route = createFileRoute("/_protected/_public/add-product")({
	component: AddProductRoute,
	validateSearch: (search) => searchSchema.parse(search),
	loader: async ({ context: { queryClient } }) =>
		await queryClient.ensureQueryData(categoriesQueryOptions()),
});

function AddProductRoute() {
	const { barcode } = Route.useSearch();
	const { data: categories } = useSuspenseQuery({
		...categoriesQueryOptions(),
	});
	const addProductFn = useServerFn(addProduct);
	const router = useRouter();
	const queryClient = useQueryClient();

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
				categories={categories}
				defaultValues={{ barcode }}
				onSubmit={async (values) => {
					try {
						await addProductFn({
							data: {
								barcode: values.barcode,
								name: values.name,
								brand: values.brand,
								categoryId: values.categoryId,
								score: values.score,
								// TO DO: is this safe? can someone on the client override the status to approved?
								status: "pending_review",
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
						queryClient.invalidateQueries({ queryKey: ["homeData"] });
						queryClient.invalidateQueries({ queryKey: ["allProducts"] });
						toast.success(
							"Product submission received! It will be reviewed shortly.",
						);
						router.history.back();
					} catch (e) {
						console.error(e);
						toast.error("Failed to submit product.");
					}
				}}
			/>
		</div>
	);
}
