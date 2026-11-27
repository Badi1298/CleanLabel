import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getReviews } from "#/components/landing/landing-data";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "#/components/ui/carousel";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";

export function ReviewsSection() {
	const [api, setApi] = useState<CarouselApi>();
	const [activeSlide, setActiveSlide] = useState(0);
	const [announcement, setAnnouncement] = useState("");
	const reviews = getReviews();

	useEffect(() => {
		if (!api) return;

		const syncInitial = () => {
			setActiveSlide(api.selectedScrollSnap());
		};

		const handleSelect = () => {
			const next = api.selectedScrollSnap();
			setActiveSlide(next);
			setAnnouncement(
				m.landing_reviews_announcement({
					current: next + 1,
					total: reviews.length,
				}),
			);
		};

		syncInitial();
		api.on("reInit", syncInitial);
		api.on("select", handleSelect);

		return () => {
			api.off("select", handleSelect);
			api.off("reInit", syncInitial);
		};
	}, [api, reviews.length]);

	return (
		<section
			id="recenzii"
			aria-labelledby="recenzii-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24"
		>
			<div className="max-w-2xl mx-auto text-center">
				<h2
					id="recenzii-heading"
					className="display-title text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance"
				>
					{m.landing_reviews_title()}
				</h2>
				<p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium text-pretty">
					{m.landing_reviews_subtitle()}
				</p>
			</div>

			<Carousel
				setApi={setApi}
				opts={{
					loop: true,
					align: "start",
					breakpoints: { "(min-width: 768px)": { active: false } },
				}}
				aria-label={m.landing_reviews_carousel_aria()}
				className="mt-9 md:mt-12"
			>
				{/* Mobile Previous / Next controls placed before track in DOM order */}
				<div className="md:hidden flex items-center justify-between gap-3 mb-3">
					<span className="text-xs font-bold text-muted-foreground tabular-nums">
						{activeSlide + 1} / {reviews.length}
					</span>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => api?.scrollPrev()}
							aria-label={m.landing_reviews_prev()}
							className="w-11 h-11 rounded-full bg-card border-border text-foreground hover:border-[#2D5A44] shadow-2xs touch-manipulation"
						>
							<ChevronLeft className="w-5 h-5" aria-hidden="true" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => api?.scrollNext()}
							aria-label={m.landing_reviews_next()}
							className="w-11 h-11 rounded-full bg-card border-border text-foreground hover:border-[#2D5A44] shadow-2xs touch-manipulation"
						>
							<ChevronRight className="w-5 h-5" aria-hidden="true" />
						</Button>
					</div>
				</div>

				<CarouselContent
					viewportClassName="py-1 -my-1 md:overflow-visible"
					className="md:ml-0 md:grid md:grid-cols-3 md:gap-6"
				>
					{reviews.map((review, index) => (
						<CarouselItem
							key={review.id}
							aria-label={m.landing_reviews_slide_of({
								current: index + 1,
								total: reviews.length,
							})}
							className="pl-4 md:pl-0 flex"
						>
							<Card className="w-full rounded-3xl bg-sidebar dark:bg-card border-border shadow-none p-6 sm:p-7 justify-between gap-5">
								<div className="space-y-4">
									<div className="flex items-center justify-between gap-3">
										<div
											role="img"
											aria-label={m.landing_reviews_rating_aria({
												rating: review.rating,
											})}
											className="flex items-center gap-1 text-[#A67C37] dark:text-[#D8AB54]"
										>
											{[1, 2, 3, 4, 5].map((starNumber) => (
												<Star
													key={`${review.id}-star-${starNumber}`}
													className="w-4 h-4 fill-current"
													aria-hidden="true"
												/>
											))}
										</div>
										<span
											aria-hidden="true"
											className="display-title text-3xl leading-none font-bold text-[#D8AB54]/65 select-none"
										>
											&bdquo;
										</span>
									</div>

									<blockquote className="text-sm sm:text-[15px] text-foreground leading-relaxed">
										&bdquo;{review.text}&rdquo;
									</blockquote>
								</div>

								<p className="pt-3 border-t border-[#F0EAE0] dark:border-[#22332A] text-sm font-extrabold text-[#1B4332] dark:text-[#FCE8C6]">
									{review.name}
								</p>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Visually hidden live status */}
				<output className="sr-only" aria-live="polite">
					{announcement}
				</output>

				{/* Mobile Marker Controls */}
				<nav
					aria-label={m.landing_reviews_nav_aria()}
					className="md:hidden mt-4 flex items-center justify-center gap-1.5"
				>
					{reviews.map((review, index) => {
						const isCurrent = activeSlide === index;
						return (
							<button
								key={review.id}
								type="button"
								aria-label={m.landing_reviews_goto({ number: index + 1 })}
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
