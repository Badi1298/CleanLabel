import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, SlidersHorizontal, Store as StoreIcon, X } from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "#/components/brand-logo";
import { CategoryIcon } from "#/components/categories/category-icon";
import { ProductCard } from "#/components/home/product-card";
import { LanguageSwitcher } from "#/components/language-switcher";
import { SearchBar } from "#/components/search/search-bar";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { StoreCard } from "#/components/stores/store-card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
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
	const [isStoreFilterOpen, setIsStoreFilterOpen] = useState(false);

	const { data } = useSuspenseQuery({
		...homeQueryOptions(storeId),
	});

	const selectedStore = data?.stores?.find((s) => s.id === storeId);

	const handleStoreSelect = (newStoreId: string) => {
		setIsStoreFilterOpen(false);
		navigate({
			to: "/",
			search: { storeId: newStoreId === "all" ? undefined : newStoreId },
			resetScroll: false,
			viewTransition: false,
		});
	};

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Deep Botanical Forest Hero */}
			<section className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-4xl md:rounded-b-[2.5rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]">
				{/* Subtle warm sunlit radial highlight */}
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.1),transparent_58%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-5 pb-7 md:pt-12 md:pb-10">
					<div className="md:hidden flex items-center justify-between gap-3 mb-5">
						<BrandLogo surface="dark" size="md" />
						<LanguageSwitcher surface="dark" isSignedIn />
					</div>

					<div className="max-w-2xl">
						<h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.03] text-[#FCE8C6]">
							{m.home_hero_title_line1()}
							<br className="sm:hidden" /> {m.home_hero_title_line2()}
						</h1>
						<p className="hidden sm:block mt-3 text-sm md:text-base text-[#FCE8C6]/80 font-medium max-w-xl">
							{m.home_hero_subtitle()}
						</p>
					</div>

					{/* Integrated Search & Store Filter Bar */}
					<div className="mt-5 md:mt-6 max-w-2xl">
						<SearchBar
							variant="hero"
							placeholder={m.home_search_placeholder()}
							trailingSlot={
								<Popover
									open={isStoreFilterOpen}
									onOpenChange={setIsStoreFilterOpen}
								>
									<PopoverTrigger asChild>
										<button
											type="button"
											aria-label={m.home_store_filter_aria()}
											className={cn(
												"relative h-full px-3.5 sm:px-4 flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:bg-[#FAF8F5]",
												selectedStore
													? "text-[#1B4332] bg-[#FAF8F5] dark:bg-[#1E2E26] dark:text-[#CBE3D4]"
													: "text-[#4A554E] hover:text-[#1B4332] hover:bg-[#FAF8F5] dark:text-[#9AA89E] dark:hover:bg-[#1E2E26]",
											)}
										>
											<SlidersHorizontal
												className="w-4 h-4 shrink-0"
												strokeWidth={2}
												aria-hidden="true"
											/>
											<span className="hidden sm:inline max-w-27.5 truncate">
												{selectedStore
													? selectedStore.name
													: m.common_all_stores()}
											</span>
											{selectedStore && (
												<span
													className="sm:hidden absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#A67C37] ring-2 ring-white"
													aria-hidden="true"
												/>
											)}
										</button>
									</PopoverTrigger>
									<PopoverContent
										align="end"
										sideOffset={8}
										className="w-60 p-1.5 rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] shadow-xl"
									>
										<div className="px-2.5 py-2 border-b border-[#F3EFE6] dark:border-[#24362D] mb-1">
											<p className="text-[11px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
												{m.home_filter_by_store()}
											</p>
										</div>
										<div className="max-h-64 overflow-y-auto space-y-0.5">
											<button
												type="button"
												onClick={() => handleStoreSelect("all")}
												className={cn(
													"w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left",
													!storeId
														? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-semibold"
														: "text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26]",
												)}
											>
												<span className="flex items-center gap-2">
													<StoreIcon className="w-4 h-4 opacity-70" />
													<span>{m.common_all_stores_title()}</span>
												</span>
												{!storeId && <Check className="w-4 h-4 shrink-0" />}
											</button>
											{data?.stores?.map((store) => {
												const isSelected = storeId === store.id;
												return (
													<button
														key={store.id}
														type="button"
														onClick={() => handleStoreSelect(store.id)}
														className={cn(
															"w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left",
															isSelected
																? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-semibold"
																: "text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26]",
														)}
													>
														<span className="flex items-center gap-2 min-w-0">
															<StoreAvatar
																name={store.name}
																logoUrl={store.logoUrl}
																size="xs"
															/>
															<span className="truncate">{store.name}</span>
														</span>
														{isSelected && (
															<Check className="w-4 h-4 shrink-0" />
														)}
													</button>
												);
											})}
										</div>
									</PopoverContent>
								</Popover>
							}
						/>

						{/* Active Store Filter Pill */}
						{selectedStore && (
							<div className="mt-3 flex items-center gap-2">
								<span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF4E6]/15 border border-[#FBF4E6]/25 px-3 py-1 text-xs font-medium text-[#FBF4E6]">
									<StoreIcon className="w-3.5 h-3.5" aria-hidden="true" />
									<span>
										{m.home_active_store_pill({ store: selectedStore.name })}
									</span>
									<button
										type="button"
										onClick={() => handleStoreSelect("all")}
										aria-label={m.home_clear_store_filter()}
										className="ml-0.5 rounded-full p-0.5 hover:bg-[#FBF4E6]/20 transition-colors cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-5xl mx-auto px-4 md:px-6 py-7 md:py-10 space-y-8 md:space-y-12">
				{/* Categories Section */}
				<section aria-labelledby="categories-heading">
					<div className="flex items-baseline justify-between mb-4 md:mb-5">
						<h2
							id="categories-heading"
							className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							{m.home_categories_heading()}
						</h2>
						<Link
							to="/search"
							search={{ ...(storeId ? { storeId } : {}) }}
							className="text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
						>
							{m.common_see_all()}
						</Link>
					</div>

					{data?.popularCategories && data.popularCategories.length > 0 ? (
						<div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-1 snap-x snap-proximity md:mx-0 md:px-0 md:scroll-px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-6 md:gap-4">
							{data.popularCategories.map((category) => (
								<Link
									key={category.id}
									to="/search"
									search={{
										categoryId: category.parentId || category.id,
										...(category.parentId
											? { subCategoryIds: [category.id] }
											: {}),
										...(storeId ? { storeId } : {}),
									}}
									className="group snap-start shrink-0 w-21.5 md:w-auto flex flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-2xl"
								>
									<CategoryIcon
										name={category.name}
										parentName={category.parentName}
										iconUrl={category.iconUrl ?? category.parentIconUrl}
										loading="eager"
										className="w-20 h-20 md:w-22 md:h-22 drop-shadow-[0_6px_14px_rgba(4,42,32,0.16)] transition-transform duration-200 group-hover:scale-105"
									/>
									<div className="flex flex-col items-center gap-0.5 w-full">
										<span className="text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] group-hover:text-[#1B4332] dark:group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight">
											{category.name}
										</span>
										<span className="hidden md:block text-[11px] text-[#5C665E] dark:text-[#9AA89E] font-medium">
											{m.common_products_count({
												count: category.productCount,
											})}
										</span>
									</div>
								</Link>
							))}
							<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
						</div>
					) : (
						<div className="text-center py-10 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D]">
							<p className="text-[#5C665E] dark:text-[#9AA89E] text-sm font-medium">
								{m.home_no_categories_for_store()}
							</p>
							{storeId && (
								<button
									type="button"
									onClick={() => handleStoreSelect("all")}
									className="mt-3 inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E3EDE7] text-[#1B4332] text-xs font-semibold hover:bg-[#D5E5DC] transition-colors cursor-pointer"
								>
									{m.home_show_all_stores()}
								</button>
							)}
						</div>
					)}
				</section>

				{/* Recently Added Section */}
				<section aria-labelledby="recent-heading">
					<div className="flex items-baseline justify-between mb-4 md:mb-5">
						<h2
							id="recent-heading"
							className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							{m.home_recent_heading()}
						</h2>
						<Link
							to="/search"
							search={{ ...(storeId ? { storeId } : {}) }}
							className="text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
						>
							{m.home_browse_all()}
						</Link>
					</div>

					{data?.recentProducts && data.recentProducts.length > 0 ? (
						<div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-2 snap-x snap-proximity md:mx-0 md:px-0 md:scroll-px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
							{data.recentProducts.map((product) => (
								<div
									key={product.id}
									className="w-[45vw] min-w-41.5 max-w-51.25 shrink-0 snap-start md:w-auto md:min-w-0 md:max-w-none"
								>
									<ProductCard product={product} />
								</div>
							))}
							<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
						</div>
					) : (
						<div className="text-center py-10 px-4 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D]">
							<p className="text-[#5C665E] dark:text-[#9AA89E] text-sm font-medium">
								{m.home_no_products_yet()}
							</p>
						</div>
					)}
				</section>

				{/* Browse by Store Section */}
				{data?.stores && data.stores.length > 0 && (
					<section aria-labelledby="stores-heading">
						<div className="flex items-baseline justify-between mb-3.5 md:mb-5">
							<h2
								id="stores-heading"
								className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
							>
								{m.home_stores_heading()}
							</h2>
							<Link
								to="/stores"
								className="text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
							>
								{m.common_all_stores()}
							</Link>
						</div>

						<div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-2 snap-x snap-proximity md:mx-0 md:px-0 md:scroll-px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
							{data.stores.map((store) => (
								<div
									key={store.id}
									className="w-[44vw] min-w-40.5 max-w-49 shrink-0 snap-start md:w-auto md:min-w-0 md:max-w-none"
								>
									<StoreCard store={store} />
								</div>
							))}
							<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
						</div>
					</section>
				)}
			</main>
		</div>
	);
}
