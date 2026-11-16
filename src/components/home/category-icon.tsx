import type { LucideIcon } from "lucide-react";
import {
	Apple,
	Baby,
	Beef,
	Candy,
	Coffee,
	Cookie,
	CookingPot,
	Croissant,
	CupSoda,
	Droplet,
	Fish,
	Leaf,
	Milk,
	Package,
	ShoppingBag,
	Snowflake,
	Soup,
	UtensilsCrossed,
	Wheat,
} from "lucide-react";
import { cn } from "#/lib/utils";

const CATEGORY_ICON_RULES: Array<{ keywords: string[]; Icon: LucideIcon }> = [
	{
		keywords: [
			"cereale",
			"cereal",
			"faina",
			"flour",
			"paste",
			"pasta",
			"orez",
			"rice",
			"grain",
			"ovaz",
		],
		Icon: Wheat,
	},
	{
		keywords: [
			"paine",
			"bread",
			"panificatie",
			"bakery",
			"croissant",
			"patiserie",
		],
		Icon: Croissant,
	},
	{
		keywords: [
			"lactate",
			"dairy",
			"lapte",
			"milk",
			"branza",
			"cheese",
			"iaurt",
			"yogurt",
			"unt",
			"butter",
			"oua",
			"egg",
		],
		Icon: Milk,
	},
	{
		keywords: [
			"sos",
			"sauce",
			"tartinabile",
			"dressing",
			"ketchup",
			"maioneza",
			"ulei",
			"oil",
			"otet",
			"vinegar",
			"sirop",
			"syrup",
		],
		Icon: Droplet,
	},
	{
		keywords: [
			"gustari",
			"snack",
			"chips",
			"biscuit",
			"cracker",
			"cookie",
			"saratele",
		],
		Icon: Cookie,
	},
	{
		keywords: [
			"dulciuri",
			"sweet",
			"ciocolata",
			"chocolate",
			"candy",
			"bomboane",
			"desert",
			"dessert",
		],
		Icon: Candy,
	},
	{
		keywords: [
			"bauturi",
			"beverage",
			"drink",
			"suc",
			"juice",
			"apa",
			"water",
			"soda",
			"racoritoare",
		],
		Icon: CupSoda,
	},
	{
		keywords: ["cafea", "coffee", "ceai", "tea"],
		Icon: Coffee,
	},
	{
		keywords: [
			"mustar",
			"ingrediente",
			"gatit",
			"cooking",
			"condiment",
			"sare",
			"ierburi",
			"zahar",
			"indulcitori",
		],
		Icon: CookingPot,
	},
	{
		keywords: ["bebe", "baby", "copii", "kids", "piureuri"],
		Icon: Baby,
	},
	{
		keywords: ["carne", "meat", "mezeluri", "poultry", "pui", "porc", "vita"],
		Icon: Beef,
	},
	{
		keywords: ["peste", "fish", "seafood", "fructe de mare"],
		Icon: Fish,
	},
	{
		keywords: [
			"conserve",
			"canned",
			"supa",
			"soup",
			"camara",
			"pantry",
			"borcan",
			"semipreparate",
		],
		Icon: Soup,
	},
	{
		keywords: ["congelate", "frozen", "inghetata", "ice cream"],
		Icon: Snowflake,
	},
	{
		keywords: [
			"fructe",
			"fruit",
			"legume",
			"vegetable",
			"produce",
			"verde",
			"salad",
		],
		Icon: Apple,
	},
	{
		keywords: ["bio", "organic", "vegan", "plant", "natural"],
		Icon: Leaf,
	},
	{
		keywords: ["gata", "ready", "meal", "preparate"],
		Icon: UtensilsCrossed,
	},
];

function normalizeCategoryName(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");
}

function resolveCategoryIcon(name: string): LucideIcon {
	const normalized = normalizeCategoryName(name);
	for (const rule of CATEGORY_ICON_RULES) {
		if (rule.keywords.some((kw) => normalized.includes(kw))) {
			return rule.Icon;
		}
	}
	return ShoppingBag;
}

type CategoryIconTileProps = {
	name: string;
	className?: string;
	iconClassName?: string;
};

/**
 * Warm cream rounded square with a cohesive monoline fine-gold category icon.
 */
export function CategoryIconTile({
	name,
	className,
	iconClassName,
}: CategoryIconTileProps) {
	const Icon = resolveCategoryIcon(name) || Package;

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-2xl bg-[#FBF4E6] dark:bg-[#1E261D] border border-[#EAE4D7] dark:border-[#2F3A2D] transition-all duration-200",
				className,
			)}
		>
			<Icon
				className={cn(
					"text-[#A67C37] dark:text-[#D4AF6A] transition-transform duration-200",
					iconClassName,
				)}
				strokeWidth={1.5}
				aria-hidden="true"
			/>
		</div>
	);
}
