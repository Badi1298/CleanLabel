import { Link } from "@tanstack/react-router";
import { ChevronRight, Store } from "lucide-react";
import { SAMPLE_STORES, WHY_CARDS } from "#/components/landing/landing-data";
import {
	BotanicalFlourish,
	EmeraldGoldMedallion,
	ScrollReveal,
} from "#/components/landing/landing-primitives";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { ScoreBadge } from "#/components/ui/score-badge";
import { cn } from "#/lib/utils";

const BENTO_SPAN_BY_ID: Record<string, string> = {
	criterii: "lg:col-span-7",
	grupe: "lg:col-span-5",
	magazine: "lg:col-span-5",
	alegere: "lg:col-span-7",
};

export function WhySection() {
	return (
		<section
			id="de-ce-pickitwell"
			aria-labelledby="why-heading"
			className="relative overflow-hidden scroll-mt-20 bg-sidebar border-y border-border/80 py-14 md:py-20"
		>
			<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
				<ScrollReveal>
					<div className="max-w-2xl mx-auto text-center space-y-3">
						<BotanicalFlourish variant="divider" />
						<h2
							id="why-heading"
							className="display-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground dark:text-[#FBF4E6]"
						>
							Alegerile alimentare nu trebuie să fie complicate.
						</h2>
						<p className="text-sm sm:text-base text-muted-foreground font-medium">
							Produsele, ingredientele și magazinele în care au fost găsite,
							într-un singur loc.
						</p>
					</div>
				</ScrollReveal>

				<div className="mt-8 md:mt-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
					{WHY_CARDS.map((card, index) => {
						const { Icon } = card;
						return (
							<ScrollReveal
								key={card.id}
								delay={index * 0.06}
								className={cn(
									"flex",
									BENTO_SPAN_BY_ID[card.id] ?? "lg:col-span-6",
								)}
							>
								<Card className="w-full relative overflow-hidden rounded-3xl bg-[#FBF4E6] dark:bg-card border-border hover:border-[#D4AF6A]/65 hover:-translate-y-0.5 transition-all duration-200 p-6 md:p-7 gap-5 shadow-[0_4px_18px_rgba(27,67,50,0.04)]">
									<article className="flex flex-col justify-between gap-5 h-full">
										<div className="flex flex-col gap-4">
											<div className="flex items-start justify-between gap-4">
												<EmeraldGoldMedallion Icon={Icon} />

												{card.id === "criterii" && (
													<div className="flex items-center gap-1.5 rounded-full bg-white/75 dark:bg-secondary/75 border border-[#D4AF6A]/40 px-2.5 py-1 text-[11px] font-bold text-[#1B4332] dark:text-[#CBE3D4]">
														<span>0</span>
														<span className="text-[#D4AF6A]">·</span>
														<span>1–2</span>
														<span className="text-[#D4AF6A]">·</span>
														<span>3–4</span>
													</div>
												)}
											</div>

											<div className="space-y-2">
												<h3 className="display-title text-lg sm:text-xl font-semibold tracking-tight text-foreground dark:text-[#FBF4E6]">
													{card.title}
												</h3>
												<p className="text-sm text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed max-w-xl">
													{card.description}
												</p>
											</div>
										</div>

										{/* Card-specific visual proof strip */}
										{card.hasMethodologyLink && (
											<div className="pt-1 flex items-center justify-between gap-3">
												<Button
													asChild
													variant="link"
													className="h-auto p-0 gap-1 text-xs font-bold text-[#2D5A44] dark:text-emerald-400 hover:text-[#1B4332] dark:hover:text-emerald-300 underline underline-offset-4"
												>
													<Link to="/metodologie">
														<span>Vezi metodologia</span>
														<ChevronRight
															className="w-3.5 h-3.5"
															aria-hidden="true"
														/>
													</Link>
												</Button>
											</div>
										)}

										{card.id === "grupe" && (
											<div className="pt-1 flex flex-wrap items-center gap-2">
												<ScoreBadge score="gold" size="sm" />
												<ScoreBadge score="silver" size="sm" />
												<ScoreBadge score="bronze" size="sm" />
											</div>
										)}

										{card.id === "magazine" && (
											<div className="pt-1 flex flex-wrap items-center gap-1.5">
												{SAMPLE_STORES.map((storeName) => (
													<Badge
														key={storeName}
														variant="outline"
														className="gap-1 bg-white/85 dark:bg-secondary border-border px-2.5 py-0.5 text-[11px] font-semibold text-foreground"
													>
														<Store
															className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400"
															aria-hidden="true"
														/>
														<span>{storeName}</span>
													</Badge>
												))}
											</div>
										)}

										{card.id === "alegere" && (
											<div className="pt-1 flex flex-wrap items-center gap-2">
												<Badge
													variant="outline"
													className="bg-white/85 dark:bg-secondary border-[#D4AF6A]/45 px-2.5 py-0.5 text-[11px] font-bold text-[#1B4332] dark:text-[#CBE3D4]"
												>
													Ingrediente declarate
												</Badge>
												<Badge
													variant="outline"
													className="bg-[#E3EDE7]/80 dark:bg-[#1E3A2C] border-[#2D5A44]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#1B4332] dark:text-[#CBE3D4]"
												>
													Alternative Gold
												</Badge>
											</div>
										)}
									</article>
								</Card>
							</ScrollReveal>
						);
					})}
				</div>

				<p className="mt-8 max-w-3xl mx-auto text-center text-xs text-muted-foreground leading-relaxed">
					Grupele se bazează doar pe numărul de ingrediente marcate pe etichetă
					ca aditivi și nu reprezintă o evaluare a calității produselor.
					Disponibilitatea în stoc nu este verificată.
				</p>
			</div>
		</section>
	);
}
