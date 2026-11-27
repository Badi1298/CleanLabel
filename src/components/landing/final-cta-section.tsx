import { Link } from "@tanstack/react-router";
import { Download, Store } from "lucide-react";
import { BrandLogo } from "#/components/brand-logo";
import { SAMPLE_STORES } from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";
import { usePwaInstall } from "#/lib/pwa-install";
import { m } from "#/paraglide/messages.js";

export function FinalCtaSection({ isSignedIn }: { isSignedIn: boolean }) {
	const ctaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const ctaLabel = isSignedIn
		? m.landing_header_cta_signed_in()
		: m.landing_final_cta_signed_out();
	const { canInstall, isInstalling, triggerInstall } = usePwaInstall();

	return (
		<section
			aria-labelledby="final-cta-heading"
			className="max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-24"
		>
			<div className="rounded-3xl md:rounded-[2.5rem] bg-[#1B4332] dark:bg-[#173729] text-[#FBF4E6] shadow-[0_16px_40px_rgba(27,67,50,0.18)] p-6 sm:p-10 md:p-12 lg:p-14">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
					{/* Overlapping Dual-Phone Mockup */}
					<div className="lg:col-span-6 order-2 lg:order-1">
						<div className="flex flex-col sm:flex-row items-center justify-center">
							{/* Phone 1 (Back-left): Product Page with Marked Additives */}
							<div className="w-full max-w-60 rounded-[1.85rem] bg-[#0E1612] p-2 border border-[#FCE8C6]/20 shadow-2xl">
								<div className="rounded-[1.35rem] bg-background dark:bg-sidebar text-foreground overflow-hidden">
									<div className="bg-[#1B4332] px-3 py-2 flex items-center justify-between">
										<BrandLogo surface="dark" size="xs" />
										<ScoreBadge score="silver" size="sm" />
									</div>
									<div className="p-3.5 space-y-2.5">
										<p className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
											{m.landing_final_marked_ingredients()}
										</p>
										<p className="text-sm font-extrabold text-foreground dark:text-[#FBF4E6] leading-snug">
											{m.landing_final_bread_name()}
										</p>
										<p className="text-xs leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]">
											{m.landing_final_bread_ingredients_prefix()}{" "}
											<mark className="rounded bg-[#FBF4E6] dark:bg-[#2A2416] border border-[#D8AB54]/55 text-[#1B3328] dark:text-[#FCE8C6] px-1 py-0.5 font-semibold">
												{m.landing_final_bread_ingredients_mark()}
											</mark>
											.
										</p>
										<div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
											<span>
												{m.common_additives_marked_count({ count: 1 })}
											</span>
											<span>18.11.2026</span>
										</div>
									</div>
								</div>
							</div>

							{/* Phone 2 (Front-right overlapping): Stores Screen */}
							<div className="w-full max-w-60 mt-4 sm:mt-8 sm:-ml-6 relative z-10 rounded-[1.85rem] bg-[#0E1612] p-2 border border-[#FCE8C6]/25 shadow-2xl">
								<div className="rounded-[1.35rem] bg-background dark:bg-sidebar text-foreground overflow-hidden">
									<div className="bg-[#1B4332] px-3 py-2 flex items-center justify-between">
										<span className="text-[10px] font-bold uppercase tracking-wider text-[#FCE8C6]/85">
											{m.landing_final_availability()}
										</span>
										<Badge
											variant="secondary"
											className="bg-[#D8AB54]/20 text-[#FCE8C6] border-0 px-2 py-0 text-[10px] font-bold"
										>
											{m.common_stores_count({ count: SAMPLE_STORES.length })}
										</Badge>
									</div>
									<div className="p-3.5 space-y-2.5">
										<p className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
											{m.landing_final_where_found()}
										</p>
										<ul className="space-y-1.5">
											{SAMPLE_STORES.map((storeName) => (
												<li
													key={storeName}
													className="flex items-center gap-2 rounded-xl bg-card border border-border px-2.5 py-2 text-xs font-bold"
												>
													<Store
														className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400 shrink-0"
														aria-hidden="true"
													/>
													<span>{storeName}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Copy & Heritage Gold CTA on Forest Green */}
					<div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left space-y-4">
						<h2
							id="final-cta-heading"
							className="display-title text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-[#FCE8C6] text-balance"
						>
							{m.landing_final_title()}
						</h2>
						<p className="text-sm sm:text-base text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
							{m.landing_final_subtitle()}
						</p>

						<div className="pt-2 flex flex-col items-center lg:items-start gap-2.5">
							<div className="flex flex-col items-center lg:items-start w-full sm:w-auto">
								<Button
									asChild
									className="w-full sm:w-auto h-auto min-h-13 px-8 py-4 rounded-full bg-[#D8AB54] hover:bg-[#E2BA68] text-[#112A1F] text-base font-extrabold shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Link to={ctaTarget}>{ctaLabel}</Link>
								</Button>

								<div
									className="pwa-install-expand self-stretch sm:self-auto -mx-1"
									data-open={canInstall ? "true" : "false"}
									aria-hidden={!canInstall}
									inert={!canInstall || undefined}
								>
									<div className="pwa-install-expand-inner">
										<div className="pt-3 px-1 pb-1 flex justify-center lg:justify-start">
											<Button
												type="button"
												variant="outline"
												tabIndex={canInstall ? undefined : -1}
												aria-disabled={isInstalling || undefined}
												onClick={triggerInstall}
												className="w-full sm:w-auto h-auto min-h-13 px-6 py-4 rounded-full border-[#FCE8C6]/35 dark:border-[#FCE8C6]/35 bg-[#FBF4E6]/10 dark:bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 dark:hover:bg-[#FBF4E6]/18 hover:text-[#FCE8C6] text-[#FCE8C6] text-base font-bold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
											>
												<Download
													className="w-4 h-4 shrink-0"
													aria-hidden="true"
												/>
												<span>
													{isInstalling
														? m.pwa_install_installing()
														: m.pwa_install_button()}
												</span>
											</Button>
										</div>
									</div>
								</div>
							</div>

							<p className="text-xs font-semibold text-[#FCE8C6]/85">
								{m.landing_final_note()}
							</p>

							<Button
								asChild
								variant="link"
								className="mt-1 h-auto p-0 gap-1 text-xs font-bold text-[#FCE8C6]/90 hover:text-white underline underline-offset-4 decoration-[#D8AB54]/70 hover:decoration-[#D8AB54]"
							>
								<Link to="/metodologie">
									{m.landing_why_methodology_link()}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
