import {
	ArrowLeft,
	Calendar,
	ChevronRight,
	Flag,
	Heart,
	Home,
	Pause,
	Play,
	Plus,
	Search,
	ShieldAlert,
	SlidersHorizontal,
	Store,
	User,
	ZoomIn,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "#/components/brand-logo";
import { CategoryIcon } from "#/components/categories/category-icon";
import {
	getHeroDemoData,
	type HeroDemoProduct,
} from "#/components/landing/landing-data";
import { ScoreBadge } from "#/components/ui/score-badge";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";

type DemoPhase =
	| "home-browse"
	| "home-tap"
	| "product-top"
	| "product-details"
	| "outro";

type DemoState = {
	phase: DemoPhase;
	chapterRunKey: number;
	chapterDurationMs: number;
};

const PHASE_DURATIONS_MS: Record<DemoPhase, number> = {
	"home-browse": 2300,
	"home-tap": 1000,
	"product-top": 3200,
	"product-details": 3500,
	outro: 4300,
};

const NEXT_PHASE: Record<DemoPhase, DemoPhase> = {
	"home-browse": "home-tap",
	"home-tap": "product-top",
	"product-top": "product-details",
	"product-details": "outro",
	outro: "home-browse",
};

const CHAPTER_HOME_TOTAL_MS =
	PHASE_DURATIONS_MS["home-browse"] + PHASE_DURATIONS_MS["home-tap"];

function getChapterIndex(phase: DemoPhase): 0 | 1 | 2 | 3 {
	if (phase === "product-top") return 1;
	if (phase === "product-details") return 2;
	if (phase === "outro") return 3;
	return 0;
}

function getNextDemoState(prev: DemoState): DemoState {
	const nextPhase = NEXT_PHASE[prev.phase];
	const prevChapter = getChapterIndex(prev.phase);
	const nextChapter = getChapterIndex(nextPhase);

	if (prevChapter === nextChapter) {
		return {
			...prev,
			phase: nextPhase,
		};
	}

	const nextDuration =
		nextChapter === 0 ? CHAPTER_HOME_TOTAL_MS : PHASE_DURATIONS_MS[nextPhase];

	return {
		phase: nextPhase,
		chapterRunKey: prev.chapterRunKey + 1,
		chapterDurationMs: nextDuration,
	};
}

function ProductArtwork({
	product,
	iconClassName,
	imgClassName,
}: {
	product: HeroDemoProduct;
	iconClassName?: string;
	imgClassName?: string;
}) {
	if (product.imageUrl) {
		return (
			<img
				src={product.imageUrl}
				alt=""
				loading="eager"
				draggable={false}
				className={cn(
					"w-full h-full object-cover object-center select-none",
					imgClassName,
				)}
			/>
		);
	}

	return (
		<CategoryIcon
			iconKey={product.categoryIconKey}
			loading="eager"
			className={iconClassName}
		/>
	);
}

/**
 * Interactive, looping miniature PickItWell app walkthrough inside a phone bezel
 * for the landing page hero. Adapts automatically to Locale and Light/Dark theme.
 */
export function HeroPhoneDemo() {
	const { featuredProduct, secondaryProducts, quickCategories } =
		getHeroDemoData();
	const homeProducts = [featuredProduct, ...secondaryProducts];

	const [demoState, setDemoState] = useState<DemoState>({
		phase: "home-browse",
		chapterRunKey: 0,
		chapterDurationMs: CHAPTER_HOME_TOTAL_MS,
	});
	const [isManuallyPaused, setIsManuallyPaused] = useState(false);
	const [isInView, setIsInView] = useState(true);
	const [isDocumentHidden, setIsDocumentHidden] = useState(false);
	const [scrollDistance, setScrollDistance] = useState(320);

	const containerRef = useRef<HTMLElement>(null);
	const detailViewportRef = useRef<HTMLDivElement>(null);
	const detailTrackRef = useRef<HTMLDivElement>(null);

	const remainingMsRef = useRef<number>(PHASE_DURATIONS_MS["home-browse"]);
	const phaseStartedAtRef = useRef<number | null>(null);
	const prevRunTokenRef = useRef<string>("home-browse:0");

	const isPaused = isManuallyPaused || !isInView || isDocumentHidden;

	const activeChapter = getChapterIndex(demoState.phase);
	const isProductView =
		demoState.phase === "product-top" || demoState.phase === "product-details";
	const isOutroView = demoState.phase === "outro";
	const isDarkTopBar = !isProductView;

	// Sync prefers-reduced-motion preference on client mount and changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const applyPreference = (matches: boolean) => {
			if (matches) {
				setIsManuallyPaused(true);
				setDemoState((prev) => ({
					phase: "product-top",
					chapterRunKey: prev.chapterRunKey + 1,
					chapterDurationMs: PHASE_DURATIONS_MS["product-top"],
				}));
			}
		};

		applyPreference(mediaQuery.matches);
		const onChange = (event: MediaQueryListEvent) => {
			applyPreference(event.matches);
		};
		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	// Pause when scrolled off-screen or browser tab becomes hidden
	useEffect(() => {
		const handleVisibility = () => {
			setIsDocumentHidden(document.visibilityState === "hidden");
		};
		handleVisibility();
		document.addEventListener("visibilitychange", handleVisibility);

		const el = containerRef.current;
		let observer: IntersectionObserver | undefined;
		if (el && typeof IntersectionObserver !== "undefined") {
			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry) {
						setIsInView(entry.isIntersecting);
					}
				},
				{ threshold: 0.2 },
			);
			observer.observe(el);
		}

		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);
			observer?.disconnect();
		};
	}, []);

	// Measure exact scrollable distance inside the product detail viewport
	useEffect(() => {
		const viewport = detailViewportRef.current;
		const track = detailTrackRef.current;
		if (!viewport || !track) return;

		const measure = () => {
			setScrollDistance(
				Math.max(0, track.scrollHeight - viewport.clientHeight),
			);
		};

		measure();
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		observer.observe(track);
		return () => observer.disconnect();
	}, []);

	// Single phase timer with pause/resume preservation
	useEffect(() => {
		const runToken = `${demoState.phase}:${demoState.chapterRunKey}`;
		if (prevRunTokenRef.current !== runToken) {
			prevRunTokenRef.current = runToken;
			remainingMsRef.current = PHASE_DURATIONS_MS[demoState.phase];
		}

		if (isPaused) {
			phaseStartedAtRef.current = null;
			return;
		}

		phaseStartedAtRef.current = Date.now();
		const timeoutId = window.setTimeout(() => {
			phaseStartedAtRef.current = null;
			setDemoState((prev) => getNextDemoState(prev));
		}, remainingMsRef.current);

		return () => {
			window.clearTimeout(timeoutId);
			if (phaseStartedAtRef.current !== null) {
				const elapsed = Date.now() - phaseStartedAtRef.current;
				remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);
				phaseStartedAtRef.current = null;
			}
		};
	}, [demoState.phase, demoState.chapterRunKey, isPaused]);

	const handleSelectChapter = (chapterIndex: 0 | 1 | 2) => {
		const targetPhase: DemoPhase =
			chapterIndex === 0
				? "home-browse"
				: chapterIndex === 1
					? "product-top"
					: "product-details";

		const durationMs =
			chapterIndex === 0
				? CHAPTER_HOME_TOTAL_MS
				: PHASE_DURATIONS_MS[targetPhase];

		setDemoState((prev) => ({
			phase: targetPhase,
			chapterRunKey: prev.chapterRunKey + 1,
			chapterDurationMs: durationMs,
		}));
	};

	const handleTogglePlayPause = () => {
		setIsManuallyPaused((prev) => !prev);
	};

	const chapters = [
		{ index: 0 as const, label: m.landing_hero_demo_step_home() },
		{ index: 1 as const, label: m.landing_hero_demo_step_product() },
		{ index: 2 as const, label: m.landing_hero_demo_step_stores() },
	];

	const navItems = [
		{ id: "home", label: m.nav_home(), Icon: Home, active: !isProductView },
		{ id: "search", label: m.nav_search(), Icon: Search, active: false },
		{ id: "favs", label: m.nav_favorites(), Icon: Heart, active: false },
		{ id: "stores", label: m.nav_stores(), Icon: Store, active: false },
		{ id: "profile", label: m.nav_profile(), Icon: User, active: false },
	];

	return (
		<figure
			ref={containerRef}
			className="mx-auto w-full max-w-[336px] sm:max-w-[364px] flex flex-col items-center"
		>
			<figcaption className="sr-only">
				{m.landing_hero_demo_figcaption()}
			</figcaption>

			{/* Phone Hardware Bezel */}
			<div className="relative w-full rounded-[2.6rem] bg-[#0B120F] p-2.5 shadow-[0_28px_70px_rgba(0,0,0,0.4)] border border-[#FCE8C6]/22">
				{/* Decorative App Screen (excluded from AT & tab order; described by figcaption) */}
				<div
					aria-hidden="true"
					className="relative h-[510px] sm:h-[548px] rounded-[2rem] bg-[#FAF8F5] dark:bg-[#0E1612] text-[#1B3328] dark:text-[#EDF2EE] overflow-hidden flex flex-col select-none"
				>
					{/* Top Phone Status Bar + Dynamic Island */}
					<div
						className={cn(
							"relative z-30 h-9 px-5 flex items-center justify-between shrink-0 transition-colors duration-300",
							isDarkTopBar
								? "bg-[#1B4332] text-[#FCE8C6]"
								: "bg-[#FDFBF7] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE]",
						)}
					>
						<span className="text-[11px] font-bold tracking-tight">9:41</span>
						<div className="w-20 h-4.5 rounded-full bg-[#0B120F] shadow-inner" />
						<div className="flex items-center gap-1.5">
							<div className="flex items-end gap-0.5 h-2.5">
								<span className="w-0.5 h-1 rounded-full bg-current opacity-85" />
								<span className="w-0.5 h-1.5 rounded-full bg-current opacity-85" />
								<span className="w-0.5 h-2 rounded-full bg-current opacity-85" />
								<span className="w-0.5 h-2.5 rounded-full bg-current opacity-85" />
							</div>
							<div className="w-4.5 h-2.5 rounded-[3px] border border-current/70 p-[1.5px] flex items-center">
								<div className="w-full h-full rounded-[1px] bg-current" />
							</div>
						</div>
					</div>

					{/* Screen Viewport Stack */}
					<div className="relative flex-1 min-h-0 overflow-hidden">
						{/* Scenes 1-3: App Chrome (Home / Product Detail + Bottom Nav) */}
						<div className="absolute inset-0 flex flex-col">
							<div className="relative flex-1 min-h-0 overflow-hidden">
								{/* Scene 1: Miniature Home Browse & Tap */}
								<div
									className={cn(
										"absolute inset-0 flex flex-col bg-[#FAF8F5] dark:bg-[#0E1612] hero-demo-screen-transition",
										isProductView
											? "-translate-x-8 opacity-0 pointer-events-none"
											: "translate-x-0 opacity-100",
									)}
								>
									{/* Botanical Home Hero Header */}
									<div className="relative bg-[#1B4332] text-[#FBF4E6] px-4 pt-1 pb-3.5 rounded-b-3xl shadow-sm shrink-0">
										<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.1),transparent_58%)] rounded-b-3xl" />
										<div className="relative z-10 mb-1 flex items-center">
											<BrandLogo surface="dark" size="xs" className="h-5" />
										</div>
										<p className="relative z-10 text-xl font-extrabold tracking-tight leading-tight text-[#FCE8C6]">
											{m.home_hero_title_line1()} {m.home_hero_title_line2()}
										</p>
										{/* Mock Integrated Search Bar */}
										<div className="relative z-10 mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] px-3 py-2 shadow-xs">
											<div className="flex items-center gap-2 min-w-0">
												<Search className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400 shrink-0" />
												<span className="text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E] truncate">
													{m.home_search_placeholder()}
												</span>
											</div>
											<SlidersHorizontal className="w-3.5 h-3.5 text-[#5C665E] dark:text-[#9AA89E] shrink-0" />
										</div>
									</div>

									{/* Home Feed Body */}
									<div className="flex-1 min-h-0 px-3.5 py-2.5 space-y-2.5 overflow-hidden">
										{/* Quick Categories Strip */}
										<div className="space-y-1.5">
											<div className="flex items-baseline justify-between gap-2">
												<p className="text-[11px] font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
													{m.home_categories_heading()}
												</p>
												<span className="text-[10px] font-semibold text-[#2D5A44] dark:text-emerald-400 shrink-0">
													{m.common_see_all()}
												</span>
											</div>
											<div className="grid grid-cols-4 gap-2">
												{quickCategories.map((category) => (
													<div
														key={category.iconKey}
														className="flex flex-col items-center gap-1 text-center"
													>
														<CategoryIcon
															iconKey={category.iconKey}
															loading="eager"
															className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_4px_10px_rgba(4,42,32,0.14)]"
														/>
														<span className="text-[9px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] line-clamp-1 leading-tight">
															{category.label}
														</span>
													</div>
												))}
											</div>
										</div>

										{/* Recently Added 3-Column Mini ProductCards */}
										<div className="space-y-1.5">
											<div className="flex items-baseline justify-between gap-2">
												<p className="text-[11px] font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
													{m.home_recent_heading()}
												</p>
												<span className="text-[10px] font-semibold text-[#2D5A44] dark:text-emerald-400 shrink-0">
													{m.common_see_all()}
												</span>
											</div>

											<div className="grid grid-cols-3 gap-1.5">
												{homeProducts.map((item) => {
													const isFeatured = item.id === featuredProduct.id;
													const isTapped =
														isFeatured && demoState.phase === "home-tap";

													return (
														<div
															key={item.id}
															className={cn(
																"relative rounded-xl bg-white dark:bg-[#16221C] border shadow-[0_2px_8px_rgba(27,67,50,0.04)] overflow-hidden flex flex-col transition-transform duration-200",
																isTapped
																	? "scale-[0.96] border-[#D8AB54] ring-2 ring-[#D8AB54]/45"
																	: "border-[#EAE4D7] dark:border-[#24362D]",
															)}
														>
															{/* Translucent Touch Ripple on Tap */}
															{isTapped && (
																<span
																	data-paused={isPaused ? "true" : "false"}
																	className="hero-demo-tap-ripple absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full bg-[#D8AB54]/35 dark:bg-[#D8AB54]/30 z-20"
																/>
															)}

															{/* Product Photo Frame */}
															<div className="relative aspect-square w-full bg-[#F5F1E8] dark:bg-[#1A2821] overflow-hidden border-b border-[#F5F1E8] dark:border-[#24362D]/80 flex items-center justify-center">
																<ProductArtwork
																	product={item}
																	iconClassName="w-8 h-8"
																/>
																<div className="absolute top-1 left-1 z-10">
																	<ScoreBadge
																		score={item.score}
																		size="sm"
																		className="h-3.5 drop-shadow-sm"
																	/>
																</div>
																<span className="absolute top-1 right-1 z-10 w-4.5 h-4.5 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7]/80 dark:border-[#2C4035] flex items-center justify-center shadow-2xs">
																	<Heart
																		className={cn(
																			"w-2.5 h-2.5",
																			item.isFavorited
																				? "fill-rose-500 text-rose-500"
																				: "text-[#9AA09A] dark:text-slate-400",
																		)}
																	/>
																</span>
															</div>

															{/* Card Body */}
															<div className="p-1.5 flex-1 flex flex-col gap-1">
																<p className="text-[10px] font-bold text-[#1B3328] dark:text-[#EDF2EE] leading-tight line-clamp-2">
																	{item.name}
																</p>
																<div className="mt-auto flex items-center gap-0.5 min-w-0">
																	<span className="inline-flex items-center gap-0.5 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] px-1 py-0.5 text-[8px] font-semibold text-[#243B30] dark:text-[#CBE3D4] min-w-0">
																		<Store className="w-2 h-2 shrink-0 text-[#687069] dark:text-[#9AA89E]" />
																		<span className="truncate">
																			{item.stores[0]}
																		</span>
																	</span>
																	{item.stores.length > 2 && (
																		<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2F5442] px-1 py-0.5 text-[8px] font-bold text-[#1B4332] dark:text-[#CBE3D4] shrink-0">
																			+{item.stores.length - 1}
																		</span>
																	)}
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>

								{/* Scenes 2-3: Product Detail View + Guided Scroll */}
								<div
									className={cn(
										"absolute inset-0 flex flex-col bg-[#FAF8F5] dark:bg-[#0E1612] hero-demo-screen-transition",
										isProductView
											? "translate-x-0 opacity-100"
											: "translate-x-full opacity-0 pointer-events-none",
									)}
								>
									{/* Sticky Sub-Header matching $productId.tsx */}
									<div className="shrink-0 h-11 px-3 bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 border-b border-[#EAE4D7] dark:border-[#24362D] flex items-center justify-between gap-2 z-10">
										<div className="flex items-center gap-1.5 min-w-0">
											<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[10px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] shrink-0">
												<ArrowLeft className="w-2.5 h-2.5" />
												<span>{m.common_back()}</span>
											</span>
											<span className="text-[11px] font-semibold text-[#5C665E] dark:text-[#9AA89E] truncate">
												{featuredProduct.name}
											</span>
										</div>

										<div className="flex items-center gap-1.5 shrink-0">
											<ScoreBadge
												score={featuredProduct.score}
												size="sm"
												className="h-4.5"
											/>
											<span
												className={cn(
													"inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold",
													featuredProduct.isFavorited
														? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60"
														: "bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D]",
												)}
											>
												<Heart
													className={cn(
														"w-2.5 h-2.5",
														featuredProduct.isFavorited
															? "fill-rose-500 text-rose-500"
															: "text-[#687069] dark:text-[#9AA89E]",
													)}
												/>
											</span>
										</div>
									</div>

									{/* Scrollable Product Content Viewport */}
									<div
										ref={detailViewportRef}
										className="relative flex-1 min-h-0 overflow-hidden"
									>
										<div
											ref={detailTrackRef}
											style={{
												transform:
													demoState.phase === "product-details"
														? `translate3d(0, -${scrollDistance}px, 0)`
														: "translate3d(0, 0, 0)",
											}}
											className="hero-demo-scroll-track p-3 space-y-2.5"
										>
											{/* Overview Hero Card matching $productId.tsx */}
											<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-3 space-y-3 shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
												{/* Large Product Photo Trigger Frame */}
												<div>
													<div className="relative h-40 sm:h-44 w-full rounded-xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] overflow-hidden flex items-center justify-center">
														<span className="absolute top-2 left-2 z-10 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1B3328] dark:text-[#EDF2EE] shadow-2xs">
															{m.product_photo_front_badge()}
														</span>
														<ProductArtwork
															product={featuredProduct}
															iconClassName="w-16 h-16"
														/>
														<span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] text-[#1B3328] dark:text-[#CBE3D4] flex items-center justify-center shadow-xs">
															<ZoomIn className="w-3 h-3" />
														</span>
													</div>
													<p className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
														<ZoomIn className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400 shrink-0" />
														<span>{m.product_tap_to_zoom()}</span>
													</p>
												</div>

												{/* Gold Score Spotlight */}
												<div className="rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/70 to-[#FBF4E6] dark:from-amber-950/50 dark:via-amber-950/30 dark:to-[#16221C] border border-[#F59E0B]/40 dark:border-amber-700/50 p-2.5 space-y-2">
													<div className="flex items-center gap-1.5 flex-wrap">
														<ScoreBadge
															score={featuredProduct.score}
															size="sm"
															className="h-4.5"
														/>
														<p className="text-[11px] font-extrabold text-[#78350F] dark:text-amber-200 leading-tight">
															{m.product_tier_gold_title()}
														</p>
													</div>
													<p className="text-[10px] text-[#4A554E] dark:text-[#B8C4BC] leading-snug">
														{m.product_tier_gold_desc()}
													</p>
													<span className="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] px-2 py-0.5 text-[9px] font-bold text-[#1B3328] dark:text-[#EDF2EE]">
														<ShieldAlert className="w-2.5 h-2.5 text-[#2D5A44] dark:text-emerald-400 shrink-0" />
														<span>{featuredProduct.additivesLabel}</span>
													</span>
												</div>

												{/* Brand, Title & Category Pill */}
												<div className="space-y-1">
													<p className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
														{featuredProduct.brand}
													</p>
													<p className="text-base font-extrabold tracking-tight leading-tight text-[#1B3328] dark:text-[#FBF4E6]">
														{featuredProduct.name}
													</p>
													{featuredProduct.categoryLabel && (
														<div className="pt-1">
															<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] pl-1 pr-2.5 py-0.5 text-[10px] font-semibold text-[#1B3328] dark:text-[#CBE3D4] max-w-full">
																<CategoryIcon
																	iconKey={featuredProduct.categoryIconKey}
																	loading="eager"
																	className="w-4 h-4 shrink-0"
																/>
																<span className="truncate">
																	{featuredProduct.categoryLabel}
																</span>
															</span>
														</div>
													)}
												</div>

												{/* Metadata Grid (Updated Date & Submitted By) */}
												<div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#F0EAE0] dark:border-[#22332A]">
													<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-2.5 py-2 flex items-start gap-1.5">
														<Calendar className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5" />
														<div className="min-w-0">
															<p className="text-[8px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] truncate">
																{m.product_last_updated()}
															</p>
															<p className="text-[10px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] truncate">
																{featuredProduct.updatedAt}
															</p>
														</div>
													</div>
													<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-2.5 py-2 flex items-start gap-1.5">
														<User className="w-3 h-3 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5" />
														<div className="min-w-0">
															<p className="text-[8px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] truncate">
																{m.product_added_by()}
															</p>
															<p className="text-[10px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] truncate">
																{featuredProduct.submittedBy}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Declared Ingredients Card matching $productId.tsx */}
											<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden">
												<div className="p-3 border-b border-[#F0EAE0] dark:border-[#22332A] flex items-center justify-between gap-2">
													<div className="flex items-start gap-2 min-w-0">
														<span className="w-7 h-7 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
															<ShieldAlert className="w-3.5 h-3.5" />
														</span>
														<div className="min-w-0">
															<p className="text-xs font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] leading-snug">
																{m.product_declared_ingredients_title()}
															</p>
															<p className="text-[10px] text-[#5C665E] dark:text-[#9AA89E] leading-tight">
																{m.product_declared_ingredients_subtitle()}
															</p>
														</div>
													</div>
													<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] px-2 py-0.5 text-[9px] font-semibold shrink-0">
														{featuredProduct.additivesLabel}
													</span>
												</div>

												<div className="p-3 space-y-2">
													<p className="text-[9px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
														{m.product_label_ingredients()}
													</p>
													<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-2.5 text-[11px] leading-relaxed text-[#1B3328] dark:text-[#EDF2EE]">
														{featuredProduct.ingredients}
													</div>
													<p className="text-[10px] text-[#5C665E] dark:text-[#9AA89E]">
														{m.product_no_additives_marked()}
													</p>
													<div className="pt-2 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
														<span className="inline-flex items-center gap-1 text-[#5C665E] dark:text-[#9AA89E] font-medium">
															<Calendar className="w-3 h-3 shrink-0" />
															<span>
																{m.product_label_checked_on()}{" "}
																{featuredProduct.checkedDate}
															</span>
														</span>
														<span className="inline-flex items-center gap-1 font-bold text-[#A67C37] dark:text-[#D4AF6A]">
															<Flag className="w-3 h-3 shrink-0" />
															<span>{m.product_report_error()}</span>
														</span>
													</div>
												</div>
											</div>

											{/* Available Stores Card matching $productId.tsx */}
											<div className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden">
												<div className="p-3 border-b border-[#F0EAE0] dark:border-[#22332A] flex items-center justify-between gap-2">
													<div className="flex items-start gap-2 min-w-0">
														<span className="w-7 h-7 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
															<Store className="w-3.5 h-3.5" />
														</span>
														<div className="min-w-0">
															<p className="text-xs font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6] leading-snug">
																{m.product_available_at()}
															</p>
															<p className="text-[10px] text-[#5C665E] dark:text-[#9AA89E] leading-tight">
																{m.product_stores_spotted_subtitle()}
															</p>
														</div>
													</div>
													<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2 py-0.5 text-[9px] font-semibold shrink-0">
														{m.common_stores_count({
															count: featuredProduct.stores.length,
														})}
													</span>
												</div>

												<div className="p-3 space-y-2">
													<ul className="space-y-1.5">
														{featuredProduct.stores.map((store) => (
															<li
																key={store}
																className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D]"
															>
																<div className="flex items-center gap-2 min-w-0">
																	<span className="w-5 h-5 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
																		<Store className="w-3 h-3" />
																	</span>
																	<span className="text-[11px] font-bold text-[#1B3328] dark:text-[#EDF2EE] truncate">
																		{store}
																	</span>
																</div>
																<ChevronRight className="w-3.5 h-3.5 text-[#7D857E] shrink-0" />
															</li>
														))}
													</ul>

													<div className="w-full px-2.5 py-2 rounded-xl border border-dashed border-[#2D5A44]/45 dark:border-[#3D6E54] bg-[#E3EDE7]/35 dark:bg-[#1E3A2C]/35 text-[10px] font-bold text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center gap-1 text-center">
														<Plus className="w-3 h-3 shrink-0" />
														<span>{m.product_report_another_store()}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Miniature 5-Tab Mobile Bottom Navigation */}
							<div className="shrink-0 bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 border-t border-[#EAE4D7] dark:border-[#24362D] px-2 py-1.5 grid grid-cols-5 items-center">
								{navItems.map(({ id, label, Icon, active }) => (
									<div
										key={id}
										className={cn(
											"flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg",
											active
												? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-semibold"
												: "text-[#687069] dark:text-[#9AA89E]",
										)}
									>
										<Icon
											className="w-3.5 h-3.5 shrink-0"
											strokeWidth={active ? 2.25 : 1.85}
										/>
										<span className="text-[9px] leading-none tracking-tight truncate max-w-full px-0.5">
											{label}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Scene 4: Staggered "So, PickItWell" Closing Slide */}
						<div
							className={cn(
								"absolute inset-0 z-20 bg-[#1B4332] text-[#FCE8C6] flex flex-col items-center justify-center px-6 text-center hero-demo-screen-transition",
								isOutroView
									? "opacity-100 scale-100"
									: "opacity-0 scale-105 pointer-events-none",
							)}
						>
							<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.14),transparent_60%)]" />
							<div
								key={
									isOutroView
										? `outro-${demoState.chapterRunKey}`
										: "outro-idle"
								}
								className="relative z-10 w-full flex flex-col items-center gap-4"
							>
								<p
									lang="en"
									data-paused={isPaused ? "true" : "false"}
									className="display-title text-3xl sm:text-[2rem] font-bold tracking-tight text-[#FCE8C6] hero-demo-outro-so"
								>
									{m.landing_hero_demo_outro_lead()}
								</p>
								<div
									data-paused={isPaused ? "true" : "false"}
									className="hero-demo-outro-logo flex justify-center w-full"
								>
									<BrandLogo
										surface="dark"
										size="md"
										className="h-24 sm:h-28 w-auto max-w-[82%]"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Accessible Screen Tap/Click Overlay (sibling outside aria-hidden & overflow-hidden) */}
				<button
					type="button"
					onClick={handleTogglePlayPause}
					aria-label={
						isManuallyPaused
							? m.landing_hero_demo_play()
							: m.landing_hero_demo_pause()
					}
					className="absolute inset-2.5 z-40 rounded-[2rem] cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FCE8C6]"
				/>
			</div>

			{/* Minimal Chapter Progress & Play/Pause Controls */}
			<fieldset className="mt-4 w-full border-0 p-0 m-0 min-w-0">
				<legend className="sr-only">
					{m.landing_hero_demo_controls_aria()}
				</legend>
				<div className="w-full flex items-center gap-2 px-1">
					<div className="flex-1 grid grid-cols-3 gap-2">
						{chapters.map((chapter) => {
							const isActive = activeChapter === chapter.index;
							const isCompleted = activeChapter > chapter.index;

							return (
								<button
									key={chapter.index}
									type="button"
									onClick={() => handleSelectChapter(chapter.index)}
									aria-current={isActive ? "step" : undefined}
									className="group min-h-11 py-1.5 px-1 flex flex-col justify-center gap-1.5 text-left cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<span
										className={cn(
											"block w-full h-1.5 rounded-full overflow-hidden transition-colors",
											isActive && isPaused
												? "bg-[#FCE8C6]/35"
												: "bg-[#FCE8C6]/22",
										)}
									>
										{isActive ? (
											<span
												key={demoState.chapterRunKey}
												data-paused={isPaused ? "true" : "false"}
												style={
													{
														"--demo-duration": `${demoState.chapterDurationMs}ms`,
													} as React.CSSProperties
												}
												className="hero-demo-progress-bar block w-full h-full rounded-full bg-[#D8AB54]"
											/>
										) : (
											<span
												className={cn(
													"block w-full h-full rounded-full transition-colors",
													isCompleted ? "bg-[#D8AB54]/80" : "bg-transparent",
												)}
											/>
										)}
									</span>
									<span
										className={cn(
											"text-[11px] font-semibold tracking-tight transition-colors",
											isActive
												? "text-[#FCE8C6]"
												: "text-[#FBF4E6]/65 group-hover:text-[#FCE8C6]/90",
										)}
									>
										{chapter.label}
									</span>
								</button>
							);
						})}
					</div>

					<button
						type="button"
						onClick={handleTogglePlayPause}
						aria-label={
							isManuallyPaused
								? m.landing_hero_demo_play()
								: m.landing_hero_demo_pause()
						}
						className={cn(
							"min-w-11 min-h-11 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]",
							isManuallyPaused
								? "bg-[#D8AB54] hover:bg-[#E2BA68] border-[#D8AB54] text-[#112A1F] shadow-xs"
								: "bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 border-[#FCE8C6]/25 text-[#FCE8C6]",
						)}
					>
						{isManuallyPaused ? (
							<Play
								className="w-4 h-4 fill-current translate-x-[1px]"
								aria-hidden="true"
							/>
						) : (
							<Pause className="w-4 h-4" aria-hidden="true" />
						)}
					</button>
				</div>
			</fieldset>
		</figure>
	);
}
