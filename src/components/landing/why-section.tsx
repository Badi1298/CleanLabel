import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { WHY_CARDS } from "#/components/landing/landing-data";
import { WhyBenefitIcon } from "#/components/landing/why-icons";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";

export function WhySection() {
	return (
		<section
			id="de-ce-pickitwell"
			aria-labelledby="why-heading"
			className="scroll-mt-20 bg-card dark:bg-[#121D17] border-y border-border py-16 md:py-24"
		>
			<div className="max-w-5xl mx-auto px-4 md:px-6">
				<div className="max-w-2xl mx-auto text-center">
					<h2
						id="why-heading"
						className="display-title text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance"
					>
						Alegerile alimentare nu trebuie să fie complicate.
					</h2>
					<p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium text-pretty">
						Produsele, ingredientele și magazinele în care au fost găsite,
						într-un singur loc.
					</p>
				</div>

				<div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
					{WHY_CARDS.map((card) => (
						<Card
							key={card.id}
							className="rounded-3xl bg-[#FBF4E6] dark:bg-[#19251E] border-[#E5DAC2] dark:border-border p-6 sm:p-7 gap-4 shadow-none"
						>
							<article className="flex flex-col gap-4 h-full">
								<div className="text-[#A67C37] dark:text-[#D8AB54]">
									<WhyBenefitIcon iconKey={card.iconKey} className="w-8 h-8" />
								</div>

								<div className="space-y-2 flex-1">
									<h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]">
										{card.title}
									</h3>
									<p className="text-sm sm:text-[15px] text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
										{card.description}
									</p>
								</div>

								{card.hasMethodologyLink && (
									<div className="pt-1">
										<Button
											asChild
											variant="link"
											className="h-auto p-0 gap-1 text-xs font-bold text-[#2D5A44] dark:text-[#D8AB54] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] underline underline-offset-4"
										>
											<Link to="/metodologie">
												<span>Vezi cum selectăm</span>
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
					))}
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
