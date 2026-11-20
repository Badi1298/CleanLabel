import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { BrandLogo } from "#/components/brand-logo";
import {
	FOOTER_LEGAL_LINKS,
	HEADER_LINKS,
	type InfoModalTopic,
	SOCIAL_LINKS,
} from "#/components/landing/landing-data";
import { Separator } from "#/components/ui/separator";

export function LandingFooter({
	onOpenInfoModal,
	isLandingPage = true,
}: {
	onOpenInfoModal: (topic: InfoModalTopic) => void;
	isLandingPage?: boolean;
}) {
	const brandClassName =
		"inline-flex items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]";
	const brandContent = (
		<BrandLogo surface="adaptive" size="md" loading="lazy" />
	);
	const exploreLinkClassName =
		"inline-flex items-center py-1 text-foreground hover:text-[#2D5A44] dark:hover:text-[#FCE8C6] transition-colors";
	const legalLinkClassName =
		"inline-flex items-center py-1 text-left text-foreground hover:text-[#2D5A44] dark:hover:text-[#FCE8C6] transition-colors";

	return (
		<footer className="bg-sidebar border-t border-border">
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-14">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
					{/* Coloana 1 – PickItWell */}
					<div className="md:col-span-5 space-y-4">
						{isLandingPage ? (
							<a href="#top" className={brandClassName}>
								{brandContent}
							</a>
						) : (
							<Link to="/landing" className={brandClassName}>
								{brandContent}
							</Link>
						)}

						<p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
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
											className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-background dark:bg-card border border-border hover:border-[#2D5A44] text-xs font-semibold text-foreground transition-colors"
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
						<h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Explorează
						</h2>
						<ul className="space-y-2 text-sm font-semibold">
							{HEADER_LINKS.map((item) => (
								<li key={item.href}>
									{isLandingPage ? (
										<a href={item.href} className={exploreLinkClassName}>
											{item.label}
										</a>
									) : (
										<Link
											to="/landing"
											hash={item.hash}
											className={exploreLinkClassName}
										>
											{item.label}
										</Link>
									)}
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
						<h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Suport și informații legale
						</h2>
						<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-1.5 text-sm font-semibold">
							{FOOTER_LEGAL_LINKS.map((item) => (
								<li key={item.kind === "route" ? item.to : item.topicId}>
									{item.kind === "route" ? (
										<Link
											to={item.to}
											className={legalLinkClassName}
											activeProps={{
												className:
													"text-[#1B4332] dark:text-[#FCE8C6] underline underline-offset-4",
											}}
										>
											{item.label}
										</Link>
									) : (
										<button
											type="button"
											onClick={() => onOpenInfoModal(item.topicId)}
											className={`${legalLinkClassName} cursor-pointer`}
										>
											{item.label}
										</button>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="mt-10 mb-6" />

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
					<p>© 2026 PickItWell. Toate drepturile rezervate.</p>
					<p>
						© 2026 [denumirea firmei], CUI [număr], [sediul], [e-mail]. Toate
						drepturile rezervate.
					</p>
				</div>
			</div>
		</footer>
	);
}
