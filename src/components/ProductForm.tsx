/** biome-ignore-all lint/correctness/noChildrenProp: The official documentation provides this pattern */
import { useForm } from "@tanstack/react-form";
import {
	AlertTriangle,
	CameraIcon,
	CheckCircle2,
	Highlighter,
	Plus,
	Sparkles,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AddCategoryDialog } from "#/components/AddCategoryDialog";
import { AddIngredientDialog } from "#/components/AddIngredientDialog";
import { AddStoreDialog } from "#/components/AddStoreDialog";
import { HighlightedIngredientsText } from "#/components/HighlightedIngredientsText";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "#/components/ui/combobox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { useImageUploadMutation } from "#/hooks/use-image-upload-mutation";
import {
	detectAdditiveCandidates,
	isPhraseFoundInText,
	mergeAdditivePhrase,
	normalizeAdditivePhrase,
	suggestScoreFromAdditivesCount,
} from "#/lib/additive-highlighting";

export type ProductFormValues = {
	barcode: string;
	name: string;
	brand: string;
	categoryIds: string[];
	ingredientIds: string[];
	score: "gold" | "silver" | "bronze" | "none";
	status: "pending_review" | "approved" | "rejected";
	rawIngredientsText: string;
	highlightedAdditives: string[] | null;
	imageFront: string | File | undefined;
	imageBack: string | File | undefined;
	storeIds: string[];
};

function FieldInfo({ field }: { field: any }) {
	const hasError =
		(field.state.meta.isTouched ||
			field.state.meta.isDirty ||
			field.form?.state?.isSubmitted ||
			field.state.meta.errorMap?.onSubmit) &&
		field.state.meta.errors.length;

	return (
		<div className="min-h-5 mt-1">
			{hasError ? (
				<em className="text-sm text-red-500 dark:text-red-400">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className="text-sm text-slate-500">Validating...</span>
			) : null}
		</div>
	);
}

export function ProductForm({
	isAdmin = false,
	defaultValues,
	categories = [],
	ingredients = [],
	stores = [],
	onSubmit,
}: {
	isAdmin?: boolean;
	defaultValues?: Partial<ProductFormValues>;
	categories?: {
		id: string;
		name: string;
		parentId?: string | null;
		parentName?: string | null;
	}[];
	ingredients?: { id: string; name: string }[];
	stores?: { id: string; name: string }[];
	onSubmit: (values: ProductFormValues) => void;
}) {
	const [showFullForm, setShowFullForm] = useState(isAdmin);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [selectedLabelText, setSelectedLabelText] = useState("");

	const updateSelectionFromTextarea = () => {
		const el = textareaRef.current;
		if (!el) return;
		const start = el.selectionStart ?? 0;
		const end = el.selectionEnd ?? 0;
		if (end > start) {
			setSelectedLabelText(el.value.slice(start, end));
		} else {
			setSelectedLabelText("");
		}
	};

	const imageUploadMutation = useImageUploadMutation();
	const form = useForm({
		defaultValues: {
			barcode: defaultValues?.barcode || "",
			name: defaultValues?.name || "",
			brand: defaultValues?.brand || "",
			categoryIds: defaultValues?.categoryIds || [],
			ingredientIds: defaultValues?.ingredientIds || [],
			score: defaultValues?.score || "none",
			status: defaultValues?.status || "pending_review",
			rawIngredientsText: defaultValues?.rawIngredientsText || "",
			highlightedAdditives: defaultValues?.highlightedAdditives ?? null,
			imageFront: defaultValues?.imageFront,
			imageBack: defaultValues?.imageBack,
			storeIds: defaultValues?.storeIds || [],
		},
		onSubmit: async ({ value }) => {
			if (isAdmin && (!value.storeIds || value.storeIds.length === 0)) {
				return;
			}

			let imageFrontUrl =
				typeof value.imageFront === "string" ? value.imageFront : undefined;
			let imageBackUrl =
				typeof value.imageBack === "string" ? value.imageBack : undefined;

			if (value.imageFront instanceof File) {
				imageFrontUrl = await imageUploadMutation.mutateAsync({
					file: value.imageFront,
					type: "front",
				});
			}
			if (value.imageBack instanceof File) {
				imageBackUrl = await imageUploadMutation.mutateAsync({
					file: value.imageBack,
					type: "back",
				});
			}

			onSubmit({
				...value,
				imageFront: imageFrontUrl,
				imageBack: imageBackUrl,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<div className="space-y-4">
				<h2 className="text-lg font-semibold border-b pb-2">Photos</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="imageFront"
						children={(field) => (
							<div className="flex flex-col gap-y-2">
								<Label
									htmlFor="imageFront"
									className="flex-col items-start justify-end flex-1"
								>
									Front Photo
								</Label>
								<div className="flex flex-1 flex-col justify-end">
									<div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative overflow-hidden group min-h-40">
										<Input
											id="imageFront"
											type="file"
											accept="image/*"
											capture="environment"
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
											onChange={(e) => {
												if (e.target.files?.[0]) {
													field.handleChange(e.target.files[0]);
												}
											}}
										/>
										{field.state.value ? (
											<div className="absolute inset-0">
												<img
													src={
														field.state.value instanceof File
															? URL.createObjectURL(field.state.value)
															: (field.state.value as string)
													}
													alt="Front preview"
													className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
												/>
												<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
													<span className="text-white font-medium drop-shadow-md">
														Change Photo
													</span>
												</div>
											</div>
										) : (
											<>
												<CameraIcon className="w-8 h-8 text-slate-400 mb-2" />
												<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
													Take a photo of the front
												</span>
											</>
										)}
									</div>
								</div>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					<form.Field
						name="imageBack"
						children={(field) => (
							<div className="flex flex-col gap-y-2">
								<Label
									htmlFor="imageBack"
									className="flex-col items-start justify-end flex-1"
								>
									Back Photo (Ingredients & Barcode)
								</Label>
								<div className="flex flex-1 flex-col justify-end">
									<div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative overflow-hidden group min-h-40">
										<Input
											id="imageBack"
											type="file"
											accept="image/*"
											capture="environment"
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
											onChange={(e) => {
												if (e.target.files?.[0]) {
													field.handleChange(e.target.files[0]);
												}
											}}
										/>
										{field.state.value ? (
											<div className="absolute inset-0">
												<img
													src={
														field.state.value instanceof File
															? URL.createObjectURL(field.state.value)
															: (field.state.value as string)
													}
													alt="Back preview"
													className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
												/>
												<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
													<span className="text-white font-medium drop-shadow-md">
														Change Photo
													</span>
												</div>
											</div>
										) : (
											<>
												<CameraIcon className="w-8 h-8 text-slate-400 mb-2" />
												<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
													Take a photo of the back
												</span>
											</>
										)}
									</div>
								</div>
								<FieldInfo field={field} />
							</div>
						)}
					/>
				</div>
			</div>

			{!isAdmin && !showFullForm && (
				<div className="flex flex-col gap-3 pt-4">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="w-full"
							>
								{isSubmitting ? "Submitting Photos..." : "Submit Photos"}
							</Button>
						)}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() => setShowFullForm(true)}
						className="w-full"
					>
						Or fill out product details manually
					</Button>
				</div>
			)}

			{showFullForm && (
				<div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
					<h2 className="text-lg font-semibold border-b pb-2 pt-4">
						Product Details
					</h2>

					<form.Field
						name="barcode"
						children={(field) => (
							<div className="flex flex-col gap-y-2">
								<Label htmlFor={field.name}>Barcode</Label>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. 5941234567890"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									!value ? "Name is required" : undefined,
							}}
							children={(field) => (
								<div className="flex flex-col gap-y-2">
									<Label htmlFor={field.name}>Product Name</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Organic Almond Milk"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>

						<form.Field
							name="brand"
							validators={{
								onChange: ({ value }) =>
									!value ? "Brand is required" : undefined,
							}}
							children={(field) => (
								<div className="flex flex-col gap-y-2">
									<Label htmlFor={field.name}>Brand</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Alpro"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						/>
					</div>

					<form.Field
						name="categoryIds"
						validators={{
							onChange: ({ value }) =>
								value.length === 0
									? "At least one category is required"
									: undefined,
						}}
						children={(field) => {
							const mainCategories = categories.filter((c) => !c.parentId);
							const selectedMainCategoryId =
								field.state.value.find((id) =>
									mainCategories.some((mc) => mc.id === id),
								) || "";

							const availableSubCategories = selectedMainCategoryId
								? categories.filter(
										(c) => c.parentId === selectedMainCategoryId,
									)
								: [];

							const selectedSubCategories = field.state.value
								.filter((id) =>
									availableSubCategories.some((sc) => sc.id === id),
								)
								.map((id) => categories.find((c) => c.id === id))
								.filter(Boolean) as {
								id: string;
								name: string;
								parentId?: string | null;
								parentName?: string | null;
							}[];

							const handleMainCategoryChange = (newMainCategoryId: string) => {
								field.handleChange([newMainCategoryId]);
							};

							const handleSubCategoriesChange = (
								newSubCategoryIds: string[],
							) => {
								if (selectedMainCategoryId) {
									field.handleChange([
										selectedMainCategoryId,
										...newSubCategoryIds,
									]);
								} else {
									field.handleChange(newSubCategoryIds);
								}
							};

							return (
								<div className="flex flex-col gap-y-4">
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor="main-category">Category</Label>
											<AddCategoryDialog
												trigger={
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
													>
														<Plus className="w-3 h-3 mr-1" /> Add New
													</Button>
												}
											/>
										</div>
										<Select
											value={selectedMainCategoryId}
											onValueChange={handleMainCategoryChange}
										>
											<SelectTrigger id="main-category">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{mainCategories.map((c) => (
													<SelectItem key={c.id} value={c.id}>
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{selectedMainCategoryId &&
										availableSubCategories.length > 0 && (
											<div className="flex flex-col gap-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
												<Label>Subcategories</Label>
												<Combobox
													items={availableSubCategories}
													itemToStringValue={(c) => c.name}
													multiple
													value={selectedSubCategories}
													onValueChange={(newValues) => {
														handleSubCategoriesChange(
															newValues.map((v) => v.id),
														);
													}}
												>
													<ComboboxChips>
														<ComboboxValue>
															{selectedSubCategories.map((item) => (
																<ComboboxChip key={item.id}>
																	{item.name}
																</ComboboxChip>
															))}
														</ComboboxValue>
														<ComboboxChipsInput placeholder="Add subcategory..." />
													</ComboboxChips>
													<ComboboxContent>
														<ComboboxEmpty>
															No subcategories found.
														</ComboboxEmpty>
														<ComboboxList>
															{(item) => (
																<ComboboxItem key={item.id} value={item}>
																	{item.name}
																</ComboboxItem>
															)}
														</ComboboxList>
													</ComboboxContent>
												</Combobox>
											</div>
										)}
									<FieldInfo field={field} />
								</div>
							);
						}}
					/>

					{isAdmin && (
						<form.Field
							name="ingredientIds"
							children={(field) => {
								const selectedIngredients = field.state.value
									.map((id) => ingredients?.find((i) => i.id === id))
									.filter(Boolean) as { id: string; name: string }[];

								return (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor={field.name}>Ingredients</Label>
											<AddIngredientDialog
												trigger={
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
													>
														<Plus className="w-3 h-3 mr-1" /> Add New
													</Button>
												}
											/>
										</div>
										<Combobox
											items={ingredients || []}
											itemToStringValue={(i) => i.name}
											multiple
											value={selectedIngredients}
											onValueChange={(newValues) => {
												field.handleChange(newValues.map((v) => v.id));
											}}
										>
											<ComboboxChips>
												<ComboboxValue>
													{selectedIngredients.map((item) => (
														<ComboboxChip key={item.id}>
															{item.name}
														</ComboboxChip>
													))}
												</ComboboxValue>
												<ComboboxChipsInput placeholder="Add mapped ingredient..." />
											</ComboboxChips>
											<ComboboxContent>
												<ComboboxEmpty>No ingredients found.</ComboboxEmpty>
												<ComboboxList>
													{(item) => (
														<ComboboxItem key={item.id} value={item}>
															{item.name}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										<FieldInfo field={field} />
									</div>
								);
							}}
						/>
					)}

					<form.Field
						name="rawIngredientsText"
						children={(field) => (
							<div className="flex flex-col gap-y-2">
								<Label htmlFor={field.name}>
									Raw Ingredients List (from label)
								</Label>
								<Textarea
									ref={textareaRef}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onSelect={isAdmin ? updateSelectionFromTextarea : undefined}
									onKeyUp={isAdmin ? updateSelectionFromTextarea : undefined}
									onMouseUp={isAdmin ? updateSelectionFromTextarea : undefined}
									onChange={(e) => {
										field.handleChange(e.target.value);
										if (isAdmin) {
											setSelectedLabelText("");
										}
									}}
									placeholder="e.g. Water, Almonds (2%), Calcium, Sea Salt..."
									className="min-h-24"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					/>

					{isAdmin && (
						<form.Field
							name="highlightedAdditives"
							children={(field) => (
								<form.Subscribe
									selector={(state) => state.values.rawIngredientsText}
									children={(rawText) => {
										const markedAdditives = field.state.value;
										const isReviewed = markedAdditives !== null;
										const additiveList = markedAdditives ?? [];
										const hasSelection = Boolean(selectedLabelText.trim());
										const hasRawText = Boolean(rawText.trim());

										const handleMarkSelected = () => {
											const normalized =
												normalizeAdditivePhrase(selectedLabelText);
											if (!normalized) {
												toast.error(
													"Select an additive phrase in the raw label text first.",
												);
												return;
											}
											const next = mergeAdditivePhrase(
												additiveList,
												normalized,
											);
											field.handleChange(next);
											setSelectedLabelText("");
											if (next.length === additiveList.length) {
												toast.info(
													`"${normalized}" is already covered by a marked additive.`,
												);
											}
										};

										const handleAutoDetect = () => {
											const candidates = detectAdditiveCandidates(rawText);
											if (candidates.length === 0) {
												if (additiveList.length === 0) {
													field.handleChange([]);
													toast.info(
														"No common additives detected — marked as 0 additives.",
													);
												} else {
													toast.info(
														"No additional common additives detected.",
													);
												}
												return;
											}

											let next = additiveList;
											const beforeCount = next.length;
											for (const candidate of candidates) {
												next = mergeAdditivePhrase(next, candidate);
											}
											field.handleChange(next);
											const addedCount = next.length - beforeCount;
											if (addedCount > 0) {
												toast.success(
													`Detected ${candidates.length} additive ${candidates.length === 1 ? "phrase" : "phrases"} (${addedCount} added).`,
												);
											} else {
												toast.info(
													"All detected additives are already marked.",
												);
											}
										};

										const handleConfirmZero = () => {
											field.handleChange([]);
										};

										const handleRemovePhrase = (phraseToRemove: string) => {
											field.handleChange(
												additiveList.filter((item) => item !== phraseToRemove),
											);
										};

										return (
											<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-3">
												<div className="flex flex-wrap items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<Highlighter
															className="w-4 h-4 text-amber-700 dark:text-amber-300"
															aria-hidden="true"
														/>
														<span className="text-sm font-semibold">
															Marked Additives on Label
														</span>
													</div>

													{!isReviewed ? (
														<Badge
															variant="outline"
															className="border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
														>
															<AlertTriangle aria-hidden="true" />
															<span>Not reviewed</span>
														</Badge>
													) : additiveList.length === 0 ? (
														<Badge
															variant="outline"
															className="border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
														>
															<CheckCircle2 aria-hidden="true" />
															<span>0 additives confirmed</span>
														</Badge>
													) : (
														<Badge
															variant="outline"
															className="border-amber-400 dark:border-amber-700 bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold"
														>
															<Highlighter aria-hidden="true" />
															<span>{additiveList.length} marked</span>
														</Badge>
													)}
												</div>

												<p className="text-xs text-muted-foreground">
													Highlight an additive in the raw label text above and
													click &lsquo;Mark selected as additive&rsquo;, or run
													Auto-detect and adjust.
												</p>

												<div className="flex flex-wrap items-center gap-2">
													<Button
														type="button"
														variant="secondary"
														size="sm"
														disabled={!hasSelection}
														onClick={handleMarkSelected}
													>
														<Highlighter
															className="w-3.5 h-3.5"
															aria-hidden="true"
														/>
														<span>Mark selected as additive</span>
													</Button>

													<Button
														type="button"
														variant="outline"
														size="sm"
														disabled={!hasRawText}
														onClick={handleAutoDetect}
													>
														<Sparkles
															className="w-3.5 h-3.5"
															aria-hidden="true"
														/>
														<span>Auto-detect additives</span>
													</Button>

													{(markedAdditives === null ||
														additiveList.length > 0) && (
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={handleConfirmZero}
														>
															<CheckCircle2
																className="w-3.5 h-3.5"
																aria-hidden="true"
															/>
															<span>
																{markedAdditives === null
																	? "Confirm 0 additives"
																	: "Clear all (0 additives)"}
															</span>
														</Button>
													)}
												</div>

												{additiveList.length > 0 && (
													<div className="flex flex-wrap gap-1.5 pt-1">
														{additiveList.map((phrase) => {
															const foundInText =
																!hasRawText ||
																isPhraseFoundInText(rawText, phrase);

															return (
																<span
																	key={phrase}
																	className={
																		foundInText
																			? "inline-flex items-center gap-1.5 rounded-full border border-amber-400/75 dark:border-amber-700/70 bg-amber-100/90 dark:bg-amber-950/70 px-2.5 py-1 text-xs font-semibold text-[#78350F] dark:text-amber-200"
																			: "inline-flex items-center gap-1.5 rounded-full border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:text-rose-200"
																	}
																>
																	{!foundInText && (
																		<AlertTriangle
																			className="w-3.5 h-3.5 shrink-0"
																			aria-hidden="true"
																		/>
																	)}
																	<span>{phrase}</span>
																	{!foundInText && (
																		<span className="text-[11px] font-medium opacity-85">
																			(not in label text)
																		</span>
																	)}
																	<button
																		type="button"
																		onClick={() => handleRemovePhrase(phrase)}
																		aria-label={`Remove ${phrase}`}
																		className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
																	>
																		<X className="w-3 h-3" aria-hidden="true" />
																	</button>
																</span>
															);
														})}
													</div>
												)}

												{hasRawText && isReviewed && (
													<div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
														<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
															Live Label Preview
														</p>
														<HighlightedIngredientsText
															text={rawText}
															highlightedAdditives={additiveList}
															className="text-xs sm:text-sm leading-relaxed text-foreground"
														/>
													</div>
												)}
											</div>
										);
									}}
								/>
							)}
						/>
					)}

					{isAdmin && (
						<form.Field
							name="storeIds"
							validators={{
								onChange: ({ value }) =>
									!value || value.length === 0
										? "At least one store is required"
										: undefined,
								onSubmit: ({ value }) =>
									!value || value.length === 0
										? "At least one store is required"
										: undefined,
							}}
							children={(field) => {
								const selectedStores = field.state.value
									.map((id) => stores?.find((s) => s.id === id))
									.filter(Boolean) as { id: string; name: string }[];

								return (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor={field.name}>
												Available At (Stores){" "}
												<span className="text-red-500">*</span>
											</Label>
											<AddStoreDialog
												trigger={
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
													>
														<Plus className="w-3 h-3 mr-1" /> Add New
													</Button>
												}
											/>
										</div>
										<Combobox
											items={stores || []}
											itemToStringValue={(s) => s.name}
											multiple
											value={selectedStores}
											onValueChange={(newValues) => {
												field.handleChange(newValues.map((v) => v.id));
											}}
										>
											<ComboboxChips>
												<ComboboxValue>
													{selectedStores.map((item) => (
														<ComboboxChip key={item.id}>
															{item.name}
														</ComboboxChip>
													))}
												</ComboboxValue>
												<ComboboxChipsInput placeholder="Add store..." />
											</ComboboxChips>
											<ComboboxContent>
												<ComboboxEmpty>No stores found.</ComboboxEmpty>
												<ComboboxList>
													{(item) => (
														<ComboboxItem key={item.id} value={item}>
															{item.name}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										<FieldInfo field={field} />
									</div>
								);
							}}
						/>
					)}

					{isAdmin && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field
								name="score"
								children={(field) => (
									<div className="flex flex-col gap-y-2">
										<Label htmlFor={field.name}>Clean Label Score</Label>
										<Select
											value={field.state.value}
											onValueChange={(
												value: "gold" | "silver" | "bronze" | "none",
											) => field.handleChange(value)}
										>
											<SelectTrigger id={field.name}>
												<SelectValue placeholder="Select a score" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="gold">Gold</SelectItem>
												<SelectItem value="silver">Silver</SelectItem>
												<SelectItem value="bronze">Bronze</SelectItem>
											</SelectContent>
										</Select>
										<form.Subscribe
											selector={(state) => state.values.highlightedAdditives}
											children={(highlightedAdditives) => {
												if (highlightedAdditives === null) return null;
												const count = highlightedAdditives.length;
												const suggested = suggestScoreFromAdditivesCount(count);
												const suggestedLabel =
													suggested.charAt(0).toUpperCase() +
													suggested.slice(1);

												if (field.state.value === suggested) {
													return (
														<p className="text-xs text-muted-foreground">
															Matches {count} marked{" "}
															{count === 1 ? "additive" : "additives"} (
															{suggestedLabel}).
														</p>
													);
												}

												return (
													<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300/70 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 px-2.5 py-1.5 text-xs text-amber-900 dark:text-amber-200">
														<span>
															{count} marked{" "}
															{count === 1 ? "additive" : "additives"} &rarr;
															Suggested: <strong>{suggestedLabel}</strong>
														</span>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => field.handleChange(suggested)}
															className="h-6 px-2 text-xs font-semibold border-amber-400/80 dark:border-amber-700 bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-900/50"
														>
															Apply
														</Button>
													</div>
												);
											}}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							/>

							<form.Field
								name="status"
								children={(field) => (
									<div className="flex flex-col gap-y-2">
										<Label htmlFor={field.name}>Status</Label>
										<Select
											value={field.state.value}
											onValueChange={(
												value: "pending_review" | "approved" | "rejected",
											) => field.handleChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending_review">
													Pending Review
												</SelectItem>
												<SelectItem value="approved">Approved</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
										<FieldInfo field={field} />
									</div>
								)}
							/>
						</div>
					)}

					<div className="pt-4">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting}
									className="w-full"
								>
									{isSubmitting ? "Saving Product..." : "Save Product"}
								</Button>
							)}
						/>
					</div>
				</div>
			)}
		</form>
	);
}
