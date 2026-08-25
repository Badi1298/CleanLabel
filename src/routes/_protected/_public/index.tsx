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
import { homeQueryOptions } from "#/queries/home-queries";

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
								<SelectTrigger className="w-full sm:w-[220px] bg-white text-slate-900 border-none h-12 shadow-md hover:bg-slate-50 transition-colors">
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
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{data?.popularCategories.map((category) => (
							<Button
								key={category.id}
								variant="outline"
								className="flex flex-col h-full"
								onClick={() =>
									navigate({ to: "/search", search: { q: category.name } })
								}
							>
								{category.iconUrl ? (
									<img
										src={category.iconUrl}
										alt={category.name}
										className="w-12 h-12 object-cover rounded-full"
									/>
								) : (
									<StoreIcon className="w-12 h-12 text-slate-500" />
								)}
								<span className="font-semibold text-slate-700 dark:text-slate-200 text-center">
									{category.name}
								</span>
								<span className="text-xs text-slate-500 font-medium">
									{category.productCount}{" "}
									{category.productCount === 1 ? "product" : "products"}
								</span>
							</Button>
						))}
					</div>
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
