import { Calendar, Flag, Search, Store } from "lucide-react";
import { useState } from "react";
import {
	CATALOG_CATEGORIES,
	SAMPLE_STORES,
	STEP_ITEMS,
	type StepId,
} from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { ScoreBadge } from "#/components/ui/score-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";

export function HowItWorksSection({
	onReportError,
}: {
	onReportError: () => void;
}) {
	const [activeStep, setActiveStep] = useState<StepId>("cauta");

	return (
		<section
			id="cum-functioneaza"
			aria-labelledby="how-it-works-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20"
		>
			<div className="max-w-2xl mx-auto text-center">
				<h2
					id="how-it-works-heading"
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]"
				>
					Caută. Vezi. Alege.
				</h2>
				<p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
					Produse selectate după aditivii marcați pe etichetă, în 3 pași simpli.
				</p>
			</div>

			{/* Interactive 3-Step Tabbed Interface */}
			<Tabs
				value={activeStep}
				onValueChange={(value) => setActiveStep(value as StepId)}
				className="mt-8 md:mt-10 gap-0"
			>
				<div className="flex justify-center border-b border-border">
					<TabsList
						aria-label="Pașii de utilizare PickItWell"
						className="h-auto w-auto bg-transparent p-0 rounded-none flex flex-nowrap items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar max-w-full"
					>
						{STEP_ITEMS.map((step, index) => (
							<TabsTrigger
								key={step.id}
								value={step.id}
								className="relative shrink-0 rounded-none bg-transparent px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold text-muted-foreground shadow-none hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-[#1B4332] dark:data-[state=active]:text-[#FCE8C6] data-[state=active]:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#FCE8C6] after:content-[''] after:absolute after:inset-x-2 after:bottom-0 after:border-b-[3px] after:border-transparent after:rounded-full after:transition-colors data-[state=active]:after:border-[#1B4332] dark:data-[state=active]:after:border-[#FCE8C6]"
							>
								{index + 1}. {step.tabLabel}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{STEP_ITEMS.map((step) => (
					<TabsContent key={step.id} value={step.id} className="mt-6">
						<Card className="rounded-3xl bg-card border-border shadow-[0_6px_24px_rgba(27,67,50,0.05)] p-5 sm:p-7 md:p-9 gap-0">
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-7 md:gap-10 items-center">
								{/* Step Explanation */}
								<div className="lg:col-span-5 space-y-4">
									<Badge
										variant="secondary"
										className="bg-accent text-accent-foreground px-3 py-1 text-xs font-bold"
									>
										{step.tabLabel}
									</Badge>
									<h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6]">
										{step.stepTitle}
									</h3>
									<p className="text-sm sm:text-base text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
										{step.description}
									</p>

									<div className="pt-2 flex flex-wrap gap-2">
										{STEP_ITEMS.map((navStep, navIdx) => {
											const isActive = activeStep === navStep.id;
											return (
												<Button
													key={navStep.id}
													type="button"
													variant="outline"
													size="sm"
													onClick={() => setActiveStep(navStep.id)}
													className={cn(
														"h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-none",
														isActive
															? "bg-[#1B4332] text-[#FCE8C6] border-[#1B4332] hover:bg-[#245540] hover:text-[#FCE8C6] dark:bg-[#FCE8C6] dark:text-[#1B3328] dark:border-[#FCE8C6] dark:hover:bg-[#F7DDA9]"
															: "bg-background dark:bg-[#121D17] text-muted-foreground border-border hover:border-[#2D5A44] hover:bg-background dark:hover:bg-[#121D17] hover:text-foreground",
													)}
												>
													<span>0{navIdx + 1}</span>
													<span>{navStep.tabLabel}</span>
												</Button>
											);
										})}
									</div>
								</div>

								{/* Step App Visual Mockup */}
								<div className="lg:col-span-7">
									<figure className="space-y-3">
										{step.id === "cauta" && <StepSearchVisual />}
										{step.id === "vezi" && (
											<StepInspectVisual onReportError={onReportError} />
										)}
										{step.id === "alege" && <StepChooseVisual />}

										{step.note && (
											<figcaption className="text-xs text-muted-foreground text-center sm:text-left leading-relaxed px-1">
												{step.note}
											</figcaption>
										)}
									</figure>
								</div>
							</div>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</section>
	);
}

function StepSearchVisual() {
	return (
		<div className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-4 sm:p-5 space-y-4">
			{/* Search bar preview */}
			<div className="flex items-center gap-2.5 rounded-2xl bg-card border border-border dark:border-[#2B3D33] px-3.5 py-2.5 shadow-2xs">
				<Search
					className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0"
					aria-hidden="true"
				/>
				<span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
					Caută produs, brand sau categorie...
				</span>
				<Badge
					variant="secondary"
					className="ml-auto bg-accent text-accent-foreground px-2.5 py-0.5 text-[11px] font-bold shrink-0"
				>
					9 categorii · 32 subcategorii
				</Badge>
			</div>

			{/* All 9 Categories with golden-styled icons */}
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
				{CATALOG_CATEGORIES.map((category) => {
					const { Icon } = category;
					return (
						<li
							key={category.name}
							className="rounded-xl bg-card border border-border p-2.5 flex items-center gap-2.5 shadow-[0_1px_4px_rgba(27,67,50,0.03)]"
						>
							<span className="w-9 h-9 rounded-full bg-[#FBF4E6] dark:bg-amber-950/50 border border-[#D4AF6A]/45 text-[#A67C37] dark:text-[#D4AF6A] flex items-center justify-center shrink-0">
								<Icon
									className="w-4 h-4"
									strokeWidth={1.9}
									aria-hidden="true"
								/>
							</span>
							<div className="min-w-0">
								<p className="text-xs font-bold text-foreground leading-snug line-clamp-2">
									{category.name}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{category.subcategoriesCount} subcategorii
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function StepInspectVisual({ onReportError }: { onReportError: () => void }) {
	return (
		<div className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-4 sm:p-5 space-y-4">
			{/* Product Header Card */}
			<div className="rounded-2xl bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<p className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
						Exemplu pagină produs
					</p>
					<h4 className="text-base sm:text-lg font-extrabold text-foreground dark:text-[#FBF4E6]">
						Sos de roșii cu busuioc
					</h4>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<ScoreBadge score="silver" size="md" />
					<Badge
						variant="outline"
						className="bg-secondary border-border dark:border-[#2B3D33] px-2.5 py-1 text-xs font-bold text-foreground"
					>
						1 aditiv marcat
					</Badge>
				</div>
			</div>

			{/* Highlighted Ingredients Card */}
			<div className="rounded-2xl bg-card border border-border p-4 space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
					Listă ingrediente declarată de producător
				</p>
				<p className="text-xs sm:text-sm leading-relaxed text-foreground">
					Roșii (84%), ceapă, ulei de măsline extravirgin, busuioc (2%), sare de
					mare, zahăr,{" "}
					<mark className="inline-block rounded-md bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/70 dark:border-amber-700/60 text-[#78350F] dark:text-amber-200 px-1.5 py-0.5 font-bold">
						corector de aciditate: acid citric (E330)
					</mark>
					.
				</p>

				<div className="pt-2 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-2 text-xs">
					<span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
						<Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>Etichetă consultată la: 18.11.2026</span>
					</span>
					<Button
						type="button"
						variant="link"
						onClick={onReportError}
						className="h-auto p-0 gap-1 text-xs font-bold text-[#A67C37] dark:text-[#D4AF6A] hover:underline underline-offset-4"
					>
						<Flag className="w-3.5 h-3.5" aria-hidden="true" />
						<span>Raportează o greșeală</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

function StepChooseVisual() {
	return (
		<div className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-4 sm:p-5 space-y-4">
			{/* Available Stores */}
			<div className="rounded-2xl bg-card border border-border p-4 space-y-3">
				<div className="flex items-center justify-between gap-2">
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Disponibil la
					</p>
					<Badge
						variant="secondary"
						className="bg-accent text-accent-foreground px-2.5 py-0.5 text-[11px] font-bold"
					>
						{SAMPLE_STORES.length} magazine
					</Badge>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{SAMPLE_STORES.map((storeName) => (
						<div
							key={storeName}
							className="rounded-xl bg-background dark:bg-[#121D17] border border-border px-3 py-2 flex items-center gap-2 text-xs font-bold text-foreground"
						>
							<Store
								className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400 shrink-0"
								aria-hidden="true"
							/>
							<span className="truncate">{storeName}</span>
						</div>
					))}
				</div>
			</div>

			{/* Category Alternatives */}
			<div className="rounded-2xl bg-card border border-border p-4 space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
					Alternative din aceeași categorie
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
					<div className="rounded-xl bg-background dark:bg-[#121D17] border border-border p-3 flex items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6] truncate">
								Passata rustică bio
							</p>
							<p className="text-[11px] text-muted-foreground">
								0 aditivi marcați
							</p>
						</div>
						<ScoreBadge score="gold" size="sm" />
					</div>
					<div className="rounded-xl bg-background dark:bg-[#121D17] border border-border p-3 flex items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6] truncate">
								Sos clasic de roșii
							</p>
							<p className="text-[11px] text-muted-foreground">
								0 aditivi marcați
							</p>
						</div>
						<ScoreBadge score="gold" size="sm" />
					</div>
				</div>
			</div>
		</div>
	);
}
