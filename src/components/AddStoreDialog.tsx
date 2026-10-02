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
import { addStore, updateStore } from "#/server/store-functions";

export function AddStoreDialog({
	trigger,
	storeToEdit,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	trigger?: React.ReactNode;
	storeToEdit?: any;
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
		logoUrl: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (storeToEdit && open) {
			setFormData({
				name: storeToEdit.name || "",
				logoUrl: storeToEdit.logoUrl || "",
			});
		} else if (!open && !storeToEdit) {
			setFormData({ name: "", logoUrl: "" });
		}
	}, [storeToEdit, open]);

	const addStoreFn = useServerFn(addStore);
	const updateStoreFn = useServerFn(updateStore);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!formData.name) {
			toast.error("Name is required");
			return;
		}

		setIsSubmitting(true);
		try {
			if (storeToEdit) {
				await updateStoreFn({
					data: {
						id: storeToEdit.id,
						name: formData.name,
						logoUrl: formData.logoUrl || undefined,
					},
				});
				toast.success("Store updated successfully!");
			} else {
				await addStoreFn({
					data: {
						name: formData.name,
						logoUrl: formData.logoUrl || undefined,
					},
				});
				toast.success("Store added successfully!");
			}
			setOpen(false);
			setFormData({ name: "", logoUrl: "" });
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			queryClient.invalidateQueries({ queryKey: ["homeData"] });
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			toast.error(
				storeToEdit ? "Failed to update store." : "Failed to add store.",
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
					<DialogTitle>{storeToEdit ? "Edit" : "Add"} Store</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label>Store Name</Label>
						<Input
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="e.g. Auchan"
						/>
					</div>
					<div className="space-y-2">
						<Label>Logo URL (optional)</Label>
						<Input
							value={formData.logoUrl}
							onChange={(e) =>
								setFormData({ ...formData, logoUrl: e.target.value })
							}
							placeholder="https://..."
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save Store"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
