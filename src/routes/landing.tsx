import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowRight,
	Award,
	Baby,
	Beef,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Cookie,
	CupSoda,
	Droplets,
	ExternalLink,
	Flag,
	Info,
	Menu,
	Milk,
	Package,
	Search,
	ShieldCheck,
	Sparkles,
	Star,
	Store,
	UtensilsCrossed,
	Wheat,
	X,
} from "lucide-react";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { ScoreBadge } from "#/components/ui/score-badge";
import { FacebookIcon, InstagramIcon } from "#/components/ui/social-icons";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/landing")({
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

type StepId = "cauta" | "vezi" | "alege";
type InfoModalTopic =
	| "metodologie"
	| "declinare"
	| "raporteaza"
	| "contact"
	| "confidentialitate"
	| "termeni"
	| "cookies";

const HEADER_LINKS = [
	{ href: "#cum-functioneaza", label: "Cum funcționează" },
	{ href: "#de-ce-pickitwell", label: "De ce PickItWell?" },
	{ href: "#recenzii", label: "Recenzii" },
] as const;

const CATALOG_CATEGORIES = [
	{
		name: "Cereale, paste și panificație",
		subcategoriesCount: 4,
		Icon: Wheat,
	},
	{
		name: "Lactate și alternative",
		subcategoriesCount: 4,
		Icon: Milk,
	},
	{
		name: "Sosuri și tartinabile",
		subcategoriesCount: 4,
		Icon: Droplets,
	},
	{
		name: "Gustări și dulciuri",
		subcategoriesCount: 6,
		Icon: Cookie,
	},
	{
		name: "Băuturi",
		subcategoriesCount: 4,
		Icon: CupSoda,
	},
	{
		name: "Ingrediente pentru gătit",
		subcategoriesCount: 4,
		Icon: UtensilsCrossed,
	},
	{
		name: "Conserve, Mâncăruri Semipreparate/Congelate",
		subcategoriesCount: 2,
		Icon: Package,
	},
	{
		name: "Carne și mezeluri",
		subcategoriesCount: 2,
		Icon: Beef,
	},
	{
		name: "Alimente pentru copii",
		subcategoriesCount: 2,
		Icon: Baby,
	},
] as const;

const STEP_ITEMS: Array<{
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

const WHY_CARDS = [
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
] as const;

const REVIEWS = [
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

const SOCIAL_LINKS = [
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
] as const;

const INFO_MODAL_TOPICS: Array<{ id: InfoModalTopic; label: string }> = [
	{ id: "metodologie", label: "Cum selectăm" },
	{ id: "declinare", label: "Declinarea răspunderii" },
	{ id: "raporteaza", label: "Raportează o greșeală" },
	{ id: "contact", label: "Contact" },
	{ id: "confidentialitate", label: "Confidențialitate" },
	{ id: "termeni", label: "Termeni și condiții" },
	{ id: "cookies", label: "Politica de cookie-uri" },
];

const TOPIC_TITLES: Record<InfoModalTopic, string> = {
	metodologie: "Cum selectăm produsele (Metodologie)",
	declinare: "Declinarea răspunderii",
	raporteaza: "Raportează o greșeală",
	contact: "Contact și comunitate PickItWell",
	confidentialitate: "Politica de confidențialitate",
	termeni: "Termeni și condiții",
	cookies: "Politica de cookie-uri",
};

function LandingPage() {
	const { data: session } = authClient.useSession();
	const isSignedIn = Boolean(session?.user);
	const appTargetTo = isSignedIn ? ("/" as const) : ("/signup" as const);

	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [activeStep, setActiveStep] = useState<StepId>("cauta");
	const [modalTopic, setModalTopic] = useState<InfoModalTopic | null>(null);

	const mobileNavId = useId();
	const heroHeadingId = useId();
	const stepTabIds = useMemo(
		() => ({
			cauta: "step-tab-cauta",
			vezi: "step-tab-vezi",
			alege: "step-tab-alege",
		}),
		[],
	);

	const tabButtonRefs = useRef<Record<StepId, HTMLButtonElement | null>>({
		cauta: null,
		vezi: null,
		alege: null,
	});
	const tabPanelRefs = useRef<Record<StepId, HTMLDivElement | null>>({
		cauta: null,
		vezi: null,
		alege: null,
	});

	// Close mobile menu on Escape
	useEffect(() => {
		if (!mobileNavOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMobileNavOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [mobileNavOpen]);

	// Sync find-in-page (`beforematch`) with active step tab
	useEffect(() => {
		const cleanups: Array<() => void> = [];
		for (const step of STEP_ITEMS) {
			const panelEl = tabPanelRefs.current[step.id];
			if (!panelEl) continue;
			const handleBeforeMatch = () => {
				setActiveStep(step.id);
			};
			panelEl.addEventListener("beforematch", handleBeforeMatch);
			cleanups.push(() =>
				panelEl.removeEventListener("beforematch", handleBeforeMatch),
			);
		}
		return () => {
			for (const cleanup of cleanups) {
				cleanup();
			}
		};
	}, []);

	const handleTabKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
		currentIndex: number,
	) => {
		let nextIndex: number | null = null;
		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				nextIndex = (currentIndex + 1) % STEP_ITEMS.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				nextIndex = (currentIndex - 1 + STEP_ITEMS.length) % STEP_ITEMS.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = STEP_ITEMS.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		const targetStep = STEP_ITEMS[nextIndex];
		setActiveStep(targetStep.id);
		const targetButton = tabButtonRefs.current[targetStep.id];
		if (targetButton) {
			targetButton.focus();
			targetButton.scrollIntoView({ block: "nearest", inline: "nearest" });
		}
	};

	const openInfoModal = useCallback((topic: InfoModalTopic) => {
		setModalTopic(topic);
	}, []);

	return (
		<div
			lang="ro"
			id="top"
			className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0E1612] text-[#1B3328] dark:text-[#EDF2EE]"
		>
			<a
				href={`#${heroHeadingId}`}
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#1B4332] focus:text-[#FCE8C6] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
			>
				Sari la conținut
			</a>

			{/* 1. Sticky Header */}
			<header className="sticky top-0 z-40 bg-[#FDFBF7]/92 dark:bg-[#131F19]/92 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D]">
				<div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4 relative">
					<a
						href="#top"
						className="inline-flex items-center gap-2.5 rounded-xl px-1.5 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] dark:focus-visible:ring-[#FCE8C6] shrink-0"
					>
						<img
							src="/logo-192x192.png"
							alt=""
							width={36}
							height={36}
							className="w-9 h-9 rounded-xl object-contain"
						/>
						<span className="font-extrabold text-lg tracking-tight text-[#1B4332] dark:text-[#FBF4E6]">
							PickItWell
						</span>
					</a>

					<nav
						aria-label="Principală"
						className="flex items-center gap-2 md:gap-6"
					>
						<ul
							id={mobileNavId}
							className={cn(
								"md:flex md:items-center md:gap-1",
								mobileNavOpen
									? "flex flex-col gap-1 absolute inset-x-0 top-full bg-[#FDFBF7]/98 dark:bg-[#131F19]/98 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D] px-4 py-3 shadow-lg md:static md:flex-row md:bg-transparent md:dark:bg-transparent md:border-0 md:p-0 md:shadow-none"
									: "hidden md:flex",
							)}
						>
							{HEADER_LINKS.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										onClick={() => setMobileNavOpen(false)}
										className="block md:inline-flex items-center min-h-11 md:min-h-9 px-3.5 py-2 md:py-1.5 rounded-xl text-sm font-semibold text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:bg-[#F3EFE6]/85 dark:hover:bg-[#1E2E26] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>

						<Link
							to={appTargetTo}
							className="inline-flex items-center justify-center min-h-10 px-4 sm:px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
						>
							Începe acum
						</Link>

						<button
							type="button"
							className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer touch-manipulation"
							aria-expanded={mobileNavOpen}
							aria-controls={mobileNavId}
							aria-label={mobileNavOpen ? "Închide meniul" : "Deschide meniul"}
							onClick={() => setMobileNavOpen((prev) => !prev)}
						>
							{mobileNavOpen ? (
								<X className="w-5 h-5" aria-hidden="true" />
							) : (
								<Menu className="w-5 h-5" aria-hidden="true" />
							)}
						</button>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				{/* 2. Hero Section (Gabi Section 3) */}
				<section
					aria-labelledby={heroHeadingId}
					className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-4xl md:rounded-b-[2.75rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]"
				>
					<div
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.12),transparent_58%)]"
						aria-hidden="true"
					/>
					<div
						className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#A67C37]/15 blur-3xl"
						aria-hidden="true"
					/>

					<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-18">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
							{/* Left Column: Copy + CTAs */}
							<div className="lg:col-span-6 space-y-5">
								<p className="inline-flex items-center gap-2 rounded-full bg-[#FBF4E6]/12 border border-[#FBF4E6]/22 px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold text-[#FCE8C6] leading-snug">
									<Sparkles
										className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0"
										aria-hidden="true"
									/>
									<span>
										Alegem produsele după ce scrie pe etichetă, așa cum facem
										pentru familia noastră.
									</span>
								</p>

								<h1
									id={heroHeadingId}
									tabIndex={-1}
									className="text-[2.35rem] sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.04] text-[#FCE8C6] outline-none"
								>
									<span lang="en">Good things SAVE Time!</span>
								</h1>

								{/* Mobile short subtitle (Gabi 3.c) */}
								<p className="sm:hidden text-sm text-[#FBF4E6]/90 font-medium leading-relaxed">
									Produse alimentare cu puțini aditivi marcați pe etichetă,
									alese după criteriile cu care facem cumpărăturile pentru
									familia noastră. Vezi unde au fost găsite. Decizia îți
									aparține.
								</p>

								{/* Desktop full subtitle (Gabi 3.b) */}
								<p className="hidden sm:block text-base md:text-[17px] text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl">
									PickItWell selectează produse alimentare cu puțini aditivi
									marcați pe etichetă, după aceleași criterii după care facem
									noi cumpărăturile pentru familia noastră. Le grupăm după
									numărul de ingrediente marcate ca aditivi (cu cod E sau clasă
									funcțională) și îți arătăm în ce magazine au fost găsite.
									Informațiile sunt orientative, iar decizia îți aparține.
								</p>

								<div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
									<Link
										to="/signup"
										className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3.5 rounded-full bg-[#FCE8C6] hover:bg-[#F7DDA9] text-[#1B3328] text-sm sm:text-base font-extrabold shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
									>
										<span>Creează-ți contul gratuit</span>
										<ArrowRight
											className="w-4 h-4 shrink-0"
											aria-hidden="true"
										/>
									</Link>

									{isSignedIn ? (
										<Link
											to="/search"
											className="inline-flex items-center justify-center gap-2 min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 border border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
										>
											<span>Descoperă produsele din PickItWell</span>
										</Link>
									) : (
										<a
											href="#cum-functioneaza"
											className="inline-flex items-center justify-center gap-2 min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 border border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
										>
											<span>Descoperă produsele din PickItWell</span>
										</a>
									)}
								</div>
							</div>

							{/* Right Column: Phone Mockup + 3 Tier Cards */}
							<div className="lg:col-span-6">
								<div className="relative mx-auto max-w-md lg:max-w-lg flex flex-col items-center">
									{/* Phone Frame */}
									<div className="relative z-10 w-full max-w-[310px] sm:max-w-[330px] rounded-[2.4rem] bg-[#0E1612] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-[#FCE8C6]/25">
										<div className="rounded-[1.9rem] bg-[#FAF8F5] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE] overflow-hidden">
											{/* Phone Status / Notch Bar */}
											<div className="bg-[#1B4332] px-4 pt-3 pb-3 text-[#FCE8C6] flex items-center justify-between">
												<div className="flex items-center gap-1.5">
													<img
														src="/logo-192x192.png"
														alt=""
														width={20}
														height={20}
														className="w-5 h-5 rounded-md object-contain"
													/>
													<span className="text-xs font-extrabold tracking-tight">
														PickItWell
													</span>
												</div>
												<ScoreBadge score="gold" size="sm" />
											</div>

											{/* Product Header */}
											<div className="p-4 space-y-3">
												<div className="rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/75 to-[#FBF4E6] dark:from-amber-950/50 dark:via-amber-950/30 dark:to-[#16221C] border border-[#F59E0B]/35 p-3">
													<div className="flex items-center justify-between gap-2">
														<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
															Olympus
														</span>
														<span className="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] px-2 py-0.5 text-[10px] font-bold text-[#1B4332] dark:text-[#CBE3D4]">
															0 aditivi marcați
														</span>
													</div>
													<p className="mt-1 text-base font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] leading-snug">
														Iaurt Grecesc Străvechi 10%
													</p>
												</div>

												{/* Declared Ingredients */}
												<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 space-y-1.5">
													<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
														Ingrediente declarate
													</p>
													<p className="text-xs leading-relaxed text-[#1B3328] dark:text-[#EDF2EE]">
														Lapte de vacă pasteurizat, smântână din lapte de
														vacă, culturi lactice selecționate.
													</p>
													<div className="pt-1 flex items-center gap-1.5 text-[10px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
														<Calendar
															className="w-3 h-3 shrink-0"
															aria-hidden="true"
														/>
														<span>Etichetă consultată la: 18.11.2026</span>
													</div>
												</div>

												{/* Available Stores */}
												<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 space-y-2">
													<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
														Găsit în magazine
													</p>
													<div className="flex flex-wrap gap-1.5">
														{["Kaufland", "Mega Image", "Lidl"].map((store) => (
															<span
																key={store}
																className="inline-flex items-center gap-1 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B3328] dark:text-[#CBE3D4]"
															>
																<Store
																	className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400"
																	aria-hidden="true"
																/>
																<span>{store}</span>
															</span>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Floating Classification Cards around Phone (stacked neatly on mobile, floating on sm+) */}
									<div className="mt-5 sm:mt-0 w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3 lg:pointer-events-none">
										{/* Gold Card */}
										<div className="lg:absolute lg:top-8 lg:-left-6 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-[#16221C] text-[#1B3328] dark:text-[#EDF2EE] border border-[#EAE4D7] dark:border-[#24362D] shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-[178px]">
											<div className="flex items-center gap-2">
												<ScoreBadge score="gold" size="sm" />
											</div>
											<div className="text-right lg:text-left">
												<p className="text-xs font-extrabold text-[#1B3328] dark:text-[#FBF4E6]">
													Ovăz integral bio
												</p>
												<p className="text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
													0 aditivi marcați
												</p>
											</div>
										</div>

										{/* Silver Card */}
										<div className="lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-right-6 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-[#16221C] text-[#1B3328] dark:text-[#EDF2EE] border border-[#EAE4D7] dark:border-[#24362D] shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-[184px]">
											<div className="flex items-center gap-2">
												<ScoreBadge score="silver" size="sm" />
											</div>
											<div className="text-right lg:text-left">
												<p className="text-xs font-extrabold text-[#1B3328] dark:text-[#FBF4E6]">
													Crackers cu semințe
												</p>
												<p className="text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
													1–2 aditivi marcați
												</p>
											</div>
										</div>

										{/* Bronze Card */}
										<div className="lg:absolute lg:bottom-8 lg:-left-4 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-[#16221C] text-[#1B3328] dark:text-[#EDF2EE] border border-[#EAE4D7] dark:border-[#24362D] shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-[178px]">
											<div className="flex items-center gap-2">
												<ScoreBadge score="bronze" size="sm" />
											</div>
											<div className="text-right lg:text-left">
												<p className="text-xs font-extrabold text-[#1B3328] dark:text-[#FBF4E6]">
													Sos pesto clasic
												</p>
												<p className="text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
													3+ aditivi marcați
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 3. Ce poți face în aplicație? / Cum funcționează */}
				<section
					id="cum-functioneaza"
					aria-labelledby="how-it-works-heading"
					className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20"
				>
					<div className="max-w-2xl mx-auto text-center">
						<h2
							id="how-it-works-heading"
							className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							Caută. Vezi. Alege.
						</h2>
						<p className="mt-3 text-sm sm:text-base text-[#5C665E] dark:text-[#9AA89E] font-medium">
							Produse selectate după aditivii marcați pe etichetă, în 3 pași
							simpli.
						</p>
					</div>

					{/* Interactive 3-Step Tabbed Interface */}
					<div className="mt-8 md:mt-10">
						<div className="flex justify-center border-b border-[#EAE4D7] dark:border-[#24362D]">
							<div
								role="tablist"
								aria-label="Pașii de utilizare PickItWell"
								className="flex flex-nowrap items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar max-w-full"
							>
								{STEP_ITEMS.map((step, index) => {
									const isSelected = activeStep === step.id;
									return (
										<button
											key={step.id}
											ref={(el) => {
												tabButtonRefs.current[step.id] = el;
											}}
											type="button"
											role="tab"
											id={stepTabIds[step.id]}
											aria-selected={isSelected}
											tabIndex={isSelected ? 0 : -1}
											onClick={() => setActiveStep(step.id)}
											onKeyDown={(e) => handleTabKeyDown(e, index)}
											className={cn(
												"relative shrink-0 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#FCE8C6]",
												"after:content-[''] after:absolute after:inset-x-2 after:bottom-0 after:border-b-[3px] after:rounded-full after:transition-colors",
												isSelected
													? "text-[#1B4332] dark:text-[#FCE8C6] after:border-[#1B4332] dark:after:border-[#FCE8C6]"
													: "text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] after:border-transparent",
											)}
										>
											{index + 1}. {step.tabLabel}
										</button>
									);
								})}
							</div>
						</div>

						{/* Tab Panels Grid (single cell, styling strictly on inner child wrapper) */}
						<div className="grid mt-6">
							{STEP_ITEMS.map((step) => {
								const isSelected = activeStep === step.id;
								return (
									<div
										key={step.id}
										ref={(el) => {
											tabPanelRefs.current[step.id] = el;
										}}
										role="tabpanel"
										aria-labelledby={stepTabIds[step.id]}
										hidden={
											isSelected
												? undefined
												: ("until-found" as unknown as boolean)
										}
										tabIndex={isSelected && step.id !== "vezi" ? 0 : undefined}
										className="col-start-1 row-start-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
									>
										<div className="rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_6px_24px_rgba(27,67,50,0.05)] p-5 sm:p-7 md:p-9">
											<div className="grid grid-cols-1 lg:grid-cols-12 gap-7 md:gap-10 items-center">
												{/* Step Explanation */}
												<div className="lg:col-span-5 space-y-4">
													<span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-3 py-1 text-xs font-bold">
														{step.tabLabel}
													</span>
													<h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
														{step.stepTitle}
													</h3>
													<p className="text-sm sm:text-base text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
														{step.description}
													</p>

													<div className="pt-2 flex flex-wrap gap-2">
														{STEP_ITEMS.map((navStep, navIdx) => (
															<button
																key={navStep.id}
																type="button"
																onClick={() => setActiveStep(navStep.id)}
																className={cn(
																	"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
																	activeStep === navStep.id
																		? "bg-[#1B4332] text-[#FCE8C6] border-[#1B4332] dark:bg-[#FCE8C6] dark:text-[#1B3328] dark:border-[#FCE8C6]"
																		: "bg-[#FAF8F5] dark:bg-[#121D17] text-[#5C665E] dark:text-[#9AA89E] border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44]",
																)}
															>
																<span>0{navIdx + 1}</span>
																<span>{navStep.tabLabel}</span>
															</button>
														))}
													</div>
												</div>

												{/* Step App Visual Mockup */}
												<div className="lg:col-span-7">
													<figure className="space-y-3">
														{step.id === "cauta" && <StepSearchVisual />}
														{step.id === "vezi" && (
															<StepInspectVisual
																onReportError={() =>
																	openInfoModal("raporteaza")
																}
															/>
														)}
														{step.id === "alege" && <StepChooseVisual />}

														{step.note && (
															<figcaption className="text-xs text-[#5C665E] dark:text-[#9AA89E] text-center sm:text-left leading-relaxed px-1">
																{step.note}
															</figcaption>
														)}
													</figure>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* 4. De ce PickItWell? */}
				<section
					id="de-ce-pickitwell"
					aria-labelledby="why-heading"
					className="scroll-mt-20 bg-[#FDFBF7] dark:bg-[#121D17] border-y border-[#EAE4D7] dark:border-[#24362D] py-14 md:py-20"
				>
					<div className="max-w-6xl mx-auto px-4 md:px-6">
						<div className="max-w-2xl mx-auto text-center">
							<h2
								id="why-heading"
								className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
							>
								Alegerile alimentare nu trebuie să fie complicate.
							</h2>
							<p className="mt-3 text-sm sm:text-base text-[#5C665E] dark:text-[#9AA89E] font-medium">
								Produsele, ingredientele și magazinele în care au fost găsite,
								într-un singur loc.
							</p>
						</div>

						<div className="mt-8 md:mt-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
							{WHY_CARDS.map((card) => {
								const { Icon } = card;
								return (
									<article
										key={card.id}
										className="rounded-3xl bg-[#FBF4E6] dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-6 flex flex-col gap-4 shadow-[0_2px_10px_rgba(27,67,50,0.03)]"
									>
										<div className="w-11 h-11 rounded-2xl bg-[#FEF3C7]/80 dark:bg-amber-950/50 border border-[#D4AF6A]/45 text-[#A67C37] dark:text-[#D4AF6A] flex items-center justify-center shrink-0">
											<Icon
												className="w-5 h-5"
												strokeWidth={1.9}
												aria-hidden="true"
											/>
										</div>

										<div className="space-y-2 flex-1">
											<h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
												{card.title}
											</h3>
											<p className="text-sm text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
												{card.description}
											</p>
										</div>

										{card.hasMethodologyLink && (
											<div className="pt-1">
												<button
													type="button"
													onClick={() => openInfoModal("metodologie")}
													className="inline-flex items-center gap-1 text-xs font-bold text-[#2D5A44] dark:text-emerald-400 hover:text-[#1B4332] dark:hover:text-emerald-300 underline underline-offset-4 transition-colors cursor-pointer"
												>
													<span>Vezi cum selectăm</span>
													<ChevronRight
														className="w-3.5 h-3.5"
														aria-hidden="true"
													/>
												</button>
											</div>
										)}
									</article>
								);
							})}
						</div>

						<p className="mt-7 max-w-3xl mx-auto text-center text-xs text-[#5C665E] dark:text-[#9AA89E] leading-relaxed">
							Grupele se bazează doar pe numărul de ingrediente marcate pe
							etichetă ca aditivi și nu reprezintă o evaluare a calității
							produselor. Disponibilitatea în stoc nu este verificată.
						</p>
					</div>
				</section>

				{/* 5. Recenzii */}
				<ReviewsSection />

				{/* 6. Începe să folosești PickItWell (CTA Final) */}
				<section
					aria-labelledby="final-cta-heading"
					className="max-w-6xl mx-auto px-4 md:px-6 pb-14 md:pb-20"
				>
					<div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-[#1B4332] text-[#FBF4E6] shadow-[0_16px_40px_rgba(27,67,50,0.18)] p-6 sm:p-10 md:p-12 lg:p-14">
						<div
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,244,230,0.12),transparent_55%)]"
							aria-hidden="true"
						/>

						<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-10 items-center">
							{/* Dual-Screen Mockup (Gabi suggestion: Product with marked additives + Stores screen) */}
							<div className="lg:col-span-6 order-2 lg:order-1">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
									{/* Screen 1: Product Page with Marked Additives */}
									<div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE] border border-[#FCE8C6]/25 p-4 shadow-xl space-y-3">
										<div className="flex items-center justify-between gap-2">
											<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
												Ingrediente marcate
											</span>
											<ScoreBadge score="silver" size="sm" />
										</div>
										<p className="text-sm font-extrabold text-[#1B3328] dark:text-[#FBF4E6] leading-snug">
											Pâine integrală cu semințe
										</p>
										<p className="text-xs leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]">
											Făină integrală de grâu, apă, semințe de floarea-soarelui,
											drojdie, sare,{" "}
											<mark className="rounded bg-amber-100 dark:bg-amber-950/70 text-[#78350F] dark:text-amber-200 px-1 py-0.5 font-semibold">
												acid ascorbic (E300)
											</mark>
											.
										</p>
										<div className="pt-1 border-t border-[#EAE4D7] dark:border-[#24362D] flex items-center justify-between text-[10px] text-[#5C665E] dark:text-[#9AA89E]">
											<span>1 aditiv marcat</span>
											<span>18.11.2026</span>
										</div>
									</div>

									{/* Screen 2: Stores & Alternatives */}
									<div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE] border border-[#FCE8C6]/25 p-4 shadow-xl space-y-3">
										<div className="flex items-center justify-between gap-2">
											<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
												Unde a fost găsit
											</span>
											<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2 py-0.5 text-[10px] font-bold">
												4 magazine
											</span>
										</div>

										<ul className="space-y-1.5">
											{["Kaufland", "Lidl", "Mega Image", "Carrefour"].map(
												(storeName) => (
													<li
														key={storeName}
														className="flex items-center justify-between rounded-xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] px-2.5 py-1.5 text-xs font-bold"
													>
														<span className="flex items-center gap-2">
															<Store
																className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400"
																aria-hidden="true"
															/>
															<span>{storeName}</span>
														</span>
														<ChevronRight
															className="w-3.5 h-3.5 text-[#7D857E]"
															aria-hidden="true"
														/>
													</li>
												),
											)}
										</ul>
									</div>
								</div>
							</div>

							{/* Copy & Golden CTA on Forest Green */}
							<div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left space-y-4">
								<h2
									id="final-cta-heading"
									className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#FCE8C6]"
								>
									Gata să încerci PickItWell?
								</h2>
								<p className="text-sm sm:text-base text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
									Produse selectate după aditivii marcați pe etichetă, cu
									ingredientele declarate de producător și magazinele în care au
									fost găsite.
								</p>

								<div className="pt-2 flex flex-col items-center lg:items-start gap-2.5">
									<Link
										to="/signup"
										className="inline-flex items-center justify-center gap-2 min-h-13 px-8 py-4 rounded-full bg-[#FCE8C6] hover:bg-[#F7DDA9] text-[#1B3328] text-base font-extrabold shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
									>
										<span>Creează cont gratuit</span>
										<ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
									</Link>

									<p className="text-xs font-semibold text-[#FCE8C6]/85">
										Decizia îți aparține.
									</p>

									<button
										type="button"
										onClick={() => openInfoModal("metodologie")}
										className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#FCE8C6]/90 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
									>
										<span>Vezi cum selectăm</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* 7. Footer (Gabi Section 7) */}
			<footer className="bg-[#FDFBF7] dark:bg-[#131F19] border-t border-[#EAE4D7] dark:border-[#24362D]">
				<div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-14">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
						{/* Coloana 1 – PickItWell */}
						<div className="md:col-span-5 space-y-4">
							<a
								href="#top"
								className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
							>
								<img
									src="/logo-192x192.png"
									alt=""
									width={36}
									height={36}
									loading="lazy"
									className="w-9 h-9 rounded-xl object-contain"
								/>
								<span className="font-extrabold text-lg tracking-tight text-[#1B4332] dark:text-[#FBF4E6]">
									PickItWell
								</span>
							</a>

							<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] leading-relaxed max-w-sm">
								Produse alimentare selectate după aditivii marcați pe etichetă.
								Decizia îți aparține.
							</p>

							<ul className="flex flex-wrap items-center gap-2 pt-1">
								{SOCIAL_LINKS.map((social) => {
									const { Icon } = social;
									return (
										<li key={social.id}>
											<a
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] transition-colors"
											>
												<Icon
													className="w-3.5 h-3.5 text-[#A67C37] dark:text-[#D4AF6A]"
													aria-hidden="true"
												/>
												<span>{social.label}</span>
												<ExternalLink
													className="w-3 h-3 opacity-60"
													aria-hidden="true"
												/>
											</a>
										</li>
									);
								})}
							</ul>
						</div>

						{/* Coloana 2 – Explorează */}
						<div className="md:col-span-3 space-y-3">
							<h2 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								Explorează
							</h2>
							<ul className="space-y-2 text-sm font-semibold">
								{HEADER_LINKS.map((item) => (
									<li key={item.href}>
										<a
											href={item.href}
											className="inline-flex items-center py-1 text-[#1B3328] dark:text-[#EDF2EE] hover:text-[#2D5A44] dark:hover:text-[#FCE8C6] transition-colors"
										>
											{item.label}
										</a>
									</li>
								))}
								<li>
									<Link
										to="/"
										className="inline-flex items-center py-1 text-[#2D5A44] dark:text-emerald-400 hover:text-[#1B4332] dark:hover:text-emerald-300 transition-colors"
									>
										Deschide aplicația
									</Link>
								</li>
							</ul>
						</div>

						{/* Coloana 3 – Suport și informații legale */}
						<div className="md:col-span-4 space-y-3">
							<h2 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								Suport și informații legale
							</h2>
							<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-1.5 text-sm font-semibold">
								{(
									[
										["contact", "Contact"],
										["raporteaza", "Raportează o greșeală"],
										["metodologie", "Cum selectăm"],
										["declinare", "Declinarea răspunderii"],
										["confidentialitate", "Politica de confidențialitate"],
										["termeni", "Termeni și condiții"],
										["cookies", "Politica de cookie-uri"],
									] as const
								).map(([topic, label]) => (
									<li key={topic}>
										<button
											type="button"
											onClick={() => openInfoModal(topic)}
											className="inline-flex items-center py-1 text-left text-[#1B3328] dark:text-[#EDF2EE] hover:text-[#2D5A44] dark:hover:text-[#FCE8C6] transition-colors cursor-pointer"
										>
											{label}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-10 pt-6 border-t border-[#EAE4D7] dark:border-[#24362D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#5C665E] dark:text-[#9AA89E]">
						<p>© 2026 PickItWell. Toate drepturile rezervate.</p>
						<p>
							© 2026 [denumirea firmei], CUI [număr], [sediul], [e-mail]. Toate
							drepturile rezervate.
						</p>
					</div>
				</div>
			</footer>

			{/* Native <dialog> Modal for Methodology, Disclaimer, Report Error & Legal */}
			<LandingInfoDialog
				topic={modalTopic}
				onSelectTopic={setModalTopic}
				onClose={() => setModalTopic(null)}
			/>
		</div>
	);
}

function StepSearchVisual() {
	return (
		<div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-4 sm:p-5 space-y-4">
			{/* Fake search bar preview */}
			<div className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2B3D33] px-3.5 py-2.5 shadow-2xs">
				<Search
					className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0"
					aria-hidden="true"
				/>
				<span className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] font-medium truncate">
					Caută produs, brand sau categorie...
				</span>
				<span className="ml-auto inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-0.5 text-[11px] font-bold shrink-0">
					9 categorii · 32 subcategorii
				</span>
			</div>

			{/* All 9 Categories with golden-styled icons */}
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
				{CATALOG_CATEGORIES.map((category) => {
					const { Icon } = category;
					return (
						<li
							key={category.name}
							className="rounded-xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-2.5 flex items-center gap-2.5 shadow-[0_1px_4px_rgba(27,67,50,0.03)]"
						>
							<span className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-amber-950/50 border border-[#D4AF6A]/45 text-[#A67C37] dark:text-[#D4AF6A] flex items-center justify-center shrink-0">
								<Icon
									className="w-4 h-4"
									strokeWidth={1.9}
									aria-hidden="true"
								/>
							</span>
							<div className="min-w-0">
								<p className="text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE] leading-snug line-clamp-2">
									{category.name}
								</p>
								<p className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
									{category.subcategoriesCount} subcategorii
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function StepInspectVisual({ onReportError }: { onReportError: () => void }) {
	return (
		<div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-4 sm:p-5 space-y-4">
			{/* Product Header Card */}
			<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<p className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
						Exemplu pagină produs
					</p>
					<h4 className="text-base sm:text-lg font-extrabold text-[#1B3328] dark:text-[#FBF4E6]">
						Sos de roșii cu busuioc
					</h4>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<ScoreBadge score="silver" size="md" />
					<span className="inline-flex items-center rounded-full bg-[#F3EFE6] dark:bg-[#1E2E26] border border-[#EAE4D7] dark:border-[#2B3D33] px-2.5 py-1 text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE]">
						1 aditiv marcat
					</span>
				</div>
			</div>

			{/* Highlighted Ingredients Card */}
			<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-4 space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
					Listă ingrediente declarată de producător
				</p>
				<p className="text-xs sm:text-sm leading-relaxed text-[#1B3328] dark:text-[#EDF2EE]">
					Roșii (84%), ceapă, ulei de măsline extravirgin, busuioc (2%), sare de
					mare, zahăr,{" "}
					<mark className="inline-block rounded-md bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/70 dark:border-amber-700/60 text-[#78350F] dark:text-amber-200 px-1.5 py-0.5 font-bold">
						corector de aciditate: acid citric (E330)
					</mark>
					.
				</p>

				<div className="pt-2 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-2 text-xs">
					<span className="inline-flex items-center gap-1.5 text-[#5C665E] dark:text-[#9AA89E] font-medium">
						<Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>Etichetă consultată la: 18.11.2026</span>
					</span>
					<button
						type="button"
						onClick={onReportError}
						className="inline-flex items-center gap-1 font-bold text-[#A67C37] dark:text-[#D4AF6A] hover:underline underline-offset-4 cursor-pointer"
					>
						<Flag className="w-3.5 h-3.5" aria-hidden="true" />
						<span>Raportează o greșeală</span>
					</button>
				</div>
			</div>
		</div>
	);
}

function StepChooseVisual() {
	return (
		<div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-4 sm:p-5 space-y-4">
			{/* Available Stores */}
			<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-4 space-y-3">
				<div className="flex items-center justify-between gap-2">
					<p className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
						Disponibil la
					</p>
					<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-0.5 text-[11px] font-bold">
						4 magazine
					</span>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{["Kaufland", "Lidl", "Mega Image", "Carrefour"].map((storeName) => (
						<div
							key={storeName}
							className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-3 py-2 flex items-center gap-2 text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE]"
						>
							<Store
								className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400 shrink-0"
								aria-hidden="true"
							/>
							<span className="truncate">{storeName}</span>
						</div>
					))}
				</div>
			</div>

			{/* Category Alternatives */}
			<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-4 space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
					Alternative din aceeași categorie
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
					<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3 flex items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="text-xs font-extrabold text-[#1B3328] dark:text-[#FBF4E6] truncate">
								Passata rustică bio
							</p>
							<p className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
								0 aditivi marcați
							</p>
						</div>
						<ScoreBadge score="gold" size="sm" />
					</div>
					<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3 flex items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="text-xs font-extrabold text-[#1B3328] dark:text-[#FBF4E6] truncate">
								Sos clasic de roșii
							</p>
							<p className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
								0 aditivi marcați
							</p>
						</div>
						<ScoreBadge score="gold" size="sm" />
					</div>
				</div>
			</div>
		</div>
	);
}

function ReviewsSection() {
	const trackRef = useRef<HTMLDivElement>(null);
	const slideRefs = useRef<Array<HTMLElement | null>>([]);

	const [activeSlide, setActiveSlide] = useState(0);
	const [announcement, setAnnouncement] = useState("");

	const pendingTargetRef = useRef<number | null>(null);
	const settledSlideRef = useRef(0);
	const currentParkedRef = useRef<number | null>(null);
	const isMobileRef = useRef(false);
	const rafRef = useRef<number | null>(null);
	const scrollFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const requestedStartLeftRef = useRef<number | null>(null);

	const getSlideElements = useCallback(
		() => slideRefs.current.filter((el): el is HTMLElement => el !== null),
		[],
	);

	const getNearestSlideIndex = useCallback(() => {
		const track = trackRef.current;
		const slides = getSlideElements();
		if (!track || slides.length === 0) return 0;

		const trackCenter = track.scrollLeft + track.clientWidth / 2;
		let bestIdx = 0;
		let bestDist = Number.POSITIVE_INFINITY;

		for (let i = 0; i < slides.length; i++) {
			const slide = slides[i];
			const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
			const dist = Math.abs(slideCenter - trackCenter);
			if (dist < bestDist) {
				bestDist = dist;
				bestIdx = i;
			}
		}
		return bestIdx;
	}, [getSlideElements]);

	const applyParking = useCallback(
		(targetIndex: number | "initial", lockOverflow: boolean) => {
			const track = trackRef.current;
			const slides = getSlideElements();
			if (!track || slides.length === 0) return;

			if (!isMobileRef.current) {
				track.style.removeProperty("--current");
				currentParkedRef.current = null;
				return;
			}

			const anchorIdx = getNearestSlideIndex();
			const anchorSlide = slides[anchorIdx];
			if (!anchorSlide) return;

			const beforeLeft = anchorSlide.offsetLeft;
			const prevSnapType = track.style.scrollSnapType;
			track.style.scrollSnapType = "none";

			if (lockOverflow) {
				track.style.overflowX = "hidden";
			}

			if (targetIndex === "initial") {
				track.style.setProperty("--current", "initial");
				currentParkedRef.current = null;
			} else {
				track.style.setProperty("--current", String(targetIndex));
				currentParkedRef.current = targetIndex;
			}

			const afterLeft = anchorSlide.offsetLeft;
			if (afterLeft !== beforeLeft) {
				track.scrollLeft += afterLeft - beforeLeft;
			}

			if (lockOverflow) {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (!trackRef.current) return;
						trackRef.current.style.removeProperty("overflow-x");
						trackRef.current.style.scrollSnapType = prevSnapType;
					});
				});
			} else {
				track.style.scrollSnapType = prevSnapType;
			}
		},
		[getNearestSlideIndex, getSlideElements],
	);

	const handleSettled = useCallback(
		(announceChange: boolean) => {
			const track = trackRef.current;
			if (!track || !isMobileRef.current) return;

			if (
				requestedStartLeftRef.current !== null &&
				Math.abs(track.scrollLeft - requestedStartLeftRef.current) < 2
			) {
				return;
			}
			requestedStartLeftRef.current = null;

			const settled = getNearestSlideIndex();
			pendingTargetRef.current = null;
			setActiveSlide(settled);

			if (currentParkedRef.current !== settled) {
				applyParking(settled, true);
			}

			if (announceChange && settled !== settledSlideRef.current) {
				settledSlideRef.current = settled;
				setAnnouncement(`Recenzia ${settled + 1} din ${REVIEWS.length}`);
			} else {
				settledSlideRef.current = settled;
			}
		},
		[applyParking, getNearestSlideIndex],
	);

	// Responsive mobile carousel parking & scroll listeners
	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;

		const mq = window.matchMedia("(max-width: 767px)");
		const syncMode = () => {
			isMobileRef.current = mq.matches;
			if (mq.matches) {
				if (!CSS.supports("order: sibling-count()")) {
					track.style.setProperty("--children-count", String(REVIEWS.length));
				}
				const nearest = getNearestSlideIndex();
				applyParking(nearest, false);
				settledSlideRef.current = nearest;
				setActiveSlide(nearest);
			} else {
				track.style.removeProperty("--current");
				track.style.removeProperty("--children-count");
				currentParkedRef.current = null;
			}
		};

		syncMode();
		mq.addEventListener("change", syncMode);

		const onScroll = () => {
			if (!isMobileRef.current) return;
			if (pendingTargetRef.current === null) {
				if (rafRef.current === null) {
					rafRef.current = requestAnimationFrame(() => {
						rafRef.current = null;
						const nearest = getNearestSlideIndex();
						setActiveSlide((prev) => (prev === nearest ? prev : nearest));
					});
				}
			}

			if (!("onscrollend" in window)) {
				if (scrollFallbackTimerRef.current) {
					clearTimeout(scrollFallbackTimerRef.current);
				}
				scrollFallbackTimerRef.current = setTimeout(() => {
					handleSettled(true);
				}, 140);
			}
		};

		const onScrollEnd = () => {
			handleSettled(true);
		};

		track.addEventListener("scroll", onScroll, { passive: true });
		if ("onscrollend" in window) {
			track.addEventListener("scrollend", onScrollEnd);
		}

		return () => {
			mq.removeEventListener("change", syncMode);
			track.removeEventListener("scroll", onScroll);
			if ("onscrollend" in window) {
				track.removeEventListener("scrollend", onScrollEnd);
			}
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			if (scrollFallbackTimerRef.current) {
				clearTimeout(scrollFallbackTimerRef.current);
			}
		};
	}, [applyParking, getNearestSlideIndex, handleSettled]);

	const scrollByDirection = (direction: -1 | 1) => {
		const track = trackRef.current;
		const slides = getSlideElements();
		if (!track || slides.length === 0) return;

		const baseIdx = pendingTargetRef.current ?? getNearestSlideIndex();
		const visualSlides = [...slides].sort(
			(a, b) => a.offsetLeft - b.offsetLeft,
		);
		const currentSlideEl = slides[baseIdx];
		const visualPos = visualSlides.indexOf(currentSlideEl);
		const targetVisualPos =
			(visualPos + direction + visualSlides.length) % visualSlides.length;
		const targetEl = visualSlides[targetVisualPos];
		const targetIndex = slides.indexOf(targetEl);
		if (!targetEl || targetIndex === -1) return;

		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const trackCenter = track.scrollLeft + track.clientWidth / 2;
		const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;
		const delta = targetCenter - trackCenter;

		requestedStartLeftRef.current = track.scrollLeft;
		pendingTargetRef.current = targetIndex;
		setActiveSlide(targetIndex);
		track.scrollBy({
			left: delta,
			behavior: prefersReduced ? "auto" : "smooth",
		});
	};

	const scrollToMarker = (targetIndex: number) => {
		const track = trackRef.current;
		const slides = getSlideElements();
		const targetEl = slides[targetIndex];
		if (!track || !targetEl) return;

		if (targetIndex === activeSlide) return;

		applyParking("initial", false);

		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const trackCenter = track.scrollLeft + track.clientWidth / 2;
		const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;
		const delta = targetCenter - trackCenter;

		requestedStartLeftRef.current = track.scrollLeft;
		pendingTargetRef.current = targetIndex;
		setActiveSlide(targetIndex);
		track.scrollBy({
			left: delta,
			behavior: prefersReduced ? "auto" : "smooth",
		});
	};

	return (
		<section
			id="recenzii"
			aria-labelledby="recenzii-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20"
		>
			<div className="max-w-2xl mx-auto text-center">
				<h2
					id="recenzii-heading"
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
				>
					Ce spun utilizatorii PickItWell?
				</h2>
				<p className="mt-3 text-sm sm:text-base text-[#5C665E] dark:text-[#9AA89E] font-medium">
					Opinii trimise de utilizatori despre experiența lor cu PickItWell.
				</p>
			</div>

			<section
				aria-roledescription="carousel"
				aria-label="Recenzii utilizatori PickItWell"
				className="mt-8 md:mt-11"
			>
				{/* Mobile Previous / Next controls placed before track in DOM order */}
				<div className="md:hidden flex items-center justify-between gap-3 mb-3">
					<span className="text-xs font-bold text-[#5C665E] dark:text-[#9AA89E] tabular-nums">
						{activeSlide + 1} / {REVIEWS.length}
					</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => scrollByDirection(-1)}
							aria-label="Recenzia anterioară"
							className="w-11 h-11 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] flex items-center justify-center shadow-2xs transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
						>
							<ChevronLeft className="w-5 h-5" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => scrollByDirection(1)}
							aria-label="Recenzia următoare"
							className="w-11 h-11 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] flex items-center justify-center shadow-2xs transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
						>
							<ChevronRight className="w-5 h-5" aria-hidden="true" />
						</button>
					</div>
				</div>

				{/* Track */}
				<div
					ref={trackRef}
					className="flex gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar motion-safe:scroll-smooth touch-pan-x md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:snap-none"
				>
					{REVIEWS.map((review, index) => (
						// biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel slides use role="group" with aria-roledescription="slide"
						<div
							key={review.id}
							ref={(el) => {
								slideRefs.current[index] = el;
							}}
							role="group"
							aria-roledescription="slide"
							aria-label={`${index + 1} din ${REVIEWS.length}`}
							className="flex-none w-full md:w-auto snap-center max-md:first:order-[clamp(0,var(--current)-(var(--children-count,sibling-count())-3),1)] max-md:last:order-[calc(-1*clamp(0,2-var(--current),1))] rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_12px_rgba(27,67,50,0.04)] p-6 flex flex-col justify-between gap-5"
						>
							<div className="space-y-4">
								<div className="flex items-center gap-1 text-[#A67C37] dark:text-[#D4AF6A]">
									<span className="sr-only">
										Evaluare {review.rating} din 5 stele
									</span>
									{[1, 2, 3, 4, 5].map((starNumber) => (
										<Star
											key={`${review.id}-star-${starNumber}`}
											className="w-4.5 h-4.5 fill-current"
											aria-hidden="true"
										/>
									))}
								</div>

								<blockquote className="text-sm sm:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] leading-relaxed">
									&ldquo;{review.text}&rdquo;
								</blockquote>
							</div>

							<p className="pt-3 border-t border-[#F0EAE0] dark:border-[#22332A] text-sm font-extrabold text-[#1B4332] dark:text-[#FCE8C6]">
								{review.name}
							</p>
						</div>
					))}
				</div>

				{/* Visually hidden live status */}
				<output className="sr-only" aria-live="polite">
					{announcement}
				</output>

				{/* Mobile Marker Controls */}
				<nav
					aria-label="Alege o recenzie"
					className="md:hidden mt-4 flex items-center justify-center gap-1.5"
				>
					{REVIEWS.map((review, index) => {
						const isCurrent = activeSlide === index;
						return (
							<button
								key={review.id}
								type="button"
								aria-label={`Mergi la recenzia ${index + 1}`}
								aria-current={isCurrent ? "true" : undefined}
								onClick={() => scrollToMarker(index)}
								className="min-w-9 min-h-9 flex items-center justify-center p-2 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-full"
							>
								<span
									aria-hidden="true"
									className={cn(
										"block h-2.5 rounded-full transition-all",
										isCurrent
											? "w-7 bg-[#1B4332] dark:bg-[#FCE8C6] ring-2 ring-[#1B4332]/25 dark:ring-[#FCE8C6]/30"
											: "w-2.5 bg-[#C9B382]/60 dark:bg-[#3A5245]",
									)}
								/>
							</button>
						);
					})}
				</nav>
			</section>
		</section>
	);
}

function LandingInfoDialog({
	topic,
	onSelectTopic,
	onClose,
}: {
	topic: InfoModalTopic | null;
	onSelectTopic: (topic: InfoModalTopic) => void;
	onClose: () => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const productInputId = useId();
	const detailsInputId = useId();
	const emailInputId = useId();

	const [reportProduct, setReportProduct] = useState("");
	const [reportDetails, setReportDetails] = useState("");
	const [reportEmail, setReportEmail] = useState("");

	const open = topic !== null;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => {
			dialog.returnValue = "";
			onClose();
		};

		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	// Mandatory fallback for browsers lacking <dialog closedby="any">
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

		const isOutside = (e: PointerEvent) => {
			const rect = dialog.getBoundingClientRect();
			return (
				e.clientX < rect.left ||
				e.clientX > rect.right ||
				e.clientY < rect.top ||
				e.clientY > rect.bottom
			);
		};

		let pressedOutside = false;
		const onPointerDown = (e: PointerEvent) => {
			pressedOutside = isOutside(e);
		};
		const onPointerUp = (e: PointerEvent) => {
			if (pressedOutside && isOutside(e)) {
				dialog.close();
			}
			pressedOutside = false;
		};

		dialog.addEventListener("pointerdown", onPointerDown);
		dialog.addEventListener("pointerup", onPointerUp);
		return () => {
			dialog.removeEventListener("pointerdown", onPointerDown);
			dialog.removeEventListener("pointerup", onPointerUp);
		};
	}, []);

	const handleSubmitReport = (e: React.FormEvent) => {
		e.preventDefault();
		if (!reportProduct.trim() || !reportDetails.trim()) {
			toast.error("Te rugăm să completezi numele produsului și descrierea.");
			return;
		}
		toast.success("Mulțumim! Sesizarea a fost trimisă spre verificare.");
		setReportProduct("");
		setReportDetails("");
		setReportEmail("");
		dialogRef.current?.close();
	};

	const activeTopic: InfoModalTopic = topic ?? "metodologie";

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			{...({ closedby: "any" } as Record<string, string>)}
			className="m-auto w-[calc(100%-1.5rem)] max-w-2xl max-h-[88dvh] rounded-3xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] p-0 text-[#1B3328] dark:text-[#EDF2EE] shadow-2xl backdrop:bg-[#0E1612]/65 backdrop:backdrop-blur-xs open:flex open:flex-col overflow-hidden"
		>
			{/* Dialog Header */}
			<div className="px-5 py-4 sm:px-6 border-b border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#131F19] flex items-start justify-between gap-3 shrink-0">
				<div className="min-w-0">
					<h2
						id={titleId}
						className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
					>
						{TOPIC_TITLES[activeTopic]}
					</h2>
				</div>
				<button
					type="button"
					onClick={() => dialogRef.current?.close()}
					aria-label="Închide fereastra"
					className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2B3D33] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] transition-colors cursor-pointer shrink-0"
				>
					<X className="w-4 h-4" aria-hidden="true" />
				</button>
			</div>

			{/* Topic Switcher Strip */}
			<div className="px-5 py-2.5 sm:px-6 border-b border-[#F0EAE0] dark:border-[#22332A] bg-white dark:bg-[#16221C] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
				{INFO_MODAL_TOPICS.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onSelectTopic(item.id)}
						className={cn(
							"shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
							activeTopic === item.id
								? "bg-[#1B4332] text-[#FCE8C6] dark:bg-[#FCE8C6] dark:text-[#1B3328]"
								: "bg-[#FAF8F5] dark:bg-[#121D17] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
						)}
					>
						{item.label}
					</button>
				))}
			</div>

			{/* Scrollable Body */}
			<div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]">
				{activeTopic === "metodologie" && (
					<div className="space-y-4">
						<p>
							PickItWell selectează produse alimentare cu puțini aditivi marcați
							pe etichetă (cu cod E sau clasă funcțională), după aceleași
							criterii cu care facem cumpărăturile pentru familia noastră.
						</p>
						<ul className="space-y-2.5">
							<li className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3.5 flex items-center gap-3">
								<ScoreBadge score="gold" size="sm" />
								<span>
									Produse fără aditivi marcați pe etichetă sau cu un număr
									minim.
								</span>
							</li>
							<li className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3.5 flex items-center gap-3">
								<ScoreBadge score="silver" size="sm" />
								<span>
									Produse cu un număr redus de aditivi marcați pe etichetă.
								</span>
							</li>
							<li className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3.5 flex items-center gap-3">
								<ScoreBadge score="bronze" size="sm" />
								<span>
									Produse cu un număr moderat de aditivi marcați pe etichetă.
								</span>
							</li>
						</ul>
						<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] border-t border-[#EAE4D7] dark:border-[#24362D] pt-3">
							Grupa se bazează doar pe numărul de ingrediente marcate pe
							etichetă ca aditivi și nu reprezintă o evaluare a calității
							nutriționale sau generale a produsului.
						</p>
					</div>
				)}

				{activeTopic === "declinare" && (
					<div className="space-y-3">
						<div className="rounded-2xl bg-[#FBF4E6] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-4 flex items-start gap-3">
							<Info
								className="w-5 h-5 text-[#A67C37] dark:text-[#D4AF6A] shrink-0 mt-0.5"
								aria-hidden="true"
							/>
							<p className="text-xs sm:text-sm text-[#1B3328] dark:text-[#EDF2EE]">
								Informațiile afișate în PickItWell au caracter orientativ.
								Decizia de cumpărare îți aparține în întregime.
							</p>
						</div>
						<p>
							Listele de ingrediente sunt preluate de pe etichetele consultate
							la data menționată pe pagina produsului. Producătorii pot modifica
							rețetele în timp, așa că te rugăm să verifici întotdeauna eticheta
							fizică înainte de cumpărare sau consum (mai ales în caz de alergii
							sau intoleranțe).
						</p>
						<p>
							Magazinele indicate sunt cele în care produsul a fost găsit;
							disponibilitatea în stoc în timp real nu este verificată.
						</p>
					</div>
				)}

				{activeTopic === "raporteaza" && (
					<form onSubmit={handleSubmitReport} className="space-y-4">
						<p className="text-xs sm:text-sm">
							Ai observat o schimbare de rețetă pe etichetă sau o informație
							care necesită actualizare? Trimite-ne detaliile mai jos.
						</p>

						<div className="space-y-1.5">
							<label
								htmlFor={productInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								Produs / Brand
							</label>
							<input
								id={productInputId}
								type="text"
								required
								value={reportProduct}
								onChange={(e) => setReportProduct(e.target.value)}
								placeholder="Ex: Sos de roșii cu busuioc"
								className="w-full min-h-11 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm text-[#1B3328] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor={detailsInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								Ce trebuie corectat?
							</label>
							<textarea
								id={detailsInputId}
								rows={3}
								required
								value={reportDetails}
								onChange={(e) => setReportDetails(e.target.value)}
								placeholder="Descrie diferența observată pe etichetă sau magazinul..."
								className="w-full p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm text-[#1B3328] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor={emailInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								E-mail (opțional)
							</label>
							<input
								id={emailInputId}
								type="email"
								inputMode="email"
								autoComplete="email"
								value={reportEmail}
								onChange={(e) => setReportEmail(e.target.value)}
								placeholder="nume@exemplu.ro"
								className="w-full min-h-11 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm text-[#1B3328] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]"
							/>
						</div>

						<div className="flex justify-end gap-2 pt-1">
							<button
								type="submit"
								className="inline-flex items-center gap-1.5 min-h-10 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] text-[#FCE8C6] text-xs font-bold transition-colors cursor-pointer"
							>
								<CheckCircle2 className="w-4 h-4" aria-hidden="true" />
								<span>Trimite sesizarea</span>
							</button>
						</div>
					</form>
				)}

				{activeTopic === "contact" && (
					<div className="space-y-4">
						<p>
							Ne poți scrie pentru întrebări despre catalog, propuneri de
							produse sau colaborări prin canalele noastre oficiale de
							comunitate:
						</p>
						<ul className="space-y-2">
							{SOCIAL_LINKS.map((item) => {
								const { Icon } = item;
								return (
									<li key={item.id}>
										<a
											href={item.href}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] px-4 py-3 text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] transition-colors"
										>
											<span className="flex items-center gap-2.5">
												<Icon
													className="w-4 h-4 text-[#A67C37] dark:text-[#D4AF6A]"
													aria-hidden="true"
												/>
												<span>{item.label}</span>
											</span>
											<ExternalLink
												className="w-4 h-4 text-[#7D857E]"
												aria-hidden="true"
											/>
										</a>
									</li>
								);
							})}
						</ul>
						<p className="text-xs text-[#5C665E] dark:text-[#9AA89E]">
							E-mail suport: [e-mail]
						</p>
					</div>
				)}

				{activeTopic === "confidentialitate" && (
					<div className="space-y-3">
						<p>
							PickItWell colectează exclusiv datele necesare funcționării
							contului tău: adresa de e-mail, numele afișat, lista de produse
							favorite și ingredientele pe care alegi să le eviți.
						</p>
						<p>
							Poți modifica sau șterge oricând contul și datele asociate direct
							din pagina de Profil din aplicație.
						</p>
					</div>
				)}

				{activeTopic === "termeni" && (
					<div className="space-y-3">
						<p>
							Accesarea și utilizarea aplicației PickItWell presupun acceptarea
							caracterului informativ al datelor despre etichetele produselor
							alimentare și disponibilitatea acestora în magazine.
						</p>
						<p>
							PickItWell nu comercializează produse alimentare și nu oferă
							recomandări medicale sau nutriționale personalizate.
						</p>
					</div>
				)}

				{activeTopic === "cookies" && (
					<div className="space-y-3">
						<p>
							PickItWell utilizează cookie-uri strict necesare pentru
							autentificare, menținerea sesiunii și salvarea preferințelor
							esențiale de navigare.
						</p>
					</div>
				)}
			</div>

			{/* Dialog Footer */}
			<div className="px-5 py-3.5 sm:px-6 border-t border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#131F19] flex items-center justify-between gap-3 shrink-0">
				<span className="inline-flex items-center gap-1.5 text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
					<span>Informațiile sunt orientative</span>
				</span>
				<form method="dialog">
					<button
						type="submit"
						className="min-h-9 px-4 py-1.5 rounded-full border border-[#EAE4D7] dark:border-[#2B3D33] bg-white dark:bg-[#16221C] text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer"
					>
						Închide
					</button>
				</form>
			</div>
		</dialog>
	);
}
