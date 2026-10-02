import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AddIngredientDialog } from "#/components/AddIngredientDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { ingredientsQueryOptions } from "#/queries/ingredient-queries";
import { deleteIngredient } from "#/server/ingredient-functions";

export const Route = createFileRoute("/_protected/admin/all-ingredients")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(
			ingredientsQueryOptions({
				pageIndex: 0,
				pageSize: 1000,
				globalFilter: "",
			}),
		);
	},
});

function RouteComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const [editingIngredient, setEditingIngredient] = useState<any>(null);
	const deleteIngredientFn = useServerFn(deleteIngredient);

	const { data: ingredientsData, refetch } = useQuery(
		ingredientsQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
			globalFilter: "",
		}),
	);

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteIngredientFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Ingredient deleted successfully!");
			refetch();
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to delete ingredient.");
		},
	});

	return (
		<div className="min-w-0 w-full p-4 md:p-8 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Ingredients</h1>
				<AddIngredientDialog
					trigger={
						<Button onClick={() => setEditingIngredient(null)}>
							Add Ingredient
						</Button>
					}
					isOpen={isOpen}
					onOpenChange={(open) => {
						setIsOpen(open);
						if (!open) setEditingIngredient(null);
					}}
					ingredientToEdit={editingIngredient}
					onSuccess={refetch}
				/>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-150 text-sm text-left">
						<thead className="bg-slate-50 dark:bg-slate-800">
							<tr>
								<th className="px-6 py-4 font-medium">Name</th>
								<th className="px-6 py-4 font-medium">Hazard Level</th>
								<th className="px-6 py-4 font-medium">Description</th>
								<th className="px-6 py-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
							{ingredientsData?.data.map((ingredient) => (
								<tr key={ingredient.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										{ingredient.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{ingredient.hazardLevel || "-"}
									</td>
									<td className="px-6 py-4 truncate max-w-50 whitespace-nowrap">
										{ingredient.description || "-"}
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex justify-end items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setEditingIngredient(ingredient);
													setIsOpen(true);
												}}
											>
												Edit
											</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
													>
														Delete
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Are you absolutely sure?
														</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete the ingredient.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() =>
																deleteMutation.mutate(ingredient.id)
															}
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
