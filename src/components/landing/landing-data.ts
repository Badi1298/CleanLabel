import {
	Award,
	type LucideIcon,
	ShieldCheck,
	Sparkles,
	Store,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import productBreadImg from "#/assets/landing/product-bread.png";
import productCrackersImg from "#/assets/landing/product-crackers.png";
import productPestoImg from "#/assets/landing/product-pesto.png";
import productTomatoSauceImg from "#/assets/landing/product-tomato-sauce.png";
import productYogurtImg from "#/assets/landing/product-yogurt.png";
import type { CategoryIconKey } from "#/components/categories/category-icon";
import { FacebookIcon, InstagramIcon } from "#/components/ui/social-icons";

export type StepId = "cauta" | "vezi" | "alege";

export const LEGAL_LAST_UPDATED_DATE = "20 noiembrie 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-11-20";
export const METHODOLOGY_REVIEW_SLA_DAYS = "[x]";

export type InfoModalTopic =
	| "raporteaza"
	| "contact"
	| "confidentialitate"
	| "termeni"
	| "cookies";

export const HEADER_LINKS = [
	{
		href: "#cum-functioneaza",
		hash: "cum-functioneaza",
		label: "Cum funcționează",
	},
	{
		href: "#de-ce-pickitwell",
		hash: "de-ce-pickitwell",
		label: "De ce PickItWell?",
	},
	{ href: "#recenzii", hash: "recenzii", label: "Recenzii" },
] as const;

export const HERO_STORES = ["Kaufland", "Mega Image", "Lidl"] as const;

export const SAMPLE_STORES = [
	"Kaufland",
	"Lidl",
	"Mega Image",
	"Carrefour",
] as const;

export const CATALOG_CATEGORIES: Array<{
	name: string;
	subcategoriesCount: number;
	iconKey: CategoryIconKey;
}> = [
	{
		name: "Cereale, paste și panificație",
		subcategoriesCount: 4,
		iconKey: "cereale-paste-panificatie",
	},
	{
		name: "Lactate și alternative",
		subcategoriesCount: 4,
		iconKey: "lactate-alternative",
	},
	{
		name: "Sosuri și tartinabile",
		subcategoriesCount: 4,
		iconKey: "sosuri-tartinabile",
	},
	{
		name: "Gustări și dulciuri",
		subcategoriesCount: 6,
		iconKey: "gustari-dulciuri",
	},
	{
		name: "Băuturi",
		subcategoriesCount: 4,
		iconKey: "bauturi",
	},
	{
		name: "Ingrediente pentru gătit",
		subcategoriesCount: 4,
		iconKey: "ingrediente-gatit",
	},
	{
		name: "Conserve, Mâncăruri Semipreparate/Congelate",
		subcategoriesCount: 2,
		iconKey: "conserve-mancaruri-gata",
	},
	{
		name: "Carne și mezeluri",
		subcategoriesCount: 2,
		iconKey: "carne-mezeluri",
	},
	{
		name: "Alimente pentru copii",
		subcategoriesCount: 2,
		iconKey: "alimente-copii",
	},
];

export const STEP_ITEMS: Array<{
	id: StepId;
	tabLabel: string;
	stepTitle: string;
	description: string;
	note?: string;
}> = [
	{
		id: "cauta",
		tabLabel: "Caută",
		stepTitle: "Pasul 1 – Caută",
		description:
			"Caută un produs sau răsfoiește categoriile din catalogul PickItWell.",
	},
	{
		id: "vezi",
		tabLabel: "Vezi",
		stepTitle: "Pasul 2 – Vezi",
		description:
			"Vezi lista de ingrediente declarată de producător și grupa în care se află produsul: Gold, Silver sau Bronze, în funcție de numărul de ingrediente marcate pe etichetă ca aditivi.",
		note: "Grupa se bazează doar pe numărul de aditivi marcați pe etichetă. Nu este o evaluare a calității produsului.",
	},
	{
		id: "alege",
		tabLabel: "Alege",
		stepTitle: "Pasul 3 – Alege",
		description:
			"Vezi în ce magazine a fost găsit produsul și, dacă vrei, alternative din aceeași categorie. Decizia îți aparține.",
		note: "Magazinele indicate sunt cele în care produsul a fost găsit. Disponibilitatea în stoc nu este verificată.",
	},
];

export const WHY_CARDS: Array<{
	id: string;
	title: string;
	description: string;
	Icon: LucideIcon;
	hasMethodologyLink: boolean;
}> = [
	{
		id: "criterii",
		title: "Selecție după criterii clare",
		description:
			"Alegem produsele după aditivii marcați pe etichetă, așa cum facem cumpărăturile pentru familia noastră.",
		Icon: ShieldCheck,
		hasMethodologyLink: true,
	},
	{
		id: "grupe",
		title: "Grupe ușor de urmărit",
		description:
			"Gold, Silver sau Bronze, în funcție de numărul de aditivi marcați pe etichetă.",
		Icon: Award,
		hasMethodologyLink: false,
	},
	{
		id: "magazine",
		title: "Vezi unde au fost găsite",
		description: "Afli în ce magazine a fost găsit fiecare produs.",
		Icon: Store,
		hasMethodologyLink: false,
	},
	{
		id: "alegere",
		title: "Alegerea îți aparține",
		description:
			"Consulți ingredientele declarate de producător și alternativele din aceeași categorie.",
		Icon: Sparkles,
		hasMethodologyLink: false,
	},
];

export const REVIEWS = [
	{
		id: "elena",
		name: "Elena",
		rating: 5,
		text: "De când folosesc PickItWell, cumpărăturile săptămânale durează mult mai puțin. Văd imediat grupa produsului și lista de aditivi marcați pe etichetă, fără să stau să descifrez scrisul minuscul la raft.",
	},
	{
		id: "andrei",
		name: "Andrei",
		rating: 5,
		text: "Îmi place foarte mult că pot verifica rapid în ce supermarketuri a fost găsit un produs și ce alternative există în aceeași categorie. Este exact instrumentul simplu de care aveam nevoie pentru familie.",
	},
	{
		id: "ioana",
		name: "Ioana",
		rating: 5,
		text: "Transparența m-a convins din prima zi: vezi exact ingredientele declarate de producător și poți compara ușor produsele între ele. Economisesc timp și iau decizii mai informate la fiecare vizită în magazin.",
	},
] as const;

export const SOCIAL_LINKS: Array<{
	id: string;
	label: string;
	href: string;
	Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
	{
		id: "instagram",
		label: "Cont Instagram",
		href: "https://www.instagram.com/pickitwell?obrf=bDU5MWdqY3VjaTE4",
		Icon: InstagramIcon,
	},
	{
		id: "fb-group",
		label: "Grup Facebook membri",
		href: "https://www.facebook.com/groups/773704136519369",
		Icon: FacebookIcon,
	},
	{
		id: "fb-page",
		label: "Pagină Facebook",
		href: "https://www.facebook.com/profile.php?id=61595898309388",
		Icon: FacebookIcon,
	},
];

export interface InfoModalTopicConfig {
	id: InfoModalTopic;
	shortLabel: string;
	footerLabel: string;
	title: string;
	description: string;
}

export const INFO_MODAL_TOPICS: readonly InfoModalTopicConfig[] = [
	{
		id: "raporteaza",
		shortLabel: "Raportează o greșeală",
		footerLabel: "Raportează o greșeală",
		title: "Raportează o greșeală",
		description:
			"Cum poți semnala modificări de rețetă sau informații inexacte direct din pagina produsului în aplicația PickItWell.",
	},
	{
		id: "contact",
		shortLabel: "Contact",
		footerLabel: "Contact",
		title: "Contact și comunitate PickItWell",
		description: "Canalele oficiale de contact și comunitate PickItWell.",
	},
	{
		id: "confidentialitate",
		shortLabel: "Confidențialitate",
		footerLabel: "Politica de confidențialitate",
		title: "Politica de confidențialitate",
		description:
			"Modul în care PickItWell colectează și gestionează datele contului.",
	},
	{
		id: "termeni",
		shortLabel: "Termeni și condiții",
		footerLabel: "Termeni și condiții",
		title: "Termeni și condiții",
		description:
			"Condițiile de utilizare a aplicației și a datelor orientative.",
	},
	{
		id: "cookies",
		shortLabel: "Politica de cookie-uri",
		footerLabel: "Politica de cookie-uri",
		title: "Politica de cookie-uri",
		description:
			"Detalii despre cookie-urile strict necesare utilizate de PickItWell.",
	},
];

export const INFO_MODAL_TOPIC_MAP: Record<
	InfoModalTopic,
	InfoModalTopicConfig
> = {
	raporteaza: INFO_MODAL_TOPICS[0],
	contact: INFO_MODAL_TOPICS[1],
	confidentialitate: INFO_MODAL_TOPICS[2],
	termeni: INFO_MODAL_TOPICS[3],
	cookies: INFO_MODAL_TOPICS[4],
};

export type FooterLegalLink =
	| { kind: "modal"; topicId: InfoModalTopic; label: string }
	| { kind: "route"; to: "/metodologie" | "/disclaimer"; label: string };

export const FOOTER_LEGAL_LINKS: readonly FooterLegalLink[] = [
	{ kind: "modal", topicId: "contact", label: "Contact" },
	{ kind: "modal", topicId: "raporteaza", label: "Raportează o greșeală" },
	{ kind: "route", to: "/metodologie", label: "Metodologie" },
	{ kind: "route", to: "/disclaimer", label: "Disclaimer" },
	{
		kind: "modal",
		topicId: "confidentialitate",
		label: "Politica de confidențialitate",
	},
	{ kind: "modal", topicId: "termeni", label: "Termeni și condiții" },
	{ kind: "modal", topicId: "cookies", label: "Politica de cookie-uri" },
];

export type HeroTier = "gold" | "silver" | "bronze";

export interface HeroTierPreview {
	score: HeroTier;
	cardTitle: string;
	cardSubtitle: string;
	brand: string;
	productName: string;
	additiveBadge: string;
	ingredients: string;
	highlightedAdditives: string[];
	checkedDate: string;
	stores: readonly string[];
	image: string;
	imageAlt: string;
}

export const HERO_TIER_PREVIEWS: readonly HeroTierPreview[] = [
	{
		score: "gold",
		cardTitle: "Iaurt Grecesc 10%",
		cardSubtitle: "0 aditivi marcați",
		brand: "Olympus",
		productName: "Iaurt Grecesc Străvechi 10%",
		additiveBadge: "0 aditivi marcați",
		ingredients:
			"Lapte de vacă pasteurizat, smântână din lapte de vacă, culturi lactice selecționate.",
		highlightedAdditives: [],
		checkedDate: "18.11.2026",
		stores: HERO_STORES,
		image: productYogurtImg,
		imageAlt: "Iaurt Grecesc Străvechi 10%",
	},
	{
		score: "silver",
		cardTitle: "Crackers cu semințe",
		cardSubtitle: "1–2 aditivi marcați",
		brand: "Artizan Pan",
		productName: "Crackers cu semințe",
		additiveBadge: "2 aditivi marcați",
		ingredients:
			"Făină integrală de grâu, semințe de in (12%), susan, ulei de floarea-soarelui, sare de mare, agent de afânare: carbonat acid de sodiu (E500), antioxidant: extract bogat în tocoferol (E306).",
		highlightedAdditives: [
			"agent de afânare: carbonat acid de sodiu (E500)",
			"antioxidant: extract bogat în tocoferol (E306)",
		],
		checkedDate: "18.11.2026",
		stores: ["Mega Image", "Carrefour"],
		image: productCrackersImg,
		imageAlt: "Crackers cu semințe",
	},
	{
		score: "bronze",
		cardTitle: "Sos pesto clasic",
		cardSubtitle: "3–4 aditivi marcați",
		brand: "Delicii Italiene",
		productName: "Sos pesto clasic",
		additiveBadge: "3 aditivi marcați",
		ingredients:
			"Ulei de floarea-soarelui, busuioc (32%), caju, brânză dură, sare, corector de aciditate: acid lactic (E270), stabilizator: gumă xantan (E415), antioxidant: acid ascorbic (E300).",
		highlightedAdditives: [
			"corector de aciditate: acid lactic (E270)",
			"stabilizator: gumă xantan (E415)",
			"antioxidant: acid ascorbic (E300)",
		],
		checkedDate: "18.11.2026",
		stores: ["Kaufland", "Lidl", "Carrefour"],
		image: productPestoImg,
		imageAlt: "Sos pesto clasic",
	},
] as const;

export interface CategoryDemoProduct {
	name: string;
	score: "gold" | "silver";
	additivesLabel: string;
}

export const CATEGORY_DEMO_PRODUCTS: Record<
	CategoryIconKey,
	readonly [CategoryDemoProduct, CategoryDemoProduct]
> = {
	"cereale-paste-panificatie": [
		{
			name: "Ovăz integral bio",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Pâine integrală cu semințe",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
	"lactate-alternative": [
		{
			name: "Iaurt Grecesc Străvechi 10%",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Chefir tradițional",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
	],
	"sosuri-tartinabile": [
		{
			name: "Passata rustică bio",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Sos de roșii cu busuioc",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
	"gustari-dulciuri": [
		{
			name: "Migdale crude naturale",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Crackers cu semințe",
			score: "silver",
			additivesLabel: "2 aditivi marcați",
		},
	],
	bauturi: [
		{
			name: "Suc presat la rece de mere",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Ceai verde infuzat",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
	"ingrediente-gatit": [
		{
			name: "Ulei de măsline extravirgin",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Oțet balsamic de Modena",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
	"conserve-mancaruri-gata": [
		{
			name: "Năut fiert la borcan",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Fasole roșie conservă",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
	"carne-mezeluri": [
		{
			name: "Piept de curcan copt lent",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
		{
			name: "Cârnați proaspeți de porc",
			score: "silver",
			additivesLabel: "2 aditivi marcați",
		},
	],
	"alimente-copii": [
		{
			name: "Piure de mere și pere bio",
			score: "gold",
			additivesLabel: "0 aditivi marcați",
		},
		{
			name: "Biscuiți cu ovăz pentru copii",
			score: "silver",
			additivesLabel: "1 aditiv marcat",
		},
	],
};

export const STEP_INSPECT_PRODUCT = {
	name: "Sos de roșii cu busuioc",
	score: "silver" as const,
	additiveBadge: "1 aditiv marcat",
	ingredients:
		"Roșii (84%), ceapă, ulei de măsline extravirgin, busuioc (2%), sare de mare, zahăr, corector de aciditate: acid citric (E330).",
	highlightedAdditives: ["corector de aciditate: acid citric (E330)"],
	checkedDate: "18.11.2026",
	image: productTomatoSauceImg,
} as const;

export interface StepAlternativeItem {
	id: string;
	name: string;
	score: "gold";
	additivesLabel: string;
	stores: readonly string[];
	image: string;
}

export const STEP_CHOOSE_ALTERNATIVES: readonly StepAlternativeItem[] = [
	{
		id: "passata-bio",
		name: "Passata rustică bio",
		score: "gold",
		additivesLabel: "0 aditivi marcați",
		stores: ["Kaufland", "Mega Image", "Carrefour"],
		image: productTomatoSauceImg,
	},
	{
		id: "sos-clasic",
		name: "Sos clasic de roșii",
		score: "gold",
		additivesLabel: "0 aditivi marcați",
		stores: ["Lidl", "Kaufland"],
		image: productTomatoSauceImg,
	},
] as const;

export const FINAL_CTA_PRODUCT = {
	name: "Pâine integrală cu semințe",
	score: "silver" as const,
	ingredients:
		"Făină integrală de grâu, apă, semințe de floarea-soarelui, drojdie, sare, acid ascorbic (E300).",
	highlightedAdditives: ["acid ascorbic (E300)"],
	additiveLabel: "1 aditiv marcat",
	checkedDate: "18.11.2026",
	image: productBreadImg,
} as const;
