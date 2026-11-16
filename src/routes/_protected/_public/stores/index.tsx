import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Store as StoreIcon, X } from "lucide-react";
import { useState } from "react";
import { StoreCard } from "#/components/stores/store-card";
import { storesQueryOptions } from "#/queries/store-queries";

export const Route = createFileRoute("/_protected/_public/stores/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(storesQueryOptions());
	},
	component: StoresIndexPage,
});

function StoresIndexPage() {
	const { data: stores } = useSuspenseQuery(storesQueryOptions());
	const [searchQuery, setSearchQuery] = useState("");

	const filteredStores = stores?.filter((store) =>
		store.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
	);

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612] pb-20">
			{/* Deep Botanical Forest Header */}
			<section className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-[1.75rem] md:rounded-b-[2.25rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.1),transparent_58%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-6 md:pt-10 md:pb-8">
					<div className="max-w-2xl">
						<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#FCE8C6] [text-wrap:balance]">
							Available Stores
						</h1>
						<p className="mt-1.5 text-sm md:text-base text-[#FCE8C6]/80 font-medium">
							Select a supermarket to explore its clean-label aisles and scored
							products.
						</p>
					</div>

					{/* Pill Search Input */}
					<form
						onSubmit={(e) => e.preventDefault()}
						className="mt-5 max-w-xl flex items-center w-full rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7]/80 dark:border-[#2C4035] shadow-[0_8px_24px_rgba(11,31,22,0.2)] h-11 md:h-12 overflow-hidden focus-within:ring-2 focus-within:ring-[#FCE8C6]/70 transition-shadow"
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
							placeholder="Search stores..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							aria-label="Search stores"
							className="flex-1 min-w-0 h-full bg-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none pr-3 [&::-webkit-search-cancel-button]:hidden"
						/>
						{searchQuery.length > 0 && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label="Clear store search"
								className="p-2 mr-1.5 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</form>
				</div>
			</section>

			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-9">
				<section aria-labelledby="stores-list-heading">
					<div className="flex items-baseline justify-between gap-3 mb-4 md:mb-5">
						<h2
							id="stores-list-heading"
							className="text-lg md:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							{searchQuery.trim() ? "Matching Stores" : "All Supermarkets"}
						</h2>
						{filteredStores && (
							<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
								{filteredStores.length}{" "}
								{filteredStores.length === 1 ? "store" : "stores"}
							</span>
						)}
					</div>

					{filteredStores && filteredStores.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
							{filteredStores.map((store) => (
								<StoreCard key={store.id} store={store} />
							))}
						</div>
					) : (
						<div className="text-center py-16 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<div className="w-12 h-12 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto mb-3">
								<StoreIcon className="w-5 h-5" aria-hidden="true" />
							</div>
							<h3 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
								No stores found
							</h3>
							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1">
								No stores match "{searchQuery}".
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
