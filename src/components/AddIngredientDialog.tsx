import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
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
import {
	addIngredient,
	updateIngredient,
} from "#/server/ingredient-functions";

export function AddIngredientDialog({
	trigger,
	ingredientToEdit,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	trigger?: React.ReactNode;
	ingredientToEdit?: any;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSuccess?: () => void;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = isOpen !== undefined ? isOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: "",
		hazardLevel: "none",
		description: "",
	});

	useEffect(() => {
		if (ingredientToEdit && open) {
			setFormData({
				name: ingredientToEdit.name || "",
				hazardLevel: ingredientToEdit.hazardLevel || "none",
				description: ingredientToEdit.description || "",
			});
		} else if (!open && !ingredientToEdit) {
			setFormData({ name: "", hazardLevel: "none", description: "" });
		}
	}, [ingredientToEdit, open]);

	const addIngredientFn = useServerFn(addIngredient);
	const updateIngredientFn = useServerFn(updateIngredient);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			if (ingredientToEdit) {
				await updateIngredientFn({
					data: {
						id: ingredientToEdit.id,
						name: formData.name,
						hazardLevel:
							formData.hazardLevel === "none"
								? undefined
								: formData.hazardLevel,
						description: formData.description,
					},
				});
				toast.success("Ingredient updated");
			} else {
				await addIngredientFn({
					data: {
						name: formData.name,
						hazardLevel:
							formData.hazardLevel === "none"
								? undefined
								: formData.hazardLevel,
						description: formData.description,
					},
				});
				toast.success("Ingredient added");
			}
			setOpen(false);
			setFormData({ name: "", hazardLevel: "none", description: "" });
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
			if (onSuccess) onSuccess();
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{ingredientToEdit ? "Edit" : "Add"} Ingredient
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label>Name</Label>
						<Input
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Hazard Level</Label>
						<Select
							value={formData.hazardLevel}
							onValueChange={(val) =>
								setFormData({ ...formData, hazardLevel: val })
							}
						>
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
						<Textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>
					<Button type="submit" className="w-full">
						Save
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
