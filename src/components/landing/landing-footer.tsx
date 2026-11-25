import { Link } from "@tanstack/react-router";
import { BrandLogo } from "#/components/brand-logo";
import {
	FOOTER_EXPLORE_LINKS,
	FOOTER_LEGAL_LINKS,
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
		"inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54]";
	const brandContent = <BrandLogo surface="dark" size="md" loading="lazy" />;
	const exploreLinkClassName =
		"inline-flex items-center py-1 text-[#FBF4E6]/85 hover:text-[#FCE8C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm";
	const legalLinkClassName =
		"inline-flex items-center py-1 text-left text-[#FBF4E6]/85 hover:text-[#FCE8C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm";

	return (
		<footer className="bg-[#112A1F] dark:bg-[#09140F] text-[#FBF4E6] border-t border-[#FCE8C6]/10">
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
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

						<p className="text-sm text-[#FBF4E6]/78 leading-relaxed max-w-sm">
							Produse alimentare selectate după aditivii marcați pe etichetă.
							Decizia îți aparține.
						</p>

						<ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
							{SOCIAL_LINKS.map((social) => {
								const { Icon } = social;
								return (
									<li key={social.id}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[#FCE8C6]/82 hover:text-[#FCE8C6] underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm"
										>
											<Icon
												className="w-3.5 h-3.5 text-[#D8AB54] shrink-0"
												aria-hidden="true"
											/>
											<span>{social.label}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Coloana 2 – Explorează */}
					<div className="md:col-span-3 space-y-3">
						<h2 className="text-xs font-bold uppercase tracking-wider text-[#FCE8C6]/65">
							Explorează
						</h2>
						<ul className="space-y-2 text-sm font-semibold">
							{FOOTER_EXPLORE_LINKS.map((item) => (
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
									className="inline-flex items-center py-1 text-[#D8AB54] hover:text-[#E8C476] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm"
								>
									Deschide aplicația
								</Link>
							</li>
						</ul>
					</div>

					{/* Coloana 3 – Suport și informații legale */}
					<div className="md:col-span-4 space-y-3">
						<h2 className="text-xs font-bold uppercase tracking-wider text-[#FCE8C6]/65">
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
													"text-[#D8AB54] underline underline-offset-4",
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

				<Separator className="mt-10 mb-6 bg-[#FCE8C6]/12" />

				{/* TODO: Add/replace with client legal entity details once provided:
				© 2026 [denumirea firmei], CUI [număr], [sediul], [e-mail]. Toate drepturile rezervate. */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#FBF4E6]/68">
					<p>© 2026 PickItWell. Toate drepturile rezervate.</p>
				</div>
			</div>
		</footer>
	);
}
