import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronRight, Heart, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
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
		imageFrontUrl: string | null;
		storeName?: string | null;
		stores?: StoreInfo[] | null;
		ingredientIds?: string[];
	};
};

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

	// Normalize stores: use product.stores if provided, or fallback to product.storeName
	const storesList: StoreInfo[] =
		product.stores && product.stores.length > 0
			? product.stores
			: product.storeName
				? [{ name: product.storeName, logoUrl: null }]
				: [];

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

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
			className="block h-full"
		>
			<Card className="h-full pt-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group border-slate-200 dark:border-slate-800">
				<div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
					{product.imageFrontUrl ? (
						<img
							src={product.imageFrontUrl}
							alt={product.name}
							className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
							loading="lazy"
						/>
					) : (
						<div className="text-slate-400 flex flex-col items-center">
							<span className="text-4xl">📦</span>
							<span className="text-sm mt-2 font-medium">No Image</span>
						</div>
					)}
					{session?.user && (
						<button
							type="button"
							onClick={handleFavoriteClick}
							className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer z-10"
						>
							<Heart
								className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500"}`}
							/>
						</button>
					)}
				</div>
				<CardHeader className="p-4 pb-2">
					<CardTitle className="text-lg line-clamp-2 leading-tight">
						{product.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 pt-0 mt-auto flex flex-col gap-2">
					{/* Single Store Display */}
					{storesList.length === 1 && (
						<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
							<span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60 max-w-full shadow-2xs">
								{storesList[0].logoUrl ? (
									<img
										src={storesList[0].logoUrl}
										alt={storesList[0].name}
										className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
									/>
								) : (
									<Store className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
								)}
								<span className="truncate">{storesList[0].name}</span>
							</span>
						</div>
					)}

					{/* Multiple Stores Display with Interactive Popover */}
					{hasMultipleStores && (
						<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
							<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
								<PopoverTrigger asChild>
									<button
										type="button"
										onClick={handleTriggerClick}
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
										className="inline-flex flex-wrap items-center gap-1.5 cursor-pointer group/store-badge focus:outline-none p-0 text-left bg-transparent border-0"
									>
										{/* First store badge */}
										<span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60 max-w-[120px] group-hover/store-badge:border-slate-300 dark:group-hover/store-badge:border-slate-600 transition-colors shadow-2xs">
											{storesList[0].logoUrl ? (
												<img
													src={storesList[0].logoUrl}
													alt={storesList[0].name}
													className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
												/>
											) : (
												<Store className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
											)}
											<span className="truncate">{storesList[0].name}</span>
										</span>

										{/* Second badge: +X more pill with chevron (for >2 stores) or second store badge (for exactly 2 stores) */}
										{showPlusMore ? (
											<span
												className={cn(
													"inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-2xs select-none",
													isPopoverOpen
														? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
														: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 active:scale-95",
												)}
											>
												<span>+{storesList.length - 1} more</span>
												<ChevronDown
													className={cn(
														"w-3 h-3 transition-transform duration-200",
														isPopoverOpen && "rotate-180",
													)}
												/>
											</span>
										) : (
											<span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60 max-w-[120px] group-hover/store-badge:border-slate-300 dark:group-hover/store-badge:border-slate-600 transition-colors shadow-2xs">
												{storesList[1].logoUrl ? (
													<img
														src={storesList[1].logoUrl}
														alt={storesList[1].name}
														className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
													/>
												) : (
													<Store className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
												)}
												<span className="truncate">{storesList[1].name}</span>
											</span>
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
									className="w-64 p-0 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-hidden z-50"
								>
									{/* Popover Header */}
									<div className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/20 dark:via-teal-500/10 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
												<Store className="w-3 h-3" />
											</div>
											<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
												Available Stores
											</span>
										</div>
										<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
											{storesList.length}
										</span>
									</div>

									{/* Store list */}
									<div className="p-1.5 max-h-56 overflow-y-auto space-y-0.5">
										{storesList.map((s, idx) => {
											const storeKey = s.id || `${s.name}-${idx}`;
											const storeRow = (
												<div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-150 group/store">
													<div className="flex items-center gap-2.5 min-w-0">
														{s.logoUrl ? (
															<img
																src={s.logoUrl}
																alt={s.name}
																className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
															/>
														) : (
															<div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover/store:bg-emerald-100 dark:group-hover/store:bg-emerald-900/50 transition-colors">
																<Store className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover/store:text-emerald-600 dark:group-hover/store:text-emerald-400 transition-colors" />
															</div>
														)}
														<span className="truncate">{s.name}</span>
													</div>
													{s.id && (
														<ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover/store:opacity-100 group-hover/store:translate-x-0 transition-all shrink-0" />
													)}
												</div>
											);

											if (s.id) {
												return (
													<Link
														key={storeKey}
														to="/stores/$storeId"
														params={{ storeId: s.id }}
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

									{/* Footer Hint */}
									<div className="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
										<span>Tap store to view</span>
										<span className="hidden sm:inline">Esc to close</span>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					)}

					{hasExcludedIngredient && (
						<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
							<span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border border-red-200 dark:border-red-800/30">
								⚠️ Warning: Contains excluded ingredients
							</span>
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
