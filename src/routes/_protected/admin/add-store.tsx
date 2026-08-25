/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { addStore } from "#/server/store-functions";

export const Route = createFileRoute("/_protected/admin/add-store")({
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
	const addStoreFn = useServerFn(addStore);
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: "",
			logoUrl: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await addStoreFn({
					data: {
						name: value.name,
						logoUrl: value.logoUrl || undefined,
					},
				});
				toast.success("Store added successfully!");
				router.history.back();
			} catch (e) {
				console.error(e);
				toast.error("Failed to add store.");
			}
		},
	});

	return (
		<div className="flex justify-center px-4 mt-4 mb-12">
			<Card className="max-w-7xl w-full">
				<CardContent>
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
									<Label htmlFor={field.name}>Store Name</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Auchan"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>

						<form.Field
							name="logoUrl"
							children={(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Logo URL (optional)</Label>
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

						<div className="pt-4">
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button
										type="submit"
										disabled={!canSubmit || isSubmitting}
										className="w-full"
									>
										{isSubmitting ? "Saving..." : "Save Store"}
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
