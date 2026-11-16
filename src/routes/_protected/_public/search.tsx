import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	SearchX,
	SlidersHorizontal,
	Sparkles,
	X,
} from "lucide-react";
import { z } from "zod";
import { CategoryBrowseCard } from "#/components/categories/category-browse-card";
import { ProductCard } from "#/components/home/product-card";
import { SearchBar } from "#/components/search/search-bar";
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
import { cn } from "#/lib/utils";
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
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
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

	const activeFilterCount =
		(searchParams.score ? 1 : 0) +
		(searchParams.storeId ? 1 : 0) +
		(searchParams.categoryId ? 1 : 0) +
		(searchParams.subCategoryIds?.length || 0);

	const hasActiveFilters = isSearchingProducts || activeFilterCount > 0;

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

	const activeTriggerStyle =
		"bg-[#E3EDE7]/75 dark:bg-[#1E3A2C] border-[#2D5A44]/40 dark:border-[#3D6E54] text-[#1B4332] dark:text-[#CBE3D4] font-semibold";
	const inactiveTriggerStyle =
		"bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#C9B382] dark:hover:border-[#365043]";

	const resultsCount = searchResults?.length || 0;

	return (
		<div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E1612] pb-20">
			{/* Top Bar with Search & Responsive Filters */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-5xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
					<SearchBar
						key={searchParams.q || "empty"}
						initialQuery={searchParams.q}
						placeholder="Search products, brands..."
					/>

					{/* Responsive Filters */}
					<section aria-label="Search filters" className="flex flex-col gap-2">
						<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
							<div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] mr-1">
								<SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
								<span>Filters</span>
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
								<SelectTrigger
									aria-label="Filter by score"
									className={cn(
										"w-full sm:w-auto sm:min-w-[132px] h-10 pointer-coarse:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
										searchParams.score
											? activeTriggerStyle
											: inactiveTriggerStyle,
									)}
								>
									<SelectValue placeholder="Score" />
								</SelectTrigger>
								<SelectContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
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
								<SelectTrigger
									aria-label="Filter by store"
									className={cn(
										"w-full sm:w-auto sm:min-w-[140px] h-10 pointer-coarse:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
										searchParams.storeId
											? activeTriggerStyle
											: inactiveTriggerStyle,
									)}
								>
									<SelectValue placeholder="Store" />
								</SelectTrigger>
								<SelectContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
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
												<SelectTrigger
													aria-label="Filter by category"
													className={cn(
														"col-span-2 w-full sm:col-span-1 sm:w-auto sm:min-w-[170px] sm:max-w-[230px] h-10 pointer-coarse:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
														activeTriggerStyle,
													)}
												>
													<SelectValue placeholder="Category" />
												</SelectTrigger>
												<SelectContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
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
														<div className="col-span-2 w-full sm:col-span-1 sm:w-64">
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
																<ComboboxChips
																	className={cn(
																		"flex-nowrap overflow-hidden min-h-10 pointer-coarse:min-h-11 rounded-xl shadow-none px-2.5",
																		selectedItems.length > 0
																			? "border-[#2D5A44]/40 dark:border-[#3D6E54] bg-[#E3EDE7]/40 dark:bg-[#1E3A2C]/50"
																			: "border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]",
																	)}
																>
																	<ComboboxValue>
																		{visibleItems.map((item) => (
																			<ComboboxChip
																				key={item.id}
																				className="max-w-28 rounded-lg bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] border border-[#C8DBD0]/70 dark:border-[#2E5440]"
																			>
																				<span className="truncate">
																					{item.name}
																				</span>
																			</ComboboxChip>
																		))}
																		{hiddenCount > 0 && (
																			<span className="text-xs font-semibold text-[#1B4332] dark:text-[#CBE3D4] whitespace-nowrap ml-1 shrink-0">
																				+{hiddenCount}
																			</span>
																		)}
																	</ComboboxValue>
																	<ComboboxChipsInput
																		placeholder={
																			selectedItems.length > 0
																				? "Add subcategory..."
																				: "Subcategories"
																		}
																		className="min-w-16 truncate text-[13px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E]"
																	/>
																</ComboboxChips>
																<ComboboxContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
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
								<button
									type="button"
									onClick={clearFilters}
									className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer sm:ml-auto"
								>
									<X className="w-3.5 h-3.5" aria-hidden="true" />
									<span>Clear all</span>
								</button>
							)}
						</div>

						{hasActiveFilters && (
							<div className="flex sm:hidden items-center justify-between pt-0.5">
								<span className="text-xs font-medium text-[#5C665E] dark:text-[#9AA89E]">
									{activeFilterCount > 0
										? `${activeFilterCount} ${activeFilterCount === 1 ? "filter" : "filters"} active`
										: "Search active"}
								</span>
								<button
									type="button"
									onClick={clearFilters}
									className="inline-flex items-center gap-1 min-h-8 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/50 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
								>
									<X className="w-3.5 h-3.5" aria-hidden="true" />
									<span>Clear all</span>
								</button>
							</div>
						)}
					</section>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
				{!isSearchingProducts ? (
					// Default / Filtered Categories State
					<section aria-labelledby="browse-categories-heading">
						<div className="flex items-baseline justify-between gap-3 mb-5">
							<div>
								<h1
									id="browse-categories-heading"
									className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] [text-wrap:balance]"
								>
									Browse Categories
								</h1>
								<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
									Pick a food aisle or jump directly into a subcategory
								</p>
							</div>
							{topLevelCategories.length > 0 && (
								<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
									{topLevelCategories.length}{" "}
									{topLevelCategories.length === 1 ? "category" : "categories"}
								</span>
							)}
						</div>

						{topLevelCategories.length > 0 ? (
							<div className="space-y-4">
								{topLevelCategories.map((parentCat, index) => {
									const subcats =
										categories
											?.filter((c) => c.parentId === parentCat.id)
											.map((subcat) => ({
												id: subcat.id,
												name: subcat.name,
												count: categoryCounts.get(subcat.id) || 0,
											})) || [];

									return (
										<CategoryBrowseCard
											key={parentCat.id}
											category={parentCat}
											productCount={categoryCounts.get(parentCat.id) || 0}
											subcategories={subcats}
											paletteIndex={index}
											onSelectCategory={() =>
												updateFilters({
													categoryId: parentCat.id,
													subCategoryIds: undefined,
												})
											}
											onSelectSubcategory={(subcatId) =>
												updateFilters({
													categoryId: parentCat.id,
													subCategoryIds: [subcatId],
												})
											}
										/>
									);
								})}
							</div>
						) : (
							<div className="text-center py-16 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
								<div className="w-12 h-12 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center mx-auto mb-3">
									<Sparkles className="w-5 h-5" aria-hidden="true" />
								</div>
								<h2 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
									No categories found
								</h2>
								<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 max-w-sm mx-auto">
									Try adjusting your store or score filters to see available
									aisles.
								</p>
								<button
									type="button"
									onClick={clearFilters}
									className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
								>
									Clear all filters
								</button>
							</div>
						)}
					</section>
				) : (
					// Active Search State: Products
					<section aria-labelledby="search-results-heading">
						<div className="flex flex-wrap items-center justify-between gap-3 mb-5">
							<div className="flex items-center gap-2.5 flex-wrap">
								<button
									type="button"
									onClick={() =>
										updateFilters({
											q: undefined,
											categoryId: undefined,
											subCategoryIds: undefined,
										})
									}
									className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] transition-colors cursor-pointer"
								>
									<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
									<span>Browse Categories</span>
								</button>

								<h1
									id="search-results-heading"
									className="text-lg sm:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] tabular-nums"
								>
									{resultsCount} {resultsCount === 1 ? "Result" : "Results"}{" "}
									Found
								</h1>
							</div>
						</div>

						{searchResults && searchResults.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-5">
								{searchResults.map((result) => (
									<ProductCard
										key={result.product.id}
										product={{
											...result.product,
											storeName: result.storeName,
											stores: result.stores,
										}}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-16 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
								<div className="w-12 h-12 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto mb-3">
									<SearchX className="w-5 h-5" aria-hidden="true" />
								</div>
								<h2 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
									No products found
								</h2>
								<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 max-w-sm mx-auto">
									Try adjusting your filters or search query.
								</p>
								<button
									type="button"
									onClick={clearFilters}
									className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
								>
									Clear all filters
								</button>
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	);
}
