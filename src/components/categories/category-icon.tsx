import { useId } from "react";
import cerealePastePanificatieIcon from "#/assets/pickitwell-icons/01-cereale-paste-panificatie.svg";
import lactateAlternativeIcon from "#/assets/pickitwell-icons/02-lactate-alternative.svg";
import sosuriTartinabileIcon from "#/assets/pickitwell-icons/03-sosuri-tartinabile.svg";
import gustariDulciuriIcon from "#/assets/pickitwell-icons/04-gustari-dulciuri.svg";
import bauturiIcon from "#/assets/pickitwell-icons/05-bauturi.svg";
import ingredienteGatitIcon from "#/assets/pickitwell-icons/06-ingrediente-gatit.svg";
import conserveMancaruriGataIcon from "#/assets/pickitwell-icons/07-conserve-mancaruri-gata.svg";
import carneMezeluriIcon from "#/assets/pickitwell-icons/08-carne-mezeluri.svg";
import alimenteCopiiIcon from "#/assets/pickitwell-icons/09-alimente-copii.svg";
import { cn } from "#/lib/utils";

export type CategoryIconKey =
	| "cereale-paste-panificatie"
	| "lactate-alternative"
	| "sosuri-tartinabile"
	| "gustari-dulciuri"
	| "bauturi"
	| "ingrediente-gatit"
	| "conserve-mancaruri-gata"
	| "carne-mezeluri"
	| "alimente-copii";

export const CATEGORY_ICON_ASSETS: Record<CategoryIconKey, string> = {
	"cereale-paste-panificatie": cerealePastePanificatieIcon,
	"lactate-alternative": lactateAlternativeIcon,
	"sosuri-tartinabile": sosuriTartinabileIcon,
	"gustari-dulciuri": gustariDulciuriIcon,
	bauturi: bauturiIcon,
	"ingrediente-gatit": ingredienteGatitIcon,
	"conserve-mancaruri-gata": conserveMancaruriGataIcon,
	"carne-mezeluri": carneMezeluriIcon,
	"alimente-copii": alimenteCopiiIcon,
};

type KeywordRule = {
	key: CategoryIconKey;
	keywords: string[];
};

const TIER_1_RULES: KeywordRule[] = [
	{
		key: "alimente-copii",
		keywords: ["alimente pentru copii", "copii", "bebe", "baby"],
	},
	{
		key: "carne-mezeluri",
		keywords: ["carne", "mezeluri", "mezel", "meat"],
	},
	{
		key: "conserve-mancaruri-gata",
		keywords: [
			"conserve",
			"mancaruri",
			"semipreparate",
			"congelate",
			"canned",
			"frozen",
		],
	},
	{
		key: "ingrediente-gatit",
		keywords: [
			"ingrediente pentru gatit",
			"ingrediente",
			"gatit",
			"cooking",
			"condiment",
		],
	},
	{
		key: "sosuri-tartinabile",
		keywords: ["sosuri", "tartinabile", "tartinabil", "sauce", "spread"],
	},
	{
		key: "lactate-alternative",
		keywords: ["lactate", "dairy", "lapte", "branza", "iaurt"],
	},
	{
		key: "gustari-dulciuri",
		keywords: ["gustari", "dulciuri", "snack", "sweet", "ciocolat", "biscuit"],
	},
	{
		key: "cereale-paste-panificatie",
		keywords: [
			"cereale",
			"panificatie",
			"paste",
			"paine",
			"bakery",
			"cereal",
			"pasta",
			"bread",
		],
	},
	{
		key: "bauturi",
		keywords: [
			"bauturi",
			"beverage",
			"drink",
			"suc",
			"sucuri",
			"apa",
			"cafea",
			"ceai",
		],
	},
];

const TIER_2_RULES: KeywordRule[] = [
	{
		key: "cereale-paste-panificatie",
		keywords: [
			"ovaz",
			"orez",
			"faina",
			"grain",
			"rice",
			"flour",
			"patiserie",
			"croissant",
		],
	},
	{
		key: "lactate-alternative",
		keywords: [
			"milk",
			"cheese",
			"yogurt",
			"unt",
			"butter",
			"smantana",
			"kefir",
			"oua",
			"egg",
		],
	},
	{
		key: "sosuri-tartinabile",
		keywords: [
			"sos",
			"ketchup",
			"maioneza",
			"mustar",
			"dressing",
			"pesto",
			"hummus",
			"zacusca",
			"gem",
			"miere",
		],
	},
	{
		key: "gustari-dulciuri",
		keywords: [
			"chips",
			"cracker",
			"cookie",
			"candy",
			"bomboane",
			"desert",
			"dessert",
			"napolitan",
			"batoane",
			"saratele",
			"covrigei",
		],
	},
	{
		key: "bauturi",
		keywords: [
			"juice",
			"water",
			"soda",
			"racoritoare",
			"coffee",
			"tea",
			"limonada",
			"sirop",
		],
	},
	{
		key: "ingrediente-gatit",
		keywords: [
			"ulei",
			"oil",
			"otet",
			"vinegar",
			"sare",
			"zahar",
			"ierburi",
			"indulcitor",
			"cacao",
		],
	},
	{
		key: "conserve-mancaruri-gata",
		keywords: [
			"conserva",
			"borcan",
			"supa",
			"soup",
			"gata",
			"ready",
			"meal",
			"preparate",
			"inghetata",
		],
	},
	{
		key: "carne-mezeluri",
		keywords: [
			"pui",
			"porc",
			"vita",
			"curcan",
			"salam",
			"sunca",
			"carnati",
			"peste",
			"fish",
			"seafood",
		],
	},
	{
		key: "alimente-copii",
		keywords: ["kids", "piureuri", "bebelus", "infant"],
	},
];

function normalizeCategoryText(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

function matchesKeyword(
	normalized: string,
	tokens: Set<string>,
	kw: string,
): boolean {
	if (kw.includes(" ")) {
		return normalized.includes(kw);
	}
	if (kw.length <= 4) {
		return tokens.has(kw);
	}
	return normalized.includes(kw);
}

export function matchPickItWellIconKey(
	rawName?: string | null,
): CategoryIconKey | null {
	if (!rawName) return null;
	const normalized = normalizeCategoryText(rawName);
	if (!normalized) return null;

	const tokens = new Set(normalized.split(" "));

	for (const rule of TIER_1_RULES) {
		if (rule.keywords.some((kw) => matchesKeyword(normalized, tokens, kw))) {
			return rule.key;
		}
	}

	for (const rule of TIER_2_RULES) {
		if (rule.keywords.some((kw) => matchesKeyword(normalized, tokens, kw))) {
			return rule.key;
		}
	}

	return null;
}

export type ResolvedCategoryIcon = {
	src: string;
	isCustomUrl: boolean;
};

export function resolveCategoryIconSrc({
	iconKey,
	name,
	parentName,
	iconUrl,
}: {
	iconKey?: CategoryIconKey;
	name?: string | null;
	parentName?: string | null;
	iconUrl?: string | null;
}): ResolvedCategoryIcon | null {
	if (iconKey) {
		return { src: CATEGORY_ICON_ASSETS[iconKey], isCustomUrl: false };
	}

	const parentMatch = matchPickItWellIconKey(parentName);
	if (parentMatch) {
		return { src: CATEGORY_ICON_ASSETS[parentMatch], isCustomUrl: false };
	}

	const nameMatch = matchPickItWellIconKey(name);
	if (nameMatch) {
		return { src: CATEGORY_ICON_ASSETS[nameMatch], isCustomUrl: false };
	}

	const trimmedUrl = iconUrl?.trim();
	if (trimmedUrl) {
		return { src: trimmedUrl, isCustomUrl: true };
	}

	return null;
}

function CategoryFallbackBadge({
	alt,
	className,
}: {
	alt: string;
	className?: string;
}) {
	const uid = useId().replace(/:/g, "");
	const bgId = `cat-bg-${uid}`;
	const goldId = `cat-gold-${uid}`;
	const isDecorative = alt === "";

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			width={256}
			height={256}
			aria-hidden={isDecorative ? true : undefined}
			role={isDecorative ? undefined : "img"}
			aria-label={isDecorative ? undefined : alt}
			className={cn("shrink-0 select-none", className)}
		>
			{!isDecorative && <title>{alt}</title>}
			<defs>
				<radialGradient id={bgId} cx=".5" cy=".28" r=".85">
					<stop offset="0" stopColor="#157050" />
					<stop offset=".6" stopColor="#0A4231" />
					<stop offset="1" stopColor="#042A20" />
				</radialGradient>
				<linearGradient
					id={goldId}
					gradientUnits="userSpaceOnUse"
					x1="70"
					y1="50"
					x2="190"
					y2="210"
				>
					<stop offset="0" stopColor="#F7E1A0" />
					<stop offset=".35" stopColor="#E2B04E" />
					<stop offset=".65" stopColor="#B98429" />
					<stop offset="1" stopColor="#EBC56E" />
				</linearGradient>
			</defs>
			<rect
				x="8"
				y="8"
				width="240"
				height="240"
				rx="56"
				fill={`url(#${bgId})`}
			/>
			<rect
				x="8"
				y="8"
				width="240"
				height="240"
				rx="56"
				fill="none"
				stroke={`url(#${goldId})`}
				strokeWidth="2.5"
			/>
			<rect
				x="17"
				y="17"
				width="222"
				height="222"
				rx="48"
				fill="none"
				stroke={`url(#${goldId})`}
				strokeOpacity=".35"
				strokeWidth="1"
			/>
			<g transform="translate(128 128) scale(1.12) translate(-128 -128)">
				<rect
					x="76"
					y="76"
					width="44"
					height="44"
					rx="11"
					fill={`url(#${goldId})`}
					fillOpacity=".17"
					stroke={`url(#${goldId})`}
					strokeWidth="4.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<rect
					x="136"
					y="76"
					width="44"
					height="44"
					rx="11"
					fill={`url(#${goldId})`}
					fillOpacity=".17"
					stroke={`url(#${goldId})`}
					strokeWidth="4.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<rect
					x="76"
					y="136"
					width="44"
					height="44"
					rx="11"
					fill={`url(#${goldId})`}
					fillOpacity=".17"
					stroke={`url(#${goldId})`}
					strokeWidth="4.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<rect
					x="136"
					y="136"
					width="44"
					height="44"
					rx="11"
					fill={`url(#${goldId})`}
					fillOpacity=".17"
					stroke={`url(#${goldId})`}
					strokeWidth="4.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}

export type CategoryIconProps = {
	iconKey?: CategoryIconKey;
	name?: string | null;
	parentName?: string | null;
	iconUrl?: string | null;
	alt?: string;
	loading?: "eager" | "lazy";
	className?: string;
};

export function CategoryIcon({
	iconKey,
	name,
	parentName,
	iconUrl,
	alt = "",
	loading = "lazy",
	className,
}: CategoryIconProps) {
	const resolved = resolveCategoryIconSrc({
		iconKey,
		name,
		parentName,
		iconUrl,
	});

	if (!resolved) {
		return <CategoryFallbackBadge alt={alt} className={className} />;
	}

	return (
		<img
			src={resolved.src}
			alt={alt}
			width={256}
			height={256}
			decoding="async"
			loading={loading}
			draggable={false}
			aria-hidden={alt === "" ? true : undefined}
			className={cn(
				"shrink-0 object-contain select-none",
				resolved.isCustomUrl && "rounded-[22%]",
				className,
			)}
		/>
	);
}
