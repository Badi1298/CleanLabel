import type { ComponentType, SVGProps } from "react";
import type { CategoryIconKey } from "#/components/categories/category-icon";
import { FacebookIcon, InstagramIcon } from "#/components/ui/social-icons";

export type StepId = "cauta" | "vezi" | "alege";
export type WhyIconKey = "criterii" | "grupe" | "magazine" | "alegere";

export const LEGAL_LAST_UPDATED_DATE = "20 noiembrie 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-11-20";
// TODO: Replace [x] with client-confirmed number of working days for methodology contestations
export const METHODOLOGY_REVIEW_SLA_DAYS = "[x]";
// TODO: Replace [e-mail] with client support email address
export const SUPPORT_EMAIL = "[e-mail]";

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

export const FOOTER_EXPLORE_LINKS = [
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
] as const;

export const HERO_STORES = ["Kaufland", "Mega Image", "Lidl"] as const;

export const HERO_TIER_EXAMPLES = [
	{
		score: "gold",
		name: "Ovăz integral bio",
		additives: "0 aditivi marcați",
	},
	{
		score: "silver",
		name: "Crackers cu semințe",
		additives: "1–2 aditivi marcați",
	},
	{
		score: "bronze",
		name: "Sos pesto clasic",
		additives: "3–4 aditivi marcați",
	},
] as const;

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
	iconKey: WhyIconKey;
	hasMethodologyLink: boolean;
}> = [
	{
		id: "criterii",
		title: "Selecție după criterii clare",
		description:
			"Alegem produsele după aditivii marcați pe etichetă, așa cum facem cumpărăturile pentru familia noastră.",
		iconKey: "criterii",
		hasMethodologyLink: true,
	},
	{
		id: "grupe",
		title: "Grupe ușor de urmărit",
		description:
			"Gold, Silver sau Bronze, în funcție de numărul de aditivi marcați pe etichetă.",
		iconKey: "grupe",
		hasMethodologyLink: false,
	},
	{
		id: "magazine",
		title: "Vezi unde au fost găsite",
		description: "Afli în ce magazine a fost găsit fiecare produs.",
		iconKey: "magazine",
		hasMethodologyLink: false,
	},
	{
		id: "alegere",
		title: "Alegerea îți aparține",
		description:
			"Consulți ingredientele declarate de producător și alternativele din aceeași categorie.",
		iconKey: "alegere",
		hasMethodologyLink: false,
	},
];

// TODO: Replace placeholder reviews with real user testimonials from Gabi
export const REVIEWS = [
	{
		id: "elena",
		name: "Elena",
		rating: 5,
		text: "Stăteam mereu cu lupa pe etichetele de la raionul de iaurturi și sosuri. Acum deschid aplicația din drum spre magazin, văd din prima câți aditivi are produsul și știu ce pun în coș.",
	},
	{
		id: "andrei",
		name: "Andrei",
		rating: 5,
		text: "Cel mai util lucru pentru mine e că văd direct în ce supermarket a fost găsit produsul. Când nu găsesc o variantă Gold, am imediat alternative curate din aceeași categorie.",
	},
	{
		id: "ioana",
		name: "Ioana",
		rating: 5,
		text: "Apreciez că nu încearcă să-ți spună ce e bun sau rău, ci îți arată clar lista de ingrediente și aditivii marcați. Economisesc mult timp la cumpărăturile pentru cei mici.",
	},
] as const;

// TODO: Add WhatsApp community link once URL is provided by client
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
	{ kind: "route", to: "/metodologie", label: "Cum selectăm" },
	{ kind: "route", to: "/disclaimer", label: "Declinarea răspunderii" },
	{
		kind: "modal",
		topicId: "confidentialitate",
		label: "Politica de confidențialitate",
	},
	{ kind: "modal", topicId: "termeni", label: "Termeni și condiții" },
	{ kind: "modal", topicId: "cookies", label: "Politica de cookie-uri" },
];
