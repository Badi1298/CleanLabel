import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { InfoModalTopic } from "#/components/landing/landing-data";
import {
	LandingLegalLayout,
	LegalSection,
	type LegalSectionTocItem,
} from "#/components/landing/landing-legal-layout";
import { getSession } from "#/server/auth-functions";

const DISCLAIMER_TOC: readonly LegalSectionTocItem[] = [
	{
		id: "natura-informatiei",
		number: 1,
		title: "Natura informației prezentate",
	},
	{
		id: "fara-recomandare",
		number: 2,
		title: "Fără recomandare de cumpărare sau nerecomandare",
	},
	{
		id: "fara-consultanta",
		number: 3,
		title: "Fără consultanță medicală, nutrițională sau de altă natură",
	},
	{
		id: "acuratete-si-limite",
		number: 4,
		title: "Acuratețe, actualitate și limite ale informației",
	},
	{
		id: "disponibilitate-magazine",
		number: 5,
		title: "Disponibilitate în magazine",
	},
	{
		id: "neutralitate-branduri",
		number: 6,
		title: "Neutralitate față de branduri",
	},
	{
		id: "limitarea-raspunderii",
		number: 7,
		title: "Limitarea răspunderii",
	},
	{
		id: "proprietate-intelectuala",
		number: 8,
		title: "Proprietate intelectuală și mărci",
	},
	{
		id: "acceptarea-termenilor",
		number: 9,
		title: "Acceptarea termenilor",
	},
];

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
				title:
					"Disclaimer PickItWell — Natura informațiilor și limitarea răspunderii",
			},
			{
				name: "description",
				content:
					"Disclaimer legal PickItWell: caracterul strict informativ al clasificării, acuratețea datelor, disponibilitatea în magazine și limitarea răspunderii.",
			},
		],
	}),
	component: DisclaimerPage,
});

function DisclaimerPage() {
	const { isSignedIn } = Route.useLoaderData();
	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);

	return (
		<LandingLegalLayout
			isSignedIn={isSignedIn}
			currentPath="/disclaimer"
			breadcrumbLabel="Disclaimer"
			badgeLabel="Informare legală"
			title="Disclaimer PickItWell"
			subtitle="Informații despre caracterul strict informativ al aplicației, acuratețea datelor și limitarea răspunderii."
			companionLink={{
				to: "/metodologie",
				label: "Citește Metodologia",
				description:
					"Vezi criteriul unic după care clasificăm produsele în Gold, Silver și Bronze.",
			}}
			tocItems={DISCLAIMER_TOC}
			modalTopic={modalTopic}
			onSelectModalTopic={setModalTopic}
		>
			<LegalSection
				id="natura-informatiei"
				number={1}
				title="Natura informației prezentate"
			>
				<p className="text-pretty">
					PickItWell este un instrument informativ care numără și afișează
					numărul de aditivi alimentari declarați pe eticheta produsului, așa
					cum apare pe ambalaj sau în sursele publice consultate la data
					verificării. PickItWell nu efectuează analize de laborator, teste
					chimice, evaluări nutriționale sau evaluări ale siguranței alimentare
					a niciunui produs. Clasificarea Gold/Silver/Bronze reflectă exclusiv
					numărul de aditivi declarați, nu o judecată privind calitatea,
					siguranța, valoarea nutrițională sau gradul de procesare al
					produsului.
				</p>
			</LegalSection>

			<LegalSection
				id="fara-recomandare"
				number={2}
				title="Fără recomandare de cumpărare sau nerecomandare"
			>
				<p className="text-pretty">
					Informațiile din PickItWell au caracter strict informativ. PickItWell
					nu recomandă, nu descurajează și nu instruiește utilizatorul să
					cumpere sau să evite vreun produs anume. Decizia de cumpărare aparține
					în exclusivitate utilizatorului. Orice interpretare a clasificării
					drept „sfat de cumpărare”, „avertisment de siguranță” sau „recomandare
					medicală” este exclusiv a utilizatorului și depășește scopul declarat
					al aplicației.
				</p>
			</LegalSection>

			<LegalSection
				id="fara-consultanta"
				number={3}
				title="Fără consultanță medicală, nutrițională sau de altă natură"
			>
				<p className="text-pretty">
					Conținutul PickItWell nu constituie și nu înlocuiește consultanța
					medicală, nutrițională, dietetică sau de altă natură profesională.
					Pentru decizii legate de alergii, intoleranțe, afecțiuni medicale sau
					regim alimentar specific, utilizatorul trebuie să consulte un medic,
					nutriționist sau alt specialist autorizat, precum și eticheta
					originală a produsului.
				</p>
			</LegalSection>

			<LegalSection
				id="acuratete-si-limite"
				number={4}
				title="Acuratețe, actualitate și limite ale informației"
			>
				<p className="text-pretty">
					Informațiile sunt verificate manual de echipa PickItWell la data
					indicată pe fiecare produs („Verificat la data...”). Rețetele,
					ambalajele și compoziția produselor se pot modifica fără notificare
					din partea producătorului, iar PickItWell nu poate garanta că
					informația afișată corespunde în orice moment ambalajului aflat
					efectiv pe raft. Utilizatorul are obligația de a verifica personal
					eticheta produsului înainte de achiziție sau consum, indiferent de
					informația afișată în aplicație. PickItWell nu oferă nicio garanție,
					expresă sau implicită, privind exactitatea, completitudinea sau
					actualitatea datelor prezentate.
				</p>
			</LegalSection>

			<LegalSection
				id="disponibilitate-magazine"
				number={5}
				title="Disponibilitate în magazine"
			>
				<p className="text-pretty">
					Referirile la magazinele în care un produs „a fost identificat”
					reflectă o constatare punctuală, la data verificării, și nu constituie
					o garanție de stoc, preț sau disponibilitate curentă. PickItWell nu
					are nicio relație contractuală cu magazinele menționate și nu verifică
					stocul acestora în timp real.
				</p>
			</LegalSection>

			<LegalSection
				id="neutralitate-branduri"
				number={6}
				title="Neutralitate față de branduri"
			>
				<p className="text-pretty">
					PickItWell nu are ca scop denigrarea, defăimarea sau prezentarea
					într-o lumină negativă a niciunui producător sau brand. Clasificarea
					produselor se bazează pe un criteriu unic, obiectiv și aplicat identic
					tuturor produselor: numărul de aditivi declarați pe etichetă, conform{" "}
					<Link
						to="/metodologie"
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						metodologiei publice PickItWell
					</Link>
					. Orice producător care identifică o eroare de verificare privind
					propriul produs poate solicita corectarea prin{" "}
					<button
						type="button"
						onClick={() => setModalTopic("contact")}
						className="font-semibold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
					>
						canalul de contact
					</button>
					, iar PickItWell va reverifica informația în cel mai scurt timp
					rezonabil.
				</p>
			</LegalSection>

			<LegalSection
				id="limitarea-raspunderii"
				number={7}
				title="Limitarea răspunderii"
			>
				<p className="text-pretty">
					În limitele maxime permise de lege, PickItWell, operatorii și
					afiliații săi nu răspund pentru niciun prejudiciu direct, indirect,
					incidental sau consecvențial rezultat din utilizarea sau
					imposibilitatea utilizării informațiilor prezentate în aplicație,
					inclusiv, dar fără a se limita la, decizii de cumpărare, reacții
					alergice, efecte asupra sănătății sau pierderi financiare.
				</p>
			</LegalSection>

			<LegalSection
				id="proprietate-intelectuala"
				number={8}
				title="Proprietate intelectuală și mărci"
			>
				<p className="text-pretty">
					Denumirile, siglele și mărcile produselor menționate aparțin
					producătorilor respectivi și sunt folosite exclusiv în scop informativ
					și de identificare, fără nicio afiliere, sponsorizare sau aprobare
					implicită din partea acestora, cu excepția parteneriatelor declarate
					explicit în aplicație.
				</p>
			</LegalSection>

			<LegalSection
				id="acceptarea-termenilor"
				number={9}
				title="Acceptarea termenilor"
			>
				<p className="text-pretty">
					Prin utilizarea PickItWell, utilizatorul confirmă că a citit, a
					înțeles și acceptă prezentul disclaimer, precum și faptul că orice
					decizie luată pe baza informațiilor prezentate îi aparține în
					exclusivitate.
				</p>
			</LegalSection>
		</LandingLegalLayout>
	);
}
