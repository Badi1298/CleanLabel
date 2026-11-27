import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Search, SearchX, X } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "#/components/home/product-card";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
import { userFavoriteProductsQueryOptions } from "#/queries/profile-queries";

export const Route = createFileRoute("/_protected/_public/favorites")({
	component: FavoritesPage,
});

type ScoreFilter = "all" | "gold" | "silver" | "bronze";

function getScoreFilterOptions(): Array<{ value: ScoreFilter; label: string }> {
	return [
		{ value: "all", label: m.favorites_filter_all() },
		{ value: "gold", label: "Gold" },
		{ value: "silver", label: "Silver" },
		{ value: "bronze", label: "Bronze" },
	];
}

const SKELETON_KEYS = [
	"fav-sk-1",
	"fav-sk-2",
	"fav-sk-3",
	"fav-sk-4",
	"fav-sk-5",
	"fav-sk-6",
	"fav-sk-7",
	"fav-sk-8",
	"fav-sk-9",
	"fav-sk-10",
];

function FavoritesPage() {
	const { data: session } = authClient.useSession();
	const [searchQuery, setSearchQuery] = useState("");
	const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
	const scoreFilterOptions = getScoreFilterOptions();

	const { data: favorites, isPending } = useQuery({
		...userFavoriteProductsQueryOptions(),
		enabled: !!session?.user,
	});

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const hasActiveFilters = normalizedQuery.length > 0 || scoreFilter !== "all";

	const filteredFavorites =
		favorites?.filter((product) => {
			if (scoreFilter !== "all" && product.score !== scoreFilter) {
				return false;
			}
			if (!normalizedQuery) return true;

			const matchesName = product.name.toLowerCase().includes(normalizedQuery);
			const matchesBrand = product.brand
				?.toLowerCase()
				.includes(normalizedQuery);
			const matchesStore = product.stores?.some((s) =>
				s.name.toLowerCase().includes(normalizedQuery),
			);

			return Boolean(matchesName || matchesBrand || matchesStore);
		}) ?? [];

	const clearFilters = () => {
		setSearchQuery("");
		setScoreFilter("all");
	};

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Deep Botanical Forest Header */}
			<section className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-[1.75rem] md:rounded-b-[2.25rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.1),transparent_58%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-6 md:pt-10 md:pb-8">
					<div className="max-w-2xl">
						<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#FCE8C6] text-balance">
							{m.favorites_title()}
						</h1>
						<p className="mt-1.5 text-sm md:text-base text-[#FCE8C6]/80 font-medium">
							{m.favorites_subtitle()}
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
							placeholder={m.favorites_search_placeholder()}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							aria-label={m.favorites_search_aria()}
							className="flex-1 min-w-0 h-full bg-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none pr-3 [&::-webkit-search-cancel-button]:hidden"
						/>
						{searchQuery.length > 0 && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label={m.favorites_clear_search()}
								className="p-2 mr-1.5 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
							>
								<X className="w-4 h-4" aria-hidden="true" />
							</button>
						)}
					</form>

					{/* Score Filter Pills */}
					{favorites && favorites.length > 0 && (
						<fieldset className="mt-4 flex flex-wrap items-center gap-2 border-0 p-0 m-0">
							<legend className="sr-only">{m.favorites_filter_legend()}</legend>
							{scoreFilterOptions.map((option) => {
								const isActive = scoreFilter === option.value;
								return (
									<button
										key={option.value}
										type="button"
										aria-pressed={isActive}
										onClick={() => setScoreFilter(option.value)}
										className={cn(
											"min-h-8 px-3.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer",
											isActive
												? "bg-[#FCE8C6] text-[#1B4332] border-[#FCE8C6] font-bold shadow-xs"
												: "bg-[#FBF4E6]/12 text-[#FCE8C6] border-[#FBF4E6]/20 hover:bg-[#FBF4E6]/20",
										)}
									>
										{option.label}
									</button>
								);
							})}
						</fieldset>
					)}
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-9">
				<section aria-labelledby="favorites-list-heading">
					<div className="flex items-baseline justify-between gap-3 mb-4 md:mb-5">
						<h2
							id="favorites-list-heading"
							className="text-lg md:text-xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							{hasActiveFilters
								? m.favorites_matching_heading()
								: m.favorites_saved_heading()}
						</h2>
						{!isPending && (
							<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
								{m.common_products_count({
									count: filteredFavorites.length,
								})}
							</span>
						)}
					</div>

					{isPending ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-5">
							{SKELETON_KEYS.map((key) => (
								<Skeleton key={key} className="aspect-4/5 rounded-2xl" />
							))}
						</div>
					) : filteredFavorites.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 md:gap-5">
							{filteredFavorites.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					) : favorites && favorites.length > 0 ? (
						<div className="text-center py-16 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<div className="w-12 h-12 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto mb-3">
								<SearchX className="w-5 h-5" aria-hidden="true" />
							</div>
							<h3 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
								{m.favorites_no_match_title()}
							</h3>
							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 max-w-sm mx-auto">
								{m.favorites_no_match_desc()}
							</p>
							<button
								type="button"
								onClick={clearFilters}
								className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
							>
								{m.favorites_clear_filters()}
							</button>
						</div>
					) : (
						<div className="text-center py-16 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/50 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto mb-3">
								<Heart className="w-5 h-5" aria-hidden="true" />
							</div>
							<h3 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
								{m.favorites_empty_title()}
							</h3>
							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 max-w-md mx-auto">
								{m.favorites_empty_desc()}
							</p>
							<Link
								to="/search"
								className="mt-5 inline-flex items-center px-5 py-2.5 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors"
							>
								{m.favorites_browse_cta()}
							</Link>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
