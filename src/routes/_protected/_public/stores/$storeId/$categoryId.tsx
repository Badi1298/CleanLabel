import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, PackageSearch, Search, X } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "#/components/home/product-card";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { categoriesQueryOptions } from "#/queries/product-queries";
import { searchQueryOptions } from "#/queries/search-queries";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute(
	"/_protected/_public/stores/$storeId/$categoryId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(storesQueryOptions());
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(
			searchQueryOptions({
				storeId: params.storeId,
				categoryId: params.categoryId,
			}),
		);
	},
	component: StoreCategoryProductsPage,
});

function StoreCategoryProductsPage() {
	const { storeId, categoryId } = Route.useParams();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

	const store = stores?.find((s) => s.id === storeId);
	const category = categories?.find((c) => c.id === categoryId);

	// Fetch all products for this store and category
	const { data: searchResults } = useSuspenseQuery({
		...searchQueryOptions({ storeId, categoryId }),
	});

	// Contextual Filtering (Local)
	const filteredResults = searchResults?.filter((result) => {
		const q = searchQuery.trim().toLowerCase();
		return (
			result.product.name.toLowerCase().includes(q) ||
			result.product.brand.toLowerCase().includes(q) ||
			result.product.rawIngredientsText?.toLowerCase().includes(q)
		);
	});

	const productCount = filteredResults?.length || 0;

	return (
		<div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E1612] pb-20">
			{/* Sticky Warm Breadcrumb & Product Filter Header */}
			<div className="bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] sticky top-0 md:top-16 z-30">
				<div className="max-w-5xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col gap-3">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-1.5 text-sm flex-wrap"
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
						<Link
							to="/stores/$storeId"
							params={{ storeId }}
							className="inline-flex items-center gap-1.5 font-semibold text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] transition-colors shrink-0"
						>
							<StoreAvatar
								name={store?.name || "Store"}
								logoUrl={store?.logoUrl}
								size="xs"
							/>
							<span>{store?.name || "Store"}</span>
						</Link>
						<ChevronRight
							className="w-4 h-4 text-[#9AA09A] shrink-0"
							aria-hidden="true"
						/>
						<span className="font-bold text-[#1B3328] dark:text-[#FBF4E6]">
							{category?.name || "Category"}
						</span>
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
							placeholder={`Search products in ${category?.name || "category"}...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							aria-label={`Search products in ${category?.name || "category"}`}
							className="flex-1 min-w-0 h-full bg-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none pr-3 [&::-webkit-search-cancel-button]:hidden"
						/>
						{searchQuery.length > 0 && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label="Clear product search"
								className="p-2 mr-1.5 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</form>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
				<section aria-labelledby="store-category-products-heading">
					<div className="flex items-baseline justify-between gap-3 mb-5">
						<h1
							id="store-category-products-heading"
							className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] tabular-nums"
						>
							{productCount} {productCount === 1 ? "Product" : "Products"}
						</h1>
					</div>

					{filteredResults && filteredResults.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-5">
							{filteredResults.map((result) => (
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
								<PackageSearch className="w-5 h-5" aria-hidden="true" />
							</div>
							<h2 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
								No products found
							</h2>
							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1">
								No products match your search in this category.
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
