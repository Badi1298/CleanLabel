/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */

import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { categoryQueryOptions } from "#/queries/category-queries";
import { updateCategory } from "#/server/category-functions";

export const Route = createFileRoute(
	"/_protected/admin/edit-category/$categoryId",
)({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) =>
		await queryClient.ensureQueryData(categoryQueryOptions(params.categoryId)),
});

function FieldInfo({ field }: { field: any }) {
	return (
		<div className="min-h-5 mt-1">
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<em className="text-sm text-red-500 dark:text-red-400">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className="text-sm text-slate-500">Validating...</span>
			) : null}
		</div>
	);
}

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const { data: category } = useQuery(categoryQueryOptions(categoryId));
	const updateCategoryFn = useServerFn(updateCategory);
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: category?.name || "",
			iconUrl: category?.iconUrl || "",
			subcategories: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await updateCategoryFn({
					data: {
						id: categoryId,
						name: value.name,
						iconUrl: value.iconUrl || undefined,
					},
				});
				queryClient.invalidateQueries({ queryKey: ["categories"] });
				queryClient.invalidateQueries({ queryKey: ["homeData"] });
				toast.success("Category updated successfully!");
				router.history.back();
			} catch (e) {
				console.error(e);
				toast.error("Failed to update category.");
			}
		},
	});

	if (!category) return null;

	return (
		<div className="flex justify-center px-4 mt-4 mb-12">
			<Card className="max-w-7xl w-full">
				<CardContent className="pt-6">
					<div className="mb-6 flex justify-between items-center">
						<h1 className="text-2xl font-bold">Edit Category</h1>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									!value ? "Name is required" : undefined,
							}}
							children={(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Category Name</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Snacks"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>

						<form.Field
							name="iconUrl"
							children={(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Icon URL (optional)</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://..."
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>

						<form.Field
							name="subcategories"
							children={(field) => (
								<div className="space-y-2 opacity-60">
									<Label htmlFor={field.name}>
										Subcategories (coming soon)
									</Label>
									<Input
										id={field.name}
										value={field.state.value}
										disabled={true}
										onChange={() => {}}
										placeholder="e.g. Chips, Chocolate..."
									/>
									<p className="text-xs text-muted-foreground">
										Subcategories will be available in a future update.
									</p>
								</div>
							)}
						/>

						<div className="pt-4 flex gap-4">
							<Button 
								type="button" 
								variant="outline" 
								className="w-full"
								onClick={() => router.history.back()}
							>
								Cancel
							</Button>
							
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button
										type="submit"
										disabled={!canSubmit || isSubmitting}
										className="w-full"
									>
										{isSubmitting ? "Saving..." : "Save Changes"}
									</Button>
								)}
							/>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
