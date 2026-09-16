import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AddIngredientDialog } from "#/components/AddIngredientDialog";
import { Button } from "#/components/ui/button";
import { ingredientsQueryOptions } from "#/queries/ingredient-queries";

export const Route = createFileRoute("/_protected/admin/ingredients")({
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

	const { data: ingredientsData, refetch } = useQuery(
		ingredientsQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
			globalFilter: "",
		}),
	);

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto">
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
				<table className="w-full text-sm text-left">
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
								<td className="px-6 py-4">{ingredient.name}</td>
								<td className="px-6 py-4">{ingredient.hazardLevel || "-"}</td>
								<td className="px-6 py-4 truncate max-w-50">
									{ingredient.description || "-"}
								</td>
								<td className="px-6 py-4 text-right">
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
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
