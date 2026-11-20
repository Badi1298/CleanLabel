import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown } from "lucide-react";
import { useId } from "react";
import {
	type InfoModalTopic,
	LEGAL_LAST_UPDATED_DATE,
	LEGAL_LAST_UPDATED_ISO,
} from "#/components/landing/landing-data";
import { LandingFooter } from "#/components/landing/landing-footer";
import { LandingHeader } from "#/components/landing/landing-header";
import { LandingInfoDialog } from "#/components/landing/landing-info-dialog";
import { Badge } from "#/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";

export interface LegalSectionTocItem {
	id: string;
	number: number;
	title: string;
}

interface LandingLegalLayoutProps {
	isSignedIn: boolean;
	currentPath: "/metodologie" | "/disclaimer";
	breadcrumbLabel: string;
	badgeLabel: string;
	title: string;
	subtitle: string;
	companionLink: {
		to: "/metodologie" | "/disclaimer";
		label: string;
		description: string;
	};
	tocItems: readonly LegalSectionTocItem[];
	modalTopic: InfoModalTopic | null;
	onSelectModalTopic: (topic: InfoModalTopic | null) => void;
	children: React.ReactNode;
}

/**
 * Shared botanical-styled document shell for public legal/methodology pages
 * linked from the PickItWell landing page.
 */
export function LandingLegalLayout({
	isSignedIn,
	currentPath,
	breadcrumbLabel,
	badgeLabel,
	title,
	subtitle,
	companionLink,
	tocItems,
	modalTopic,
	onSelectModalTopic,
	children,
}: LandingLegalLayoutProps) {
	const headingId = useId();

	return (
		<div
			lang="ro"
			id="top"
			className="min-h-screen flex flex-col bg-background text-foreground"
		>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#1B4332] focus:text-[#FCE8C6] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
			>
				Sari la conținut
			</a>

			<LandingHeader isSignedIn={isSignedIn} isLandingPage={false} />

			{/* Forest Green Document Hero */}
			<section
				aria-labelledby={headingId}
				className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-3xl md:rounded-b-[2.5rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]"
			>
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.12),transparent_58%)]"
					aria-hidden="true"
				/>
				<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-9 sm:pt-8 sm:pb-12 space-y-5">
					<Breadcrumb aria-label="Traseu pagină">
						<BreadcrumbList className="text-xs sm:text-sm text-[#FCE8C6]/80">
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link
										to="/landing"
										className="text-[#FCE8C6]/80 hover:text-[#FCE8C6] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6] rounded-sm"
									>
										Acasă
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-[#FCE8C6]/50" />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link
										to={currentPath}
										aria-current="page"
										className="font-bold text-[#FCE8C6] hover:text-[#FCE8C6] forced-colors:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6] rounded-sm"
									>
										{breadcrumbLabel}
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="space-y-3 max-w-3xl">
						<Badge
							variant="outline"
							className="max-w-full whitespace-normal rounded-full bg-[#FBF4E6]/12 border-[#FBF4E6]/22 px-3.5 py-1 text-xs font-semibold text-[#FCE8C6]"
						>
							{badgeLabel}
						</Badge>
						<h1
							id={headingId}
							className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold tracking-tight leading-tight text-[#FCE8C6] text-balance"
						>
							{title}
						</h1>
						<p className="max-w-[65ch] text-sm sm:text-base text-[#FBF4E6]/88 font-medium leading-relaxed text-pretty">
							{subtitle}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3 pt-1">
						<span className="inline-flex items-center gap-2 rounded-full bg-[#FBF4E6]/10 border border-[#FBF4E6]/20 px-3.5 py-1.5 text-xs font-semibold text-[#FCE8C6]">
							<Calendar
								className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0"
								aria-hidden="true"
							/>
							<span>
								Ultima actualizare:{" "}
								<time dateTime={LEGAL_LAST_UPDATED_ISO}>
									{LEGAL_LAST_UPDATED_DATE}
								</time>
							</span>
						</span>

						<Link
							to={companionLink.to}
							className="inline-flex items-center gap-1.5 min-h-9 rounded-full bg-[#FCE8C6] hover:bg-[#F7DDA9] text-[#1B3328] px-4 py-1.5 text-xs font-extrabold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
						>
							<span>{companionLink.label}</span>
							<ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			{/* Main Content + Table of Contents */}
			<main
				id="main-content"
				className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8 sm:py-10 md:py-14"
			>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
					{/* Mobile Collapsible Table of Contents */}
					<div className="lg:hidden">
						<details className="group rounded-2xl bg-card border border-border overflow-hidden shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<summary className="flex items-center justify-between gap-3 px-4 py-3.5 min-h-12 cursor-pointer text-sm font-bold text-foreground hover:bg-secondary/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
								<span>Cuprins ({tocItems.length} secțiuni)</span>
								<ChevronDown
									className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
									aria-hidden="true"
								/>
							</summary>
							<nav
								aria-label="Cuprins document mobil"
								className="px-4 pb-4 pt-2 border-t border-border"
							>
								<TocLinksList items={tocItems} />
							</nav>
						</details>
					</div>

					{/* Desktop Sticky Sidebar */}
					<aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-4">
						<Card className="rounded-3xl bg-card border-border p-5 gap-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<h2 className="text-sm font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance">
								Cuprins document
							</h2>
							<nav aria-label="Cuprins document">
								<TocLinksList items={tocItems} />
							</nav>
						</Card>

						<Card className="rounded-3xl bg-[#FBF4E6] dark:bg-card border-border p-5 gap-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
							<div className="space-y-1.5">
								<p className="text-sm font-extrabold text-foreground dark:text-[#FBF4E6]">
									{companionLink.label}
								</p>
								<p className="text-xs text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed text-pretty">
									{companionLink.description}
								</p>
								<div className="pt-1">
									<Link
										to={companionLink.to}
										className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4 hover:text-[#2D5A44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
									>
										<span>Deschide documentul</span>
										<ArrowRight
											className="w-3.5 h-3.5 shrink-0"
											aria-hidden="true"
										/>
									</Link>
								</div>
							</div>

							<Separator />

							<div className="space-y-1.5">
								<p className="text-xs font-semibold text-muted-foreground text-pretty">
									Erori de verificare sau întrebări din partea producătorilor:
								</p>
								<button
									type="button"
									onClick={() => onSelectModalTopic("contact")}
									className="inline-flex items-center text-xs font-bold text-[#2D5A44] dark:text-emerald-400 underline underline-offset-4 hover:text-[#1B4332] dark:hover:text-emerald-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
								>
									Contactează echipa PickItWell
								</button>
							</div>
						</Card>
					</aside>

					{/* Main Legal Article */}
					<div className="lg:col-span-8 space-y-6 min-w-0">
						<article className="rounded-3xl bg-card border border-border shadow-[0_6px_24px_rgba(27,67,50,0.05)] p-5 sm:p-8 md:p-10">
							<div className="divide-y divide-border">{children}</div>

							<div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
								<p className="text-pretty">
									Ultima actualizare:{" "}
									<time
										dateTime={LEGAL_LAST_UPDATED_ISO}
										className="font-semibold text-foreground"
									>
										{LEGAL_LAST_UPDATED_DATE}
									</time>
								</p>
								<button
									type="button"
									onClick={() => onSelectModalTopic("contact")}
									className="font-bold text-[#2D5A44] dark:text-emerald-400 hover:underline underline-offset-4 cursor-pointer text-left sm:text-right focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-sm"
								>
									Ai o întrebare sau o sesizare? Contactează-ne
								</button>
							</div>
						</article>

						<div className="flex flex-wrap items-center justify-between gap-3">
							<Button
								asChild
								variant="outline"
								className="h-auto min-h-10 px-4 py-2 rounded-full border-border bg-card text-xs font-bold text-foreground hover:bg-secondary"
							>
								<Link to="/landing">
									<ArrowLeft
										className="w-3.5 h-3.5 shrink-0"
										aria-hidden="true"
									/>
									<span>Înapoi la PickItWell</span>
								</Link>
							</Button>

							<Button
								asChild
								className="h-auto min-h-10 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-bold"
							>
								<Link to={companionLink.to}>
									<span>{companionLink.label}</span>
									<ArrowRight
										className="w-3.5 h-3.5 shrink-0"
										aria-hidden="true"
									/>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</main>

			<LandingFooter
				isLandingPage={false}
				onOpenInfoModal={(selected) => onSelectModalTopic(selected)}
			/>

			<LandingInfoDialog
				topic={modalTopic}
				isSignedIn={isSignedIn}
				onSelectTopic={(selected) => onSelectModalTopic(selected)}
				onClose={() => onSelectModalTopic(null)}
			/>
		</div>
	);
}

function TocLinksList({ items }: { items: readonly LegalSectionTocItem[] }) {
	return (
		<ol className="space-y-1">
			{items.map((item) => (
				<li key={item.id}>
					<a
						href={`#${item.id}`}
						className="flex items-start gap-2.5 min-h-9 rounded-xl px-2.5 py-2 text-xs sm:text-[13px] font-semibold text-[#4A554E] dark:text-[#B8C4BC] hover:bg-secondary/75 hover:text-[#1B4332] dark:hover:text-[#FCE8C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
					>
						<span className="tabular-nums font-bold text-[#A67C37] dark:text-[#D4AF6A] shrink-0">
							{item.number}.
						</span>
						<span className="text-pretty leading-snug">{item.title}</span>
					</a>
				</li>
			))}
		</ol>
	);
}

/**
 * Numbered section block for legal and methodology documents.
 */
export function LegalSection({
	id,
	number,
	title,
	children,
}: {
	id: string;
	number: number;
	title: string;
	children: React.ReactNode;
}) {
	const headingId = `${id}-heading`;

	return (
		<section
			id={id}
			aria-labelledby={headingId}
			className="scroll-mt-24 py-6 first:pt-0 last:pb-0 space-y-3"
		>
			<div className="flex items-start gap-3">
				<span
					aria-hidden="true"
					className="inline-flex min-w-7 min-h-7 px-2 rounded-full bg-[#FBF4E6] dark:bg-amber-950/50 border border-[#D4AF6A]/45 text-xs font-extrabold tabular-nums text-[#A67C37] dark:text-[#D4AF6A] items-center justify-center shrink-0 mt-0.5"
				>
					{number}
				</span>
				<h2
					id={headingId}
					className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance"
				>
					{number}. {title}
				</h2>
			</div>

			<div className="max-w-[68ch] space-y-3 text-sm sm:text-[15px] leading-relaxed text-[#4A554E] dark:text-[#B8C4BC] break-words sm:pl-10">
				{children}
			</div>
		</section>
	);
}
