import { Calendar, Flag, Search, Store } from "lucide-react";
import { useState } from "react";
import { CategoryIcon } from "#/components/categories/category-icon";
import {
	CATALOG_CATEGORIES,
	SAMPLE_STORES,
	STEP_ITEMS,
	type StepId,
} from "#/components/landing/landing-data";
import { Badge } from "#/components/ui/badge";
import { ScoreBadge } from "#/components/ui/score-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export function HowItWorksSection() {
	const [activeStep, setActiveStep] = useState<StepId>("cauta");

	return (
		<section
			id="cum-functioneaza"
			aria-labelledby="how-it-works-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24"
		>
			<div className="max-w-2xl mx-auto text-center">
				<h2
					id="how-it-works-heading"
					className="display-title text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance"
				>
					Caută. Vezi. Alege.
				</h2>
				<p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium text-pretty">
					Produse selectate după aditivii marcați pe etichetă, în 3 pași simpli.
				</p>
			</div>

			{/* Interactive 3-Step Tabbed Interface (single control strip) */}
			<Tabs
				value={activeStep}
				onValueChange={(value) => setActiveStep(value as StepId)}
				className="mt-9 md:mt-11 gap-0"
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
								className="relative flex-none shrink-0 rounded-none bg-transparent px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold text-muted-foreground shadow-none hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-[#1B4332] dark:data-[state=active]:text-[#FCE8C6] data-[state=active]:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#FCE8C6] after:content-[''] after:absolute after:inset-x-2 after:bottom-0 after:border-b-[3px] after:border-transparent after:rounded-full after:transition-colors data-[state=active]:after:border-[#1B4332] dark:data-[state=active]:after:border-[#D8AB54]"
							>
								{index + 1}. {step.tabLabel}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{STEP_ITEMS.map((step) => (
					<TabsContent key={step.id} value={step.id} className="mt-8 md:mt-10">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
							{/* Step Explanation */}
							<div className="lg:col-span-5 space-y-3.5">
								<h3 className="display-title text-2xl sm:text-[1.75rem] md:text-[2rem] font-bold tracking-tight text-foreground dark:text-[#FBF4E6] text-balance">
									{step.stepTitle}
								</h3>
								<p className="text-sm sm:text-base text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed text-pretty">
									{step.description}
								</p>
							</div>

							{/* Step App Visual Mockup */}
							<div className="lg:col-span-7">
								<figure className="space-y-3">
									{step.id === "cauta" && <StepSearchVisual />}
									{step.id === "vezi" && <StepInspectVisual />}
									{step.id === "alege" && <StepChooseVisual />}

									{step.note && (
										<figcaption className="text-xs text-muted-foreground text-center sm:text-left leading-relaxed px-1">
											{step.note}
										</figcaption>
									)}
								</figure>
							</div>
						</div>
					</TabsContent>
				))}
			</Tabs>
		</section>
	);
}

function StepSearchVisual() {
	return (
		<div className="rounded-3xl bg-card border border-border p-4 sm:p-6 shadow-[0_6px_24px_rgba(27,67,50,0.05)] space-y-4">
			{/* Clean Search Bar Preview */}
			<div className="flex items-center gap-2.5 rounded-2xl bg-background dark:bg-[#121D17] border border-border dark:border-[#2B3D33] px-3.5 py-2.5">
				<Search
					className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0"
					aria-hidden="true"
				/>
				<span className="text-xs sm:text-sm text-muted-foreground font-medium">
					Caută produs, brand sau categorie...
				</span>
			</div>

			<div className="flex items-center justify-between gap-2 px-1">
				<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
					Catalog categorii
				</p>
				<p className="text-[11px] font-semibold text-[#2D5A44] dark:text-[#D8AB54]">
					9 categorii · 32 subcategorii
				</p>
			</div>

			{/* All 9 Categories with PickItWell icons (no truncation) */}
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
				{CATALOG_CATEGORIES.map((category) => (
					<li
						key={category.name}
						className="rounded-xl bg-background/70 dark:bg-[#121D17] p-2.5 flex items-center gap-2.5"
					>
						<CategoryIcon
							iconKey={category.iconKey}
							name={category.name}
							className="w-9 h-9"
						/>
						<div className="min-w-0">
							<p className="text-xs font-bold text-foreground leading-snug">
								{category.name}
							</p>
							<p className="text-[11px] text-muted-foreground">
								{category.subcategoriesCount} subcategorii
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function StepInspectVisual() {
	return (
		<div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-[0_6px_24px_rgba(27,67,50,0.05)] space-y-5">
			{/* Product Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
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

			{/* Highlighted Ingredients */}
			<div className="space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
					Listă ingrediente declarată de producător
				</p>
				<p className="text-xs sm:text-sm leading-relaxed text-foreground">
					Roșii (84%), ceapă, ulei de măsline extravirgin, busuioc (2%), sare de
					mare, zahăr,{" "}
					<mark className="inline-block rounded-md bg-[#FBF4E6] dark:bg-[#2A2416] border border-[#D8AB54]/55 text-[#1B3328] dark:text-[#FCE8C6] px-1.5 py-0.5 font-bold">
						corector de aciditate: acid citric (E330)
					</mark>
					.
				</p>

				<div className="pt-3 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-2 text-xs">
					<span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
						<Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>Etichetă consultată la: 18.11.2026</span>
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF4E6] dark:bg-[#2A2416] border border-[#D8AB54]/50 px-2.5 py-1 text-[11px] font-bold text-[#8E6726] dark:text-[#D8AB54]">
						<Flag className="w-3 h-3 shrink-0" aria-hidden="true" />
						<span>Raportează o greșeală</span>
					</span>
				</div>
			</div>
		</div>
	);
}

function StepChooseVisual() {
	return (
		<div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-[0_6px_24px_rgba(27,67,50,0.05)] space-y-5">
			{/* Available Stores */}
			<div className="space-y-3">
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
							className="rounded-xl bg-background dark:bg-[#121D17] px-3 py-2 flex items-center gap-2 text-xs font-bold text-foreground"
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
			<div className="pt-4 border-t border-border space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
					Alternative din aceeași categorie
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
					<div className="rounded-xl bg-background dark:bg-[#121D17] p-3 flex items-center justify-between gap-2">
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
					<div className="rounded-xl bg-background dark:bg-[#121D17] p-3 flex items-center justify-between gap-2">
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
