import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Filter, Store as StoreIcon, X } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "#/components/home/product-card";
import { SearchBar } from "#/components/search/search-bar";
import { Button } from "#/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "#/components/ui/combobox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	activeCategoriesQueryOptions,
	categoriesQueryOptions,
} from "#/queries/product-queries";
import { searchQueryOptions } from "#/queries/search-queries";
import { storesQueryOptions } from "#/queries/store-queries";

const searchSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
	categoryId: z.string().optional(),
	subCategoryIds: z.array(z.string()).optional(),
	score: z.enum(["gold", "silver", "bronze", "none", "rejected"]).optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_protected/_public/search")({
	validateSearch: searchSchema,
	loaderDeps: ({
		search: { q, storeId, categoryId, subCategoryIds, score },
	}) => ({
		q,
		storeId,
		categoryId,
		subCategoryIds,
		score,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(
			activeCategoriesQueryOptions({
				storeId: deps.storeId,
				score: deps.score,
			}),
		);
		await queryClient.ensureQueryData(storesQueryOptions());

		// Only fetch products if a category or search term is selected
		const isSearchingProducts =
			Boolean(deps.q && deps.q.trim().length > 0) ||
			Boolean(deps.categoryId) ||
			Boolean(deps.subCategoryIds && deps.subCategoryIds.length > 0);

		if (isSearchingProducts) {
			await queryClient.ensureQueryData(searchQueryOptions(deps));
		}
	},
	component: SearchPage,
});

function SearchPage() {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const isSearchingProducts =
		Boolean(searchParams.q && searchParams.q.trim().length > 0) ||
		Boolean(searchParams.categoryId) ||
		Boolean(
			searchParams.subCategoryIds && searchParams.subCategoryIds.length > 0,
		);

	const hasActiveFilters =
		isSearchingProducts ||
		Boolean(searchParams.storeId) ||
		Boolean(searchParams.score);

	const { data: allCategories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: activeCategoriesData } = useSuspenseQuery(
		activeCategoriesQueryOptions({
			storeId: searchParams.storeId,
			score: searchParams.score,
		}),
	);

	const activeCategoryIds = activeCategoriesData?.map((c) => c.id);
	const categoryCounts = new Map(
		activeCategoriesData?.map((c) => [c.id, c.count]),
	);

	const categories = allCategories?.filter((c) =>
		activeCategoryIds?.includes(c.id),
	);
	const topLevelCategories = categories?.filter((c) => !c.parentId) || [];

	const { data: stores } = useSuspenseQuery(storesQueryOptions());

	const { data: searchResults } = useQuery({
		...searchQueryOptions(searchParams),
		// Only run this query if product search is active
		enabled: isSearchingProducts,
	});

	const updateFilters = (updates: Partial<SearchSchema>) => {
		navigate({
			to: "/search",
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	const updateFilter = <K extends keyof SearchSchema>(
		key: K,
		value: SearchSchema[K],
	) => {
		updateFilters({ [key]: value });
	};

	const clearFilters = () => {
		navigate({ to: "/search", search: {} });
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Top Bar with Search */}
			<div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
					<SearchBar
						key={searchParams.q || "empty"}
						initialQuery={searchParams.q}
					/>

					{/* Filters */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
							<Filter className="w-4 h-4" />
							<span>Filters:</span>
						</div>

						<Select
							value={searchParams.score || "all"}
							onValueChange={(val) =>
								updateFilter(
									"score",
									val === "all" ? undefined : (val as SearchSchema["score"]),
								)
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
								<SelectItem value="rejected">Rejected</SelectItem>
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

						{searchParams.categoryId &&
							(() => {
								const selectedCat = allCategories?.find(
									(c) => c.id === searchParams.categoryId,
								);
								const parentId =
									selectedCat?.parentId || searchParams.categoryId;
								const subcats =
									categories?.filter((c) => c.parentId === parentId) || [];
								const parentCategories =
									categories?.filter((c) => !c.parentId) || [];
								const currentParentCat = allCategories?.find(
									(c) => c.id === parentId,
								);
								const displayParentCategories =
									currentParentCat &&
									!parentCategories.some((c) => c.id === parentId)
										? [currentParentCat, ...parentCategories]
										: parentCategories;

								return (
									<>
										<Select
											value={parentId}
											onValueChange={(val) =>
												updateFilters({
													categoryId: val === "all" ? undefined : val,
													subCategoryIds: undefined,
												})
											}
										>
											<SelectTrigger className="w-35 h-9 text-sm">
												<SelectValue placeholder="Category" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Categories</SelectItem>
												{displayParentCategories.map((cat) => (
													<SelectItem key={cat.id} value={cat.id}>
														{cat.name} ({categoryCounts.get(cat.id) || 0})
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{subcats.length > 0 &&
											(() => {
												const selectedItems = subcats.filter((subcat) =>
													searchParams.subCategoryIds?.includes(subcat.id),
												);
												const MAX_VISIBLE = 2;
												const visibleItems = selectedItems.slice(
													0,
													MAX_VISIBLE,
												);
												const hiddenCount =
													selectedItems.length - visibleItems.length;

												return (
													<div className="w-64 max-w-full">
														<Combobox
															items={subcats}
															itemToStringValue={(c) => c.name}
															multiple
															value={selectedItems}
															onValueChange={(newValues) => {
																updateFilter(
																	"subCategoryIds",
																	newValues.length > 0
																		? newValues.map((v) => v.id)
																		: undefined,
																);
															}}
														>
															<ComboboxChips className="flex-nowrap overflow-hidden">
																<ComboboxValue>
																	{visibleItems.map((item) => (
																		<ComboboxChip
																			key={item.id}
																			className="max-w-20"
																		>
																			<span className="truncate">
																				{item.name}
																			</span>
																		</ComboboxChip>
																	))}
																	{hiddenCount > 0 && (
																		<span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-1 shrink-0">
																			+{hiddenCount} more
																		</span>
																	)}
																</ComboboxValue>
																<ComboboxChipsInput
																	placeholder="Subcategories"
																	className="min-w-15 truncate"
																/>
															</ComboboxChips>
															<ComboboxContent>
																<ComboboxEmpty>
																	No subcategories found.
																</ComboboxEmpty>
																<ComboboxList>
																	{(item) => (
																		<ComboboxItem key={item.id} value={item}>
																			{item.name} (
																			{categoryCounts.get(item.id) || 0})
																		</ComboboxItem>
																	)}
																</ComboboxList>
															</ComboboxContent>
														</Combobox>
													</div>
												);
											})()}
									</>
								);
							})()}

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
				{!isSearchingProducts ? (
					// Default / Filtered Categories State
					<section>
						<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
							Browse Categories
						</h2>
						{topLevelCategories.length > 0 ? (
							<div className="space-y-6">
								{topLevelCategories.map((parentCat) => {
									const subcats =
										categories?.filter((c) => c.parentId === parentCat.id) ||
										[];

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
													updateFilters({
														categoryId: parentCat.id,
														subCategoryIds: undefined,
													})
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
													<span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2 py-1 rounded-full">
														{categoryCounts.get(parentCat.id) || 0}
													</span>
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
																	updateFilters({
																		categoryId: parentCat.id,
																		subCategoryIds: [subcat.id],
																	});
																}}
															>
																<span className="truncate">{subcat.name}</span>
																<span className="ml-auto bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2 py-0.5 rounded-full">
																	{categoryCounts.get(subcat.id) || 0}
																</span>
															</Button>
														))}
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
								<h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
									No categories found
								</h3>
								<p className="text-slate-500 mt-2">
									Try adjusting your store or score filters.
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
				) : (
					// Active Search State: Products
					<section>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
							<div className="flex items-center gap-3">
								<Button
									variant="ghost"
									size="sm"
									className="gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 h-8 -ml-2"
									onClick={() =>
										updateFilters({
											q: undefined,
											categoryId: undefined,
											subCategoryIds: undefined,
										})
									}
								>
									<ArrowLeft className="w-4 h-4" />
									Browse Categories
								</Button>
								<span className="text-slate-300 dark:text-slate-700">|</span>
								<h2 className="text-xl font-bold text-slate-900 dark:text-white">
									{searchResults?.length || 0} Results Found
								</h2>
							</div>
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
