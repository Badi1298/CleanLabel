import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { categoriesQueryOptions } from "#/queries/product-queries";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute("/_protected/_public/stores/$storeId/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(storesQueryOptions());
	},
	component: StoreCategoriesPage,
});

function StoreCategoriesPage() {
	const navigate = useNavigate();
	const { storeId } = Route.useParams();

	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

	const store = stores?.find((s) => s.id === storeId);
	const [searchQuery, setSearchQuery] = useState("");

	const q = searchQuery.toLowerCase();

	const topLevelCategories = categories?.filter((c) => !c.parentId) || [];
	const visibleTopLevelCategories = topLevelCategories.filter((parentCat) => {
		const parentMatches = parentCat.name.toLowerCase().includes(q);
		const hasMatchingSubcat = categories?.some(
			(c) => c.parentId === parentCat.id && c.name.toLowerCase().includes(q),
		);
		return parentMatches || hasMatchingSubcat;
	});

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Top Bar with Search */}
			<div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
						<div className="flex items-center gap-2 text-slate-500 text-sm">
							<Link
								to="/stores"
								className="font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								Stores
							</Link>
							<span>/</span>
							<div className="flex items-center gap-2">
								{store?.logoUrl ? (
									<img
										src={store.logoUrl}
										alt={store.name}
										className="w-5 h-5 rounded-full"
									/>
								) : (
									<StoreIcon className="w-4 h-4 text-slate-500" />
								)}
								<span className="font-medium text-slate-900 dark:text-white">
									{store?.name || "Store"}
								</span>
							</div>
						</div>
					</div>

					<form
						onSubmit={handleSearchSubmit}
						className="flex-1 flex items-center gap-2 relative"
					>
						<Search className="absolute left-3 text-slate-400 w-5 h-5" />
						<Input
							placeholder="Search categories..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-12 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-none shadow-none text-md"
						/>
						<Button
							type="button"
							onClick={() => setSearchQuery("")}
							variant="ghost"
							size="lg"
							className="h-12 px-4 font-bold text-slate-500"
						>
							Clear
						</Button>
					</form>
				</div>
			</div>

			<main className="max-w-6xl mx-auto px-4 py-8">
				<section>
					<div className="space-y-6">
						{visibleTopLevelCategories.map((parentCat) => {
							const subcats =
								categories?.filter((c) => c.parentId === parentCat.id) || [];
							const visibleSubcats = subcats.filter(
								(c) =>
									parentCat.name.toLowerCase().includes(q) ||
									c.name.toLowerCase().includes(q),
							);

							return (
								<div
									key={parentCat.id}
									className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
								>
									{/* Parent Category Header */}
									<Button
										variant="ghost"
										className="w-full h-auto rounded-none p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-normal"
										onClick={() =>
											navigate({ to: `/stores/${storeId}/${parentCat.id}` })
										}
									>
										<div className="flex items-center gap-4">
											{parentCat.iconUrl ? (
												<img
													src={parentCat.iconUrl}
													alt={parentCat.name}
													className="w-12 h-12 object-cover rounded-full bg-slate-100 dark:bg-slate-800"
												/>
											) : (
												<div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
													<StoreIcon className="w-6 h-6 text-slate-500" />
												</div>
											)}
											<h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
												{parentCat.name}
											</h3>
										</div>
										<div className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 px-3">
											View All {parentCat.name}
										</div>
									</Button>

									{/* Subcategories */}
									{visibleSubcats.length > 0 && (
										<div className="p-4 bg-slate-50/50 dark:bg-slate-950/50">
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
												{visibleSubcats.map((subcat) => (
													<Button
														key={subcat.id}
														variant="outline"
														className="justify-start h-auto py-3 px-4 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all bg-white dark:bg-slate-900"
														onClick={(e) => {
															e.stopPropagation();
															navigate({
																to: `/stores/${storeId}/${subcat.id}`,
															});
														}}
													>
														<span className="truncate">{subcat.name}</span>
													</Button>
												))}
											</div>
										</div>
									)}
								</div>
							);
						})}

						{visibleTopLevelCategories.length === 0 && (
							<div className="text-center py-10 text-slate-500">
								No categories found matching "{searchQuery}"
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
