import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute("/_protected/_public/stores/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(storesQueryOptions());
	},
	component: StoresIndexPage,
});

function StoresIndexPage() {
	const navigate = useNavigate();
	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const [searchQuery, setSearchQuery] = useState("");

	const filteredStores = stores?.filter((store) =>
		store.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Top Bar with Search */}
			<div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<form
						onSubmit={handleSearchSubmit}
						className="flex-1 flex items-center gap-2 relative"
					>
						<Search className="absolute left-3 text-slate-400 w-5 h-5" />
						<Input
							placeholder="Search stores..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-12 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-none shadow-none text-md"
						/>
						<Button type="button" onClick={() => setSearchQuery("")} variant="ghost" size="lg" className="h-12 px-4 font-bold text-slate-500">
							Clear
						</Button>
					</form>
				</div>
			</div>

			<main className="max-w-6xl mx-auto px-4 py-8">
				<section>
					<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
						Available Stores
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{filteredStores?.map((store) => (
							<Button
								key={store.id}
								variant="outline"
								className="flex flex-col h-32 items-center justify-center p-4 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
								onClick={() => navigate({ to: `/stores/${store.id}` })}
							>
								{store.logoUrl ? (
									<img
										src={store.logoUrl}
										alt={store.name}
										className="w-12 h-12 object-cover rounded-full mb-3"
									/>
								) : (
									<StoreIcon className="w-12 h-12 text-slate-500 mb-3" />
								)}
								<span className="font-semibold text-slate-700 dark:text-slate-200 text-center whitespace-normal">
									{store.name}
								</span>
							</Button>
						))}
						{filteredStores?.length === 0 && (
							<div className="col-span-full text-center py-10 text-slate-500">
								No stores found matching "{searchQuery}"
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
