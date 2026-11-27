import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { InfoModalTopic } from "#/components/landing/landing-data";
import {
	LandingLegalLayout,
	LegalSection,
	type LegalSectionTocItem,
} from "#/components/landing/landing-legal-layout";
import { m } from "#/paraglide/messages.js";
import { getSession } from "#/server/auth-functions";

function getDisclaimerToc(): readonly LegalSectionTocItem[] {
	return [
		{ id: "natura-informatiei", number: 1, title: m.disclaimer_s1_title() },
		{ id: "fara-recomandare", number: 2, title: m.disclaimer_s2_title() },
		{ id: "fara-consultanta", number: 3, title: m.disclaimer_s3_title() },
		{ id: "acuratete-si-limite", number: 4, title: m.disclaimer_s4_title() },
		{
			id: "disponibilitate-magazine",
			number: 5,
			title: m.disclaimer_s5_title(),
		},
		{ id: "neutralitate-branduri", number: 6, title: m.disclaimer_s6_title() },
		{ id: "limitarea-raspunderii", number: 7, title: m.disclaimer_s7_title() },
		{
			id: "proprietate-intelectuala",
			number: 8,
			title: m.disclaimer_s8_title(),
		},
		{ id: "acceptarea-termenilor", number: 9, title: m.disclaimer_s9_title() },
	];
}

export const Route = createFileRoute("/disclaimer")({
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
				title: m.disclaimer_meta_title(),
			},
			{
				name: "description",
				content: m.disclaimer_meta_description(),
			},
		],
	}),
	component: DisclaimerPage,
});

function DisclaimerPage() {
	const { isSignedIn } = Route.useLoaderData();
	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);
	const tocItems = getDisclaimerToc();

	return (
		<LandingLegalLayout
			isSignedIn={isSignedIn}
			currentPath="/disclaimer"
			breadcrumbLabel={m.disclaimer_breadcrumb()}
			badgeLabel={m.disclaimer_badge()}
			title={m.disclaimer_title()}
			subtitle={m.disclaimer_subtitle()}
			companionLink={{
				to: "/metodologie",
				label: m.disclaimer_companion_label(),
				description: m.disclaimer_companion_desc(),
			}}
			tocItems={tocItems}
			modalTopic={modalTopic}
			onSelectModalTopic={setModalTopic}
		>
			<LegalSection
				id="natura-informatiei"
				number={1}
				title={m.disclaimer_s1_title()}
			>
				<p className="text-pretty">{m.disclaimer_s1_body()}</p>
			</LegalSection>

			<LegalSection
				id="fara-recomandare"
				number={2}
				title={m.disclaimer_s2_title()}
			>
				<p className="text-pretty">{m.disclaimer_s2_body()}</p>
			</LegalSection>

			<LegalSection
				id="fara-consultanta"
				number={3}
				title={m.disclaimer_s3_title()}
			>
				<p className="text-pretty">{m.disclaimer_s3_body()}</p>
			</LegalSection>

			<LegalSection
				id="acuratete-si-limite"
				number={4}
				title={m.disclaimer_s4_title()}
			>
				<p className="text-pretty">{m.disclaimer_s4_body()}</p>
			</LegalSection>

			<LegalSection
				id="disponibilitate-magazine"
				number={5}
				title={m.disclaimer_s5_title()}
			>
				<p className="text-pretty">{m.disclaimer_s5_body()}</p>
			</LegalSection>

			<LegalSection
				id="neutralitate-branduri"
				number={6}
				title={m.disclaimer_s6_title()}
			>
				<p className="text-pretty">
					{m.disclaimer_s6_body_prefix()}{" "}
					<Link
						to="/metodologie"
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						{m.disclaimer_s6_methodology_link()}
					</Link>
					{m.disclaimer_s6_body_mid()}{" "}
					<button
						type="button"
						onClick={() => setModalTopic("contact")}
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						{m.disclaimer_s6_contact_btn()}
					</button>
					{m.disclaimer_s6_body_suffix()}
				</p>
			</LegalSection>

			<LegalSection
				id="limitarea-raspunderii"
				number={7}
				title={m.disclaimer_s7_title()}
			>
				<p className="text-pretty">{m.disclaimer_s7_body()}</p>
			</LegalSection>

			<LegalSection
				id="proprietate-intelectuala"
				number={8}
				title={m.disclaimer_s8_title()}
			>
				<p className="text-pretty">{m.disclaimer_s8_body()}</p>
			</LegalSection>

			<LegalSection
				id="acceptarea-termenilor"
				number={9}
				title={m.disclaimer_s9_title()}
			>
				<p className="text-pretty">{m.disclaimer_s9_body()}</p>
			</LegalSection>
		</LandingLegalLayout>
	);
}
