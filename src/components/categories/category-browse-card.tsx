import {
	Apple,
	Beef,
	ChevronRight,
	Cookie,
	Croissant,
	CupSoda,
	Droplets,
	Fish,
	Leaf,
	Milk,
	ShoppingBasket,
	Wheat,
} from "lucide-react";
import { cn } from "#/lib/utils";

export const CATEGORY_PALETTES = [
	{
		bg: "bg-emerald-50 dark:bg-emerald-950/50",
		border: "border-emerald-200/80 dark:border-emerald-900/50",
		iconText: "text-emerald-700 dark:text-emerald-300",
	},
	{
		bg: "bg-amber-50 dark:bg-amber-950/50",
		border: "border-amber-200/80 dark:border-amber-900/50",
		iconText: "text-amber-700 dark:text-amber-300",
	},
	{
		bg: "bg-rose-50 dark:bg-rose-950/50",
		border: "border-rose-200/80 dark:border-rose-900/50",
		iconText: "text-rose-700 dark:text-rose-300",
	},
	{
		bg: "bg-sky-50 dark:bg-sky-950/50",
		border: "border-sky-200/80 dark:border-sky-900/50",
		iconText: "text-sky-700 dark:text-sky-300",
	},
	{
		bg: "bg-purple-50 dark:bg-purple-950/50",
		border: "border-purple-200/80 dark:border-purple-900/50",
		iconText: "text-purple-700 dark:text-purple-300",
	},
	{
		bg: "bg-orange-50 dark:bg-orange-950/50",
		border: "border-orange-200/80 dark:border-orange-900/50",
		iconText: "text-orange-700 dark:text-orange-300",
	},
] as const;

const CATEGORY_ICON_RULES: Array<{
	keywords: string[];
	Icon: typeof ShoppingBasket;
}> = [
	{
		keywords: ["bauturi", "băuturi", "drink", "beverage", "suc", "apa", "apă"],
		Icon: CupSoda,
	},
	{
		keywords: ["carne", "meat", "mezel", "pui", "porc", "vita", "vită"],
		Icon: Beef,
	},
	{
		keywords: ["peste", "pește", "fish", "fructe de mare", "seafood"],
		Icon: Fish,
	},
	{
		keywords: ["lactate", "dairy", "lapte", "branza", "brânză", "iaurt"],
		Icon: Milk,
	},
	{
		keywords: ["dulciuri", "gustari", "gustări", "snack", "sweet", "ciocolat"],
		Icon: Cookie,
	},
	{
		keywords: ["sosuri", "tartinabil", "sauce", "ulei", "condiment"],
		Icon: Droplets,
	},
	{
		keywords: [
			"panificatie",
			"panificație",
			"paine",
			"pâine",
			"bakery",
			"patiser",
		],
		Icon: Croissant,
	},
	{
		keywords: ["fructe", "legume", "produce", "vegetal"],
		Icon: Apple,
	},
	{
		keywords: ["bio", "organic", "eco", "vegan", "plant"],
		Icon: Leaf,
	},
	{
		keywords: ["baza", "bază", "cereale", "paste", "faina", "făină", "pantry"],
		Icon: Wheat,
	},
];

export function getCategoryVisual(categoryName: string, index: number) {
	const normalized = categoryName.toLowerCase();
	const matched = CATEGORY_ICON_RULES.find((rule) =>
		rule.keywords.some((kw) => normalized.includes(kw)),
	);

	return {
		palette: CATEGORY_PALETTES[index % CATEGORY_PALETTES.length],
		Icon: matched?.Icon ?? ShoppingBasket,
	};
}

export type CategoryBrowseSubcategory = {
	id: string;
	name: string;
	count: number;
};

type CategoryBrowseCardProps = {
	category: {
		id: string;
		name: string;
		iconUrl?: string | null;
	};
	productCount: number;
	subcategories: CategoryBrowseSubcategory[];
	paletteIndex: number;
	onSelectCategory: () => void;
	onSelectSubcategory: (subcategoryId: string) => void;
};

export function CategoryBrowseCard({
	category,
	productCount,
	subcategories,
	paletteIndex,
	onSelectCategory,
	onSelectSubcategory,
}: CategoryBrowseCardProps) {
	const { palette, Icon } = getCategoryVisual(category.name, paletteIndex);

	return (
		<article className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] hover:shadow-[0_8px_24px_rgba(27,67,50,0.06)] hover:border-[#D4CCB8] dark:hover:border-[#365043] transition-all duration-200 overflow-hidden">
			{/* Parent Category Header */}
			<button
				type="button"
				onClick={onSelectCategory}
				className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 hover:bg-[#FAF8F5]/80 dark:hover:bg-[#1A2821]/70 transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B4332]"
			>
				<div className="flex items-center gap-3.5 min-w-0">
					<div
						className={cn(
							"w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
							palette.bg,
							palette.border,
						)}
					>
						{category.iconUrl ? (
							<img
								src={category.iconUrl}
								alt=""
								className="w-8 h-8 object-contain"
								loading="lazy"
							/>
						) : (
							<Icon
								className={cn("w-5.5 h-5.5", palette.iconText)}
								strokeWidth={1.9}
								aria-hidden="true"
							/>
						)}
					</div>

					<div className="min-w-0">
						<h3 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#1B3328] dark:text-[#EDF2EE] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] transition-colors leading-snug text-balance">
							{category.name}
						</h3>
						<p className="text-xs font-medium text-[#5C665E] dark:text-[#9AA89E] mt-0.5 tabular-nums">
							{productCount} {productCount === 1 ? "product" : "products"}
							{subcategories.length > 0 && (
								<span>
									{" "}
									· {subcategories.length}{" "}
									{subcategories.length === 1 ? "subcategory" : "subcategories"}
								</span>
							)}
						</p>
					</div>
				</div>

				<span className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] px-3 py-1.5 min-h-8 text-xs font-semibold text-[#1B4332] dark:text-[#CBE3D4] group-hover:bg-[#E3EDE7] dark:group-hover:bg-[#1E3A2C] group-hover:border-[#C8DBD0] transition-colors shrink-0">
					<span className="hidden sm:inline">View all</span>
					<span className="sm:hidden">All</span>
					<ChevronRight
						className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
						aria-hidden="true"
					/>
				</span>
			</button>

			{/* Subcategory Pills */}
			{subcategories.length > 0 && (
				<div className="border-t border-[#F0EAE0] dark:border-[#22332A] bg-[#FAF8F5]/65 dark:bg-[#121D17]/60 px-4 py-3 sm:px-5 sm:py-3.5">
					<div className="flex flex-wrap gap-2">
						{subcategories.map((subcat) => (
							<button
								key={subcat.id}
								type="button"
								onClick={() => onSelectSubcategory(subcat.id)}
								className="group/sub inline-flex items-center gap-2 max-w-full min-h-9.5 pointer-coarse:min-h-11 rounded-xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2A3D33] px-3.5 py-1.5 text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] shadow-[0_1px_2px_rgba(27,67,50,0.03)] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/55 dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] active:scale-[0.99] transition-all cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
							>
								<span className="leading-snug">{subcat.name}</span>
								<span className="inline-flex items-center justify-center min-w-5.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E] group-hover/sub:bg-white/90 dark:group-hover/sub:bg-[#16221C] group-hover/sub:text-[#1B4332] dark:group-hover/sub:text-[#CBE3D4] tabular-nums transition-colors shrink-0">
									{subcat.count}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</article>
	);
}
