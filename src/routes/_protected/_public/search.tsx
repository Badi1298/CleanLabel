import {
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ChevronRight,
	FolderTree,
	Loader2,
	SearchX,
	SlidersHorizontal,
	X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { z } from "zod";
import { getCategoryVisual } from "#/components/categories/category-browse-card";
import { ProductCard } from "#/components/home/product-card";
import {
	CategoryNavList,
	MobileCategoryDrawer,
} from "#/components/search/category-sidebar";
import { SearchBar } from "#/components/search/search-bar";
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
import {
	infiniteSearchQueryOptions,
	searchCategorySectionsQueryOptions,
} from "#/queries/search-queries";
import { storesQueryOptions } from "#/queries/store-queries";
import { UNCATEGORIZED_CATEGORY_ID } from "#/server/search-functions";

const CATEGORY_PREVIEW_LIMIT = 8;
const CATEGORY_PAGE_SIZE = 24;

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
		const hasCategoryFilter =
			Boolean(deps.categoryId) ||
			Boolean(deps.subCategoryIds && deps.subCategoryIds.length > 0);

		await Promise.all([
			queryClient.ensureQueryData(categoriesQueryOptions()),
			queryClient.ensureQueryData(
				activeCategoriesQueryOptions({
					storeId: deps.storeId,
					score: deps.score,
				}),
			),
			queryClient.ensureQueryData(storesQueryOptions()),
			hasCategoryFilter
				? queryClient.ensureInfiniteQueryData(
						infiniteSearchQueryOptions({
							...deps,
							pageSize: CATEGORY_PAGE_SIZE,
						}),
					)
				: queryClient.ensureQueryData(
						searchCategorySectionsQueryOptions({
							q: deps.q,
							storeId: deps.storeId,
							score: deps.score,
							limitPerCategory: CATEGORY_PREVIEW_LIMIT,
						}),
					),
		]);
	},
	component: SearchPage,
});

function SearchPage() {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const drawerId = useId();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const selectedSubCategoryId = searchParams.subCategoryIds?.[0];
	const hasCategoryFilter =
		Boolean(searchParams.categoryId) || Boolean(selectedSubCategoryId);

	const activeFilterCount =
		(searchParams.score ? 1 : 0) +
		(searchParams.storeId ? 1 : 0) +
		(hasCategoryFilter ? 1 : 0);

	const hasActiveFilters =
		Boolean(searchParams.q?.trim()) || activeFilterCount > 0;

	const { data: allCategories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: activeCategoriesData } = useSuspenseQuery(
		activeCategoriesQueryOptions({
			storeId: searchParams.storeId,
			score: searchParams.score,
		}),
	);
	const { data: stores } = useSuspenseQuery(storesQueryOptions());

	const categoryCounts = useMemo(
		() => new Map(activeCategoriesData?.map((c) => [c.id, c.count])),
		[activeCategoriesData],
	);

	const activeCategoryIds = useMemo(
		() => new Set(activeCategoriesData?.map((c) => c.id)),
		[activeCategoriesData],
	);

	const categories = useMemo(
		() => allCategories?.filter((c) => activeCategoryIds.has(c.id)) || [],
		[allCategories, activeCategoryIds],
	);

	const topLevelCategories = useMemo(
		() => categories.filter((c) => !c.parentId),
		[categories],
	);

	const selectedSubcategory = selectedSubCategoryId
		? allCategories?.find((c) => c.id === selectedSubCategoryId)
		: undefined;

	const activeParentId =
		selectedSubcategory?.parentId ||
		(searchParams.categoryId
			? allCategories?.find((c) => c.id === searchParams.categoryId)
					?.parentId || searchParams.categoryId
			: undefined);

	const activeParentCategory =
		activeParentId === UNCATEGORIZED_CATEGORY_ID
			? { id: UNCATEGORIZED_CATEGORY_ID, name: "Other", iconUrl: null }
			: activeParentId
				? allCategories?.find((c) => c.id === activeParentId)
				: undefined;

	const { data: sectionsData, isFetching: isFetchingSections } = useQuery({
		...searchCategorySectionsQueryOptions({
			q: searchParams.q,
			storeId: searchParams.storeId,
			score: searchParams.score,
			limitPerCategory: CATEGORY_PREVIEW_LIMIT,
		}),
		enabled: !hasCategoryFilter,
		placeholderData: keepPreviousData,
	});

	const {
		data: infiniteData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching: isFetchingFiltered,
	} = useInfiniteQuery({
		...infiniteSearchQueryOptions({
			q: searchParams.q,
			storeId: searchParams.storeId,
			categoryId: searchParams.categoryId,
			subCategoryIds: searchParams.subCategoryIds,
			score: searchParams.score,
			pageSize: CATEGORY_PAGE_SIZE,
		}),
		enabled: hasCategoryFilter,
		placeholderData: keepPreviousData,
	});

	const filteredProducts = useMemo(
		() => infiniteData?.pages.flatMap((page) => page.items) || [],
		[infiniteData],
	);
	const filteredTotalCount = infiniteData?.pages[0]?.totalCount ?? 0;

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

	const handleSelectAllCategories = () => {
		updateFilters({
			categoryId: undefined,
			subCategoryIds: undefined,
		});
	};

	const handleSelectCategory = (categoryId: string) => {
		updateFilters({
			categoryId,
			subCategoryIds: undefined,
		});
	};

	const handleSelectSubcategory = (parentId: string, subcatId: string) => {
		updateFilters({
			categoryId: parentId,
			subCategoryIds: [subcatId],
		});
	};

	const activeTriggerStyle =
		"bg-[#E3EDE7]/75 dark:bg-[#1E3A2C] border-[#2D5A44]/40 dark:border-[#3D6E54] text-[#1B4332] dark:text-[#CBE3D4] font-semibold";
	const inactiveTriggerStyle =
		"bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#C9B382] dark:hover:border-[#365043]";

	const mobileCategoryLabel =
		selectedSubcategory?.name || activeParentCategory?.name || "Categories";

	const trimmedQuery = searchParams.q?.trim();

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Top Bar with Search & Filters */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
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

							<button
								type="button"
								onClick={() => setIsDrawerOpen(true)}
								aria-expanded={isDrawerOpen}
								aria-controls={drawerId}
								className={cn(
									"col-span-2 lg:hidden inline-flex items-center justify-between gap-2 h-10 pointer-coarse:h-11 px-3 rounded-xl border text-[13px] transition-colors cursor-pointer",
									hasCategoryFilter ? activeTriggerStyle : inactiveTriggerStyle,
								)}
							>
								<span className="flex items-center gap-2 min-w-0">
									<FolderTree className="w-4 h-4 shrink-0" aria-hidden="true" />
									<span className="truncate">{mobileCategoryLabel}</span>
								</span>
								<ChevronRight
									className="w-4 h-4 shrink-0 opacity-70"
									aria-hidden="true"
								/>
							</button>

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
										"w-full sm:w-auto sm:min-w-33 h-10 pointer-coarse:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
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
										"w-full sm:w-auto sm:min-w-35 h-10 pointer-coarse:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
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

			{/* Mobile Slide-Over Category Drawer */}
			<div className="lg:hidden">
				<MobileCategoryDrawer
					id={drawerId}
					isOpen={isDrawerOpen}
					onOpenChange={setIsDrawerOpen}
					topLevelCategories={topLevelCategories}
					categories={categories}
					categoryCounts={categoryCounts}
					activeParentId={activeParentId}
					selectedCategoryId={searchParams.categoryId}
					selectedSubCategoryId={selectedSubCategoryId}
					totalProductsCount={
						!hasCategoryFilter ? sectionsData?.totalProductsCount : undefined
					}
					onSelectAll={handleSelectAllCategories}
					onSelectCategory={(catId) => handleSelectCategory(catId)}
					onSelectSubcategory={handleSelectSubcategory}
				/>
			</div>

			{/* Main Content + Left Categories Aside */}
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-7">
					<aside
						aria-label="Browse by category"
						className="hidden lg:block w-64 shrink-0 lg:sticky lg:top-44 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]"
					>
						<div className="px-2.5 pt-1 pb-2">
							<h2 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								Categories
							</h2>
						</div>
						<CategoryNavList
							topLevelCategories={topLevelCategories}
							categories={categories}
							categoryCounts={categoryCounts}
							activeParentId={activeParentId}
							selectedCategoryId={searchParams.categoryId}
							selectedSubCategoryId={selectedSubCategoryId}
							totalProductsCount={
								!hasCategoryFilter
									? sectionsData?.totalProductsCount
									: undefined
							}
							onSelectAll={handleSelectAllCategories}
							onSelectCategory={(catId) => handleSelectCategory(catId)}
							onSelectSubcategory={handleSelectSubcategory}
						/>
					</aside>

					<main className="flex-1 min-w-0">
						{!hasCategoryFilter ? (
							<section aria-labelledby="all-products-heading">
								<div className="flex items-baseline justify-between gap-3 mb-6">
									<div>
										<h1
											id="all-products-heading"
											className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] text-balance"
										>
											{trimmedQuery
												? `Results for "${trimmedQuery}"`
												: "All Products"}
										</h1>
										<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
											Browse by aisle or pick a category to see all items
										</p>
									</div>

									{typeof sectionsData?.totalProductsCount === "number" && (
										<span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
											{isFetchingSections && (
												<Loader2
													className="w-3 h-3 animate-spin"
													aria-hidden="true"
												/>
											)}
											<span>
												{sectionsData.totalProductsCount}{" "}
												{sectionsData.totalProductsCount === 1
													? "product"
													: "products"}
											</span>
										</span>
									)}
								</div>

								{sectionsData && sectionsData.sections.length > 0 ? (
									<div className="space-y-9">
										{sectionsData.sections.map((section, index) => {
											const { palette, Icon } = getCategoryVisual(
												section.category.name,
												index,
											);
											const hasMoreInCategory =
												section.totalCount > section.products.length;

											return (
												<section
													key={section.category.id}
													aria-labelledby={`cat-section-${section.category.id}`}
												>
													<div className="flex items-center justify-between gap-3 mb-3.5 pb-2 border-b border-[#EAE4D7]/80 dark:border-[#24362D]">
														<div className="flex items-center gap-2.5 min-w-0">
															<div
																className={cn(
																	"w-8 h-8 rounded-full border flex items-center justify-center shrink-0",
																	palette.bg,
																	palette.border,
																)}
															>
																{section.category.iconUrl ? (
																	<img
																		src={section.category.iconUrl}
																		alt=""
																		className="w-5 h-5 object-contain"
																		loading="lazy"
																	/>
																) : (
																	<Icon
																		className={cn("w-4 h-4", palette.iconText)}
																		strokeWidth={2}
																		aria-hidden="true"
																	/>
																)}
															</div>
															<h2
																id={`cat-section-${section.category.id}`}
																className="text-base sm:text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] truncate"
															>
																{section.category.name}
															</h2>
															<span className="inline-flex items-center justify-center rounded-full bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E] px-2 py-0.5 text-[11px] font-bold tabular-nums shrink-0">
																{section.totalCount}
															</span>
														</div>

														<button
															type="button"
															onClick={() =>
																handleSelectCategory(section.category.id)
															}
															className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer shrink-0"
														>
															<span>
																{hasMoreInCategory
																	? `View all (${section.totalCount})`
																	: "Open"}
															</span>
															<ChevronRight
																className="w-3.5 h-3.5"
																aria-hidden="true"
															/>
														</button>
													</div>

													<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-5">
														{section.products.map((result) => (
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
												</section>
											);
										})}
									</div>
								) : (
									<EmptyProductsState onClear={clearFilters} />
								)}
							</section>
						) : (
							<section aria-labelledby="search-results-heading">
								<div className="flex flex-wrap items-center justify-between gap-3 mb-5">
									<div className="flex items-center gap-2.5 flex-wrap">
										<button
											type="button"
											onClick={handleSelectAllCategories}
											className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] transition-colors cursor-pointer"
										>
											<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
											<span>All Products</span>
										</button>

										<div className="flex items-center gap-1.5 flex-wrap">
											{activeParentCategory && selectedSubcategory ? (
												<>
													<button
														type="button"
														onClick={() =>
															handleSelectCategory(activeParentCategory.id)
														}
														className="text-sm font-semibold text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] transition-colors cursor-pointer"
													>
														{activeParentCategory.name}
													</button>
													<ChevronRight
														className="w-4 h-4 text-[#9AA09A]"
														aria-hidden="true"
													/>
													<h1
														id="search-results-heading"
														className="text-lg sm:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
													>
														{selectedSubcategory.name}
													</h1>
												</>
											) : (
												<h1
													id="search-results-heading"
													className="text-lg sm:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
												>
													{activeParentCategory?.name || "Category Results"}
												</h1>
											)}
										</div>
									</div>

									<span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
										{isFetchingFiltered && !isFetchingNextPage && (
											<Loader2
												className="w-3 h-3 animate-spin"
												aria-hidden="true"
											/>
										)}
										<span>
											{filteredTotalCount}{" "}
											{filteredTotalCount === 1 ? "Result" : "Results"}
										</span>
									</span>
								</div>

								{filteredProducts.length > 0 ? (
									<>
										<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-5">
											{filteredProducts.map((result) => (
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

										{hasNextPage && (
											<div className="mt-8 flex flex-col items-center gap-2">
												<button
													type="button"
													onClick={() => fetchNextPage()}
													disabled={isFetchingNextPage}
													className="inline-flex items-center gap-2 min-h-10 px-5 py-2 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-sm font-semibold text-[#1B4332] dark:text-[#CBE3D4] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] disabled:opacity-60 transition-colors cursor-pointer"
												>
													{isFetchingNextPage && (
														<Loader2
															className="w-4 h-4 animate-spin"
															aria-hidden="true"
														/>
													)}
													<span>
														{isFetchingNextPage
															? "Loading more..."
															: `Load more (${filteredProducts.length} of ${filteredTotalCount})`}
													</span>
												</button>
											</div>
										)}
									</>
								) : (
									<EmptyProductsState onClear={clearFilters} />
								)}
							</section>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

function EmptyProductsState({ onClear }: { onClear: () => void }) {
	return (
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
				onClick={onClear}
				className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
			>
				Clear all filters
			</button>
		</div>
	);
}
