import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { WHY_CARDS } from "#/components/landing/landing-data";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";

export function WhySection() {
	return (
		<section
			id="de-ce-pickitwell"
			aria-labelledby="why-heading"
			className="scroll-mt-20 bg-sidebar border-y border-border py-14 md:py-20"
		>
			<div className="max-w-6xl mx-auto px-4 md:px-6">
				<div className="max-w-2xl mx-auto text-center">
					<h2
						id="why-heading"
						className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
					>
						Alegerile alimentare nu trebuie să fie complicate.
					</h2>
					<p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
						Produsele, ingredientele și magazinele în care au fost găsite,
						într-un singur loc.
					</p>
				</div>

				<div className="mt-8 md:mt-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
					{WHY_CARDS.map((card) => {
						const { Icon } = card;
						return (
							<Card
								key={card.id}
								className="rounded-3xl bg-[#FBF4E6] dark:bg-card border-border p-6 gap-4 shadow-[0_2px_10px_rgba(27,67,50,0.03)]"
							>
								<article className="flex flex-col gap-4 h-full">
									<div className="w-11 h-11 rounded-2xl bg-[#FEF3C7]/80 dark:bg-amber-950/50 border border-[#D4AF6A]/45 text-[#A67C37] dark:text-[#D4AF6A] flex items-center justify-center shrink-0">
										<Icon
											className="w-5 h-5"
											strokeWidth={1.9}
											aria-hidden="true"
										/>
									</div>

									<div className="space-y-2 flex-1">
										<h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]">
											{card.title}
										</h3>
										<p className="text-sm text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
											{card.description}
										</p>
									</div>

									{card.hasMethodologyLink && (
										<div className="pt-1">
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
								</article>
							</Card>
						);
					})}
				</div>

				<p className="mt-7 max-w-3xl mx-auto text-center text-xs text-muted-foreground leading-relaxed">
					Grupele se bazează doar pe numărul de ingrediente marcate pe etichetă
					ca aditivi și nu reprezintă o evaluare a calității produselor.
					Disponibilitatea în stoc nu este verificată.
				</p>
			</div>
		</section>
	);
}
