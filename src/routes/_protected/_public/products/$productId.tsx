import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	Heart,
	Info,
	Package,
	ShieldAlert,
	Store,
} from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ProductCard } from "#/components/home/product-card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import {
	productAlternativesQueryOptions,
	productDetailsQueryOptions,
} from "#/queries/product-queries";
import {
	userExcludedIngredientsQueryOptions,
	userFavoriteProductsQueryOptions,
} from "#/queries/profile-queries";
import { toggleFavoriteProduct } from "#/server/profile-functions";

export const Route = createFileRoute("/_protected/_public/products/$productId")(
	{
		loader: async ({ context: { queryClient }, params: { productId } }) => {
			const [product] = await Promise.all([
				queryClient.ensureQueryData(productDetailsQueryOptions(productId)),
				queryClient.ensureQueryData(productAlternativesQueryOptions(productId)),
			]);
			if (!product) {
				throw notFound();
			}
		},
		notFoundComponent: () => (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Package className="w-16 h-16 text-slate-300" />
				<h2 className="text-xl font-medium text-slate-600">
					Product not found
				</h2>
				<Link to="/" className="text-blue-600 hover:underline">
					Return to Home
				</Link>
			</div>
		),
		component: ProductDetails,
	},
);

function getScoreBadgeProps(score: string) {
	switch (score) {
		case "gold":
			return {
				className: "bg-yellow-400 text-yellow-900 border-yellow-500",
			};
		case "silver":
			return {
				className: "bg-slate-300 text-slate-800 border-slate-400",
			};
		case "bronze":
			return {
				className: "bg-amber-600 text-amber-50 border-amber-700",
			};
		default:
			return {
				className:
					"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
			};
	}
}

function ProductDetails() {
	const router = useRouter();
	const { productId } = Route.useParams();
	const { data: product } = useSuspenseQuery(
		productDetailsQueryOptions(productId),
	);
	const { data: alternatives } = useSuspenseQuery(
		productAlternativesQueryOptions(productId),
	);

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

	const isFavorited = favoriteProducts?.some((fav) => fav.id === product?.id);

	const handleFavoriteClick = async () => {
		if (!session?.user || !product) return;
		try {
			await toggleFavoriteFn({ data: { productId: product.id } });
			refetchFavorites();
		} catch (error) {
			console.error("Failed to toggle favorite", error);
		}
	};

	if (!product) return null;

	const scoreBadge = getScoreBadgeProps(product.score);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Header / Navigation */}
			<header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center">
				<Button
					size="icon"
					variant="ghost"
					className="mr-3 cursor-pointer rounded-full"
					onClick={() => router.history.back()}
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="font-semibold text-lg truncate flex-1">
					{product.name}
				</h1>
				{session?.user && (
					<Button
						size="icon"
						variant="ghost"
						className="ml-3 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
						onClick={handleFavoriteClick}
					>
						<Heart
							className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-500"}`}
						/>
					</Button>
				)}
			</header>

			<main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
				{/* Top Section: Images and Basic Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
					{/* Image Gallery */}
					<div className="flex flex-col gap-y-4">
						{product.imageFrontUrl ? (
							<Card className="p-2 overflow-hidden group rounded-2xl">
								<TransformWrapper>
									<TransformComponent
										wrapperStyle={{
											width: "100%",
											height: "100%",
											borderRadius: "0.75rem",
										}}
									>
										<img
											src={product.imageFrontUrl}
											alt={`${product.name} Front`}
											className="w-full aspect-4/5 object-contain transition-transform group-hover:scale-[1.02]"
										/>
									</TransformComponent>
								</TransformWrapper>
							</Card>
						) : (
							<Card className="bg-slate-100 dark:bg-slate-900 rounded-2xl aspect-4/5 flex items-center justify-center shadow-none">
								<Package className="w-16 h-16 text-slate-300 dark:text-slate-700" />
							</Card>
						)}
						{product.imageBackUrl && (
							<Card className="p-2 overflow-hidden group rounded-2xl">
								<TransformWrapper>
									<TransformComponent
										wrapperStyle={{
											width: "100%",
											height: "100%",
											borderRadius: "0.75rem",
										}}
									>
										<img
											src={product.imageBackUrl}
											alt={`${product.name} Back`}
											className="w-full aspect-4/5 object-contain"
										/>
									</TransformComponent>
								</TransformWrapper>
							</Card>
						)}
					</div>

					{/* Product Info */}
					<div className="gap-y-6 flex flex-col justify-center">
						<div>
							<div className="flex flex-wrap items-center gap-2 mb-3">
								{product.score && (
									<Badge
										variant="outline"
										className={cn("capitalize", scoreBadge.className)}
									>
										{product.score !== "none" ? product.score : "Score Missing"}
									</Badge>
								)}
								{product.productCategories?.map((pc) => (
									<Badge
										key={pc.category.id}
										variant="secondary"
										className="font-normal flex items-center gap-1.5"
									>
										{pc.category.iconUrl && (
											<img
												src={pc.category.iconUrl}
												alt=""
												className="w-3.5 h-3.5 opacity-80 object-contain"
											/>
										)}
										{pc.category.name}
									</Badge>
								))}
							</div>

							<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
								{product.name}
							</h1>
							<p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
								{product.brand}
							</p>
						</div>

						{product.barcode && (
							<Card className="rounded-xl shadow-sm">
								<CardContent className="flex items-center gap-3">
									<div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
										<Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
									</div>
									<div>
										<p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
											Barcode / EAN
										</p>
										<p className="font-mono text-slate-700 dark:text-slate-300">
											{product.barcode}
										</p>
									</div>
								</CardContent>
							</Card>
						)}

						<div className="flex flex-col gap-1">
							{product.submittedBy && (
								<p className="text-sm text-slate-500 dark:text-slate-400">
									Added by{" "}
									<span className="font-medium text-slate-700 dark:text-slate-300">
										{product.submittedBy.name || "Unknown"}
									</span>
								</p>
							)}
							{product.updatedAt && (
								<p className="text-sm text-slate-500 dark:text-slate-400">
									Last updated on{" "}
									<span className="font-medium text-slate-700 dark:text-slate-300">
										{new Date(product.updatedAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</p>
							)}
						</div>
					</div>
				</div>

				<Separator className="my-8 opacity-50" />

				{/* Ingredients Section */}
				<div className="space-y-6">
					<h3 className="text-2xl font-semibold flex items-center gap-2">
						<ShieldAlert className="w-6 h-6 text-blue-500" />
						Ingredients Analysis
					</h3>

					{product.productIngredients &&
					product.productIngredients.length > 0 ? (
						<div className="grid gap-3">
							{product.productIngredients.map(({ ingredient }) => {
								const isExcluded = excludedIngredients?.some(
									(ex) => ex.id === ingredient.id,
								);
								return (
									<Card
										key={ingredient.id}
										className={cn(
											"rounded-xl shadow-sm transition-colors",
											isExcluded &&
												"border-red-500 bg-red-50/50 dark:bg-red-950/20",
										)}
									>
										<CardContent className="p-4 flex items-center justify-between">
											<div className="flex items-center gap-2">
												{isExcluded && (
													<AlertTriangle className="w-5 h-5 text-red-500 mr-1" />
												)}
												<span
													className={cn(
														"font-medium",
														isExcluded
															? "text-red-700 dark:text-red-400"
															: "text-slate-800 dark:text-slate-200",
													)}
												>
													{ingredient.name}
												</span>
												{ingredient.description && (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Info
																	className={cn(
																		"w-4 h-4 transition-colors cursor-help",
																		isExcluded
																			? "text-red-400 hover:text-red-600"
																			: "text-slate-400 hover:text-slate-600",
																	)}
																/>
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p>{ingredient.description}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
											</div>
											{ingredient.hazardLevel && (
												<Badge
													variant={
														ingredient.hazardLevel === "high"
															? "destructive"
															: ingredient.hazardLevel === "medium"
																? "secondary"
																: "default"
													}
													className="uppercase text-[10px]"
												>
													{ingredient.hazardLevel} Hazard
												</Badge>
											)}
										</CardContent>
									</Card>
								);
							})}
						</div>
					) : (
						<Card className="bg-slate-50/50 dark:bg-slate-900/50 border-dashed shadow-none">
							<CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
								<AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
								<p>Detailed ingredient breakdown is not available yet.</p>
							</CardContent>
						</Card>
					)}

					{product.rawIngredientsText && (
						<div className="mt-6 space-y-2">
							<h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
								Raw Label Text
							</h4>
							<Card className="bg-slate-50 dark:bg-slate-900/50 shadow-none">
								<CardContent className="p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
									{product.rawIngredientsText}
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Available at Stores */}
				{product.productStores && product.productStores.length > 0 && (
					<>
						<Separator className="my-8 opacity-50" />
						<div className="space-y-4">
							<h3 className="text-xl font-semibold flex items-center gap-2">
								<Store className="w-5 h-5 text-emerald-500" />
								Available at
							</h3>
							<div className="flex flex-wrap gap-3">
								{product.productStores.map(({ store }) => (
									<div
										key={store.id}
										className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
									>
										{store.logoUrl ? (
											<img
												src={store.logoUrl}
												alt={store.name}
												className="w-6 h-6 rounded-full object-cover"
											/>
										) : (
											<div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
												<Store className="w-3 h-3 text-slate-500" />
											</div>
										)}
										<span className="font-medium text-sm">{store.name}</span>
									</div>
								))}
							</div>
						</div>
					</>
				)}

				{/* Alternatives Section */}
				{alternatives && alternatives.length > 0 && (
					<>
						<Separator className="my-8 opacity-50" />
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold flex items-center gap-2">
									<Package className="w-5 h-5 text-indigo-500" />
									Alternatives
								</h3>
								{(() => {
									const parentCategory = product.productCategories?.find(
										(pc) => !pc.category.parentId,
									)?.category;
									const subCategories =
										product.productCategories
											?.filter((pc) => pc.category.parentId)
											?.map((pc) => pc.category) || [];
									const mainCategoryId =
										parentCategory?.id || subCategories[0]?.parentId;
									const subCategoryIds = subCategories.map((sc) => sc.id);

									if (!mainCategoryId) return null;

									return (
										<Link
											to="/search"
											search={{
												categoryId: mainCategoryId,
												subCategoryIds:
													subCategoryIds.length > 0
														? subCategoryIds
														: undefined,
											}}
										>
											<Button
												variant="outline"
												size="sm"
												className="hidden sm:flex"
											>
												See all
											</Button>
										</Link>
									);
								})()}
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
								{alternatives.map((alt) => (
									<ProductCard key={alt.id} product={alt} />
								))}
							</div>
							{(() => {
								const parentCategory = product.productCategories?.find(
									(pc) => !pc.category.parentId,
								)?.category;
								const subCategories =
									product.productCategories
										?.filter((pc) => pc.category.parentId)
										?.map((pc) => pc.category) || [];
								const mainCategoryId =
									parentCategory?.id || subCategories[0]?.parentId;
								const subCategoryIds = subCategories.map((sc) => sc.id);

								if (!mainCategoryId) return null;

								return (
									<div className="mt-4 sm:hidden">
										<Link
											to="/search"
											search={{
												categoryId: mainCategoryId,
												subCategoryIds:
													subCategoryIds.length > 0
														? subCategoryIds
														: undefined,
											}}
											className="block w-full"
										>
											<Button variant="outline" className="w-full">
												See all Alternatives
											</Button>
										</Link>
									</div>
								);
							})()}
						</div>
					</>
				)}
			</main>
		</div>
	);
}
