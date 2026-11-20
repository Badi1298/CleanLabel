import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { FinalCtaSection } from "#/components/landing/final-cta-section";
import { HeroSection } from "#/components/landing/hero-section";
import { HowItWorksSection } from "#/components/landing/how-it-works-section";
import type { InfoModalTopic } from "#/components/landing/landing-data";
import { LandingFooter } from "#/components/landing/landing-footer";
import { LandingHeader } from "#/components/landing/landing-header";
import { LandingInfoDialog } from "#/components/landing/landing-info-dialog";
import { ReviewsSection } from "#/components/landing/reviews-section";
import { WhySection } from "#/components/landing/why-section";
import { getSession } from "#/server/auth-functions";

export const Route = createFileRoute("/landing")({
	loader: async () => {
		try {
			const session = await getSession();
			return { isSignedIn: Boolean(session?.user) };
		} catch {
			return { isSignedIn: false };
		}
	},
	gcTime: 0,
	preloadGcTime: 0,
	preloadStaleTime: 5_000,
	head: () => ({
		meta: [
			{
				title:
					"PickItWell — Produse alimentare selectate după aditivii marcați pe etichetă",
			},
			{
				name: "description",
				content:
					"PickItWell selectează produse alimentare cu puțini aditivi marcați pe etichetă, le grupează în Gold, Silver sau Bronze și îți arată în ce magazine au fost găsite.",
			},
		],
	}),
	component: LandingPage,
});

function LandingPage() {
	const { isSignedIn } = Route.useLoaderData();

	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);
	const heroHeadingId = useId();

	return (
		<div
			lang="ro"
			id="top"
			className="min-h-screen flex flex-col bg-background text-foreground"
		>
			<a
				href={`#${heroHeadingId}`}
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#1B4332] focus:text-[#FCE8C6] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
			>
				Sari la conținut
			</a>

			<LandingHeader isSignedIn={isSignedIn} />

			<main className="flex-1">
				<HeroSection heroHeadingId={heroHeadingId} isSignedIn={isSignedIn} />
				<HowItWorksSection />
				<WhySection />
				<ReviewsSection />
				<FinalCtaSection isSignedIn={isSignedIn} />
			</main>

			<LandingFooter onOpenInfoModal={setModalTopic} />

			<LandingInfoDialog
				topic={modalTopic}
				isSignedIn={isSignedIn}
				onSelectTopic={setModalTopic}
				onClose={() => setModalTopic(null)}
			/>
		</div>
	);
}
