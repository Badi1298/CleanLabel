import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
	type InfoModalTopic,
	METHODOLOGY_REVIEW_SLA_DAYS,
} from "#/components/landing/landing-data";
import {
	LandingLegalLayout,
	LegalSection,
	type LegalSectionTocItem,
} from "#/components/landing/landing-legal-layout";
import { ScoreBadge } from "#/components/ui/score-badge";
import { m } from "#/paraglide/messages.js";
import { getSession } from "#/server/auth-functions";

function getMetodologieToc(): readonly LegalSectionTocItem[] {
	return [
		{ id: "scopul-documentului", number: 1, title: m.methodology_s1_title() },
		{
			id: "criteriul-de-clasificare",
			number: 2,
			title: m.methodology_s2_title(),
		},
		{ id: "definitia-aditiv", number: 3, title: m.methodology_s3_title() },
		{
			id: "nivelurile-de-clasificare",
			number: 4,
			title: m.methodology_s4_title(),
		},
		{ id: "sursa-datelor", number: 5, title: m.methodology_s5_title() },
		{
			id: "frecventa-de-reverificare",
			number: 6,
			title: m.methodology_s6_title(),
		},
		{ id: "ce-nu-acopera", number: 7, title: m.methodology_s7_title() },
		{
			id: "procedura-de-contestare",
			number: 8,
			title: m.methodology_s8_title(),
		},
		{
			id: "independenta-metodologiei",
			number: 9,
			title: m.methodology_s9_title(),
		},
		{
			id: "actualizarea-metodologiei",
			number: 10,
			title: m.methodology_s10_title(),
		},
	];
}

function getClassificationLevels() {
	return [
		{ score: "gold", description: m.methodology_tier_gold_desc() },
		{ score: "silver", description: m.methodology_tier_silver_desc() },
		{ score: "bronze", description: m.methodology_tier_bronze_desc() },
	] as const;
}

function getMethodologyExclusions() {
	return [
		m.methodology_s7_ex1(),
		m.methodology_s7_ex2(),
		m.methodology_s7_ex3(),
		m.methodology_s7_ex4(),
	] as const;
}

const legalSearchSchema = z.object({
	from: z.enum(["profile"]).optional(),
});

export const Route = createFileRoute("/metodologie")({
	validateSearch: legalSearchSchema,
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
				title: m.methodology_meta_title(),
			},
			{
				name: "description",
				content: m.methodology_meta_description(),
			},
		],
	}),
	component: MetodologiePage,
});

function MetodologiePage() {
	const { isSignedIn } = Route.useLoaderData();
	const { from } = Route.useSearch();
	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);
	const tocItems = getMetodologieToc();
	const classificationLevels = getClassificationLevels();
	const methodologyExclusions = getMethodologyExclusions();

	return (
		<LandingLegalLayout
			isSignedIn={isSignedIn}
			from={from}
			currentPath="/metodologie"
			breadcrumbLabel={m.methodology_breadcrumb()}
			badgeLabel={m.methodology_badge()}
			title={m.methodology_title()}
			subtitle={m.methodology_subtitle()}
			companionLink={{
				to: "/disclaimer",
				label: m.methodology_companion_label(),
				description: m.methodology_companion_desc(),
			}}
			tocItems={tocItems}
			modalTopic={modalTopic}
			onSelectModalTopic={setModalTopic}
		>
			<LegalSection
				id="scopul-documentului"
				number={1}
				title={m.methodology_s1_title()}
			>
				<p className="text-pretty">{m.methodology_s1_body()}</p>
			</LegalSection>

			<LegalSection
				id="criteriul-de-clasificare"
				number={2}
				title={m.methodology_s2_title()}
			>
				<p className="text-pretty">{m.methodology_s2_body()}</p>
			</LegalSection>

			<LegalSection
				id="definitia-aditiv"
				number={3}
				title={m.methodology_s3_title()}
			>
				<p className="text-pretty">{m.methodology_s3_body()}</p>
			</LegalSection>

			<LegalSection
				id="nivelurile-de-clasificare"
				number={4}
				title={m.methodology_s4_title()}
			>
				<div className="overflow-x-auto rounded-2xl border border-border bg-background dark:bg-[#121D17]">
					<table className="w-full border-collapse text-left text-sm">
						<caption className="sr-only">
							{m.methodology_table_caption()}
						</caption>
						<thead>
							<tr className="border-b border-border bg-sidebar">
								<th
									scope="col"
									className="px-4 py-3 text-xs font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
								>
									{m.methodology_table_col_level()}
								</th>
								<th
									scope="col"
									className="px-4 py-3 text-xs font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
								>
									{m.methodology_table_col_count()}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{classificationLevels.map((tier) => (
								<tr key={tier.score}>
									<td className="px-4 py-3.5 align-middle">
										<ScoreBadge score={tier.score} size="sm" />
									</td>
									<td className="px-4 py-3.5 align-middle font-medium text-foreground">
										{tier.description}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="rounded-2xl bg-[#FBF4E6] dark:bg-[#121D17] border border-border p-4 text-xs sm:text-sm font-medium text-foreground text-pretty">
					{m.methodology_s4_callout()}
				</div>
			</LegalSection>

			<LegalSection
				id="sursa-datelor"
				number={5}
				title={m.methodology_s5_title()}
			>
				<p className="text-pretty">{m.methodology_s5_body()}</p>
			</LegalSection>

			<LegalSection
				id="frecventa-de-reverificare"
				number={6}
				title={m.methodology_s6_title()}
			>
				<p className="text-pretty">
					{m.methodology_s6_body_prefix()}{" "}
					<a
						href="#procedura-de-contestare"
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						{m.methodology_s6_section_link()}
					</a>
					{m.methodology_s6_body_suffix()}
				</p>
			</LegalSection>

			<LegalSection
				id="ce-nu-acopera"
				number={7}
				title={m.methodology_s7_title()}
			>
				<p className="text-pretty">{m.methodology_s7_intro()}</p>
				<ul className="space-y-2 pl-1">
					{methodologyExclusions.map((item) => (
						<li
							key={item}
							className="flex items-start gap-2.5 text-pretty leading-relaxed"
						>
							<span
								aria-hidden="true"
								className="mt-2 w-1.5 h-1.5 rounded-full bg-[#A67C37] dark:bg-[#D4AF6A] shrink-0"
							/>
							<span>{item}</span>
						</li>
					))}
				</ul>
				<p className="text-pretty">{m.methodology_s7_outro()}</p>
			</LegalSection>

			<LegalSection
				id="procedura-de-contestare"
				number={8}
				title={m.methodology_s8_title()}
			>
				<p className="text-pretty">
					{m.methodology_s8_body_prefix()}{" "}
					<button
						type="button"
						onClick={() => setModalTopic("contact")}
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						{m.methodology_s8_contact_btn()}
					</button>
					{/* TODO: Confirm SLA working days with client */}
					{m.methodology_s8_body_suffix({ days: METHODOLOGY_REVIEW_SLA_DAYS })}
				</p>
			</LegalSection>

			<LegalSection
				id="independenta-metodologiei"
				number={9}
				title={m.methodology_s9_title()}
			>
				<p className="text-pretty">{m.methodology_s9_body()}</p>
			</LegalSection>

			<LegalSection
				id="actualizarea-metodologiei"
				number={10}
				title={m.methodology_s10_title()}
			>
				<p className="text-pretty">{m.methodology_s10_body()}</p>
			</LegalSection>
		</LandingLegalLayout>
	);
}
