import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, ChevronRight, Store } from "lucide-react";
import { HighlightedIngredientsText } from "#/components/HighlightedIngredientsText";
import {
	FINAL_CTA_PRODUCT,
	SAMPLE_STORES,
} from "#/components/landing/landing-data";
import {
	BotanicalFlourish,
	ScrollReveal,
} from "#/components/landing/landing-primitives";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";

export function FinalCtaSection({ isSignedIn }: { isSignedIn: boolean }) {
	const ctaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const ctaLabel = isSignedIn ? "Deschide aplicația" : "Creează cont gratuit";

	return (
		<section
			aria-labelledby="final-cta-heading"
			className="max-w-6xl mx-auto px-4 md:px-6 pb-14 md:pb-20"
		>
			<ScrollReveal>
				<div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-linear-to-br from-[#1B4332] via-[#173B2C] to-[#102B1F] text-[#FBF4E6] shadow-[0_22px_54px_rgba(16,43,31,0.24)] p-6 sm:p-10 md:p-12 lg:p-14">
					<div
						className="pointer-events-none absolute inset-0 landing-botanical-dots"
						aria-hidden="true"
					/>
					<div
						className="pointer-events-none absolute inset-0 landing-grain"
						aria-hidden="true"
					/>
					<div
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(247,225,160,0.14),transparent_55%)]"
						aria-hidden="true"
					/>
					<BotanicalFlourish
						variant="corner"
						className="hidden md:block absolute bottom-0 right-0 w-56 h-56 rotate-90 opacity-75"
					/>

					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-10 items-center">
						{/* Layered Dual-Phone Mockup */}
						<div className="lg:col-span-6 order-2 lg:order-1">
							<div className="relative mx-auto max-w-lg py-2">
								{/* Warm ambient glow behind dual phones */}
								<div
									aria-hidden="true"
									className="pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 h-48 rounded-full bg-[#E2B04E]/18 blur-3xl"
								/>

								<div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 items-start">
									{/* Phone 1: Product Page with Marked Additives */}
									<div className="rounded-[2rem] bg-[#0B1410] p-2 border border-[#E2B04E]/30 shadow-2xl sm:-rotate-2 sm:hover:rotate-0 sm:hover:-translate-y-1 transition-transform duration-300">
										<div className="rounded-[1.5rem] bg-background dark:bg-sidebar text-foreground p-4 space-y-3">
											<div className="flex items-center justify-between gap-2">
												<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
													Ingrediente marcate
												</span>
												<ScoreBadge score={FINAL_CTA_PRODUCT.score} size="sm" />
											</div>

											<div className="flex items-center gap-2.5">
												<img
													src={FINAL_CTA_PRODUCT.image}
													alt={FINAL_CTA_PRODUCT.name}
													width={640}
													height={640}
													loading="lazy"
													decoding="async"
													className="w-12 h-12 rounded-xl object-cover bg-[#F5F1E8] border border-border shrink-0"
												/>
												<p className="display-title text-sm font-semibold text-foreground dark:text-[#FBF4E6] leading-snug">
													{FINAL_CTA_PRODUCT.name}
												</p>
											</div>

											<HighlightedIngredientsText
												text={FINAL_CTA_PRODUCT.ingredients}
												highlightedAdditives={[
													...FINAL_CTA_PRODUCT.highlightedAdditives,
												]}
												className="text-xs leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]"
											/>

											<div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
												<span className="font-semibold text-foreground/80">
													{FINAL_CTA_PRODUCT.additiveLabel}
												</span>
												<span className="inline-flex items-center gap-1">
													<Calendar
														className="w-3 h-3 shrink-0"
														aria-hidden="true"
													/>
													<span>{FINAL_CTA_PRODUCT.checkedDate}</span>
												</span>
											</div>
										</div>
									</div>

									{/* Phone 2: Stores */}
									<div className="rounded-[2rem] bg-[#0B1410] p-2 border border-[#E2B04E]/30 shadow-2xl sm:mt-8 sm:rotate-2 sm:hover:rotate-0 sm:hover:-translate-y-1 transition-transform duration-300">
										<div className="rounded-[1.5rem] bg-background dark:bg-sidebar text-foreground p-4 space-y-3">
											<div className="flex items-center justify-between gap-2">
												<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
													Unde a fost găsit
												</span>
												<Badge
													variant="secondary"
													className="bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold"
												>
													{SAMPLE_STORES.length} magazine
												</Badge>
											</div>

											<ul className="space-y-1.5">
												{SAMPLE_STORES.map((storeName) => (
													<li
														key={storeName}
														className="flex items-center justify-between rounded-xl bg-card border border-border px-2.5 py-2 text-xs font-bold"
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
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Copy & Metallic Gold CTA on Forest Green */}
						<div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left space-y-4">
							<h2
								id="final-cta-heading"
								className="display-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#FCE8C6]"
							>
								Gata să încerci PickItWell?
							</h2>
							<p className="text-sm sm:text-base text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
								Produse selectate după aditivii marcați pe etichetă, cu
								ingredientele declarate de producător și magazinele în care au
								fost găsite.
							</p>

							<div className="pt-2 flex flex-col items-center lg:items-start gap-2.5">
								<Button
									asChild
									className="group h-auto min-h-13 px-8 py-4 rounded-full landing-gold-cta text-base font-extrabold border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Link to={ctaTarget}>
										<span>{ctaLabel}</span>
										<ArrowRight
											className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5"
											aria-hidden="true"
										/>
									</Link>
								</Button>

								<p className="text-xs font-semibold text-[#FCE8C6]/85">
									Decizia îți aparține.
								</p>

								<Button
									asChild
									variant="link"
									className="mt-1 h-auto p-0 gap-1 text-xs font-bold text-[#FCE8C6]/90 hover:text-white underline underline-offset-4"
								>
									<Link to="/metodologie">
										<span>Vezi metodologia</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</ScrollReveal>
		</section>
	);
}
