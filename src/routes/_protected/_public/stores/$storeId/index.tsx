import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { categoriesQueryOptions } from "#/queries/product-queries";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute("/_protected/_public/stores/$storeId/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(categoriesQueryOptions());
		await queryClient.ensureQueryData(storesQueryOptions());
	},
	component: StoreCategoriesPage,
});

function StoreCategoriesPage() {
	const navigate = useNavigate();
	const { storeId } = Route.useParams();

	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

	const store = stores?.find((s) => s.id === storeId);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCategories = categories?.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

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
								className="font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								Stores
							</Link>
							<span>/</span>
							<div className="flex items-center gap-2">
								{store?.logoUrl ? (
									<img
										src={store.logoUrl}
										alt={store.name}
										className="w-5 h-5 rounded-full"
									/>
								) : (
									<StoreIcon className="w-4 h-4 text-slate-500" />
								)}
								<span className="font-medium text-slate-900 dark:text-white">
									{store?.name || "Store"}
								</span>
							</div>
						</div>
					</div>

					<form
						onSubmit={handleSearchSubmit}
						className="flex-1 flex items-center gap-2 relative"
					>
						<Search className="absolute left-3 text-slate-400 w-5 h-5" />
						<Input
							placeholder="Search categories..."
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
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{filteredCategories?.map((category) => (
							<Button
								key={category.id}
								variant="outline"
								className="flex flex-col h-32 items-center justify-center p-4 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
								onClick={() =>
									navigate({ to: `/stores/${storeId}/${category.id}` })
								}
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
						{filteredCategories?.length === 0 && (
							<div className="col-span-full text-center py-10 text-slate-500">
								No categories found matching "{searchQuery}"
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
