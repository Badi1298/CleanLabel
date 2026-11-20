import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Sparkles, Store } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { BrandLogo } from "#/components/brand-logo";
import { HighlightedIngredientsText } from "#/components/HighlightedIngredientsText";
import {
	HERO_TIER_PREVIEWS,
	type HeroTier,
} from "#/components/landing/landing-data";
import { BotanicalFlourish } from "#/components/landing/landing-primitives";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";
import { cn } from "#/lib/utils";

const CARD_LAYOUT_CLASSES: Record<HeroTier, string> = {
	gold: "lg:absolute lg:top-8 lg:-left-7 lg:z-20 landing-float-slow lg:max-w-47",
	silver:
		"lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-right-7 lg:z-20 landing-float-delayed lg:max-w-48",
	bronze:
		"lg:absolute lg:bottom-8 lg:-left-5 lg:z-20 landing-float-slow lg:max-w-47",
};

const TIER_RANGE_PILLS: Array<{ tier: HeroTier; range: string }> = [
	{ tier: "gold", range: "0" },
	{ tier: "silver", range: "1–2" },
	{ tier: "bronze", range: "3–4" },
];

export function HeroSection({
	heroHeadingId,
	isSignedIn,
}: {
	heroHeadingId: string;
	isSignedIn: boolean;
}) {
	const [activeTier, setActiveTier] = useState<HeroTier>("gold");
	const prefersReducedMotion = useReducedMotion();

	const activeProduct =
		HERO_TIER_PREVIEWS.find((item) => item.score === activeTier) ??
		HERO_TIER_PREVIEWS[0];

	const primaryCtaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const primaryCtaLabel = isSignedIn
		? "Deschide aplicația"
		: "Creează-ți contul gratuit";

	return (
		<section
			aria-labelledby={heroHeadingId}
			className="relative overflow-hidden bg-linear-to-b from-[#1B4332] via-[#183C2D] to-[#122F22] text-[#FBF4E6] rounded-b-4xl md:rounded-b-[2.75rem] shadow-[0_18px_46px_rgba(16,43,31,0.24)]"
		>
			{/* Layered Botanical Atmosphere */}
			<div
				className="pointer-events-none absolute inset-0 landing-botanical-dots"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 landing-grain"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(247,225,160,0.16),transparent_56%)]"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#CFA042]/18 blur-3xl"
				aria-hidden="true"
			/>
			<BotanicalFlourish
				variant="corner"
				className="hidden md:block absolute top-0 right-0 w-60 h-60 opacity-85"
			/>
			<BotanicalFlourish
				variant="corner"
				className="hidden lg:block absolute bottom-0 left-0 w-52 h-52 rotate-180 opacity-65"
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-18">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
					{/* Left Column: Copy + CTAs */}
					<div className="lg:col-span-6 space-y-5">
						<Badge
							variant="outline"
							className="max-w-full whitespace-normal gap-2 rounded-full bg-[#FBF4E6]/10 backdrop-blur-xs border-[#E2B04E]/35 px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold text-[#FCE8C6] leading-snug shadow-xs"
						>
							<Sparkles
								className="w-3.5 h-3.5 text-[#F2CF82] shrink-0"
								aria-hidden="true"
							/>
							<span>
								Alegem produsele după ce scrie pe etichetă, așa cum facem pentru
								familia noastră.
							</span>
						</Badge>

						<h1
							id={heroHeadingId}
							tabIndex={-1}
							className="display-title text-[2.55rem] sm:text-5xl lg:text-[3.7rem] font-semibold tracking-tight leading-[1.03] text-[#FCE8C6] outline-none"
						>
							<span lang="en">
								Good things{" "}
								<em className="not-italic sm:italic landing-gold-text font-semibold">
									SAVE Time!
								</em>
							</span>
						</h1>

						{/* Mobile short subtitle */}
						<p className="sm:hidden text-sm text-[#FBF4E6]/90 font-medium leading-relaxed">
							Produse alimentare cu puțini aditivi marcați pe etichetă, alese
							după criteriile cu care facem cumpărăturile pentru familia
							noastră. Vezi unde au fost găsite. Decizia îți aparține.
						</p>

						{/* Desktop full subtitle */}
						<p className="hidden sm:block text-base md:text-[17px] text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl">
							PickItWell selectează produse alimentare cu puțini aditivi marcați
							pe etichetă, după aceleași criterii după care facem noi
							cumpărăturile pentru familia noastră. Le grupăm după numărul de
							ingrediente marcate ca aditivi (cu cod E sau clasă funcțională) și
							îți arătăm în ce magazine au fost găsite. Informațiile sunt
							orientative, iar decizia îți aparține.
						</p>

						<div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
							<Button
								asChild
								className="group h-auto min-h-12 px-6 py-3.5 rounded-full landing-gold-cta text-sm sm:text-base font-extrabold border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
							>
								<Link to={primaryCtaTarget}>
									<span>{primaryCtaLabel}</span>
									<ArrowRight
										className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
										aria-hidden="true"
									/>
								</Link>
							</Button>

							{isSignedIn ? (
								<Button
									asChild
									variant="outline"
									className="h-auto min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 hover:text-[#FCE8C6] border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold backdrop-blur-xs dark:bg-[#FBF4E6]/10 dark:hover:bg-[#FBF4E6]/18 dark:border-[#FBF4E6]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Link to="/search">
										<span>Descoperă produsele din PickItWell</span>
									</Link>
								</Button>
							) : (
								<Button
									asChild
									variant="outline"
									className="h-auto min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 hover:text-[#FCE8C6] border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold backdrop-blur-xs dark:bg-[#FBF4E6]/10 dark:hover:bg-[#FBF4E6]/18 dark:border-[#FBF4E6]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<a href="#cum-functioneaza">
										<span>Descoperă produsele din PickItWell</span>
									</a>
								</Button>
							)}
						</div>

						{/* Interactive 3-tier plaque legend */}
						<div className="pt-2 flex flex-wrap items-center gap-2">
							{TIER_RANGE_PILLS.map(({ tier, range }) => {
								const isSelected = activeTier === tier;
								return (
									<button
										key={tier}
										type="button"
										aria-pressed={isSelected}
										onClick={() => setActiveTier(tier)}
										className={cn(
											"inline-flex items-center gap-2 rounded-full px-2.5 py-1 border transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]",
											isSelected
												? "bg-[#FBF4E6]/18 border-[#E2B04E]/75 shadow-sm"
												: "bg-[#FBF4E6]/7 border-[#FBF4E6]/16 hover:bg-[#FBF4E6]/13 hover:border-[#E2B04E]/45",
										)}
									>
										<ScoreBadge score={tier} size="sm" className="h-5" />
										<span className="text-[11px] font-bold text-[#FCE8C6]/90 tabular-nums pr-1">
											{range}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Right Column: Live Interactive Phone Mockup + 3 Tier Switcher Cards */}
					<div className="lg:col-span-6">
						<div className="relative mx-auto max-w-md lg:max-w-lg flex flex-col items-center">
							{/* Soft golden halo behind phone */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#E2B04E]/16 blur-3xl"
							/>

							{/* Phone Frame */}
							<div className="relative z-10 w-full max-w-80 sm:max-w-85 rounded-[2.6rem] bg-[#0B1410] p-2.5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] ring-1 ring-[#E2B04E]/30">
								{/* Top speaker notch pill */}
								<div
									aria-hidden="true"
									className="mx-auto mb-1.5 h-1.5 w-14 rounded-full bg-[#1E3328]"
								/>

								<div className="rounded-[2rem] bg-background dark:bg-sidebar text-foreground overflow-hidden">
									{/* Phone App Header */}
									<div className="bg-[#1B4332] px-4 pt-3 pb-3 text-[#FCE8C6] flex items-center justify-between border-b border-[#E2B04E]/20">
										<BrandLogo surface="dark" size="xs" />
										<ScoreBadge score={activeProduct.score} size="sm" />
									</div>

									{/* Animated Product Screen (initial={false} keeps SSR LCP instant) */}
									<AnimatePresence mode="wait" initial={false}>
										<motion.div
											key={activeProduct.score}
											initial={
												prefersReducedMotion ? false : { opacity: 0, y: 8 }
											}
											animate={{ opacity: 1, y: 0 }}
											exit={
												prefersReducedMotion ? undefined : { opacity: 0, y: -6 }
											}
											transition={{ duration: 0.22, ease: "easeOut" }}
											className="p-4 space-y-3"
										>
											{/* Product Header with Editorial Studio Photo */}
											<div className="rounded-2xl bg-linear-to-br from-[#FFFBEB] via-[#FEF3C7]/75 to-[#FBF4E6] dark:from-amber-950/50 dark:via-amber-950/30 dark:to-card border border-[#E2B04E]/45 p-3 flex items-center gap-3">
												<div className="w-16 h-16 rounded-xl bg-[#F5F1E8] overflow-hidden border border-[#E2B04E]/35 shrink-0 shadow-xs">
													<img
														src={activeProduct.image}
														alt={activeProduct.imageAlt}
														width={640}
														height={640}
														decoding="async"
														fetchPriority={
															activeProduct.score === "gold" ? "high" : "low"
														}
														loading={
															activeProduct.score === "gold"
																? undefined
																: "lazy"
														}
														className="w-full h-full object-cover"
													/>
												</div>

												<div className="min-w-0 flex-1 space-y-1">
													<div className="flex items-center justify-between gap-1.5 flex-wrap">
														<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
															{activeProduct.brand}
														</span>
														<Badge
															variant="outline"
															className="bg-white/95 dark:bg-card border-border px-2 py-0.5 text-[10px] font-bold text-[#1B4332] dark:text-[#CBE3D4]"
														>
															{activeProduct.additiveBadge}
														</Badge>
													</div>
													<p className="display-title text-sm sm:text-[15px] font-semibold tracking-tight text-foreground dark:text-[#FBF4E6] leading-snug">
														{activeProduct.productName}
													</p>
												</div>
											</div>

											{/* Declared Ingredients (with real HighlightedIngredientsText) */}
											<div className="rounded-2xl bg-card border border-border p-3 space-y-1.5">
												<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
													Ingrediente declarate
												</p>
												<HighlightedIngredientsText
													text={activeProduct.ingredients}
													highlightedAdditives={
														activeProduct.highlightedAdditives
													}
													className="text-xs leading-relaxed text-foreground"
												/>
												<div className="pt-1 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
													<Calendar
														className="w-3 h-3 shrink-0"
														aria-hidden="true"
													/>
													<span>
														Etichetă consultată la: {activeProduct.checkedDate}
													</span>
												</div>
											</div>

											{/* Available Stores */}
											<div className="rounded-2xl bg-card border border-border p-3 space-y-2">
												<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
													Găsit în magazine
												</p>
												<div className="flex flex-wrap gap-1.5">
													{activeProduct.stores.map((store) => (
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
										</motion.div>
									</AnimatePresence>
								</div>
							</div>

							{/* Interactive Floating Tier Cards around Phone */}
							<div className="mt-5 sm:mt-4 lg:mt-0 w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3">
								{HERO_TIER_PREVIEWS.map((tier) => {
									const isSelected = activeTier === tier.score;
									return (
										<motion.button
											key={tier.score}
											type="button"
											aria-pressed={isSelected}
											onClick={() => setActiveTier(tier.score)}
											whileHover={
												prefersReducedMotion
													? undefined
													: { scale: 1.03, y: -2 }
											}
											whileTap={
												prefersReducedMotion ? undefined : { scale: 0.98 }
											}
											transition={{
												type: "spring",
												stiffness: 380,
												damping: 26,
											}}
											className={cn(
												"text-left rounded-2xl px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 cursor-pointer touch-manipulation transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]",
												CARD_LAYOUT_CLASSES[tier.score],
												isSelected
													? "bg-[#FFFDF7] dark:bg-[#1B2B22] text-foreground ring-2 ring-[#E2B04E] shadow-[0_14px_34px_rgba(0,0,0,0.32)]"
													: "bg-[#FBF4E6]/95 dark:bg-card/95 text-foreground border border-border shadow-lg hover:border-[#E2B04E]/75",
											)}
										>
											<div className="flex items-center justify-between w-full gap-2">
												<ScoreBadge score={tier.score} size="sm" />
												{isSelected && (
													<span
														aria-hidden="true"
														className="w-2 h-2 rounded-full bg-[#1B4332] dark:bg-[#E2B04E] ring-2 ring-[#E2B04E]/40 shrink-0"
													/>
												)}
											</div>
											<div className="text-right lg:text-left">
												<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6]">
													{tier.cardTitle}
												</p>
												<p className="text-[11px] font-medium text-muted-foreground">
													{tier.cardSubtitle}
												</p>
											</div>
										</motion.button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
