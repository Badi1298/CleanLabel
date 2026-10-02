import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Package } from "lucide-react";
import { ProductCard } from "#/components/home/product-card";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";
import { userFavoriteProductsQueryOptions } from "#/queries/profile-queries";

export const Route = createFileRoute("/_protected/_public/favorites")({
	component: FavoritesPage,
});

function FavoritesPage() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const { data: favorites, isPending } = useQuery({
		...userFavoriteProductsQueryOptions(),
		enabled: !!session?.user,
	});

	return (
		<div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
			<header className="flex items-center gap-4 mb-8">
				<Button
					size="icon"
					variant="ghost"
					className="cursor-pointer rounded-full"
					onClick={() => router.history.back()}
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
					My Favorites
				</h1>
			</header>

			{isPending ? (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
					{Array.from({ length: 10 }).map((_, i) => (
						<Skeleton key={i} className="aspect-4/5 rounded-xl" />
					))}
				</div>
			) : favorites && favorites.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
					{favorites.map((product) => (
						<ProductCard
							key={product.id}
							product={{
								...product,
								storeName: null,
								ingredientIds: [],
							}}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
					<Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-2" />
					<h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
						No favorites yet
					</h2>
					<p className="text-slate-500 dark:text-slate-400 max-w-md">
						You haven't added any products to your favorites. Start browsing and
						click the heart icon to save products here!
					</p>
					<Button asChild className="mt-4">
						<Link to="/">Browse Products</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
