import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { categoriesQueryOptions } from "#/queries/category-queries";
import { addCategory, updateCategory } from "#/server/category-functions";

export function AddCategoryDialog({
	trigger,
	categoryToEdit,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	trigger?: React.ReactNode;
	categoryToEdit?: any;
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
		iconUrl: "",
		parentId: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: categoriesResult } = useQuery({
		...categoriesQueryOptions({ pageIndex: 0, pageSize: 1000, globalFilter: "" }),
		enabled: open,
	});
	const topLevelCategories =
		categoriesResult?.data.filter((c) => !c.parentId && c.id !== categoryToEdit?.id) || [];

	useEffect(() => {
		if (categoryToEdit && open) {
			setFormData({
				name: categoryToEdit.name || "",
				iconUrl: categoryToEdit.iconUrl || "",
				parentId: categoryToEdit.parentId || "",
			});
		} else if (!open && !categoryToEdit) {
			setFormData({ name: "", iconUrl: "", parentId: "" });
		}
	}, [categoryToEdit, open]);

	const addCategoryFn = useServerFn(addCategory);
	const updateCategoryFn = useServerFn(updateCategory);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!formData.name) {
			toast.error("Name is required");
			return;
		}

		setIsSubmitting(true);
		try {
			if (categoryToEdit) {
				await updateCategoryFn({
					data: {
						id: categoryToEdit.id,
						name: formData.name,
						iconUrl: formData.iconUrl || undefined,
						parentId: formData.parentId || null,
					},
				});
				toast.success("Category updated successfully!");
			} else {
				await addCategoryFn({
					data: {
						name: formData.name,
						iconUrl: formData.iconUrl || undefined,
						parentId: formData.parentId || undefined,
					},
				});
				toast.success("Category added successfully!");
			}
			setOpen(false);
			setFormData({ name: "", iconUrl: "", parentId: "" });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["homeData"] });
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error(
				categoryToEdit
					? "Failed to update category."
					: "Failed to add category.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{categoryToEdit ? "Edit" : "Add"} Category</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label>Category Name</Label>
						<Input
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="e.g. Snacks"
						/>
					</div>
					<div className="space-y-2">
						<Label>Icon URL (optional)</Label>
						<Input
							value={formData.iconUrl}
							onChange={(e) =>
								setFormData({ ...formData, iconUrl: e.target.value })
							}
							placeholder="https://..."
						/>
					</div>
					<div className="space-y-2">
						<Label>Parent Category</Label>
						<Select
							value={formData.parentId || "none"}
							onValueChange={(val) => setFormData({ ...formData, parentId: val === "none" ? "" : val })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select parent category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None (Top-Level Category)</SelectItem>
								{topLevelCategories.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save Category"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
