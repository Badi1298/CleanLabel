import type { ComponentType, SVGProps } from "react";
import demoBronzeProduct from "#/assets/demo/demo-bronze-product.jpeg";
import demoGoldProduct from "#/assets/demo/demo-gold-product.jpeg";
import demoSilverProduct from "#/assets/demo/demo-silver-product.jpeg";
import type { CategoryIconKey } from "#/components/categories/category-icon";
import { FacebookIcon, InstagramIcon } from "#/components/ui/social-icons";
import { formatLocalizedDate } from "#/lib/i18n";
import { m } from "#/paraglide/messages.js";

export type StepId = "cauta" | "vezi" | "alege";
export type WhyIconKey = "criterii" | "grupe" | "magazine" | "alegere";

export const LEGAL_LAST_UPDATED_ISO = "2026-11-20";
// TODO: Replace [x] with client-confirmed number of working days for methodology contestations
export const METHODOLOGY_REVIEW_SLA_DAYS = "[x]";
// TODO: Replace [e-mail] with client support email address
export const SUPPORT_EMAIL = "[e-mail]";

export function getLegalLastUpdatedDate(): string {
	return formatLocalizedDate(LEGAL_LAST_UPDATED_ISO, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export type InfoModalTopic =
	| "raporteaza"
	| "contact"
	| "confidentialitate"
	| "termeni"
	| "cookies";

export function getHeaderLinks() {
	return [
		{
			href: "#cum-functioneaza",
			hash: "cum-functioneaza",
			label: m.landing_nav_how_it_works(),
		},
		{
			href: "#de-ce-pickitwell",
			hash: "de-ce-pickitwell",
			label: m.landing_nav_why(),
		},
		{ href: "#recenzii", hash: "recenzii", label: m.landing_nav_reviews() },
	] as const;
}

export function getFooterExploreLinks() {
	return [
		{
			href: "#cum-functioneaza",
			hash: "cum-functioneaza",
			label: m.landing_nav_how_it_works(),
		},
		{
			href: "#de-ce-pickitwell",
			hash: "de-ce-pickitwell",
			label: m.landing_nav_why(),
		},
	] as const;
}

export const HERO_STORES = [
	"Carrefour",
	"Kaufland",
	"Mega Image",
	"Auchan",
] as const;

export interface HeroDemoProduct {
	id: string;
	brand: string;
	name: string;
	score: "gold" | "silver" | "bronze";
	additivesLabel: string;
	stores: readonly string[];
	categoryIconKey: CategoryIconKey;
	categoryLabel?: string;
	imageUrl?: string;
	ingredients?: string;
	updatedAt?: string;
	checkedDate?: string;
	submittedBy?: string;
	isFavorited?: boolean;
}

export interface HeroDemoCategory {
	iconKey: CategoryIconKey;
	label: string;
}

export function getHeroDemoData(): {
	featuredProduct: HeroDemoProduct;
	secondaryProducts: readonly HeroDemoProduct[];
	quickCategories: readonly HeroDemoCategory[];
} {
	return {
		featuredProduct: {
			id: "daucy-chickpeas",
			brand: "d'aucy",
			name: m.landing_hero_demo_gold_name(),
			score: "gold",
			additivesLabel: m.common_additives_marked_count({ count: 0 }),
			stores: HERO_STORES,
			categoryIconKey: "conserve-mancaruri-gata",
			categoryLabel: m.landing_cat_canned(),
			imageUrl: demoGoldProduct,
			ingredients: m.landing_hero_demo_gold_ingredients(),
			updatedAt: m.landing_hero_demo_gold_updated_at(),
			checkedDate: m.landing_hero_demo_gold_checked_date(),
			submittedBy: "PickItWell",
			isFavorited: true,
		},
		secondaryProducts: [
			{
				id: "maxims-butter-beans",
				brand: "Maxim's",
				name: m.landing_hero_demo_silver_name(),
				score: "silver",
				additivesLabel: m.landing_tier_example_silver_additives(),
				stores: ["Carrefour", "Lidl"],
				categoryIconKey: "conserve-mancaruri-gata",
				imageUrl: demoSilverProduct,
			},
			{
				id: "sultanel-ginger-mustard",
				brand: "Sultanel",
				name: m.landing_hero_demo_bronze_name(),
				score: "bronze",
				additivesLabel: m.landing_tier_example_bronze_additives(),
				stores: ["Kaufland", "Mega Image"],
				categoryIconKey: "sosuri-tartinabile",
				imageUrl: demoBronzeProduct,
			},
		],
		quickCategories: [
			{
				iconKey: "conserve-mancaruri-gata",
				label: m.landing_cat_canned(),
			},
			{
				iconKey: "lactate-alternative",
				label: m.landing_cat_dairy(),
			},
			{
				iconKey: "gustari-dulciuri",
				label: m.landing_cat_snacks(),
			},
			{
				iconKey: "sosuri-tartinabile",
				label: m.landing_cat_sauces(),
			},
		],
	};
}

export const SAMPLE_STORES = [
	"Kaufland",
	"Lidl",
	"Mega Image",
	"Carrefour",
] as const;

export function getCatalogCategories(): Array<{
	name: string;
	subcategoriesCount: number;
	iconKey: CategoryIconKey;
}> {
	return [
		{
			name: m.landing_cat_cereals(),
			subcategoriesCount: 4,
			iconKey: "cereale-paste-panificatie",
		},
		{
			name: m.landing_cat_dairy(),
			subcategoriesCount: 4,
			iconKey: "lactate-alternative",
		},
		{
			name: m.landing_cat_sauces(),
			subcategoriesCount: 4,
			iconKey: "sosuri-tartinabile",
		},
		{
			name: m.landing_cat_snacks(),
			subcategoriesCount: 6,
			iconKey: "gustari-dulciuri",
		},
		{
			name: m.landing_cat_beverages(),
			subcategoriesCount: 4,
			iconKey: "bauturi",
		},
		{
			name: m.landing_cat_cooking(),
			subcategoriesCount: 4,
			iconKey: "ingrediente-gatit",
		},
		{
			name: m.landing_cat_canned(),
			subcategoriesCount: 2,
			iconKey: "conserve-mancaruri-gata",
		},
		{
			name: m.landing_cat_meat(),
			subcategoriesCount: 2,
			iconKey: "carne-mezeluri",
		},
		{
			name: m.landing_cat_baby(),
			subcategoriesCount: 2,
			iconKey: "alimente-copii",
		},
	];
}

export function getStepItems(): Array<{
	id: StepId;
	tabLabel: string;
	stepTitle: string;
	description: string;
	note?: string;
}> {
	return [
		{
			id: "cauta",
			tabLabel: m.landing_step1_tab(),
			stepTitle: m.landing_step1_title(),
			description: m.landing_step1_description(),
		},
		{
			id: "vezi",
			tabLabel: m.landing_step2_tab(),
			stepTitle: m.landing_step2_title(),
			description: m.landing_step2_description(),
			note: m.landing_step2_note(),
		},
		{
			id: "alege",
			tabLabel: m.landing_step3_tab(),
			stepTitle: m.landing_step3_title(),
			description: m.landing_step3_description(),
			note: m.landing_step3_note(),
		},
	];
}

export function getWhyCards(): Array<{
	id: string;
	title: string;
	description: string;
	iconKey: WhyIconKey;
	hasMethodologyLink: boolean;
}> {
	return [
		{
			id: "criterii",
			title: m.landing_why_card1_title(),
			description: m.landing_why_card1_desc(),
			iconKey: "criterii",
			hasMethodologyLink: true,
		},
		{
			id: "grupe",
			title: m.landing_why_card2_title(),
			description: m.landing_why_card2_desc(),
			iconKey: "grupe",
			hasMethodologyLink: false,
		},
		{
			id: "magazine",
			title: m.landing_why_card3_title(),
			description: m.landing_why_card3_desc(),
			iconKey: "magazine",
			hasMethodologyLink: false,
		},
		{
			id: "alegere",
			title: m.landing_why_card4_title(),
			description: m.landing_why_card4_desc(),
			iconKey: "alegere",
			hasMethodologyLink: false,
		},
	];
}

// TODO: Replace placeholder reviews with real user testimonials from Gabi
export function getReviews() {
	return [
		{
			id: "elena",
			name: "Elena",
			rating: 5,
			text: m.landing_review1_text(),
		},
		{
			id: "andrei",
			name: "Andrei",
			rating: 5,
			text: m.landing_review2_text(),
		},
		{
			id: "ioana",
			name: "Ioana",
			rating: 5,
			text: m.landing_review3_text(),
		},
	] as const;
}

// TODO: Add WhatsApp community link once URL is provided by client
export function getSocialLinks(): Array<{
	id: string;
	label: string;
	href: string;
	Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> {
	return [
		{
			id: "instagram",
			label: m.landing_social_instagram(),
			href: "https://www.instagram.com/pickitwell?obrf=bDU5MWdqY3VjaTE4",
			Icon: InstagramIcon,
		},
		{
			id: "fb-group",
			label: m.landing_social_fb_group(),
			href: "https://www.facebook.com/groups/773704136519369",
			Icon: FacebookIcon,
		},
		{
			id: "fb-page",
			label: m.landing_social_fb_page(),
			href: "https://www.facebook.com/profile.php?id=61595898309388",
			Icon: FacebookIcon,
		},
	];
}

export interface InfoModalTopicConfig {
	id: InfoModalTopic;
	shortLabel: string;
	footerLabel: string;
	title: string;
	description: string;
}

export function getInfoModalTopics(): readonly InfoModalTopicConfig[] {
	return [
		{
			id: "raporteaza",
			shortLabel: m.landing_modal_report_label(),
			footerLabel: m.landing_modal_report_label(),
			title: m.landing_modal_report_title(),
			description: m.landing_modal_report_desc(),
		},
		{
			id: "contact",
			shortLabel: m.landing_modal_contact_label(),
			footerLabel: m.landing_modal_contact_label(),
			title: m.landing_modal_contact_title(),
			description: m.landing_modal_contact_desc(),
		},
		{
			id: "confidentialitate",
			shortLabel: m.landing_modal_privacy_short(),
			footerLabel: m.landing_modal_privacy_label(),
			title: m.landing_modal_privacy_label(),
			description: m.landing_modal_privacy_desc(),
		},
		{
			id: "termeni",
			shortLabel: m.landing_modal_terms_label(),
			footerLabel: m.landing_modal_terms_label(),
			title: m.landing_modal_terms_label(),
			description: m.landing_modal_terms_desc(),
		},
		{
			id: "cookies",
			shortLabel: m.landing_modal_cookies_label(),
			footerLabel: m.landing_modal_cookies_label(),
			title: m.landing_modal_cookies_label(),
			description: m.landing_modal_cookies_desc(),
		},
	];
}

export function getInfoModalTopicMap(): Record<
	InfoModalTopic,
	InfoModalTopicConfig
> {
	const topics = getInfoModalTopics();
	return {
		raporteaza: topics[0],
		contact: topics[1],
		confidentialitate: topics[2],
		termeni: topics[3],
		cookies: topics[4],
	};
}

export type FooterLegalLink =
	| { kind: "modal"; topicId: InfoModalTopic; label: string }
	| { kind: "route"; to: "/metodologie" | "/disclaimer"; label: string };

export function getFooterLegalLinks(): readonly FooterLegalLink[] {
	return [
		{
			kind: "modal",
			topicId: "contact",
			label: m.landing_modal_contact_label(),
		},
		{
			kind: "modal",
			topicId: "raporteaza",
			label: m.landing_modal_report_label(),
		},
		{
			kind: "route",
			to: "/metodologie",
			label: m.landing_footer_how_we_select(),
		},
		{
			kind: "route",
			to: "/disclaimer",
			label: m.landing_footer_disclaimer(),
		},
		{
			kind: "modal",
			topicId: "confidentialitate",
			label: m.landing_modal_privacy_label(),
		},
		{ kind: "modal", topicId: "termeni", label: m.landing_modal_terms_label() },
		{
			kind: "modal",
			topicId: "cookies",
			label: m.landing_modal_cookies_label(),
		},
	];
}
