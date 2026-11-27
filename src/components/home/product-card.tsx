import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ChevronDown,
	ChevronRight,
	Heart,
	Package,
	Store,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { ScoreBadge } from "#/components/ui/score-badge";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
import {
	userExcludedIngredientsQueryOptions,
	userFavoriteProductsQueryOptions,
} from "#/queries/profile-queries";
import { toggleFavoriteProduct } from "#/server/profile-functions";

export type StoreInfo = {
	id?: string;
	name: string;
	logoUrl?: string | null;
};

type ProductCardProps = {
	product: {
		id: string;
		name: string;
		score?: string | null;
		imageFrontUrl: string | null;
		storeName?: string | null;
		stores?: StoreInfo[] | null;
		ingredientIds?: string[];
	};
};

function StoreChip({
	store,
	className,
}: {
	store: StoreInfo;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] text-[#243B30] dark:text-[#CBE3D4] px-2 py-0.5 text-[11px] font-semibold border border-[#EAE4D7] dark:border-[#2B3D33] max-w-[116px]",
				className,
			)}
		>
			{store.logoUrl ? (
				<img
					src={store.logoUrl}
					alt=""
					className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
				/>
			) : (
				<Store
					className="w-3 h-3 text-[#687069] dark:text-[#9AA89E] shrink-0"
					aria-hidden="true"
				/>
			)}
			<span className="truncate">{store.name}</span>
		</span>
	);
}

export function ProductCard({ product }: ProductCardProps) {
	const { data: session } = authClient.useSession();

	const { data: excludedIngredients } = useQuery({
		...userExcludedIngredientsQueryOptions(),
		enabled: !!session?.user,
	});

	const { data: favoriteProducts, refetch: refetchFavorites } = useQuery({
		...userFavoriteProductsQueryOptions(),
		enabled: !!session?.user,
	});

	const toggleFavoriteFn = useServerFn(toggleFavoriteProduct);

	const isFavorited = favoriteProducts?.some((fav) => fav.id === product.id);

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!session?.user) return;
		try {
			await toggleFavoriteFn({ data: { productId: product.id } });
			refetchFavorites();
		} catch (error) {
			console.error("Failed to toggle favorite", error);
		}
	};

	const hasExcludedIngredient =
		excludedIngredients &&
		product.ingredientIds &&
		product.ingredientIds.some((id) =>
			excludedIngredients.some((ex) => ex.id === id),
		);

	const storesList: StoreInfo[] =
		product.stores && product.stores.length > 0
			? product.stores
			: product.storeName
				? [{ name: product.storeName, logoUrl: null }]
				: [];

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		setIsPopoverOpen(true);
	};

	const handleMouseLeave = () => {
		closeTimerRef.current = setTimeout(() => {
			setIsPopoverOpen(false);
		}, 150);
	};

	const handleTriggerClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsPopoverOpen((prev) => !prev);
	};

	useEffect(() => {
		return () => {
			if (closeTimerRef.current) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	const hasMultipleStores = storesList.length > 1;
	const showPlusMore = storesList.length > 2;

	return (
		<Link
			to="/products/$productId"
			params={{ productId: product.id }}
			className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-2xl"
		>
			<article className="h-full rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_8px_rgba(27,67,50,0.03)] hover:shadow-[0_10px_24px_rgba(27,67,50,0.08)] hover:border-[#D4CCB8] dark:hover:border-[#365043] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
				{/* Product Photo Frame */}
				<div className="relative aspect-square w-full bg-[#F5F1E8] dark:bg-[#1A2821] flex items-center justify-center overflow-hidden border-b border-[#F5F1E8] dark:border-[#24362D]/80">
					{/* Top-Left Semantic Tier Badge */}
					<div className="absolute top-2.5 left-2.5 z-10">
						<ScoreBadge
							score={product.score}
							size="sm"
							className="drop-shadow-sm"
						/>
					</div>

					{/* Top-Right Favorite Button */}
					{session?.user && (
						<button
							type="button"
							onClick={handleFavoriteClick}
							aria-label={
								isFavorited
									? m.product_card_remove_fav()
									: m.product_card_add_fav()
							}
							className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#16221C]/90 backdrop-blur-xs border border-[#EAE4D7]/80 dark:border-[#2C4035] flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
						>
							<Heart
								className={cn(
									"w-4 h-4 transition-colors",
									isFavorited
										? "fill-rose-500 text-rose-500"
										: "text-[#9AA09A] hover:text-[#1B4332] dark:text-slate-400",
								)}
							/>
						</button>
					)}

					{product.imageFrontUrl ? (
						<img
							src={product.imageFrontUrl}
							alt={product.name}
							className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
							loading="lazy"
						/>
					) : (
						<div className="text-[#9AA09A] dark:text-slate-500 flex flex-col items-center gap-1.5">
							<Package className="w-8 h-8 opacity-60" strokeWidth={1.5} />
							<span className="text-xs font-medium">{m.common_no_image()}</span>
						</div>
					)}
				</div>

				{/* Card Body */}
				<div className="p-3.5 pt-3 flex-1 flex flex-col gap-2">
					<h3 className="text-[15px] font-bold text-[#1B3328] dark:text-[#EDF2EE] line-clamp-2 leading-snug group-hover:text-[#1B4332] dark:group-hover:text-emerald-300 transition-colors">
						{product.name}
					</h3>

					<div className="mt-auto flex flex-col gap-1.5 pt-0.5">
						{/* Excluded Ingredient Warning (placed right above store chips for instant shelf scanning) */}
						{hasExcludedIngredient && (
							<div className="flex items-center">
								<span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-rose-200/80 dark:border-rose-800/50">
									<AlertTriangle
										className="w-3 h-3 shrink-0"
										aria-hidden="true"
									/>
									<span className="truncate">
										{m.product_card_excluded_warning()}
									</span>
								</span>
							</div>
						)}

						{/* Single Store Display */}
						{storesList.length === 1 && (
							<div className="flex items-center">
								<StoreChip store={storesList[0]} className="max-w-full" />
							</div>
						)}

						{/* Multiple Stores Display with Interactive Popover */}
						{hasMultipleStores && (
							<div className="flex items-center">
								<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
									<PopoverTrigger asChild>
										<button
											type="button"
											onClick={handleTriggerClick}
											onMouseEnter={handleMouseEnter}
											onMouseLeave={handleMouseLeave}
											className="inline-flex flex-wrap items-center gap-1 cursor-pointer group/store-badge focus:outline-none p-0 text-left bg-transparent border-0"
										>
											<StoreChip store={storesList[0]} />

											{showPlusMore ? (
												<span
													className={cn(
														"inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-200 select-none border",
														isPopoverOpen
															? "bg-[#1B4332] text-[#FBF4E6] border-[#1B4332] shadow-xs"
															: "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] border-[#C8DBD0] dark:border-[#2F5442] hover:bg-[#D5E5DC]",
													)}
												>
													<span>+{storesList.length - 1}</span>
													<ChevronDown
														className={cn(
															"w-3 h-3 transition-transform duration-200",
															isPopoverOpen && "rotate-180",
														)}
													/>
												</span>
											) : (
												<StoreChip store={storesList[1]} />
											)}
										</button>
									</PopoverTrigger>

									<PopoverContent
										align="start"
										side="top"
										sideOffset={6}
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
										onClick={(e) => {
											e.stopPropagation();
										}}
										className="w-60 p-0 rounded-2xl shadow-xl border border-[#EAE4D7] dark:border-[#24362D] bg-white/95 dark:bg-[#16221C]/95 backdrop-blur-md overflow-hidden z-50"
									>
										<div className="px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#1B2A22] border-b border-[#EAE4D7] dark:border-[#24362D] flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-5 h-5 rounded-full bg-[#E3EDE7] dark:bg-[#234332] flex items-center justify-center text-[#1B4332] dark:text-[#CBE3D4]">
													<Store className="w-3 h-3" />
												</div>
												<span className="text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE]">
													{m.product_card_available_stores()}
												</span>
											</div>
											<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E3EDE7] dark:bg-[#234332] text-[#1B4332] dark:text-[#CBE3D4]">
												{storesList.length}
											</span>
										</div>

										<div className="p-1.5 max-h-56 overflow-y-auto space-y-0.5">
											{storesList.map((s, idx) => {
												const storeKey = s.id || `${s.name}-${idx}`;
												const storeRow = (
													<div className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors group/store">
														<div className="flex items-center gap-2.5 min-w-0">
															{s.logoUrl ? (
																<img
																	src={s.logoUrl}
																	alt=""
																	className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-[#EAE4D7] dark:ring-[#24362D]"
																/>
															) : (
																<div className="w-5 h-5 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] flex items-center justify-center shrink-0">
																	<Store className="w-3 h-3 text-[#687069] dark:text-[#9AA89E]" />
																</div>
															)}
															<span className="truncate">{s.name}</span>
														</div>
														{s.id && (
															<ChevronRight className="w-3.5 h-3.5 text-[#9AA09A] opacity-0 -translate-x-1 group-hover/store:opacity-100 group-hover/store:translate-x-0 transition-all shrink-0" />
														)}
													</div>
												);

												if (s.id) {
													return (
														<Link
															key={storeKey}
															to="/stores"
															search={{ storeId: s.id }}
															onClick={(e) => {
																e.stopPropagation();
																setIsPopoverOpen(false);
															}}
															className="block"
														>
															{storeRow}
														</Link>
													);
												}

												return <div key={storeKey}>{storeRow}</div>;
											})}
										</div>

										<div className="px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#131F19] border-t border-[#EAE4D7] dark:border-[#24362D] text-[10px] text-[#687069] dark:text-[#9AA89E] flex items-center justify-between">
											<span>{m.product_card_tap_store()}</span>
											<span className="hidden sm:inline">
												{m.product_card_esc_close()}
											</span>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						)}
					</div>
				</div>
			</article>
		</Link>
	);
}
