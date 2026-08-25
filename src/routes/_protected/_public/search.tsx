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

	const updateFilter = (key: keyof typeof searchParams, value: string | undefined) => {
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
							onValueChange={(val) => updateFilter("score", val === "all" ? undefined : val)}
						>
							<SelectTrigger className="w-[130px] h-9 text-sm">
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
							onValueChange={(val) => updateFilter("storeId", val === "all" ? undefined : val)}
						>
							<SelectTrigger className="w-[140px] h-9 text-sm">
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
								onValueChange={(val) => updateFilter("categoryId", val === "all" ? undefined : val)}
							>
								<SelectTrigger className="w-[140px] h-9 text-sm">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories?.map((cat) => (
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
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{categories?.map((category) => (
								<Button
									key={category.id}
									variant="outline"
									className="flex flex-col h-32 items-center justify-center p-4 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
									onClick={() => updateFilter("categoryId", category.id)}
								>
									{category.iconUrl ? (
										<img
											src={category.iconUrl}
											alt={category.name}
											className="w-12 h-12 object-cover rounded-full mb-3"
										/>
									) : (
										<StoreIcon className="w-12 h-12 text-slate-500 mb-3" />
									)}
									<span className="font-semibold text-slate-700 dark:text-slate-200 text-center whitespace-normal">
										{category.name}
									</span>
								</Button>
							))}
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
											categoryName: result.category?.name || null,
										}} 
									/>
								))}
							</div>
						) : (
							<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
								<h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No products found</h3>
								<p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
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
