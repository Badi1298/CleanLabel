import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

type ProductCardProps = {
	product: {
		id: string;
		name: string;
		brand: string;
		score: "gold" | "silver" | "bronze" | "none";
		imageFrontUrl: string | null;
		categoryName: string | null;
	};
};

export function ProductCard({ product }: ProductCardProps) {
	const scoreColors = {
		gold: "bg-yellow-400 text-yellow-950 hover:bg-yellow-500",
		silver: "bg-slate-300 text-slate-900 hover:bg-slate-400",
		bronze: "bg-amber-600 text-white hover:bg-amber-700",
		none: "bg-slate-100 text-slate-500 hover:bg-slate-200",
	};

	const scoreLabels = {
		gold: "Gold",
		silver: "Silver",
		bronze: "Bronze",
		none: "Unrated",
	};

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
					<div className="absolute top-3 right-3 shadow-sm rounded-lg">
						<Badge className={scoreColors[product.score]}>
							{scoreLabels[product.score]}
						</Badge>
					</div>
				</div>
				<CardHeader className="p-4 pb-2">
					<CardDescription className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
						{product.brand}
					</CardDescription>
					<CardTitle className="text-lg line-clamp-2 leading-tight">
						{product.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 pt-0 mt-auto">
					<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
						{product.categoryName && (
							<span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium">
								{product.categoryName}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
