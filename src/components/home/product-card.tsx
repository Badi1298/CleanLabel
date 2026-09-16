import { Link } from "@tanstack/react-router";

import {
	Card,
	CardContent,

	CardHeader,
	CardTitle,
} from "#/components/ui/card";

type ProductCardProps = {
	product: {
		id: string;
		name: string;
		imageFrontUrl: string | null;
		storeName: string | null;
	};
};

export function ProductCard({ product }: ProductCardProps) {



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
					{/* Removed score badge per request */}
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
					<div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
						<span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border border-red-200 dark:border-red-800/30">
							⚠️ Fara alergeni (WIP)
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
