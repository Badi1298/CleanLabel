import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "#/components/home/product-card";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
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
		const q = searchQuery.toLowerCase();
		return (
			result.product.name.toLowerCase().includes(q) ||
			result.product.brand.toLowerCase().includes(q) ||
			result.product.rawIngredientsText?.toLowerCase().includes(q)
		);
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
								preload={false}
								className="font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								Stores
							</Link>
							<span>/</span>
							<Link
								to={"/stores/$storeId"}
								params={{
									storeId: storeId,
								}}
								preload={false}
								className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								{store?.name || "Store"}
							</Link>
							<span>/</span>
							<span className="font-medium text-slate-900 dark:text-white">
								{category?.name || "Category"}
							</span>
						</div>
					</div>

					<form
						onSubmit={handleSearchSubmit}
						className="flex-1 flex items-center gap-2 relative"
					>
						<Search className="absolute left-3 text-slate-400 w-5 h-5" />
						<Input
							placeholder={`Search products in ${category?.name || "category"}...`}
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
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-slate-900 dark:text-white">
							{filteredResults?.length || 0} Products
						</h2>
					</div>

					{filteredResults && filteredResults.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{filteredResults.map((result) => (
								<ProductCard
									key={result.product.id}
									product={{
										...result.product,
										categoryName: result.category?.name || null,
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
								No products match your search in this category.
							</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
