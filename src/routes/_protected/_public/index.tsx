import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Store as StoreIcon } from "lucide-react";

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
import { cn } from "#/lib/utils";
import { homeQueryOptions } from "#/queries/home-queries";

// Soft pastel palettes for category backdrops matching modern grocery app styles
const CATEGORY_PALETTES = [
	{
		bg: "bg-emerald-50 dark:bg-emerald-950/40",
		border: "border-emerald-100 dark:border-emerald-900/30",
	},
	{
		bg: "bg-amber-50 dark:bg-amber-950/40",
		border: "border-amber-100 dark:border-amber-900/30",
	},
	{
		bg: "bg-rose-50 dark:bg-rose-950/40",
		border: "border-rose-100 dark:border-rose-900/30",
	},
	{
		bg: "bg-sky-50 dark:bg-sky-950/40",
		border: "border-sky-100 dark:border-sky-900/30",
	},
	{
		bg: "bg-purple-50 dark:bg-purple-950/40",
		border: "border-purple-100 dark:border-purple-900/30",
	},
	{
		bg: "bg-orange-50 dark:bg-orange-950/40",
		border: "border-orange-100 dark:border-orange-900/30",
	},
];

// Default placeholder image for categories
const DEFAULT_CATEGORY_PLACEHOLDER =
	"/images/categories/placeholder-groceries.svg";

export const Route = createFileRoute("/_protected/_public/")({
	validateSearch: (search: Record<string, unknown>): { storeId?: string } => {
		return {
			storeId: typeof search.storeId === "string" ? search.storeId : undefined,
		};
	},
	loaderDeps: ({ search: { storeId } }) => ({ storeId }),
	loader: async ({ context: { queryClient }, deps: { storeId } }) =>
		await queryClient.ensureQueryData(homeQueryOptions(storeId)),
	component: Home,
});

function Home() {
	const navigate = useNavigate();
	const { storeId } = Route.useSearch();

	const { data } = useSuspenseQuery({
		...homeQueryOptions(storeId),
	});

	const handleStoreSelect = (newStoreId: string) => {
		navigate({
			to: "/",
			search: { storeId: newStoreId === "all" ? undefined : newStoreId },
			resetScroll: false,
			viewTransition: false,
		});
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			{/* Hero Section */}
			<section className="bg-indigo-600 dark:bg-indigo-900 text-white pt-20 pb-16 px-4 rounded-b-[3rem] shadow-lg relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
				<div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
					<h1 className="text-5xl font-extrabold tracking-tight">
						Make <span className="text-yellow-300">Clean</span> Choices
					</h1>
					<p className="text-lg text-indigo-100 max-w-2xl mx-auto">
						Discover the healthiest products based on our transparent scoring
						system.
					</p>

					<div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-4">
						<SearchBar />
					</div>

					<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-indigo-100">
						<span className="text-sm font-medium">
							Or browse by your favorite store:
						</span>
						<div className="w-full sm:w-auto">
							<Select
								value={storeId || "all"}
								onValueChange={handleStoreSelect}
							>
								<SelectTrigger className="w-full sm:w-55 bg-white text-slate-900 border-none h-12 shadow-md hover:bg-slate-50 transition-colors">
									<div className="flex items-center gap-2">
										<StoreIcon className="w-4 h-4 text-slate-500" />
										<SelectValue placeholder="Select Store" />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Stores</SelectItem>
									{data?.stores?.map((store) => (
										<SelectItem key={store.id} value={store.id}>
											{store.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
				{/* Popular Categories Section */}
				<section>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
							Popular Categories
						</h2>
						<Button
							variant="outline"
							onClick={() =>
								navigate({
									to: "/search",
									search: { q: "", ...(storeId ? { storeId } : {}) },
								})
							}
						>
							See All
						</Button>
					</div>
					{data?.popularCategories && data.popularCategories.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{data.popularCategories.map((category, index) => {
								const palette =
									CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
								const imageSrc =
									category.iconUrl || DEFAULT_CATEGORY_PLACEHOLDER;

								return (
									<button
										key={category.id}
										type="button"
										onClick={() =>
											navigate({
												to: "/search",
												search: {
													q: category.name,
													...(storeId ? { storeId } : {}),
												},
											})
										}
										className="group relative flex flex-col items-center justify-between p-4 h-full min-h-43.75 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer text-center outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
									>
										{/* Soft pastel circular backdrop with descriptive image */}
										<div className="relative mb-3 flex items-center justify-center">
											<div
												className={cn(
													"w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border",
													palette.bg,
													palette.border,
												)}
											>
												<img
													src={imageSrc}
													alt={category.name}
													className="w-16 h-16 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
													loading="lazy"
												/>
											</div>
										</div>

										{/* Category Name & Count */}
										<div className="flex flex-col items-center gap-1 w-full mt-auto">
											<span className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
												{category.name}
											</span>
											<span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
												{category.productCount}{" "}
												{category.productCount === 1 ? "product" : "products"}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					) : (
						<div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
							<p className="text-slate-500 dark:text-slate-400 font-medium">
								No categories found for this store.
							</p>
						</div>
					)}
				</section>

				{/* Recently Added Section */}
				<section>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
							Recently Added
						</h2>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{data?.recentProducts?.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
