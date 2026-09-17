import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Store as StoreIcon, X } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "#/components/home/product-card";
import { SearchBar } from "#/components/search/search-bar";
import { Button } from "#/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { categoriesQueryOptions } from "#/queries/product-queries";
import { searchQueryOptions } from "#/queries/search-queries";
import { storesQueryOptions } from "#/queries/store-queries";

const searchSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
	categoryId: z.string().optional(),
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
});

export const Route = createFileRoute("/_protected/_public/search")({
	validateSearch: searchSchema,
	loaderDeps: ({ search: { q, storeId, categoryId, score } }) => ({
		q,
		storeId,
		categoryId,
		score,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(storesQueryOptions());
		// Only fetch products if a filter is active
		if (deps.q || deps.storeId || deps.categoryId || deps.score) {
			await queryClient.ensureQueryData(searchQueryOptions(deps));
		}
	},
	component: SearchPage,
});

function SearchPage() {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const hasActiveFilters =
		!!searchParams.q ||
		!!searchParams.storeId ||
		!!searchParams.categoryId ||
		!!searchParams.score;

	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: stores } = useSuspenseQuery(storesQueryOptions());

	const { data: searchResults } = useQuery({
		...searchQueryOptions(searchParams),
		// Only run this query if there are active filters
		enabled: hasActiveFilters,
	});

	const updateFilter = (
		key: keyof typeof searchParams,
		value: string | undefined,
	) => {
		navigate({
			to: "/search",
			search: (prev: any) => ({ ...prev, [key]: value }),
		});
	};

	const clearFilters = () => {
		navigate({ to: "/search", search: {} });
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Top Bar with Search */}
			<div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
					<SearchBar initialQuery={searchParams.q} />

					{/* Filters */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
							<Filter className="w-4 h-4" />
							<span>Filters:</span>
						</div>

						<Select
							value={searchParams.score || "all"}
							onValueChange={(val) =>
								updateFilter("score", val === "all" ? undefined : val)
							}
						>
							<SelectTrigger className="w-32.5 h-9 text-sm">
								<SelectValue placeholder="Score" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Any Score</SelectItem>
								<SelectItem value="gold">Gold</SelectItem>
								<SelectItem value="silver">Silver</SelectItem>
								<SelectItem value="bronze">Bronze</SelectItem>
								<SelectItem value="none">Unrated</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={searchParams.storeId || "all"}
							onValueChange={(val) =>
								updateFilter("storeId", val === "all" ? undefined : val)
							}
						>
							<SelectTrigger className="w-35 h-9 text-sm">
								<SelectValue placeholder="Store" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Any Store</SelectItem>
								{stores?.map((store) => (
									<SelectItem key={store.id} value={store.id}>
										{store.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{searchParams.categoryId && (
							<Select
								value={searchParams.categoryId}
								onValueChange={(val) =>
									updateFilter("categoryId", val === "all" ? undefined : val)
								}
							>
								<SelectTrigger className="w-35 h-9 text-sm">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories
										?.filter((c) => !c.parentId)
										.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						)}

						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilters}
								className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9"
							>
								<X className="w-4 h-4 mr-1" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</div>

			<main className="max-w-6xl mx-auto px-4 py-8">
				{!hasActiveFilters ? (
					// Default State: Categories
					<section>
						<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
							Browse Categories
						</h2>
						<div className="space-y-6">
							{categories
								?.filter((c) => !c.parentId)
								.map((parentCat) => {
									const subcats = categories.filter(
										(c) => c.parentId === parentCat.id,
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
												onClick={() => updateFilter("categoryId", parentCat.id)}
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
											{subcats.length > 0 && (
												<div className="p-4 bg-slate-50/50 dark:bg-slate-950/50">
													<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
														{subcats.map((subcat) => (
															<Button
																key={subcat.id}
																variant="outline"
																className="justify-start h-auto py-3 px-4 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all bg-white dark:bg-slate-900"
																onClick={(e) => {
																	e.stopPropagation();
																	updateFilter("categoryId", subcat.id);
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
						</div>
					</section>
				) : (
					// Active Search State: Products
					<section>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white">
								{searchResults?.length || 0} Results Found
							</h2>
						</div>

						{searchResults && searchResults.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{searchResults.map((result) => (
									<ProductCard
										key={result.product.id}
										product={{
											...result.product,
											storeName: result.storeName,
										}}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
								<h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
									No products found
								</h3>
								<p className="text-slate-500 mt-2">
									Try adjusting your filters or search query.
								</p>
								<Button
									variant="outline"
									className="mt-6"
									onClick={clearFilters}
								>
									Clear all filters
								</Button>
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	);
}
