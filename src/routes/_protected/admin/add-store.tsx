/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "#/components/ui/button";
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
				alert("Store added successfully!");
				router.history.back();
			} catch (e) {
				console.error(e);
				alert("Failed to add store.");
			}
		},
	});

	return (
		<div className="px-4 mt-4 max-w-2xl mx-auto mb-12">
			<h1 className="text-2xl font-bold mb-6">Add Store</h1>
			<div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-fit">
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
			</div>
		</div>
	);
}
