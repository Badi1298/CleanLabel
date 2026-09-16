import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { ingredientsQueryOptions } from "#/queries/ingredient-queries";
import { addIngredient, updateIngredient } from "#/server/ingredient-functions";

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
	const [formData, setFormData] = useState({ name: "", hazardLevel: "none", description: "" });

	const addIngredientFn = useServerFn(addIngredient);
	const updateIngredientFn = useServerFn(updateIngredient);

	const { data: ingredientsData, refetch } = useQuery(
		ingredientsQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
			globalFilter: "",
		}),
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingIngredient) {
				await updateIngredientFn({
					data: {
						id: editingIngredient.id,
						name: formData.name,
						hazardLevel: formData.hazardLevel === "none" ? undefined : formData.hazardLevel,
						description: formData.description,
					},
				});
				toast.success("Ingredient updated");
			} else {
				await addIngredientFn({
					data: {
						name: formData.name,
						hazardLevel: formData.hazardLevel === "none" ? undefined : formData.hazardLevel,
						description: formData.description,
					},
				});
				toast.success("Ingredient added");
			}
			setIsOpen(false);
			refetch();
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Ingredients</h1>
				<Dialog open={isOpen} onOpenChange={(open) => {
					setIsOpen(open);
					if (!open) setEditingIngredient(null);
				}}>
					<DialogTrigger asChild>
						<Button onClick={() => setFormData({ name: "", hazardLevel: "none", description: "" })}>Add Ingredient</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editingIngredient ? "Edit" : "Add"} Ingredient</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
							</div>
							<div className="space-y-2">
								<Label>Hazard Level</Label>
								<Select value={formData.hazardLevel} onValueChange={(val) => setFormData({ ...formData, hazardLevel: val })}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
							</div>
							<Button type="submit" className="w-full">Save</Button>
						</form>
					</DialogContent>
				</Dialog>
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
								<td className="px-6 py-4 truncate max-w-[200px]">{ingredient.description || "-"}</td>
								<td className="px-6 py-4 text-right">
									<Button variant="ghost" size="sm" onClick={() => {
										setEditingIngredient(ingredient);
										setFormData({
											name: ingredient.name,
											hazardLevel: ingredient.hazardLevel || "none",
											description: ingredient.description || "",
										});
										setIsOpen(true);
									}}>Edit</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
