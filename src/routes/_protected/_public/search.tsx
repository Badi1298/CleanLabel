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
	SlidersHorizontal,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { CategoryIcon } from "#/components/categories/category-icon";
import {
	CategorySectionsView,
	EmptyProductsState,
	FILTER_TRIGGER_ACTIVE_CLASS,
	FILTER_TRIGGER_INACTIVE_CLASS,
	PaginatedProductsGrid,
	ScoreFilterSelect,
} from "#/components/search/catalog-views";
import {
	CategoryNavList,
	MobileCategoryDrawer,
} from "#/components/search/category-sidebar";
import { SearchBar } from "#/components/search/search-bar";
import { Badge } from "#/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
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
					q: deps.q,
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
			q: searchParams.q,
			storeId: searchParams.storeId,
			score: searchParams.score,
		}),
	);
	const { data: stores } = useSuspenseQuery(storesQueryOptions());

	const categoryCounts = useMemo(
		() => new Map(activeCategoriesData.categories.map((c) => [c.id, c.count])),
		[activeCategoriesData],
	);

	const activeCategoryIds = useMemo(
		() => new Set(activeCategoriesData.categories.map((c) => c.id)),
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
			? {
					id: UNCATEGORIZED_CATEGORY_ID,
					name: m.common_other_category(),
					iconUrl: null,
				}
			: activeParentId
				? allCategories?.find((c) => c.id === activeParentId)
				: undefined;

	const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
		() => new Set(activeParentId ? [activeParentId] : []),
	);

	useEffect(() => {
		if (!activeParentId) return;
		setExpandedCategoryIds((prev) => {
			if (prev.has(activeParentId)) return prev;
			const next = new Set(prev);
			next.add(activeParentId);
			return next;
		});
	}, [activeParentId]);

	const handleToggleCategoryExpand = (categoryId: string, open: boolean) => {
		setExpandedCategoryIds((prev) => {
			const has = prev.has(categoryId);
			if (open === has) return prev;
			const next = new Set(prev);
			if (open) {
				next.add(categoryId);
			} else {
				next.delete(categoryId);
			}
			return next;
		});
	};

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

	const mobileCategoryLabel =
		selectedSubcategory?.name ||
		activeParentCategory?.name ||
		m.search_categories_label();

	const trimmedQuery = searchParams.q?.trim();

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Top Bar with Search & Filters */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
					<SearchBar
						key={searchParams.q || "empty"}
						initialQuery={searchParams.q}
						placeholder={m.home_search_placeholder()}
					/>

					{/* Responsive Filters */}
					<section
						aria-label={m.search_filters_aria()}
						className="flex flex-col gap-2"
					>
						<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
							<div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] mr-1">
								<SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
								<span>{m.common_filters()}</span>
							</div>

							<div className="col-span-2 lg:hidden">
								<MobileCategoryDrawer
									isOpen={isDrawerOpen}
									onOpenChange={setIsDrawerOpen}
									trigger={
										<Button
											type="button"
											variant="outline"
											className={cn(
												"w-full justify-between gap-2 h-10 pointer-coarse:h-11 px-3 rounded-xl text-[13px] shadow-none transition-colors",
												hasCategoryFilter
													? FILTER_TRIGGER_ACTIVE_CLASS
													: FILTER_TRIGGER_INACTIVE_CLASS,
											)}
										>
											<span className="flex items-center gap-2 min-w-0">
												{activeParentCategory ? (
													<CategoryIcon
														name={
															selectedSubcategory?.name ??
															activeParentCategory.name
														}
														parentName={activeParentCategory.name}
														iconUrl={
															selectedSubcategory?.iconUrl ??
															activeParentCategory.iconUrl
														}
														className="w-5 h-5"
													/>
												) : (
													<FolderTree
														className="w-4 h-4 shrink-0"
														aria-hidden="true"
													/>
												)}
												<span className="truncate">{mobileCategoryLabel}</span>
											</span>
											<ChevronRight
												className="w-4 h-4 shrink-0 opacity-70"
												aria-hidden="true"
											/>
										</Button>
									}
									topLevelCategories={topLevelCategories}
									categories={categories}
									categoryCounts={categoryCounts}
									activeParentId={activeParentId}
									selectedCategoryId={searchParams.categoryId}
									selectedSubCategoryId={selectedSubCategoryId}
									expandedCategoryIds={expandedCategoryIds}
									totalProductsCount={activeCategoriesData.totalProductsCount}
									onSelectAll={handleSelectAllCategories}
									onSelectCategory={(catId) => handleSelectCategory(catId)}
									onToggleCategoryExpand={handleToggleCategoryExpand}
									onSelectSubcategory={handleSelectSubcategory}
								/>
							</div>

							<ScoreFilterSelect
								value={searchParams.score}
								onChange={(val) => updateFilter("score", val)}
							/>

							<Select
								value={searchParams.storeId || "all"}
								onValueChange={(val) =>
									updateFilter("storeId", val === "all" ? undefined : val)
								}
							>
								<SelectTrigger
									aria-label={m.search_filter_by_store_aria()}
									className={cn(
										"w-full sm:w-auto sm:min-w-35 h-10 data-[size=default]:h-10 pointer-coarse:h-11 pointer-coarse:data-[size=default]:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
										searchParams.storeId
											? FILTER_TRIGGER_ACTIVE_CLASS
											: FILTER_TRIGGER_INACTIVE_CLASS,
									)}
								>
									<SelectValue placeholder={m.search_store_placeholder()} />
								</SelectTrigger>
								<SelectContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
									<SelectItem value="all">{m.search_any_store()}</SelectItem>
									{stores?.map((store) => (
										<SelectItem key={store.id} value={store.id}>
											{store.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{hasActiveFilters && (
								<Button
									type="button"
									variant="ghost"
									onClick={clearFilters}
									className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 sm:ml-auto"
								>
									<X className="w-3.5 h-3.5" aria-hidden="true" />
									<span>{m.common_clear_all()}</span>
								</Button>
							)}
						</div>

						{hasActiveFilters && (
							<div className="flex sm:hidden items-center justify-between pt-0.5">
								<span className="text-xs font-medium text-[#5C665E] dark:text-[#9AA89E]">
									{activeFilterCount > 0
										? m.common_filters_active_count({
												count: activeFilterCount,
											})
										: m.search_active()}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={clearFilters}
									className="h-auto min-h-8 gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/50 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/70 shadow-none"
								>
									<X className="w-3.5 h-3.5" aria-hidden="true" />
									<span>{m.common_clear_all()}</span>
								</Button>
							</div>
						)}
					</section>
				</div>
			</div>

			{/* Main Content + Left Categories Aside */}
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-7">
					<aside
						aria-label={m.search_browse_by_category_aria()}
						className="hidden lg:block w-64 shrink-0 lg:sticky lg:top-44 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]"
					>
						<div className="px-2.5 pt-1 pb-2">
							<h2 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								{m.search_categories_label()}
							</h2>
						</div>
						<CategoryNavList
							topLevelCategories={topLevelCategories}
							categories={categories}
							categoryCounts={categoryCounts}
							activeParentId={activeParentId}
							selectedCategoryId={searchParams.categoryId}
							selectedSubCategoryId={selectedSubCategoryId}
							expandedCategoryIds={expandedCategoryIds}
							totalProductsCount={activeCategoriesData.totalProductsCount}
							onSelectAll={handleSelectAllCategories}
							onSelectCategory={(catId) => handleSelectCategory(catId)}
							onToggleCategoryExpand={handleToggleCategoryExpand}
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
												? m.search_results_for({ query: trimmedQuery })
												: m.common_all_products_title()}
										</h1>
										<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
											{m.search_subtitle()}
										</p>
									</div>

									{typeof sectionsData?.totalProductsCount === "number" && (
										<Badge
											variant="secondary"
											className="gap-1.5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0"
										>
											{isFetchingSections && (
												<Loader2
													className="w-3 h-3 animate-spin"
													aria-hidden="true"
												/>
											)}
											<span>
												{m.common_products_count({
													count: sectionsData.totalProductsCount,
												})}
											</span>
										</Badge>
									)}
								</div>

								{sectionsData && sectionsData.sections.length > 0 ? (
									<CategorySectionsView
										sections={sectionsData.sections}
										onSelectCategory={handleSelectCategory}
									/>
								) : (
									<EmptyProductsState onAction={clearFilters} />
								)}
							</section>
						) : (
							<section aria-labelledby="search-results-heading">
								<div className="flex flex-wrap items-center justify-between gap-3 mb-5">
									<div className="flex items-center gap-2.5 flex-wrap">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleSelectAllCategories}
											className="h-auto min-h-9 gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] shadow-none"
										>
											<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
											<span>{m.common_all_products_title()}</span>
										</Button>

										{activeParentCategory && (
											<CategoryIcon
												name={
													selectedSubcategory?.name ?? activeParentCategory.name
												}
												parentName={activeParentCategory.name}
												iconUrl={
													selectedSubcategory?.iconUrl ??
													activeParentCategory.iconUrl
												}
												className="w-8 h-8"
											/>
										)}

										{activeParentCategory && selectedSubcategory ? (
											<Breadcrumb>
												<BreadcrumbList className="gap-1.5 sm:gap-1.5">
													<BreadcrumbItem>
														<BreadcrumbLink asChild>
															<Button
																type="button"
																variant="link"
																onClick={() =>
																	handleSelectCategory(activeParentCategory.id)
																}
																className="h-auto p-0 text-sm font-semibold text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] hover:no-underline"
															>
																{activeParentCategory.name}
															</Button>
														</BreadcrumbLink>
													</BreadcrumbItem>
													<BreadcrumbSeparator className="text-[#9AA09A] [&>svg]:size-4" />
													<BreadcrumbItem>
														<BreadcrumbPage className="font-normal">
															<h1
																id="search-results-heading"
																className="text-lg sm:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
															>
																{selectedSubcategory.name}
															</h1>
														</BreadcrumbPage>
													</BreadcrumbItem>
												</BreadcrumbList>
											</Breadcrumb>
										) : (
											<h1
												id="search-results-heading"
												className="text-lg sm:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
											>
												{activeParentCategory?.name ||
													m.search_category_results_fallback()}
											</h1>
										)}
									</div>

									<Badge
										variant="secondary"
										className="gap-1.5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0"
									>
										{isFetchingFiltered && !isFetchingNextPage && (
											<Loader2
												className="w-3 h-3 animate-spin"
												aria-hidden="true"
											/>
										)}
										<span>
											{m.common_results_count({ count: filteredTotalCount })}
										</span>
									</Badge>
								</div>

								{filteredProducts.length > 0 ? (
									<PaginatedProductsGrid
										products={filteredProducts}
										totalCount={filteredTotalCount}
										hasNextPage={hasNextPage}
										isFetchingNextPage={isFetchingNextPage}
										onFetchNextPage={() => fetchNextPage()}
									/>
								) : (
									<EmptyProductsState onAction={clearFilters} />
								)}
							</section>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
