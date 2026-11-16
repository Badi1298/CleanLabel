import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { CategoryBrowseCard } from "#/components/categories/category-browse-card";
import { StoreAvatar } from "#/components/stores/store-avatar";
import {
	activeCategoriesQueryOptions,
	categoriesQueryOptions,
} from "#/queries/product-queries";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute("/_protected/_public/stores/$storeId/")({
	loader: async ({ context: { queryClient }, params: { storeId } }) => {
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(activeCategoriesQueryOptions(storeId));
		await queryClient.ensureQueryData(storesQueryOptions());
	},
	component: StoreCategoriesPage,
});

function StoreCategoriesPage() {
	const navigate = useNavigate();
	const { storeId } = Route.useParams();

	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const { data: allCategories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: activeCategoriesData } = useSuspenseQuery(
		activeCategoriesQueryOptions(storeId),
	);

	const activeCategoryIds = activeCategoriesData?.map((c) => c.id);
	const categoryCounts = new Map(
		activeCategoriesData?.map((c) => [c.id, c.count]),
	);

	const categories = allCategories?.filter((c) =>
		activeCategoryIds?.includes(c.id),
	);

	const store = stores?.find((s) => s.id === storeId);
	const [searchQuery, setSearchQuery] = useState("");

	const q = searchQuery.trim().toLowerCase();

	const topLevelCategories = categories?.filter((c) => !c.parentId) || [];
	const visibleTopLevelCategories = topLevelCategories.filter((parentCat) => {
		const parentMatches = parentCat.name.toLowerCase().includes(q);
		const hasMatchingSubcat = categories?.some(
			(c) => c.parentId === parentCat.id && c.name.toLowerCase().includes(q),
		);
		return parentMatches || hasMatchingSubcat;
	});

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612] pb-20">
			{/* Sticky Warm Breadcrumb & Category Filter Header */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-5xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-2 text-sm min-w-0"
					>
						<Link
							to="/stores"
							className="font-semibold text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] transition-colors shrink-0"
						>
							Stores
						</Link>
						<ChevronRight
							className="w-4 h-4 text-[#9AA09A] shrink-0"
							aria-hidden="true"
						/>
						<div className="flex items-center gap-2 min-w-0">
							<StoreAvatar
								name={store?.name || "Store"}
								logoUrl={store?.logoUrl}
								size="xs"
							/>
							<span className="font-bold text-[#1B3328] dark:text-[#FBF4E6] truncate">
								{store?.name || "Store"}
							</span>
						</div>
					</nav>

					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex items-center w-full rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2C4035] shadow-[0_2px_10px_rgba(27,67,50,0.04)] h-11 md:h-12 overflow-hidden focus-within:ring-2 focus-within:ring-[#2D5A44]/35 focus-within:border-[#2D5A44] transition-all"
					>
						<span className="pl-4 pr-2.5 flex items-center justify-center text-[#687069] dark:text-[#9AA89E] shrink-0">
							<Search
								className="w-4.5 h-4.5"
								strokeWidth={2}
								aria-hidden="true"
							/>
						</span>
						<input
							type="search"
							placeholder={`Search categories in ${store?.name || "store"}...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							aria-label="Search categories"
							className="flex-1 min-w-0 h-full bg-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none pr-3 [&::-webkit-search-cancel-button]:hidden"
						/>
						{searchQuery.length > 0 && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label="Clear category search"
								className="p-2 mr-1.5 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</form>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
				<section aria-labelledby="store-categories-heading">
					<div className="flex items-baseline justify-between gap-3 mb-5">
						<div>
							<h1
								id="store-categories-heading"
								className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] text-balance"
							>
								{store?.name || "Store"} Aisles
							</h1>
							<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
								Browse available categories and subcategories at{" "}
								{store?.name || "this store"}
							</p>
						</div>
						{visibleTopLevelCategories.length > 0 && (
							<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
								{visibleTopLevelCategories.length}{" "}
								{visibleTopLevelCategories.length === 1
									? "category"
									: "categories"}
							</span>
						)}
					</div>

					{visibleTopLevelCategories.length > 0 ? (
						<div className="space-y-4">
							{visibleTopLevelCategories.map((parentCat, index) => {
								const subcats =
									categories?.filter((c) => c.parentId === parentCat.id) || [];
								const visibleSubcats = subcats
									.filter(
										(c) =>
											parentCat.name.toLowerCase().includes(q) ||
											c.name.toLowerCase().includes(q),
									)
									.map((subcat) => ({
										id: subcat.id,
										name: subcat.name,
										count: categoryCounts.get(subcat.id) || 0,
									}));

								return (
									<CategoryBrowseCard
										key={parentCat.id}
										category={parentCat}
										productCount={categoryCounts.get(parentCat.id) || 0}
										subcategories={visibleSubcats}
										paletteIndex={index}
										onSelectCategory={() =>
											navigate({ to: `/stores/${storeId}/${parentCat.id}` })
										}
										onSelectSubcategory={(subcatId) =>
											navigate({ to: `/stores/${storeId}/${subcatId}` })
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
							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1">
								{searchQuery
									? `No categories match "${searchQuery}" at ${store?.name || "this store"}.`
									: `No scored products have been added for ${store?.name || "this store"} yet.`}
							</p>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
								>
									Clear search
								</button>
							)}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
