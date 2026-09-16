import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AddStoreDialog } from "#/components/AddStoreDialog";
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
import { storesQueryOptions } from "#/queries/store-queries";
import { deleteStore } from "#/server/store-functions";

export const Route = createFileRoute("/_protected/admin/all-stores")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(storesQueryOptions());
	},
});

function RouteComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const [editingStore, setEditingStore] = useState<any>(null);
	const deleteStoreFn = useServerFn(deleteStore);

	const { data: storesData, refetch } = useQuery(storesQueryOptions());

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteStoreFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Store deleted successfully!");
			refetch();
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to delete store.");
		},
	});

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto">
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

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
													This action cannot be undone. This will permanently
													delete the store.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => deleteMutation.mutate(store.id)}
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
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
	);
}
