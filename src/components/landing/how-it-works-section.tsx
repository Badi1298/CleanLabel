import {
	ArrowRight,
	Calendar,
	Check,
	Flag,
	RotateCcw,
	Search,
	Store,
} from "lucide-react";
import { useId, useState } from "react";
import {
	CategoryIcon,
	type CategoryIconKey,
} from "#/components/categories/category-icon";
import { HighlightedIngredientsText } from "#/components/HighlightedIngredientsText";
import {
	CATALOG_CATEGORIES,
	CATEGORY_DEMO_PRODUCTS,
	SAMPLE_STORES,
	STEP_CHOOSE_ALTERNATIVES,
	STEP_INSPECT_PRODUCT,
	STEP_ITEMS,
	type StepId,
} from "#/components/landing/landing-data";
import {
	BotanicalFlourish,
	ScrollReveal,
} from "#/components/landing/landing-primitives";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { ScoreBadge } from "#/components/ui/score-badge";
import { Switch } from "#/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";

export function HowItWorksSection({
	selectedCategory,
	onSelectCategory,
	activeStep: controlledStep,
	onActiveStepChange,
}: {
	selectedCategory?: CategoryIconKey;
	onSelectCategory?: (key: CategoryIconKey) => void;
	activeStep?: StepId;
	onActiveStepChange?: (step: StepId) => void;
}) {
	const [internalStep, setInternalStep] = useState<StepId>("cauta");
	const [internalCategory, setInternalCategory] = useState<CategoryIconKey>(
		"cereale-paste-panificatie",
	);

	const activeStep = controlledStep ?? internalStep;
	const setActiveStep = onActiveStepChange ?? setInternalStep;
	const activeCategoryKey = selectedCategory ?? internalCategory;
	const handleCategorySelect = onSelectCategory ?? setInternalCategory;

	return (
		<section
			id="cum-functioneaza"
			aria-labelledby="how-it-works-heading"
			className="scroll-mt-20 max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20"
		>
			<ScrollReveal>
				<div className="max-w-2xl mx-auto text-center space-y-3">
					<BotanicalFlourish variant="divider" />
					<h2
						id="how-it-works-heading"
						className="display-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground dark:text-[#FBF4E6]"
					>
						Caută. Vezi. Alege.
					</h2>
					<p className="text-sm sm:text-base text-muted-foreground font-medium">
						Produse selectate după aditivii marcați pe etichetă, în 3 pași
						simpli.
					</p>
				</div>
			</ScrollReveal>

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

				{STEP_ITEMS.map((step, stepIndex) => {
					const nextStep = STEP_ITEMS[(stepIndex + 1) % STEP_ITEMS.length];
					const isLastStep = stepIndex === STEP_ITEMS.length - 1;
					return (
						<TabsContent key={step.id} value={step.id} className="mt-6">
							<Card className="rounded-[2rem] bg-card border-border/90 shadow-[0_12px_36px_rgba(27,67,50,0.06)] p-5 sm:p-7 md:p-9 gap-0">
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-7 md:gap-10 items-center">
									{/* Step Explanation */}
									<div className="lg:col-span-5 space-y-4">
										<div className="flex items-center justify-between gap-3">
											<Badge
												variant="secondary"
												className="bg-accent text-accent-foreground px-3 py-1 text-xs font-bold"
											>
												{step.tabLabel}
											</Badge>
											<span
												aria-hidden="true"
												className="display-title italic text-5xl leading-none font-medium text-[#D4AF6A]/40 select-none"
											>
												0{stepIndex + 1}
											</span>
										</div>

										<h3 className="display-title text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground dark:text-[#FBF4E6]">
											{step.stepTitle}
										</h3>
										<p className="text-sm sm:text-base text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed">
											{step.description}
										</p>

										<div className="pt-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => setActiveStep(nextStep.id)}
												className="h-auto gap-1.5 rounded-full px-4 py-2 text-xs font-bold border-border hover:border-[#2D5A44] bg-background dark:bg-[#121D17] text-foreground shadow-none"
											>
												{isLastStep ? (
													<>
														<RotateCcw
															className="w-3.5 h-3.5"
															aria-hidden="true"
														/>
														<span>Reia de la pasul 1</span>
													</>
												) : (
													<>
														<span>Pasul următor</span>
														<ArrowRight
															className="w-3.5 h-3.5"
															aria-hidden="true"
														/>
													</>
												)}
											</Button>
										</div>
									</div>

									{/* Step App Visual Mockup */}
									<div className="lg:col-span-7">
										<figure className="space-y-3">
											{step.id === "cauta" && (
												<StepSearchVisual
													selectedCategory={activeCategoryKey}
													onSelectCategory={handleCategorySelect}
												/>
											)}
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
							</Card>
						</TabsContent>
					);
				})}
			</Tabs>
		</section>
	);
}

function StepSearchVisual({
	selectedCategory,
	onSelectCategory,
}: {
	selectedCategory: CategoryIconKey;
	onSelectCategory: (key: CategoryIconKey) => void;
}) {
	const activeCategoryObj =
		CATALOG_CATEGORIES.find((c) => c.iconKey === selectedCategory) ??
		CATALOG_CATEGORIES[0];
	const sampleProducts = CATEGORY_DEMO_PRODUCTS[activeCategoryObj.iconKey];

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

			{/* Interactive 9 Categories Grid */}
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
				{CATALOG_CATEGORIES.map((category) => {
					const isSelected = category.iconKey === activeCategoryObj.iconKey;
					return (
						<li key={category.name}>
							<button
								type="button"
								aria-pressed={isSelected}
								onClick={() => onSelectCategory(category.iconKey)}
								className={cn(
									"w-full text-left rounded-xl p-2.5 flex items-center gap-2.5 transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#FCE8C6]",
									isSelected
										? "bg-[#FBF4E6] dark:bg-[#1A2D23] border border-[#D4AF6A]/75 shadow-sm"
										: "bg-card border border-border hover:border-[#D4AF6A]/45 shadow-[0_1px_4px_rgba(27,67,50,0.03)]",
								)}
							>
								<CategoryIcon
									iconKey={category.iconKey}
									name={category.name}
									loading="lazy"
									className="w-10 h-10"
								/>
								<div className="min-w-0">
									<p className="text-xs font-bold text-foreground leading-snug line-clamp-2">
										{category.name}
									</p>
									<p className="text-[11px] text-muted-foreground">
										{category.subcategoriesCount} subcategorii
									</p>
								</div>
							</button>
						</li>
					);
				})}
			</ul>

			{/* Live Category Sample Preview Drawer */}
			<div className="rounded-xl bg-card border border-border/90 p-3 space-y-2.5">
				<div className="flex items-center justify-between gap-2">
					<p className="text-[11px] font-bold text-[#2D5A44] dark:text-emerald-400 truncate">
						{activeCategoryObj.name}
					</p>
					<span className="text-[10px] font-semibold text-muted-foreground shrink-0">
						{activeCategoryObj.subcategoriesCount} subcategorii
					</span>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{sampleProducts.map((item) => (
						<div
							key={item.name}
							className="rounded-lg bg-background dark:bg-[#121D17] border border-border/80 px-2.5 py-2 flex items-center justify-between gap-2"
						>
							<div className="min-w-0">
								<p className="text-xs font-bold text-foreground truncate">
									{item.name}
								</p>
								<p className="text-[10px] text-muted-foreground">
									{item.additivesLabel}
								</p>
							</div>
							<ScoreBadge score={item.score} size="sm" className="h-5" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function StepInspectVisual() {
	const [highlightAdditives, setHighlightAdditives] = useState(true);
	const highlightSwitchId = useId();

	return (
		<div className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-4 sm:p-5 space-y-4">
			{/* Product Header Card with Thumbnail */}
			<div className="rounded-2xl bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-13 h-13 rounded-xl bg-[#F5F1E8] overflow-hidden border border-[#EAE4D7] dark:border-[#24362D] shrink-0">
						<img
							src={STEP_INSPECT_PRODUCT.image}
							alt={STEP_INSPECT_PRODUCT.name}
							width={640}
							height={640}
							loading="lazy"
							decoding="async"
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="min-w-0">
						<p className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
							Exemplu pagină produs
						</p>
						<h4 className="display-title text-base sm:text-lg font-semibold text-foreground dark:text-[#FBF4E6] truncate">
							{STEP_INSPECT_PRODUCT.name}
						</h4>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<ScoreBadge score={STEP_INSPECT_PRODUCT.score} size="md" />
					<Badge
						variant="outline"
						className="bg-secondary border-border dark:border-[#2B3D33] px-2.5 py-1 text-xs font-bold text-foreground"
					>
						{STEP_INSPECT_PRODUCT.additiveBadge}
					</Badge>
				</div>
			</div>

			{/* Highlighted Ingredients Card with Interactive Highlight Switch */}
			<div className="rounded-2xl bg-card border border-border p-4 space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Listă ingrediente declarată de producător
					</p>
					<div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#2D5A44] dark:text-emerald-400 select-none">
						<label htmlFor={highlightSwitchId} className="cursor-pointer">
							Evidențiază aditivii
						</label>
						<Switch
							id={highlightSwitchId}
							checked={highlightAdditives}
							onCheckedChange={setHighlightAdditives}
						/>
					</div>
				</div>

				<HighlightedIngredientsText
					text={STEP_INSPECT_PRODUCT.ingredients}
					highlightedAdditives={
						highlightAdditives
							? [...STEP_INSPECT_PRODUCT.highlightedAdditives]
							: []
					}
					className="text-xs sm:text-sm leading-relaxed text-foreground"
				/>

				<div className="pt-2 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-2 text-xs">
					<span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
						<Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>
							Etichetă consultată la: {STEP_INSPECT_PRODUCT.checkedDate}
						</span>
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF4E6] dark:bg-amber-950/50 border border-[#D4AF6A]/45 px-2.5 py-1 text-[11px] font-bold text-[#A67C37] dark:text-[#D4AF6A]">
						<Flag className="w-3 h-3 shrink-0" aria-hidden="true" />
						<span>Raportează o greșeală</span>
					</span>
				</div>
			</div>
		</div>
	);
}

function StepChooseVisual() {
	const [selectedAltId, setSelectedAltId] = useState<string>(
		STEP_CHOOSE_ALTERNATIVES[0].id,
	);
	const activeAlternative =
		STEP_CHOOSE_ALTERNATIVES.find((alt) => alt.id === selectedAltId) ??
		STEP_CHOOSE_ALTERNATIVES[0];

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
					{SAMPLE_STORES.map((storeName) => {
						const isInSelectedAlt =
							activeAlternative.stores.includes(storeName);
						return (
							<div
								key={storeName}
								className={cn(
									"rounded-xl border px-3 py-2 flex items-center justify-between gap-2 text-xs font-bold transition-colors",
									isInSelectedAlt
										? "bg-[#E3EDE7]/65 dark:bg-[#1A2E23] border-[#2D5A44]/40 dark:border-emerald-700/50 text-foreground"
										: "bg-background dark:bg-[#121D17] border-border text-muted-foreground",
								)}
							>
								<span className="flex items-center gap-2 min-w-0">
									<Store
										className={cn(
											"w-3.5 h-3.5 shrink-0",
											isInSelectedAlt
												? "text-[#1B4332] dark:text-emerald-400"
												: "text-muted-foreground/70",
										)}
										aria-hidden="true"
									/>
									<span className="truncate">{storeName}</span>
								</span>
								{isInSelectedAlt && (
									<Check
										className="w-3.5 h-3.5 text-[#1B4332] dark:text-emerald-400 shrink-0"
										aria-hidden="true"
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Category Alternatives (Interactive Switcher) */}
			<div className="rounded-2xl bg-card border border-border p-4 space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Alternative din aceeași categorie
					</p>
					<span className="inline-flex items-center gap-1 rounded-full bg-[#FBF4E6] dark:bg-amber-950/40 border border-[#D4AF6A]/45 px-2 py-0.5 text-[10px] font-bold text-[#8E6727] dark:text-[#E2B04E]">
						Silver · 1 aditiv → Gold · 0 aditivi
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
					{STEP_CHOOSE_ALTERNATIVES.map((alt) => {
						const isSelected = alt.id === activeAlternative.id;
						return (
							<button
								key={alt.id}
								type="button"
								aria-pressed={isSelected}
								onClick={() => setSelectedAltId(alt.id)}
								className={cn(
									"text-left rounded-xl p-2.5 flex items-center justify-between gap-2.5 transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]",
									isSelected
										? "bg-[#FBF4E6] dark:bg-[#192820] border border-[#D4AF6A]/75 shadow-sm"
										: "bg-background dark:bg-[#121D17] border border-border hover:border-[#D4AF6A]/45",
								)}
							>
								<div className="flex items-center gap-2.5 min-w-0">
									<img
										src={alt.image}
										alt=""
										width={640}
										height={640}
										loading="lazy"
										decoding="async"
										className="w-10 h-10 rounded-lg object-cover bg-[#F5F1E8] shrink-0"
									/>
									<div className="min-w-0">
										<p className="text-xs font-extrabold text-foreground dark:text-[#FBF4E6] truncate">
											{alt.name}
										</p>
										<p className="text-[11px] text-muted-foreground">
											{alt.additivesLabel}
										</p>
									</div>
								</div>
								<ScoreBadge
									score={alt.score}
									size="sm"
									className="h-5 shrink-0"
								/>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
