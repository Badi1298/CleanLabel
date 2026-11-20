import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { REVIEWS } from "#/components/landing/landing-data";
import {
	BotanicalFlourish,
	ScrollReveal,
} from "#/components/landing/landing-primitives";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "#/components/ui/carousel";
import { cn } from "#/lib/utils";

export function ReviewsSection() {
	const [api, setApi] = useState<CarouselApi>();
	const [activeSlide, setActiveSlide] = useState(0);
	const [announcement, setAnnouncement] = useState("");

	useEffect(() => {
		if (!api) return;

		const syncInitial = () => {
			setActiveSlide(api.selectedScrollSnap());
		};

		const handleSelect = () => {
			const next = api.selectedScrollSnap();
			setActiveSlide(next);
			setAnnouncement(`Recenzia ${next + 1} din ${REVIEWS.length}`);
		};

		syncInitial();
		api.on("reInit", syncInitial);
		api.on("select", handleSelect);

		return () => {
			api.off("select", handleSelect);
			api.off("reInit", syncInitial);
		};
	}, [api]);

	return (
		<section
			id="recenzii"
			aria-labelledby="recenzii-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20"
		>
			<ScrollReveal>
				<div className="max-w-2xl mx-auto text-center space-y-3">
					<BotanicalFlourish variant="divider" />
					<h2
						id="recenzii-heading"
						className="display-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground dark:text-[#FBF4E6]"
					>
						Ce spun utilizatorii PickItWell?
					</h2>
					<p className="text-sm sm:text-base text-muted-foreground font-medium">
						Opinii trimise de utilizatori despre experiența lor cu PickItWell.
					</p>
				</div>
			</ScrollReveal>

			<Carousel
				setApi={setApi}
				opts={{
					loop: true,
					align: "start",
					breakpoints: { "(min-width: 768px)": { active: false } },
				}}
				aria-label="Recenzii utilizatori PickItWell"
				className="mt-8 md:mt-12"
			>
				{/* Mobile Previous / Next controls placed before track in DOM order */}
				<div className="md:hidden flex items-center justify-between gap-3 mb-3">
					<span className="text-xs font-bold text-muted-foreground tabular-nums">
						{activeSlide + 1} / {REVIEWS.length}
					</span>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => api?.scrollPrev()}
							aria-label="Recenzia anterioară"
							className="w-11 h-11 rounded-full bg-card border-border text-foreground hover:border-[#2D5A44] shadow-2xs touch-manipulation"
						>
							<ChevronLeft className="w-5 h-5" aria-hidden="true" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => api?.scrollNext()}
							aria-label="Recenzia următoare"
							className="w-11 h-11 rounded-full bg-card border-border text-foreground hover:border-[#2D5A44] shadow-2xs touch-manipulation"
						>
							<ChevronRight className="w-5 h-5" aria-hidden="true" />
						</Button>
					</div>
				</div>

				<CarouselContent
					viewportClassName="py-2 -my-2 md:overflow-visible"
					className="md:ml-0 md:grid md:grid-cols-3 md:gap-6"
				>
					{REVIEWS.map((review, index) => {
						const isFeaturedCenter = index === 1;
						return (
							<CarouselItem
								key={review.id}
								aria-label={`${index + 1} din ${REVIEWS.length}`}
								className="pl-4 md:pl-0 flex"
							>
								<Card
									className={cn(
										"w-full rounded-3xl p-6 md:p-7 justify-between gap-5 transition-all duration-200",
										isFeaturedCenter
											? "md:-translate-y-2 bg-[#FBF4E6]/85 dark:bg-[#192820] border-[#D4AF6A]/50 shadow-[0_14px_34px_rgba(27,67,50,0.08)]"
											: "bg-card border-border shadow-[0_4px_16px_rgba(27,67,50,0.04)] hover:border-[#D4AF6A]/45",
									)}
								>
									<div className="space-y-3.5">
										<div className="flex items-center justify-between gap-2">
											<div
												role="img"
												aria-label={`Evaluare ${review.rating} din 5 stele`}
												className="flex items-center gap-1 text-[#C59338] dark:text-[#E2B04E]"
											>
												{[1, 2, 3, 4, 5].map((starNumber) => (
													<Star
														key={`${review.id}-star-${starNumber}`}
														className="w-4.5 h-4.5 fill-current"
														aria-hidden="true"
													/>
												))}
											</div>

											<span
												aria-hidden="true"
												className="display-title text-5xl leading-none text-[#D4AF6A]/40 select-none -mt-2"
											>
												&ldquo;
											</span>
										</div>

										<blockquote className="text-sm sm:text-[15px] text-foreground leading-relaxed">
											&ldquo;{review.text}&rdquo;
										</blockquote>
									</div>

									<div className="pt-3.5 border-t border-[#F0EAE0] dark:border-[#22332A] flex items-center gap-3">
										<span
											aria-hidden="true"
											className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_50%_28%,#157050_0%,#0A4231_65%,#042A20_100%)] border border-[#E2B04E]/65 text-[#F3D58D] text-xs font-extrabold flex items-center justify-center shrink-0"
										>
											{review.name.charAt(0)}
										</span>
										<p className="text-sm font-extrabold text-[#1B4332] dark:text-[#FCE8C6]">
											{review.name}
										</p>
									</div>
								</Card>
							</CarouselItem>
						);
					})}
				</CarouselContent>

				{/* Visually hidden live status */}
				<output className="sr-only" aria-live="polite">
					{announcement}
				</output>

				{/* Mobile Marker Controls */}
				<nav
					aria-label="Alege o recenzie"
					className="md:hidden mt-4 flex items-center justify-center gap-1.5"
				>
					{REVIEWS.map((review, index) => {
						const isCurrent = activeSlide === index;
						return (
							<button
								key={review.id}
								type="button"
								aria-label={`Mergi la recenzia ${index + 1}`}
								aria-current={isCurrent ? "true" : undefined}
								onClick={() => api?.scrollTo(index)}
								className="min-w-9 min-h-9 flex items-center justify-center p-2 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] rounded-full"
							>
								<span
									aria-hidden="true"
									className={cn(
										"block h-2.5 rounded-full transition-all",
										isCurrent
											? "w-7 bg-[#1B4332] dark:bg-[#FCE8C6] ring-2 ring-[#1B4332]/25 dark:ring-[#FCE8C6]/30"
											: "w-2.5 bg-[#C9B382]/60 dark:bg-[#3A5245]",
									)}
								/>
							</button>
						);
					})}
				</nav>
			</Carousel>
		</section>
	);
}
