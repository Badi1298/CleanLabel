import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddStoreDialog } from "#/components/AddStoreDialog";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	storeExclusiveProductsQueryOptions,
	storesQueryOptions,
} from "#/queries/store-queries";
import { deleteStore } from "#/server/store-functions";

export const Route = createFileRoute("/_protected/admin/all-stores")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(storesQueryOptions());
	},
});

function DeleteStoreDialog({
	store,
	isOpen,
	onOpenChange,
	onSuccess,
}: {
	store: { id: string; name: string } | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}) {
	const queryClient = useQueryClient();
	const deleteStoreFn = useServerFn(deleteStore);

	const { data: exclusiveProducts, isLoading } = useQuery(
		storeExclusiveProductsQueryOptions(store?.id),
	);

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteStoreFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Store deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			queryClient.invalidateQueries({ queryKey: ["searchResults"] });
			queryClient.invalidateQueries({ queryKey: ["homeData"] });
			queryClient.invalidateQueries({ queryKey: ["allProducts"] });
			queryClient.invalidateQueries({ queryKey: ["activeCategories"] });
			onOpenChange(false);
			onSuccess();
		},
		onError: (error: any) => {
			console.error(error);
			toast.error(error?.message || "Failed to delete store.");
		},
	});

	if (!store) return null;

	const hasExclusiveProducts = (exclusiveProducts?.length || 0) > 0;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md sm:max-w-lg">
				{isLoading ? (
					<div className="py-8 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
						<p className="text-sm text-slate-500">Checking store products...</p>
					</div>
				) : hasExclusiveProducts ? (
					<>
						<DialogHeader>
							<div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
								<AlertTriangle className="w-6 h-6" />
							</div>
							<DialogTitle className="text-xl">Cannot Delete Store</DialogTitle>
							<DialogDescription className="text-slate-600 dark:text-slate-300 pt-2">
								<strong>{store.name}</strong> cannot be deleted because{" "}
								<strong>{exclusiveProducts?.length}</strong> product
								{exclusiveProducts && exclusiveProducts.length > 1
									? "s are"
									: " is"}{" "}
								currently only available at this store.
							</DialogDescription>
						</DialogHeader>

						<div className="my-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-amber-800 dark:text-amber-300">
							No product should remain without a store. Please reassign or add
							another store to these products before deleting this store:
						</div>

						<div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50">
							{exclusiveProducts?.map((p) => (
								<div
									key={p.id}
									className="flex items-center justify-between p-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-xs gap-3"
								>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
											{p.name}
										</p>
										<p className="text-xs text-slate-500 truncate">{p.brand}</p>
									</div>
									<Link
										to="/admin/add-product"
										search={{ productId: p.id }}
										target="_blank"
										className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-2.5 py-1.5 rounded-md transition-colors"
									>
										Edit <ExternalLink className="w-3 h-3" />
									</Link>
								</div>
							))}
						</div>

						<DialogFooter className="mt-4">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="w-full sm:w-auto"
							>
								Understood
							</Button>
						</DialogFooter>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle className="text-xl">
								Are you absolutely sure?
							</DialogTitle>
							<DialogDescription className="text-slate-600 dark:text-slate-300 pt-2">
								This will permanently delete the store{" "}
								<strong>{store.name}</strong>. No products will be left without
								a store.
							</DialogDescription>
						</DialogHeader>

						<DialogFooter className="mt-4">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={deleteMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={() => deleteMutation.mutate(store.id)}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete Store"}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

function RouteComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const [editingStore, setEditingStore] = useState<any>(null);
	const [deletingStore, setDeletingStore] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const { data: storesData, refetch } = useQuery(storesQueryOptions());

	return (
		<div className="min-w-0 w-full p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Stores</h1>
				<AddStoreDialog
					trigger={
						<Button onClick={() => setEditingStore(null)}>Add Store</Button>
					}
					isOpen={isOpen}
					onOpenChange={(open) => {
						setIsOpen(open);
						if (!open) setEditingStore(null);
					}}
					storeToEdit={editingStore}
					onSuccess={refetch}
				/>
			</div>

			<DeleteStoreDialog
				store={deletingStore}
				isOpen={!!deletingStore}
				onOpenChange={(open) => {
					if (!open) setDeletingStore(null);
				}}
				onSuccess={refetch}
			/>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full">
				<div className="overflow-x-auto w-full">
					<table className="w-full text-sm text-left">
						<thead className="bg-slate-50 dark:bg-slate-800">
							<tr>
								<th className="px-6 py-4 font-medium">Name</th>
								<th className="px-6 py-4 font-medium">Logo</th>
								<th className="px-6 py-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
							{storesData?.map((store) => (
								<tr key={store.id}>
									<td className="px-6 py-4">{store.name}</td>
									<td className="px-6 py-4">
										{store.logoUrl ? (
											<img
												src={store.logoUrl}
												alt={`${store.name} logo`}
												className="h-8 w-auto object-contain"
											/>
										) : (
											"-"
										)}
									</td>
									<td className="px-6 py-4 text-right">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setEditingStore(store);
												setIsOpen(true);
											}}
										>
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
											onClick={() => setDeletingStore(store)}
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
							{(!storesData || storesData.length === 0) && (
								<tr>
									<td
										colSpan={3}
										className="px-6 py-12 text-center text-slate-500"
									>
										No stores found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
