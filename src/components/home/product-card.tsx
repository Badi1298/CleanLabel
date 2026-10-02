import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { authClient } from "#/lib/auth-client";
import {
	userExcludedIngredientsQueryOptions,
	userFavoriteProductsQueryOptions,
} from "#/queries/profile-queries";
import { toggleFavoriteProduct } from "#/server/profile-functions";

type ProductCardProps = {
	product: {
		id: string;
		name: string;
		imageFrontUrl: string | null;
		storeName: string | null;
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
							className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
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
					{product.storeName && (
						<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
							<span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
								📍 {product.storeName}
							</span>
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
