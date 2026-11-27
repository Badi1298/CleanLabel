import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { FinalCtaSection } from "#/components/landing/final-cta-section";
import { HeroSection } from "#/components/landing/hero-section";
import { HowItWorksSection } from "#/components/landing/how-it-works-section";
import type { InfoModalTopic } from "#/components/landing/landing-data";
import { LandingFooter } from "#/components/landing/landing-footer";
import { LandingHeader } from "#/components/landing/landing-header";
import { LandingInfoDialog } from "#/components/landing/landing-info-dialog";
import { ReviewsSection } from "#/components/landing/reviews-section";
import { WhySection } from "#/components/landing/why-section";
import { isStandalonePwa, usePwaInstall } from "#/lib/pwa-install";
import { m } from "#/paraglide/messages.js";
import { getSession } from "#/server/auth-functions";

export const Route = createFileRoute("/landing")({
	beforeLoad: () => {
		if (typeof window !== "undefined" && isStandalonePwa()) {
			throw redirect({ to: "/", replace: true });
		}
	},
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
				title: m.landing_meta_title(),
			},
			{
				name: "description",
				content: m.landing_meta_description(),
			},
		],
		scripts: [
			{
				children:
					"try{if(window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true){window.location.replace('/');}}catch{}",
			},
		],
	}),
	component: LandingPage,
});

function LandingPage() {
	const { isSignedIn } = Route.useLoaderData();
	const { isStandalone } = usePwaInstall();
	const navigate = useNavigate();

	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);
	const heroHeadingId = useId();

	useEffect(() => {
		if (isStandalone) {
			navigate({ to: "/", replace: true });
		}
	}, [isStandalone, navigate]);

	if (isStandalone) {
		return null;
	}

	return (
		<div
			id="top"
			className="min-h-screen flex flex-col bg-background text-foreground"
		>
			<a
				href={`#${heroHeadingId}`}
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#1B4332] focus:text-[#FCE8C6] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
			>
				{m.common_skip_to_content()}
			</a>

			<LandingHeader isSignedIn={isSignedIn} />

			<main className="flex-1">
				<HeroSection heroHeadingId={heroHeadingId} isSignedIn={isSignedIn} />
				<HowItWorksSection />
				<WhySection />
				<ReviewsSection />
				<FinalCtaSection isSignedIn={isSignedIn} />
			</main>

			<LandingFooter isSignedIn={isSignedIn} onOpenInfoModal={setModalTopic} />

			<LandingInfoDialog
				topic={modalTopic}
				isSignedIn={isSignedIn}
				onSelectTopic={setModalTopic}
				onClose={() => setModalTopic(null)}
			/>
		</div>
	);
}
