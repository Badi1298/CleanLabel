import {
	keepPreviousData,
	useInfiniteQuery,
	useQueries,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ChevronRight,
	Loader2,
	SlidersHorizontal,
	Store as StoreIcon,
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
import type { CategoryItem } from "#/components/search/category-sidebar";
import { SearchBar } from "#/components/search/search-bar";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { StoreCard } from "#/components/stores/store-card";
import {
	MobileStoreDrawer,
	type StoreCategoriesData,
	StoreNavList,
} from "#/components/stores/store-sidebar";
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

const storesSearchSchema = z.object({
	storeId: z.string().optional(),
	categoryId: z.string().optional(),
	subCategoryId: z.string().optional(),
	q: z.string().optional(),
	score: z.enum(["gold", "silver", "bronze", "none"]).optional(),
});

type StoresSearch = z.infer<typeof storesSearchSchema>;

export const Route = createFileRoute("/_protected/_public/stores")({
	validateSearch: storesSearchSchema,
	loaderDeps: ({
		search: { storeId, categoryId, subCategoryId, q, score },
	}) => ({
		storeId,
		categoryId,
		subCategoryId,
		q,
		score,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		const storesPromise = queryClient.ensureQueryData(
			storesQueryOptions({ score: deps.score }),
		);

		if (!deps.storeId) {
			await storesPromise;
			return;
		}

		const hasCategoryFilter =
			Boolean(deps.categoryId) || Boolean(deps.subCategoryId);

		await Promise.all([
			storesPromise,
			queryClient.ensureQueryData(categoriesQueryOptions()),
			queryClient.ensureQueryData(
				activeCategoriesQueryOptions({
					q: deps.q,
					storeId: deps.storeId,
					score: deps.score,
				}),
			),
			hasCategoryFilter
				? queryClient.ensureInfiniteQueryData(
						infiniteSearchQueryOptions({
							q: deps.q,
							storeId: deps.storeId,
							categoryId: deps.categoryId,
							subCategoryIds: deps.subCategoryId
								? [deps.subCategoryId]
								: undefined,
							score: deps.score,
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
	component: StoresPage,
});

function buildStoreCategoriesData(
	allCategories: CategoryItem[] | undefined,
	activeRows: Array<{ id: string; count: number }> | undefined,
	isLoading: boolean,
): StoreCategoriesData {
	if (!allCategories || !activeRows) {
		return {
			categories: [],
			counts: new Map<string, number>(),
			isLoading,
		};
	}
	const counts = new Map(activeRows.map((c) => [c.id, c.count]));
	const categories = allCategories.filter(
		(c) => !c.parentId && counts.has(c.id),
	);
	return {
		categories,
		counts,
		isLoading,
	};
}

function StoresPage() {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [storeSearchQuery, setStoreSearchQuery] = useState("");
	const [expandedStoreIds, setExpandedStoreIds] = useState<Set<string>>(
		() => new Set(searchParams.storeId ? [searchParams.storeId] : []),
	);

	const { data: stores } = useSuspenseQuery(
		storesQueryOptions({ score: searchParams.score }),
	);

	const selectedStore = useMemo(
		() =>
			searchParams.storeId
				? stores?.find((s) => s.id === searchParams.storeId)
				: undefined,
		[stores, searchParams.storeId],
	);

	useEffect(() => {
		const storeId = selectedStore?.id;
		if (!storeId) return;
		setExpandedStoreIds((prev) => {
			if (prev.has(storeId)) return prev;
			const next = new Set(prev);
			next.add(storeId);
			return next;
		});
	}, [selectedStore?.id]);

	const isUnknownStore = Boolean(searchParams.storeId) && !selectedStore;

	const hasCategoryFilter =
		Boolean(searchParams.categoryId) || Boolean(searchParams.subCategoryId);

	const { data: allCategories, isPending: isPendingAllCategories } = useQuery({
		...categoriesQueryOptions(),
		enabled: Boolean(selectedStore) || expandedStoreIds.size > 0,
	});

	const {
		data: activeCategoriesData,
		isPending: isPendingSelectedCategories,
		isFetching: isFetchingCategories,
	} = useQuery({
		...activeCategoriesQueryOptions({
			q: searchParams.q,
			storeId: selectedStore?.id,
			score: searchParams.score,
		}),
		enabled: Boolean(selectedStore),
		placeholderData: (previousData, previousQuery) => {
			const prevFilters = previousQuery?.queryKey[1] as
				| { storeId?: string }
				| undefined;
			return prevFilters?.storeId === selectedStore?.id
				? previousData
				: undefined;
		},
	});

	const nonSelectedExpandedStoreIds = useMemo(
		() => Array.from(expandedStoreIds).filter((id) => id !== selectedStore?.id),
		[expandedStoreIds, selectedStore?.id],
	);

	const nonSelectedStoreCategoryQueries = useQueries({
		queries: nonSelectedExpandedStoreIds.map((storeId) => ({
			...activeCategoriesQueryOptions({
				storeId,
				score: searchParams.score,
			}),
		})),
	});

	const categoryCounts = useMemo(
		() =>
			new Map(
				(activeCategoriesData?.categories ?? []).map((c) => [c.id, c.count]),
			),
		[activeCategoriesData],
	);

	const activeCategoryIds = useMemo(
		() => new Set((activeCategoriesData?.categories ?? []).map((c) => c.id)),
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

	const storeCategoriesByStoreId = useMemo(() => {
		const map = new Map<string, StoreCategoriesData>();

		if (selectedStore) {
			map.set(selectedStore.id, {
				categories: topLevelCategories,
				counts: categoryCounts,
				isLoading:
					isPendingAllCategories ||
					isPendingSelectedCategories ||
					(isFetchingCategories && topLevelCategories.length === 0),
			});
		}

		for (let i = 0; i < nonSelectedExpandedStoreIds.length; i += 1) {
			const storeId = nonSelectedExpandedStoreIds[i];
			const query = nonSelectedStoreCategoryQueries[i];
			map.set(
				storeId,
				buildStoreCategoriesData(
					allCategories,
					query?.data?.categories,
					isPendingAllCategories || Boolean(query?.isPending),
				),
			);
		}

		return map;
	}, [
		selectedStore,
		topLevelCategories,
		categoryCounts,
		isPendingAllCategories,
		isPendingSelectedCategories,
		isFetchingCategories,
		nonSelectedExpandedStoreIds,
		nonSelectedStoreCategoryQueries,
		allCategories,
	]);

	const categoryParam = searchParams.categoryId
		? allCategories?.find((c) => c.id === searchParams.categoryId)
		: undefined;

	const selectedSubcategory = searchParams.subCategoryId
		? allCategories?.find((c) => c.id === searchParams.subCategoryId)
		: categoryParam?.parentId
			? categoryParam
			: undefined;

	const activeParentId =
		selectedSubcategory?.parentId ||
		categoryParam?.parentId ||
		searchParams.categoryId;

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

	const activeSubcategories = useMemo(
		() =>
			activeParentId
				? categories.filter((c) => c.parentId === activeParentId)
				: [],
		[categories, activeParentId],
	);

	const {
		data: sectionsData,
		isFetching: isFetchingSections,
		isPending: isPendingSections,
	} = useQuery({
		...searchCategorySectionsQueryOptions({
			q: searchParams.q,
			storeId: selectedStore?.id,
			score: searchParams.score,
			limitPerCategory: CATEGORY_PREVIEW_LIMIT,
		}),
		enabled: Boolean(selectedStore) && !hasCategoryFilter,
		placeholderData: keepPreviousData,
	});

	const {
		data: infiniteData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching: isFetchingFiltered,
		isPending: isPendingFiltered,
	} = useInfiniteQuery({
		...infiniteSearchQueryOptions({
			q: searchParams.q,
			storeId: selectedStore?.id,
			categoryId: searchParams.categoryId,
			subCategoryIds: searchParams.subCategoryId
				? [searchParams.subCategoryId]
				: undefined,
			score: searchParams.score,
			pageSize: CATEGORY_PAGE_SIZE,
		}),
		enabled: Boolean(selectedStore) && hasCategoryFilter,
		placeholderData: keepPreviousData,
	});

	const filteredProducts = useMemo(
		() => infiniteData?.pages.flatMap((page) => page.items) || [],
		[infiniteData],
	);
	const filteredTotalCount = infiniteData?.pages[0]?.totalCount ?? 0;

	const trimmedStoreQuery = storeSearchQuery.trim();
	const filteredStores = useMemo(
		() =>
			stores?.filter((store) =>
				store.name.toLowerCase().includes(trimmedStoreQuery.toLowerCase()),
			) || [],
		[stores, trimmedStoreQuery],
	);

	const trimmedProductQuery = searchParams.q?.trim();

	const sidebarStores = useMemo(() => {
		if (
			!selectedStore ||
			!trimmedProductQuery ||
			typeof activeCategoriesData?.totalProductsCount !== "number"
		) {
			return stores;
		}
		return stores.map((store) =>
			store.id === selectedStore.id
				? { ...store, productCount: activeCategoriesData.totalProductsCount }
				: store,
		);
	}, [
		stores,
		selectedStore,
		trimmedProductQuery,
		activeCategoriesData?.totalProductsCount,
	]);

	const activeStoreFilterCount =
		(searchParams.score ? 1 : 0) + (hasCategoryFilter ? 1 : 0);
	const hasActiveStoreFilters =
		Boolean(searchParams.q?.trim()) || activeStoreFilterCount > 0;

	const updateFilters = (updates: Partial<StoresSearch>) => {
		navigate({
			to: "/stores",
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	const handleSelectAllStores = () => {
		setStoreSearchQuery("");
		navigate({ to: "/stores", search: {} });
	};

	const handleSelectStore = (storeId: string) => {
		setStoreSearchQuery("");
		navigate({
			to: "/stores",
			search: (prev) => ({
				storeId,
				score: prev.score,
			}),
		});
	};

	const handleToggleStoreExpand = (storeId: string, open: boolean) => {
		setExpandedStoreIds((prev) => {
			const has = prev.has(storeId);
			if (open === has) return prev;
			const next = new Set(prev);
			if (open) {
				next.add(storeId);
			} else {
				next.delete(storeId);
			}
			return next;
		});
	};

	const handleSelectCategory = (storeId: string, categoryId: string) => {
		const isSameStore = storeId === selectedStore?.id;
		navigate({
			to: "/stores",
			search: (prev) => ({
				...(isSameStore ? prev : { score: prev.score }),
				storeId,
				categoryId,
				subCategoryId: undefined,
			}),
		});
	};

	const handleSelectSubcategory = (parentId: string, subCategoryId: string) => {
		navigate({
			to: "/stores",
			search: (prev) => ({
				...prev,
				categoryId: parentId,
				subCategoryId,
			}),
		});
	};

	const handleToggleSubcategory = (
		storeId: string,
		parentId: string,
		subCategoryId: string,
	) => {
		if (selectedSubcategory?.id === subCategoryId) {
			handleSelectCategory(storeId, parentId);
			return;
		}
		handleSelectSubcategory(parentId, subCategoryId);
	};

	const clearStoreFilters = () => {
		navigate({
			to: "/stores",
			search: (prev) => ({
				storeId: prev.storeId,
			}),
		});
	};

	const mobileDrawerTriggerLabel = selectedStore
		? selectedSubcategory?.name
			? `${selectedStore.name} · ${selectedSubcategory.name}`
			: activeParentCategory?.name
				? `${selectedStore.name} · ${activeParentCategory.name}`
				: selectedStore.name
		: m.common_all_stores_title();

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Top Bar with Search & Filters */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
					{selectedStore ? (
						<>
							<SearchBar
								key={`${selectedStore.id}:${searchParams.q || "empty"}`}
								initialQuery={searchParams.q}
								placeholder={m.stores_search_in_placeholder({
									store: selectedStore.name,
								})}
								ariaLabel={m.stores_search_in_aria({
									store: selectedStore.name,
								})}
								onSubmitQuery={(q) => updateFilters({ q })}
							/>

							<section
								aria-label={m.stores_filters_aria()}
								className="flex flex-col gap-2"
							>
								<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
									<div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] mr-1">
										<SlidersHorizontal
											className="w-3.5 h-3.5"
											aria-hidden="true"
										/>
										<span>{m.common_filters()}</span>
									</div>

									<div className="col-span-2 lg:hidden">
										<MobileStoreDrawer
											isOpen={isDrawerOpen}
											onOpenChange={setIsDrawerOpen}
											trigger={
												<Button
													type="button"
													variant="outline"
													className={cn(
														"w-full justify-between gap-2 h-10 pointer-coarse:h-11 px-3 rounded-xl text-[13px] shadow-none transition-colors",
														FILTER_TRIGGER_ACTIVE_CLASS,
													)}
												>
													<span className="flex items-center gap-2 min-w-0">
														<StoreAvatar
															name={selectedStore.name}
															logoUrl={selectedStore.logoUrl}
															size="xs"
														/>
														<span className="truncate">
															{selectedStore.name}
														</span>
														{activeParentCategory && (
															<>
																<span
																	className="opacity-60 shrink-0"
																	aria-hidden="true"
																>
																	·
																</span>
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
																	className="w-4.5 h-4.5"
																/>
																<span className="truncate">
																	{selectedSubcategory?.name ||
																		activeParentCategory.name}
																</span>
															</>
														)}
													</span>
													<ChevronRight
														className="w-4 h-4 shrink-0 opacity-70"
														aria-hidden="true"
													/>
												</Button>
											}
											stores={sidebarStores}
											selectedStoreId={selectedStore.id}
											expandedStoreIds={expandedStoreIds}
											storeCategoriesByStoreId={storeCategoriesByStoreId}
											activeParentCategoryId={activeParentId}
											onSelectAllStores={handleSelectAllStores}
											onSelectStore={handleSelectStore}
											onToggleStoreExpand={handleToggleStoreExpand}
											onSelectCategory={handleSelectCategory}
										/>
									</div>

									<ScoreFilterSelect
										value={searchParams.score}
										onChange={(val) => updateFilters({ score: val })}
									/>

									{hasActiveStoreFilters && (
										<Button
											type="button"
											variant="ghost"
											onClick={clearStoreFilters}
											className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 sm:ml-auto"
										>
											<X className="w-3.5 h-3.5" aria-hidden="true" />
											<span>{m.common_clear_all()}</span>
										</Button>
									)}
								</div>

								{hasActiveStoreFilters && (
									<div className="flex sm:hidden items-center justify-between pt-0.5">
										<span className="text-xs font-medium text-[#5C665E] dark:text-[#9AA89E]">
											{activeStoreFilterCount > 0
												? m.common_filters_active_count({
														count: activeStoreFilterCount,
													})
												: m.search_active()}
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={clearStoreFilters}
											className="h-auto min-h-8 gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/50 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/70 shadow-none"
										>
											<X className="w-3.5 h-3.5" aria-hidden="true" />
											<span>{m.common_clear_all()}</span>
										</Button>
									</div>
								)}
							</section>
						</>
					) : (
						<>
							<SearchBar
								key="stores-search"
								initialQuery={storeSearchQuery}
								placeholder={m.stores_search_placeholder()}
								ariaLabel={m.stores_search_aria()}
								showSubmitButton={false}
								onChangeQuery={setStoreSearchQuery}
								onSubmitQuery={(val) => setStoreSearchQuery(val ?? "")}
							/>

							<div className="lg:hidden">
								<MobileStoreDrawer
									isOpen={isDrawerOpen}
									onOpenChange={setIsDrawerOpen}
									trigger={
										<Button
											type="button"
											variant="outline"
											className={cn(
												"w-full justify-between gap-2 h-10 pointer-coarse:h-11 px-3 rounded-xl text-[13px] shadow-none transition-colors",
												FILTER_TRIGGER_INACTIVE_CLASS,
											)}
										>
											<span className="flex items-center gap-2 min-w-0">
												<StoreIcon
													className="w-4 h-4 shrink-0"
													aria-hidden="true"
												/>
												<span className="truncate">
													{mobileDrawerTriggerLabel}
												</span>
											</span>
											<ChevronRight
												className="w-4 h-4 shrink-0 opacity-70"
												aria-hidden="true"
											/>
										</Button>
									}
									stores={stores}
									selectedStoreId={undefined}
									expandedStoreIds={expandedStoreIds}
									storeCategoriesByStoreId={storeCategoriesByStoreId}
									activeParentCategoryId={undefined}
									onSelectAllStores={handleSelectAllStores}
									onSelectStore={handleSelectStore}
									onToggleStoreExpand={handleToggleStoreExpand}
									onSelectCategory={handleSelectCategory}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Main Content + Left Stores Aside */}
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
				<div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-7">
					<aside
						aria-label={m.stores_browse_by_store_aria()}
						className={cn(
							"hidden lg:block w-64 shrink-0 lg:sticky lg:overflow-y-auto rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]",
							selectedStore
								? "lg:top-44 lg:max-h-[calc(100dvh-12rem)]"
								: "lg:top-36 lg:max-h-[calc(100dvh-10rem)]",
						)}
					>
						<div className="px-2.5 pt-1 pb-2">
							<h2 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								{m.nav_stores()}
							</h2>
						</div>
						<StoreNavList
							stores={sidebarStores}
							selectedStoreId={selectedStore?.id}
							expandedStoreIds={expandedStoreIds}
							storeCategoriesByStoreId={storeCategoriesByStoreId}
							activeParentCategoryId={activeParentId}
							onSelectAllStores={handleSelectAllStores}
							onSelectStore={handleSelectStore}
							onToggleStoreExpand={handleToggleStoreExpand}
							onSelectCategory={handleSelectCategory}
						/>
					</aside>

					<main className="flex-1 min-w-0">
						{isUnknownStore ? (
							<EmptyProductsState
								icon={<StoreIcon className="w-5 h-5" aria-hidden="true" />}
								title={m.stores_not_found_title()}
								description={m.stores_not_found_desc()}
								actionLabel={m.stores_view_all()}
								onAction={handleSelectAllStores}
							/>
						) : !selectedStore ? (
							<section aria-labelledby="all-stores-heading">
								<div className="flex items-baseline justify-between gap-3 mb-6">
									<div>
										<h1
											id="all-stores-heading"
											className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] text-balance"
										>
											{trimmedStoreQuery
												? m.stores_matching_title()
												: m.common_all_stores_title()}
										</h1>
										<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
											{m.stores_subtitle()}
										</p>
									</div>

									<Badge
										variant="secondary"
										className="rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0"
									>
										{m.common_stores_count({ count: filteredStores.length })}
									</Badge>
								</div>

								{filteredStores.length > 0 ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4">
										{filteredStores.map((store) => (
											<StoreCard key={store.id} store={store} />
										))}
									</div>
								) : (
									<EmptyProductsState
										icon={<StoreIcon className="w-5 h-5" aria-hidden="true" />}
										title={m.stores_no_stores_title()}
										description={
											trimmedStoreQuery
												? m.stores_no_stores_match({ query: trimmedStoreQuery })
												: m.stores_no_stores_yet()
										}
										actionLabel={
											trimmedStoreQuery ? m.common_clear_search() : undefined
										}
										onAction={
											trimmedStoreQuery
												? () => setStoreSearchQuery("")
												: undefined
										}
									/>
								)}
							</section>
						) : !hasCategoryFilter ? (
							<section aria-labelledby="store-overview-heading">
								<div className="flex items-start sm:items-center justify-between gap-3 mb-6">
									<div className="flex items-center gap-3 min-w-0">
										<StoreAvatar
											name={selectedStore.name}
											logoUrl={selectedStore.logoUrl}
											size="md"
										/>
										<div className="min-w-0">
											<h1
												id="store-overview-heading"
												className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] text-balance truncate"
											>
												{trimmedProductQuery
													? m.stores_results_in_store({
															query: trimmedProductQuery,
															store: selectedStore.name,
														})
													: selectedStore.name}
											</h1>
											<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
												{m.stores_overview_subtitle({
													store: selectedStore.name,
												})}
											</p>
										</div>
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

								{isPendingSections && !sectionsData ? (
									<div className="py-16 flex justify-center">
										<Loader2
											className="w-6 h-6 animate-spin text-[#2D5A44]"
											aria-label={m.common_loading_products()}
										/>
									</div>
								) : sectionsData && sectionsData.sections.length > 0 ? (
									<CategorySectionsView
										sections={sectionsData.sections}
										onSelectCategory={(categoryId) =>
											handleSelectCategory(selectedStore.id, categoryId)
										}
									/>
								) : (
									<EmptyProductsState
										title={
											hasActiveStoreFilters
												? m.search_empty_title()
												: m.stores_none_in_store({ store: selectedStore.name })
										}
										description={
											hasActiveStoreFilters
												? m.search_empty_desc()
												: m.stores_none_in_store_desc()
										}
										actionLabel={
											hasActiveStoreFilters
												? m.common_clear_all_filters()
												: m.stores_view_all()
										}
										onAction={
											hasActiveStoreFilters
												? clearStoreFilters
												: handleSelectAllStores
										}
									/>
								)}
							</section>
						) : (
							<section aria-labelledby="store-category-heading">
								<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
									<div className="flex items-center gap-2.5 flex-wrap">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => handleSelectStore(selectedStore.id)}
											className="h-auto min-h-9 gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] shadow-none"
										>
											<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
											<StoreAvatar
												name={selectedStore.name}
												logoUrl={selectedStore.logoUrl}
												size="xs"
											/>
											<span>{selectedStore.name}</span>
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
																	handleSelectCategory(
																		selectedStore.id,
																		activeParentCategory.id,
																	)
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
																id="store-category-heading"
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
												id="store-category-heading"
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

								{activeSubcategories.length > 0 && activeParentCategory && (
									<nav
										aria-label={m.stores_subcategories_in({
											category: activeParentCategory.name,
										})}
										className="flex flex-wrap items-center gap-2 mb-5"
									>
										{activeSubcategories.map((subcat) => {
											const isSubSelected =
												selectedSubcategory?.id === subcat.id;
											const subCount = categoryCounts.get(subcat.id) ?? 0;

											return (
												<Button
													key={subcat.id}
													type="button"
													variant="outline"
													size="sm"
													onClick={() =>
														handleToggleSubcategory(
															selectedStore.id,
															activeParentCategory.id,
															subcat.id,
														)
													}
													aria-pressed={isSubSelected}
													className={cn(
														"h-auto min-h-8.5 gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-none transition-colors cursor-pointer",
														isSubSelected
															? "bg-[#E3EDE7] dark:bg-[#1E3A2C] border-[#2D5A44]/50 dark:border-[#3D6E54] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#D5E6DC] dark:hover:bg-[#234535] hover:border-[#2D5A44] hover:text-[#1B4332] dark:hover:text-[#CBE3D4]"
															: "bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-[#5C665E] dark:text-[#9AA89E] hover:border-[#2D5A44] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
													)}
												>
													<span>{subcat.name}</span>
													<Badge
														variant="secondary"
														className={cn(
															"px-1.5 py-0 text-[10px] font-bold rounded-full tabular-nums",
															isSubSelected
																? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
																: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
														)}
													>
														{subCount}
													</Badge>
													{isSubSelected && (
														<X
															className="w-3 h-3 shrink-0 opacity-80"
															aria-hidden="true"
														/>
													)}
												</Button>
											);
										})}
									</nav>
								)}

								{isPendingFiltered && !infiniteData ? (
									<div className="py-16 flex justify-center">
										<Loader2
											className="w-6 h-6 animate-spin text-[#2D5A44]"
											aria-label={m.common_loading_products()}
										/>
									</div>
								) : filteredProducts.length > 0 ? (
									<PaginatedProductsGrid
										products={filteredProducts}
										totalCount={filteredTotalCount}
										hasNextPage={hasNextPage}
										isFetchingNextPage={isFetchingNextPage}
										onFetchNextPage={() => fetchNextPage()}
									/>
								) : (
									<EmptyProductsState onAction={clearStoreFilters} />
								)}
							</section>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
