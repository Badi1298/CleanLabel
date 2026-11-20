import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Sparkles, Store } from "lucide-react";
import { HERO_STORES } from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ScoreBadge } from "#/components/ui/score-badge";

export function HeroSection({
	heroHeadingId,
	isSignedIn,
}: {
	heroHeadingId: string;
	isSignedIn: boolean;
}) {
	const primaryCtaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const primaryCtaLabel = isSignedIn
		? "Deschide aplicația"
		: "Creează-ți contul gratuit";

	return (
		<section
			aria-labelledby={heroHeadingId}
			className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-4xl md:rounded-b-[2.75rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]"
		>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.12),transparent_58%)]"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#A67C37]/15 blur-3xl"
				aria-hidden="true"
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-18">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
					{/* Left Column: Copy + CTAs */}
					<div className="lg:col-span-6 space-y-5">
						<Badge
							variant="outline"
							className="max-w-full whitespace-normal gap-2 rounded-full bg-[#FBF4E6]/12 border-[#FBF4E6]/22 px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold text-[#FCE8C6] leading-snug"
						>
							<Sparkles
								className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0"
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
							className="text-[2.35rem] sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.04] text-[#FCE8C6] outline-none"
						>
							<span lang="en">Good things SAVE Time!</span>
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
								className="h-auto min-h-12 px-6 py-3.5 rounded-full bg-[#FCE8C6] hover:bg-[#F7DDA9] text-[#1B3328] text-sm sm:text-base font-extrabold shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
							>
								<Link to={primaryCtaTarget}>
									<span>{primaryCtaLabel}</span>
									<ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
								</Link>
							</Button>

							{isSignedIn ? (
								<Button
									asChild
									variant="outline"
									className="h-auto min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 hover:text-[#FCE8C6] border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold dark:bg-[#FBF4E6]/12 dark:hover:bg-[#FBF4E6]/20 dark:border-[#FBF4E6]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Link to="/search">
										<span>Descoperă produsele din PickItWell</span>
									</Link>
								</Button>
							) : (
								<Button
									asChild
									variant="outline"
									className="h-auto min-h-12 px-5 py-3.5 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 hover:text-[#FCE8C6] border-[#FBF4E6]/25 text-[#FCE8C6] text-sm font-bold dark:bg-[#FBF4E6]/12 dark:hover:bg-[#FBF4E6]/20 dark:border-[#FBF4E6]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<a href="#cum-functioneaza">
										<span>Descoperă produsele din PickItWell</span>
									</a>
								</Button>
							)}
						</div>
					</div>

					{/* Right Column: Phone Mockup + 3 Tier Cards */}
					<div className="lg:col-span-6">
						<div className="relative mx-auto max-w-md lg:max-w-lg flex flex-col items-center">
							{/* Phone Frame */}
							<div className="relative z-10 w-full max-w-77.5 sm:max-w-82.5 rounded-[2.4rem] bg-[#0E1612] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-[#FCE8C6]/25">
								<div className="rounded-[1.9rem] bg-background dark:bg-sidebar text-foreground overflow-hidden">
									{/* Phone Status / Notch Bar */}
									<div className="bg-[#1B4332] px-4 pt-3 pb-3 text-[#FCE8C6] flex items-center justify-between">
										<div className="flex items-center gap-1.5">
											<img
												src="/logo-192x192.png"
												alt=""
												width={20}
												height={20}
												className="w-5 h-5 rounded-md object-contain"
											/>
											<span className="text-xs font-extrabold tracking-tight">
												PickItWell
											</span>
										</div>
										<ScoreBadge score="gold" size="sm" />
									</div>

									{/* Product Header */}
									<div className="p-4 space-y-3">
										<div className="rounded-2xl bg-linear-to-br from-[#FFFBEB] via-[#FEF3C7]/75 to-[#FBF4E6] dark:from-amber-950/50 dark:via-amber-950/30 dark:to-card border border-[#F59E0B]/35 p-3">
											<div className="flex items-center justify-between gap-2">
												<span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
													Olympus
												</span>
												<Badge
													variant="outline"
													className="bg-white/90 dark:bg-card border-border px-2 py-0.5 text-[10px] font-bold text-[#1B4332] dark:text-[#CBE3D4]"
												>
													0 aditivi marcați
												</Badge>
											</div>
											<p className="mt-1 text-base font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6] leading-snug">
												Iaurt Grecesc Străvechi 10%
											</p>
										</div>

										{/* Declared Ingredients */}
										<div className="rounded-2xl bg-card border border-border p-3 space-y-1.5">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
												Ingrediente declarate
											</p>
											<p className="text-xs leading-relaxed text-foreground">
												Lapte de vacă pasteurizat, smântână din lapte de vacă,
												culturi lactice selecționate.
											</p>
											<div className="pt-1 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
												<Calendar
													className="w-3 h-3 shrink-0"
													aria-hidden="true"
												/>
												<span>Etichetă consultată la: 18.11.2026</span>
											</div>
										</div>

										{/* Available Stores */}
										<div className="rounded-2xl bg-card border border-border p-3 space-y-2">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
												Găsit în magazine
											</p>
											<div className="flex flex-wrap gap-1.5">
												{HERO_STORES.map((store) => (
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
									</div>
								</div>
							</div>

							{/* Floating Classification Cards around Phone */}
							<div className="mt-5 sm:mt-0 w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3 lg:pointer-events-none">
								{/* Gold Card */}
								<div className="lg:absolute lg:top-8 lg:-left-6 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-card text-foreground border border-border shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-44.5">
									<div className="flex items-center gap-2">
										<ScoreBadge score="gold" size="sm" />
									</div>
									<div className="text-right lg:text-left">
										<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6]">
											Ovăz integral bio
										</p>
										<p className="text-[11px] font-medium text-muted-foreground">
											0 aditivi marcați
										</p>
									</div>
								</div>

								{/* Silver Card */}
								<div className="lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-right-6 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-card text-foreground border border-border shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-46">
									<div className="flex items-center gap-2">
										<ScoreBadge score="silver" size="sm" />
									</div>
									<div className="text-right lg:text-left">
										<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6]">
											Crackers cu semințe
										</p>
										<p className="text-[11px] font-medium text-muted-foreground">
											1–2 aditivi marcați
										</p>
									</div>
								</div>

								{/* Bronze Card */}
								<div className="lg:absolute lg:bottom-8 lg:-left-4 lg:z-20 rounded-2xl bg-[#FBF4E6] dark:bg-card text-foreground border border-border shadow-lg px-3.5 py-2.5 flex items-center justify-between lg:flex-col lg:items-start gap-1.5 lg:max-w-44.5">
									<div className="flex items-center gap-2">
										<ScoreBadge score="bronze" size="sm" />
									</div>
									<div className="text-right lg:text-left">
										<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6]">
											Sos pesto clasic
										</p>
										<p className="text-[11px] font-medium text-muted-foreground">
											3–4 aditivi marcați
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
