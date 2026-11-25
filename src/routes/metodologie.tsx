import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { getSession } from "#/server/auth-functions";

const METODOLOGIE_TOC: readonly LegalSectionTocItem[] = [
	{
		id: "scopul-documentului",
		number: 1,
		title: "Scopul acestui document",
	},
	{
		id: "criteriul-de-clasificare",
		number: 2,
		title: "Criteriul de clasificare",
	},
	{
		id: "definitia-aditiv",
		number: 3,
		title: "Definiția „aditiv” folosită",
	},
	{
		id: "nivelurile-de-clasificare",
		number: 4,
		title: "Nivelurile de clasificare",
	},
	{
		id: "sursa-datelor",
		number: 5,
		title: "Sursa datelor",
	},
	{
		id: "frecventa-de-reverificare",
		number: 6,
		title: "Frecvența de reverificare",
	},
	{
		id: "ce-nu-acopera",
		number: 7,
		title: "Ce NU acoperă această metodologie",
	},
	{
		id: "procedura-de-contestare",
		number: 8,
		title: "Procedura de contestare și corectare",
	},
	{
		id: "independenta-metodologiei",
		number: 9,
		title: "Independența metodologiei",
	},
	{
		id: "actualizarea-metodologiei",
		number: 10,
		title: "Actualizarea acestei metodologii",
	},
];

const CLASSIFICATION_LEVELS = [
	{
		score: "gold",
		description: "0 (zero) aditivi declarați pe etichetă",
	},
	{
		score: "silver",
		description: "1–2 aditivi declarați pe etichetă",
	},
	{
		score: "bronze",
		description: "3–4 aditivi declarați pe etichetă",
	},
] as const;

const METHODOLOGY_EXCLUSIONS = [
	"o evaluare a siguranței alimentare a produsului;",
	"o evaluare nutrițională sau a gradului de procesare;",
	"o recomandare medicală sau dietetică;",
	"o afirmație despre calitatea generală a produsului.",
] as const;

export const Route = createFileRoute("/metodologie")({
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
				title: "Metodologia PickItWell — Criteriul de clasificare a produselor",
			},
			{
				name: "description",
				content:
					"Metodologia publică și verificabilă PickItWell: Gold (0 aditivi), Silver (1-2 aditivi), Bronze (3-4 aditivi) și excluderea produselor cu 5+ aditivi.",
			},
		],
	}),
	component: MetodologiePage,
});

function MetodologiePage() {
	const { isSignedIn } = Route.useLoaderData();
	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);

	return (
		<LandingLegalLayout
			isSignedIn={isSignedIn}
			currentPath="/metodologie"
			breadcrumbLabel="Metodologie"
			badgeLabel="Metodologie publică"
			title="Metodologia PickItWell"
			subtitle="Criteriul unic, public și verificabil pe baza căruia clasificăm produsele alimentare ambalate."
			companionLink={{
				to: "/disclaimer",
				label: "Citește Disclaimer-ul",
				description:
					"Află limitele informațiilor prezentate și condițiile de utilizare.",
			}}
			tocItems={METODOLOGIE_TOC}
			modalTopic={modalTopic}
			onSelectModalTopic={setModalTopic}
		>
			<LegalSection
				id="scopul-documentului"
				number={1}
				title="Scopul acestui document"
			>
				<p className="text-pretty">
					Acest document descrie, în mod public și verificabil, criteriul unic
					pe baza căruia PickItWell clasifică produsele alimentare ambalate.
					Scopul este garantarea transparenței și a aplicării identice a
					aceluiași criteriu tuturor produselor, indiferent de brand, producător
					sau magazin.
				</p>
			</LegalSection>

			<LegalSection
				id="criteriul-de-clasificare"
				number={2}
				title="Criteriul de clasificare"
			>
				<p className="text-pretty">
					PickItWell clasifică produsele exclusiv pe baza numărului de aditivi
					alimentari declarați pe eticheta produsului (ingrediente cu cod E sau
					denumire echivalentă declarată explicit ca aditiv de către producător
					pe ambalaj). Nu se ia în considerare: valoarea nutrițională,
					cantitatea de zahăr/sare/grăsimi, gradul de procesare, originea
					ingredientelor, prețul sau reputația brandului. Metodologia numără, nu
					interpretează.
				</p>
			</LegalSection>

			<LegalSection
				id="definitia-aditiv"
				number={3}
				title="Definiția „aditiv” folosită"
			>
				<p className="text-pretty">
					Este considerat aditiv orice ingredient care apare pe eticheta
					produsului sub formă de cod E (ex: E330) sau sub denumirea sa
					echivalentă declarată ca aditiv (ex: „acid citric” listat separat de
					ingredientele de bază). Toți aditivii sunt numărați în mod egal,
					indiferent de tipul, rolul sau originea lor (conservant, colorant,
					îndulcitor, stabilizator etc.). PickItWell nu face distincție între
					aditivi „mai buni” sau „mai puțin buni” — fiecare aditiv declarat
					contează o unitate în total.
				</p>
			</LegalSection>

			<LegalSection
				id="nivelurile-de-clasificare"
				number={4}
				title="Nivelurile de clasificare"
			>
				<div className="overflow-x-auto rounded-2xl border border-border bg-background dark:bg-[#121D17]">
					<table className="w-full border-collapse text-left text-sm">
						<caption className="sr-only">
							Nivelurile de clasificare PickItWell în funcție de numărul de
							aditivi declarați
						</caption>
						<thead>
							<tr className="border-b border-border bg-sidebar">
								<th
									scope="col"
									className="px-4 py-3 text-xs font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
								>
									Nivel
								</th>
								<th
									scope="col"
									className="px-4 py-3 text-xs font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
								>
									Număr de aditivi declarați
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{CLASSIFICATION_LEVELS.map((tier) => (
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
					Produsele cu 5 sau mai mulți aditivi declarați nu sunt incluse în
					catalogul PickItWell.
				</div>
			</LegalSection>

			<LegalSection id="sursa-datelor" number={5} title="Sursa datelor">
				<p className="text-pretty">
					Informația este preluată direct de pe eticheta produsului,
					fotografiată sau examinată fizic de echipa PickItWell la punctul de
					vânzare, sau, atunci când eticheta fizică nu e disponibilă, din
					informațiile publicate oficial de producător/retailer (site-ul oficial
					al produsului sau al magazinului). Fiecare produs afișează data
					ultimei verificări.
				</p>
			</LegalSection>

			<LegalSection
				id="frecventa-de-reverificare"
				number={6}
				title="Frecvența de reverificare"
			>
				<p className="text-pretty">
					Produsele sunt reverificate periodic, iar orice sesizare din partea
					unui utilizator sau a unui producător privind o posibilă modificare de
					rețetă declanșează o reverificare prioritară (vezi{" "}
					<a
						href="#procedura-de-contestare"
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						secțiunea 8
					</a>
					). PickItWell nu garantează o frecvență fixă de reverificare pentru
					fiecare produs individual, având în vedere volumul cataloagelor de
					retail și ritmul de modificare a rețetelor de către producători.
				</p>
			</LegalSection>

			<LegalSection
				id="ce-nu-acopera"
				number={7}
				title="Ce NU acoperă această metodologie"
			>
				<p className="text-pretty">Această clasificare nu este:</p>
				<ul className="space-y-2 pl-1">
					{METHODOLOGY_EXCLUSIONS.map((item) => (
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
				<p className="text-pretty">
					Un produs clasificat Gold (0 aditivi) poate conține, de exemplu,
					cantități ridicate de zahăr, sare sau grăsimi — aspecte care nu sunt
					evaluate de această metodologie. Clasificarea se referă strict la
					numărul de aditivi declarați.
				</p>
			</LegalSection>

			<LegalSection
				id="procedura-de-contestare"
				number={8}
				title="Procedura de contestare și corectare"
			>
				<p className="text-pretty">
					Orice producător, retailer sau utilizator care identifică o eroare de
					verificare (ex: rețetă modificată, etichetă citită greșit, produs
					neactualizat) poate solicita reverificarea prin{" "}
					<button
						type="button"
						onClick={() => setModalTopic("contact")}
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						canalul de contact
					</button>
					. PickItWell se angajează să reverifice sesizarea și, dacă e
					confirmată, să actualizeze clasificarea produsului în termen de{" "}
					{/* TODO: Confirm SLA working days with client */}
					{METHODOLOGY_REVIEW_SLA_DAYS} zile lucrătoare de la primirea
					sesizării, cu menționarea datei noii verificări.
				</p>
			</LegalSection>

			<LegalSection
				id="independenta-metodologiei"
				number={9}
				title="Independența metodologiei"
			>
				<p className="text-pretty">
					Clasificarea unui produs nu poate fi modificată contra plată și nu
					este influențată de parteneriate comerciale, sponsorizări sau
					publicitate. Un brand poate deveni partener PickItWell doar dacă
					produsele sale întrunesc deja criteriile de clasificare superioară
					conform acestei metodologii, aplicate identic ca pentru orice alt
					produs necontractat.
				</p>
			</LegalSection>

			<LegalSection
				id="actualizarea-metodologiei"
				number={10}
				title="Actualizarea acestei metodologii"
			>
				<p className="text-pretty">
					PickItWell își rezervă dreptul de a actualiza această metodologie
					pentru a reflecta îmbunătățiri ale procesului de verificare. Orice
					modificare va fi publicată pe această pagină, cu data actualizării,
					iar clasificările existente vor fi reevaluate conform criteriilor
					actualizate într-un termen rezonabil.
				</p>
			</LegalSection>
		</LandingLegalLayout>
	);
}
