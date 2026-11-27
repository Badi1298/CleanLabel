import { Link } from "@tanstack/react-router";
import { Calendar, Download, Store } from "lucide-react";
import { BrandLogo } from "#/components/brand-logo";
import {
	getHeroTierExamples,
	HERO_STORES,
} from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";
import { usePwaInstall } from "#/lib/pwa-install";
import { m } from "#/paraglide/messages.js";

export function HeroSection({
	heroHeadingId,
	isSignedIn,
}: {
	heroHeadingId: string;
	isSignedIn: boolean;
}) {
	const primaryCtaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const primaryCtaLabel = isSignedIn
		? m.landing_header_cta_signed_in()
		: m.landing_hero_cta_signed_out();
	const heroTierExamples = getHeroTierExamples();
	const { canInstall, isInstalling, triggerInstall } = usePwaInstall();

	const secondaryLinkClassName =
		"inline-flex items-center justify-center sm:justify-start min-h-10 text-sm font-semibold text-[#FCE8C6]/90 hover:text-[#FCE8C6] underline underline-offset-4 decoration-[#D8AB54]/70 hover:decoration-[#D8AB54] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm";

	return (
		<section
			aria-labelledby={heroHeadingId}
			className="bg-[#1B4332] dark:bg-[#112A1F] text-[#FBF4E6]"
		>
			<div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-14 sm:pt-14 sm:pb-18 lg:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
					{/* Left Column: Copy + CTAs */}
					<div className="lg:col-span-6 space-y-6">
						<h1
							id={heroHeadingId}
							tabIndex={-1}
							className="display-title text-[2.5rem] sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight leading-[1.04] text-[#FCE8C6] text-balance outline-none"
						>
							<span lang="en">{m.landing_hero_slogan()}</span>
						</h1>

						<p className="text-base md:text-[17px] text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl text-pretty">
							{m.landing_hero_subtitle()}
						</p>

						<div className="pt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
							<Button
								asChild
								className="h-auto min-h-12 px-7 py-3.5 rounded-full bg-[#D8AB54] hover:bg-[#E2BA68] text-[#112A1F] text-sm sm:text-base font-extrabold shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
							>
								<Link to={primaryCtaTarget}>{primaryCtaLabel}</Link>
							</Button>

							{canInstall && (
								<Button
									type="button"
									variant="outline"
									aria-disabled={isInstalling || undefined}
									onClick={triggerInstall}
									className="h-auto min-h-12 px-6 py-3.5 rounded-full border-[#FCE8C6]/35 dark:border-[#FCE8C6]/35 bg-[#FBF4E6]/10 dark:bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 dark:hover:bg-[#FBF4E6]/18 hover:text-[#FCE8C6] text-[#FCE8C6] text-sm sm:text-base font-bold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Download className="w-4 h-4 shrink-0" aria-hidden="true" />
									<span>
										{isInstalling
											? m.pwa_install_installing()
											: m.pwa_install_button()}
									</span>
								</Button>
							)}

							{isSignedIn ? (
								<Link to="/search" className={secondaryLinkClassName}>
									{m.landing_hero_secondary_cta()}
								</Link>
							) : (
								<a href="#cum-functioneaza" className={secondaryLinkClassName}>
									{m.landing_hero_secondary_cta()}
								</a>
							)}
						</div>
					</div>

					{/* Right Column: Clean Phone Mockup + Tier Strip */}
					<div className="lg:col-span-6">
						<div className="mx-auto max-w-md lg:max-w-lg flex flex-col items-center">
							{/* Phone Frame */}
							<div className="w-full max-w-77.5 sm:max-w-82.5 rounded-[2.4rem] bg-[#0E1612] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.32)] border border-[#FCE8C6]/22">
								<div className="rounded-[1.9rem] bg-background dark:bg-sidebar text-foreground overflow-hidden">
									{/* Phone Status / Brand Bar */}
									<div className="bg-[#1B4332] px-4 pt-3 pb-3 text-[#FCE8C6] flex items-center justify-between">
										<BrandLogo surface="dark" size="xs" />
										<ScoreBadge score="gold" size="sm" />
									</div>

									{/* Product Details */}
									<div className="p-4 space-y-3">
										<div className="rounded-2xl bg-[#FBF4E6] dark:bg-[#1E261D] border border-[#D8AB54]/45 p-3">
											<div className="flex items-center justify-between gap-2">
												<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
													Olympus
												</span>
												<Badge
													variant="outline"
													className="bg-white/90 dark:bg-card border-[#D8AB54]/40 px-2 py-0.5 text-[10px] font-bold text-[#1B4332] dark:text-[#FCE8C6]"
												>
													{m.landing_hero_phone_additives_badge()}
												</Badge>
											</div>
											<p className="mt-1 text-base font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6] leading-snug">
												{m.landing_hero_phone_product_name()}
											</p>
										</div>

										{/* Declared Ingredients */}
										<div className="rounded-2xl bg-card border border-border p-3 space-y-1.5">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
												{m.landing_hero_phone_ingredients_label()}
											</p>
											<p className="text-xs leading-relaxed text-foreground">
												{m.landing_hero_phone_ingredients_sample()}
											</p>
											<div className="pt-1 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
												<Calendar
													className="w-3 h-3 shrink-0"
													aria-hidden="true"
												/>
												<span>{m.landing_hero_phone_checked_at()}</span>
											</div>
										</div>

										{/* Available Stores */}
										<div className="rounded-2xl bg-card border border-border p-3 space-y-2">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
												{m.landing_hero_phone_stores_label()}
											</p>
											<div className="flex flex-wrap gap-1.5">
												{HERO_STORES.map((store) => (
													<Badge
														key={store}
														variant="outline"
														className="gap-1 bg-[#F6F3EB] dark:bg-secondary border-border dark:border-[#2B3D33] px-2.5 py-0.5 text-[11px] font-semibold text-foreground dark:text-[#CBE3D4]"
													>
														<Store
															className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400"
															aria-hidden="true"
														/>
														<span>{store}</span>
													</Badge>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Balanced 3-Tier Strip Underneath Phone */}
							<div className="mt-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
								{heroTierExamples.map((tier) => (
									<div
										key={tier.score}
										className="rounded-2xl bg-[#FBF4E6]/8 border border-[#FCE8C6]/16 px-3 py-2.5 flex sm:flex-col items-center sm:items-start justify-between gap-2"
									>
										<ScoreBadge score={tier.score} size="sm" />
										<div className="text-right sm:text-left min-w-0">
											<p className="text-xs font-bold text-[#FCE8C6] leading-snug">
												{tier.name}
											</p>
											<p className="text-[11px] font-medium text-[#FBF4E6]/75">
												{tier.additives}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
