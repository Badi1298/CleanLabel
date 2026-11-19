import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Store } from "lucide-react";
import { SAMPLE_STORES } from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";

export function FinalCtaSection({
	isSignedIn,
	onOpenMethodology,
}: {
	isSignedIn: boolean;
	onOpenMethodology: () => void;
}) {
	const ctaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const ctaLabel = isSignedIn ? "Deschide aplicația" : "Creează cont gratuit";

	return (
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
					{/* Dual-Screen Mockup */}
					<div className="lg:col-span-6 order-2 lg:order-1">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
							{/* Screen 1: Product Page with Marked Additives */}
							<div className="rounded-2xl bg-background dark:bg-sidebar text-foreground border border-[#FCE8C6]/25 p-4 shadow-xl space-y-3">
								<div className="flex items-center justify-between gap-2">
									<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
										Ingrediente marcate
									</span>
									<ScoreBadge score="silver" size="sm" />
								</div>
								<p className="text-sm font-extrabold text-foreground dark:text-[#FBF4E6] leading-snug">
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
								<div className="pt-1 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
									<span>1 aditiv marcat</span>
									<span>18.11.2026</span>
								</div>
							</div>

							{/* Screen 2: Stores & Alternatives */}
							<div className="rounded-2xl bg-background dark:bg-sidebar text-foreground border border-[#FCE8C6]/25 p-4 shadow-xl space-y-3">
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
											className="flex items-center justify-between rounded-xl bg-card border border-border px-2.5 py-1.5 text-xs font-bold"
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
							<Button
								asChild
								className="h-auto min-h-13 px-8 py-4 rounded-full bg-[#FCE8C6] hover:bg-[#F7DDA9] text-[#1B3328] text-base font-extrabold shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
							>
								<Link to={ctaTarget}>
									<span>{ctaLabel}</span>
									<ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
								</Link>
							</Button>

							<p className="text-xs font-semibold text-[#FCE8C6]/85">
								Decizia îți aparține.
							</p>

							<Button
								type="button"
								variant="link"
								onClick={onOpenMethodology}
								className="mt-1 h-auto p-0 gap-1 text-xs font-bold text-[#FCE8C6]/90 hover:text-white underline underline-offset-4"
							>
								<span>Vezi cum selectăm</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
