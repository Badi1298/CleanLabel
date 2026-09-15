/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { addCategory } from "#/server/category-functions";

export const Route = createFileRoute("/_protected/admin/add-category")({
	component: RouteComponent,
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
	const addCategoryFn = useServerFn(addCategory);
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: "",
			iconUrl: "",
			subcategories: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await addCategoryFn({
					data: {
						name: value.name,
						iconUrl: value.iconUrl || undefined,
					},
				});
				queryClient.invalidateQueries({ queryKey: ["categories"] });
				queryClient.invalidateQueries({ queryKey: ["homeData"] });
				toast.success("Category added successfully!");
				router.history.back();
			} catch (e) {
				console.error(e);
				toast.error("Failed to add category.");
			}
		},
	});

	return (
		<div className="flex justify-center px-4 mt-4 mb-12">
			<Card className="max-w-7xl w-full">
				<CardContent className="pt-6">
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

						<div className="pt-4">
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button
										type="submit"
										disabled={!canSubmit || isSubmitting}
										className="w-full"
									>
										{isSubmitting ? "Saving..." : "Save Category"}
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
