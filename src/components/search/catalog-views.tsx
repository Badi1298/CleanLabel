import { ChevronRight, Loader2, SearchX } from "lucide-react";
import type * as React from "react";
import { CategoryIcon } from "#/components/categories/category-icon";
import { ProductCard, type StoreInfo } from "#/components/home/product-card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

export type ScoreFilterValue = "gold" | "silver" | "bronze" | "none";

export const FILTER_TRIGGER_ACTIVE_CLASS =
	"bg-[#E3EDE7]/75 dark:bg-[#1E3A2C] border-[#2D5A44]/40 dark:border-[#3D6E54] text-[#1B4332] dark:text-[#CBE3D4] font-semibold hover:bg-[#E3EDE7] dark:hover:bg-[#234535] hover:text-[#1B4332] dark:hover:text-[#CBE3D4]";

export const FILTER_TRIGGER_INACTIVE_CLASS =
	"bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#C9B382] dark:hover:border-[#365043] hover:bg-white dark:hover:bg-[#16221C] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]";

export type CatalogProductResult = {
	product: {
		id: string;
		name: string;
		brand?: string;
		score?: string | null;
		imageFrontUrl: string | null;
		ingredientIds?: string[];
		stores?: StoreInfo[] | null;
	};
	storeName: string | null;
	stores: StoreInfo[];
};

export type CatalogCategorySection = {
	category: {
		id: string;
		name: string;
		iconUrl: string | null;
	};
	totalCount: number;
	products: CatalogProductResult[];
};

type ScoreFilterSelectProps = {
	value?: ScoreFilterValue;
	onChange: (value: ScoreFilterValue | undefined) => void;
	className?: string;
};

export function ScoreFilterSelect({
	value,
	onChange,
	className,
}: ScoreFilterSelectProps) {
	return (
		<Select
			value={value || "all"}
			onValueChange={(val) =>
				onChange(val === "all" ? undefined : (val as ScoreFilterValue))
			}
		>
			<SelectTrigger
				aria-label="Filter by score"
				className={cn(
					"w-full sm:w-auto sm:min-w-33 h-10 data-[size=default]:h-10 pointer-coarse:h-11 pointer-coarse:data-[size=default]:h-11 rounded-xl text-[13px] shadow-none transition-colors cursor-pointer",
					value ? FILTER_TRIGGER_ACTIVE_CLASS : FILTER_TRIGGER_INACTIVE_CLASS,
					className,
				)}
			>
				<SelectValue placeholder="Score" />
			</SelectTrigger>
			<SelectContent className="rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C]">
				<SelectItem value="all">Any Score</SelectItem>
				<SelectItem value="gold">Gold</SelectItem>
				<SelectItem value="silver">Silver</SelectItem>
				<SelectItem value="bronze">Bronze</SelectItem>
				<SelectItem value="none">Unrated</SelectItem>
			</SelectContent>
		</Select>
	);
}

type CategorySectionsViewProps = {
	sections: CatalogCategorySection[];
	onSelectCategory: (categoryId: string) => void;
};

export function CategorySectionsView({
	sections,
	onSelectCategory,
}: CategorySectionsViewProps) {
	return (
		<div className="space-y-9">
			{sections.map((section) => {
				const hasMoreInCategory = section.totalCount > section.products.length;

				return (
					<section
						key={section.category.id}
						aria-labelledby={`cat-section-${section.category.id}`}
					>
						<div className="flex items-center justify-between gap-3 mb-3.5 pb-2 border-b border-[#EAE4D7]/80 dark:border-[#24362D]">
							<div className="flex items-center gap-2.5 min-w-0">
								<CategoryIcon
									name={section.category.name}
									iconUrl={section.category.iconUrl}
									className="w-9 h-9"
								/>
								<h2
									id={`cat-section-${section.category.id}`}
									className="text-base sm:text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] truncate"
								>
									{section.category.name}
								</h2>
								<Badge
									variant="secondary"
									className="rounded-full bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E] px-2 py-0.5 text-[11px] font-bold tabular-nums shrink-0"
								>
									{section.totalCount}
								</Badge>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onSelectCategory(section.category.id)}
								className="h-auto gap-1 px-2 py-1 text-xs sm:text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] hover:bg-[#E3EDE7]/50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-[#1E3A2C]/60 shrink-0"
							>
								<span>
									{hasMoreInCategory
										? `View all (${section.totalCount})`
										: "Open"}
								</span>
								<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
							</Button>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-5">
							{section.products.map((result) => (
								<ProductCard
									key={result.product.id}
									product={{
										...result.product,
										storeName: result.storeName,
										stores: result.stores,
									}}
								/>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}

type PaginatedProductsGridProps = {
	products: CatalogProductResult[];
	totalCount: number;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	onFetchNextPage: () => void;
};

export function PaginatedProductsGrid({
	products,
	totalCount,
	hasNextPage,
	isFetchingNextPage,
	onFetchNextPage,
}: PaginatedProductsGridProps) {
	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-5">
				{products.map((result) => (
					<ProductCard
						key={result.product.id}
						product={{
							...result.product,
							storeName: result.storeName,
							stores: result.stores,
						}}
					/>
				))}
			</div>

			{hasNextPage && (
				<div className="mt-8 flex flex-col items-center gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onFetchNextPage}
						disabled={isFetchingNextPage}
						className="h-auto min-h-10 px-5 py-2 rounded-full bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-sm font-semibold text-[#1B4332] dark:text-[#CBE3D4] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] shadow-none"
					>
						{isFetchingNextPage && (
							<Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
						)}
						<span>
							{isFetchingNextPage
								? "Loading more..."
								: `Load more (${products.length} of ${totalCount})`}
						</span>
					</Button>
				</div>
			)}
		</>
	);
}

type EmptyProductsStateProps = {
	icon?: React.ReactNode;
	title?: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
};

export function EmptyProductsState({
	icon,
	title = "No products found",
	description = "Try adjusting your filters or search query.",
	actionLabel = "Clear all filters",
	onAction,
}: EmptyProductsStateProps) {
	return (
		<Card className="py-16 px-4 text-center rounded-2xl bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] gap-0">
			<CardContent className="px-0">
				<div className="w-12 h-12 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto mb-3">
					{icon ?? <SearchX className="w-5 h-5" aria-hidden="true" />}
				</div>
				<h2 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
					{title}
				</h2>
				<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 max-w-sm mx-auto">
					{description}
				</p>
				{onAction && (
					<Button
						type="button"
						onClick={onAction}
						className="mt-5 h-auto px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540]"
					>
						{actionLabel}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
