import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowLeft,
	Info,
	Package,
	ShieldAlert,
	Store,
} from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { productDetailsQueryOptions } from "#/queries/product-queries";

export const Route = createFileRoute("/products/$productId")({
	loader: async ({ context: { queryClient }, params: { productId } }) => {
		await queryClient.ensureQueryData(productDetailsQueryOptions(productId));
	},
	component: ProductDetails,
});

function getScoreBadgeProps(score: string) {
	switch (score) {
		case "gold":
			return {
				className: "bg-yellow-400 text-yellow-900 border-yellow-500",
				label: "Gold Label",
			};
		case "silver":
			return {
				className: "bg-slate-300 text-slate-800 border-slate-400",
				label: "Silver Label",
			};
		case "bronze":
			return {
				className: "bg-amber-600 text-amber-50 border-amber-700",
				label: "Bronze Label",
			};
		default:
			return {
				className:
					"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
				label: "No Label",
			};
	}
}

function ProductDetails() {
	const { productId } = Route.useParams();
	const { data: product } = useSuspenseQuery(
		productDetailsQueryOptions(productId),
	);

	if (!product) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Package className="w-16 h-16 text-slate-300" />
				<h2 className="text-xl font-medium text-slate-600">
					Product not found
				</h2>
				<Link to="/" className="text-blue-600 hover:underline">
					Return to Home
				</Link>
			</div>
		);
	}

	const scoreBadge = getScoreBadgeProps(product.score);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
			{/* Header / Navigation */}
			<header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center">
				<Button
					className="mr-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
					onClick={() => window.history.back()}
				>
					<ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
				</Button>
				<h1 className="font-semibold text-lg truncate flex-1">
					{product.name}
				</h1>
			</header>

			<main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
				{/* Top Section: Images and Basic Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
					{/* Image Gallery */}
					<div className="space-y-4">
						{product.imageFrontUrl ? (
							<div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
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
											className="w-full aspect-[4/5] object-contain transition-transform group-hover:scale-[1.02]"
										/>
									</TransformComponent>
								</TransformWrapper>
							</div>
						) : (
							<div className="bg-slate-100 dark:bg-slate-900 rounded-2xl aspect-[4/5] flex items-center justify-center border border-slate-200 dark:border-slate-800">
								<Package className="w-16 h-16 text-slate-300 dark:text-slate-700" />
							</div>
						)}
						{product.imageBackUrl && (
							<div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
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
											className="w-full aspect-video object-contain"
										/>
									</TransformComponent>
								</TransformWrapper>
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="space-y-6 flex flex-col justify-center">
						<div>
							<div className="flex flex-wrap items-center gap-2 mb-3">
								<Badge variant="outline" className={scoreBadge.className}>
									{scoreBadge.label}
								</Badge>
								{product.category && (
									<Badge
										variant="secondary"
										className="font-normal flex items-center gap-1.5"
									>
										{product.category.iconUrl && (
											<img
												src={product.category.iconUrl}
												alt=""
												className="w-3.5 h-3.5 opacity-80 object-contain"
											/>
										)}
										{product.category.name}
									</Badge>
								)}
								{product.status === "pending_review" && (
									<Badge
										variant="outline"
										className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400"
									>
										Pending Review
									</Badge>
								)}
							</div>

							<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
								{product.name}
							</h1>
							<p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
								{product.brand}
							</p>
						</div>

						{product.barcode && (
							<div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
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
							</div>
						)}

						{product.submittedBy && (
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Added by{" "}
								<span className="font-medium text-slate-700 dark:text-slate-300">
									{product.submittedBy.name || "Unknown"}
								</span>
							</p>
						)}
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
							{product.productIngredients.map(({ ingredient }) => (
								<div
									key={ingredient.id}
									className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between"
								>
									<span className="font-medium text-slate-800 dark:text-slate-200">
										{ingredient.name}
									</span>
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
								</div>
							))}
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
							<div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
								{product.rawIngredientsText}
							</div>
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
			</main>
		</div>
	);
}
