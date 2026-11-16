import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowLeft,
	CameraIcon,
	CheckCircle2,
	Loader2,
	Package,
	Plus,
	Store,
	X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { ScoreBadge } from "#/components/ui/score-badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useImageUploadMutation } from "#/hooks/use-image-upload-mutation";
import { cn } from "#/lib/utils";
import { productDetailsQueryOptions } from "#/queries/product-queries";
import { storesQueryOptions } from "#/queries/store-queries";
import { submitProductStore } from "#/server/store-submission-functions";

export const Route = createFileRoute(
	"/_protected/_public/products/$productId_/add-store",
)({
	loader: async ({ context: { queryClient }, params: { productId } }) => {
		await Promise.all([
			queryClient.ensureQueryData(productDetailsQueryOptions(productId)),
			queryClient.ensureQueryData(storesQueryOptions()),
		]);
	},
	component: AddStoreToProductPage,
});

function AddStoreToProductPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { productId } = Route.useParams();

	const { data: product } = useSuspenseQuery(
		productDetailsQueryOptions(productId),
	);
	const { data: stores } = useSuspenseQuery(storesQueryOptions());

	const [selectedStoreId, setSelectedStoreId] = useState<string>("");
	const [otherStoreName, setOtherStoreName] = useState<string>("");
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [statusMessage, setStatusMessage] = useState<string>("");
	const [errors, setErrors] = useState<{
		store?: string;
		otherStoreName?: string;
		photo?: string;
	}>({});

	const storeSelectId = useId();
	const storeErrorId = useId();
	const otherStoreId = useId();
	const otherStoreHelpId = useId();
	const otherStoreErrorId = useId();
	const photoInputId = useId();
	const photoHelpId = useId();
	const photoErrorId = useId();

	const storeTriggerRef = useRef<HTMLButtonElement>(null);
	const otherStoreInputRef = useRef<HTMLInputElement>(null);
	const photoInputRef = useRef<HTMLInputElement>(null);

	const imageUploadMutation = useImageUploadMutation();
	const submitProductStoreFn = useServerFn(submitProductStore);

	useEffect(() => {
		return () => {
			if (photoPreview) {
				URL.revokeObjectURL(photoPreview);
			}
		};
	}, [photoPreview]);

	if (!product) {
		return (
			<div className="bg-[#FAF8F5] dark:bg-[#0E1612] min-h-[65vh] flex items-center justify-center px-4 py-12">
				<div className="max-w-md w-full text-center py-12 px-6 bg-white dark:bg-[#16221C] rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)]">
					<div className="w-12 h-12 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto mb-3">
						<Package className="w-6 h-6" aria-hidden="true" />
					</div>
					<h1 className="text-lg font-bold text-[#1B3328] dark:text-[#EDF2EE]">
						Product not found
					</h1>
					<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1">
						This product may have been removed or is not yet available.
					</p>
					<Link
						to="/"
						className="mt-5 inline-flex items-center px-5 py-2.5 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors"
					>
						Return to Home
					</Link>
				</div>
			</div>
		);
	}

	const existingStoreIds = new Set(
		product.productStores?.map((ps) => ps.storeId) || [],
	);

	// Filter out stores that are already associated with this product
	const availableStores = (stores || []).filter(
		(s) => !existingStoreIds.has(s.id),
	);

	const handlePhotoChange = (file: File | undefined) => {
		if (!file) return;
		if (photoPreview) {
			URL.revokeObjectURL(photoPreview);
		}
		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
		setErrors((prev) => ({ ...prev, photo: undefined }));
	};

	const removePhoto = () => {
		setPhotoFile(null);
		if (photoPreview) {
			URL.revokeObjectURL(photoPreview);
		}
		setPhotoPreview(null);
		if (photoInputRef.current) {
			photoInputRef.current.value = "";
		}
	};

	const validate = () => {
		const newErrors: {
			store?: string;
			otherStoreName?: string;
			photo?: string;
		} = {};

		if (!selectedStoreId) {
			newErrors.store = "Please select a store or choose 'Other'.";
		} else if (selectedStoreId === "other" && !otherStoreName.trim()) {
			newErrors.otherStoreName = "Please enter the store name.";
		}

		if (!photoFile) {
			newErrors.photo =
				"Please take or upload a photo of the front of the product.";
		}

		setErrors(newErrors);

		if (newErrors.store) {
			storeTriggerRef.current?.focus();
		} else if (newErrors.otherStoreName) {
			otherStoreInputRef.current?.focus();
		} else if (newErrors.photo) {
			photoInputRef.current?.focus();
		}

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate() || !photoFile) return;

		try {
			setIsSubmitting(true);
			setStatusMessage("Uploading verification photo...");

			const publicUrl = await imageUploadMutation.mutateAsync({
				file: photoFile,
				type: "front",
			});

			setStatusMessage("Submitting store report...");

			await submitProductStoreFn({
				data: {
					productId: product.id,
					storeId: selectedStoreId !== "other" ? selectedStoreId : undefined,
					otherStoreName:
						selectedStoreId === "other" ? otherStoreName.trim() : undefined,
					proofImageUrl: publicUrl,
				},
			});

			queryClient.invalidateQueries({
				queryKey: ["productDetails", product.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["pendingStoreSubmissionsCount"],
			});

			toast.success(
				"Store submission received! An admin will review and verify it shortly.",
			);
			router.history.back();
		} catch (error: unknown) {
			console.error("Failed to submit store report:", error);
			const message =
				error instanceof Error
					? error.message
					: "Failed to submit store report. Please try again.";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
			setStatusMessage("");
		}
	};

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Sticky Botanical Sub-Header */}
			<div className="sticky top-0 md:top-16 z-30 bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D]">
				<div className="max-w-3xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
					<div className="flex items-center gap-2.5 min-w-0">
						<button
							type="button"
							onClick={() => router.history.back()}
							className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44] hover:bg-[#E3EDE7]/50 dark:hover:bg-[#1E3A2C] transition-colors cursor-pointer touch-manipulation shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
						>
							<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
							<span>Back</span>
						</button>
						<span className="text-sm font-semibold text-[#5C665E] dark:text-[#9AA89E] truncate">
							Report Store Availability
						</span>
					</div>

					<ScoreBadge score={product.score} size="sm" />
				</div>
			</div>

			<main className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-9 space-y-6">
				{/* Product Summary Card */}
				<section
					aria-label="Product summary"
					className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] p-4 sm:p-5 flex gap-4 items-center"
				>
					{product.imageFrontUrl ? (
						<div className="w-16 h-20 rounded-xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] p-1.5 flex items-center justify-center shrink-0">
							<img
								src={product.imageFrontUrl}
								alt={product.name}
								className="w-full h-full object-contain"
							/>
						</div>
					) : (
						<div className="w-16 h-20 rounded-xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] flex items-center justify-center text-[#9AA09A] dark:text-slate-500 shrink-0">
							<Package className="w-7 h-7 opacity-65" aria-hidden="true" />
						</div>
					)}

					<div className="min-w-0 flex-1">
						{product.brand && (
							<p className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400 truncate">
								{product.brand}
							</p>
						)}
						<h2 className="font-extrabold text-[#1B3328] dark:text-[#FBF4E6] text-base sm:text-lg leading-snug truncate mt-0.5">
							{product.name}
						</h2>

						<div className="mt-2 flex flex-wrap items-center gap-1.5">
							<span className="text-[11px] font-semibold text-[#5C665E] dark:text-[#9AA89E]">
								Listed at:
							</span>
							{product.productStores && product.productStores.length > 0 ? (
								product.productStores.map(({ store }) => (
									<span
										key={store.id}
										className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] text-[#243B30] dark:text-[#CBE3D4] px-2 py-0.5 text-[11px] font-semibold border border-[#EAE4D7] dark:border-[#2B3D33]"
									>
										<StoreAvatar
											name={store.name}
											logoUrl={store.logoUrl}
											size="xs"
											className="w-4 h-4 text-[8px]"
										/>
										<span>{store.name}</span>
									</span>
								))
							) : (
								<span className="text-xs italic text-[#7D857E] dark:text-[#8E9B92]">
									No stores yet
								</span>
							)}
						</div>
					</div>
				</section>

				{/* Submission Form Card */}
				<section
					aria-labelledby="report-store-heading"
					className="rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_4px_20px_rgba(27,67,50,0.04)] overflow-hidden"
				>
					<div className="p-5 sm:p-6 border-b border-[#F0EAE0] dark:border-[#22332A] bg-[#FAF8F5]/65 dark:bg-[#121D17]/60 flex items-start gap-3.5">
						<span className="w-11 h-11 rounded-2xl bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
							<Store className="w-5 h-5" aria-hidden="true" />
						</span>
						<div className="min-w-0">
							<h1
								id="report-store-heading"
								className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
							>
								Where did you find this product?
							</h1>
							<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 leading-relaxed">
								Select the supermarket where you spotted this item and attach a
								quick front photo so our team can verify it.
							</p>
						</div>
					</div>

					<form
						noValidate
						onSubmit={handleSubmit}
						className="p-5 sm:p-6 space-y-6"
					>
						{/* Store Dropdown */}
						<div>
							<label
								htmlFor={storeSelectId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] mb-2"
							>
								Select Store{" "}
								<span
									className="text-rose-600 dark:text-rose-400"
									aria-hidden="true"
								>
									*
								</span>
							</label>
							<Select
								value={selectedStoreId}
								onValueChange={(val) => {
									setSelectedStoreId(val);
									setErrors((prev) => ({
										...prev,
										store: undefined,
										otherStoreName: undefined,
									}));
								}}
							>
								<SelectTrigger
									ref={storeTriggerRef}
									id={storeSelectId}
									aria-required="true"
									aria-invalid={Boolean(errors.store)}
									aria-describedby={errors.store ? storeErrorId : undefined}
									className={cn(
										"w-full data-[size=default]:h-auto min-h-11 pointer-coarse:min-h-12 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border-[#EAE4D7] dark:border-[#2B3D33] text-base sm:text-sm text-[#1B3328] dark:text-[#EDF2EE] shadow-none cursor-pointer focus-visible:ring-[#2D5A44]/40 focus-visible:border-[#2D5A44]",
										errors.store &&
											"border-rose-500 dark:border-rose-500 focus-visible:ring-rose-500/30",
									)}
								>
									<SelectValue placeholder="Choose a store..." />
								</SelectTrigger>
								<SelectContent className="max-h-64 rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] shadow-xl">
									{availableStores.map((store) => (
										<SelectItem
											key={store.id}
											value={store.id}
											className="min-h-10 rounded-lg text-sm text-[#1B3328] dark:text-[#EDF2EE] cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<StoreAvatar
													name={store.name}
													logoUrl={store.logoUrl}
													size="xs"
												/>
												<span>{store.name}</span>
											</div>
										</SelectItem>
									))}
									<SelectItem
										value="other"
										className="min-h-10 rounded-lg text-sm font-semibold text-[#1B4332] dark:text-emerald-400 cursor-pointer"
									>
										<div className="flex items-center gap-2">
											<Plus className="w-4 h-4" aria-hidden="true" />
											<span>Other (Store not in list)</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
							{errors.store && (
								<p
									id={storeErrorId}
									role="alert"
									className="mt-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400"
								>
									{errors.store}
								</p>
							)}
						</div>

						{/* Other Store Name input if "other" is selected */}
						{selectedStoreId === "other" && (
							<div className="animate-in fade-in slide-in-from-top-2 duration-200">
								<label
									htmlFor={otherStoreId}
									className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] mb-2"
								>
									Store Name{" "}
									<span
										className="text-rose-600 dark:text-rose-400"
										aria-hidden="true"
									>
										*
									</span>
								</label>
								<input
									ref={otherStoreInputRef}
									id={otherStoreId}
									name="otherStoreName"
									type="text"
									required
									autoComplete="organization"
									enterKeyHint="done"
									maxLength={120}
									placeholder="e.g., Kaufland, Mega Image, Local Market..."
									value={otherStoreName}
									aria-invalid={Boolean(errors.otherStoreName)}
									aria-describedby={
										errors.otherStoreName
											? `${otherStoreHelpId} ${otherStoreErrorId}`
											: otherStoreHelpId
									}
									onChange={(e) => {
										setOtherStoreName(e.target.value);
										if (errors.otherStoreName && e.target.value.trim()) {
											setErrors((prev) => ({
												...prev,
												otherStoreName: undefined,
											}));
										}
									}}
									className={cn(
										"w-full min-h-11 pointer-coarse:min-h-12 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] font-[inherit] text-base sm:text-sm text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]/40 focus:border-[#2D5A44] transition-colors",
										errors.otherStoreName &&
											"border-rose-500 dark:border-rose-500 focus:ring-rose-500/30 focus:border-rose-500",
									)}
								/>
								{errors.otherStoreName && (
									<p
										id={otherStoreErrorId}
										role="alert"
										className="mt-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400"
									>
										{errors.otherStoreName}
									</p>
								)}
								<p
									id={otherStoreHelpId}
									className="mt-1.5 text-xs text-[#5C665E] dark:text-[#9AA89E]"
								>
									An admin will review this store name and add it to the
									platform.
								</p>
							</div>
						)}

						{/* Photo Upload / Capture */}
						<div>
							<label
								htmlFor={photoInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								Front Photo of Product{" "}
								<span
									className="text-rose-600 dark:text-rose-400"
									aria-hidden="true"
								>
									*
								</span>
							</label>
							<p
								id={photoHelpId}
								className="mt-1 mb-2.5 text-xs text-[#5C665E] dark:text-[#9AA89E]"
							>
								Take or upload a quick front photo of the product at the store
								to validate availability.
							</p>

							{photoPreview ? (
								<div className="relative rounded-2xl overflow-hidden border border-[#EAE4D7] dark:border-[#24362D] bg-[#F5F1E8] dark:bg-[#1A2821] aspect-4/3 max-h-72 w-full flex items-center justify-center p-3">
									<img
										src={photoPreview}
										alt="Selected front verification preview"
										className="w-full h-full object-contain"
									/>
									<button
										type="button"
										onClick={removePhoto}
										aria-label="Remove verification photo"
										className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 dark:bg-[#16221C]/95 border border-[#EAE4D7] dark:border-[#2C4035] text-[#1B3328] dark:text-[#EDF2EE] hover:text-rose-700 hover:border-rose-300 shadow-md flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
									>
										<X className="w-4 h-4" aria-hidden="true" />
									</button>
								</div>
							) : (
								<div
									className={cn(
										"relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors bg-[#FAF8F5]/70 dark:bg-[#121D17]/60 group focus-within:ring-2 focus-within:ring-[#2D5A44]/50 focus-within:border-[#2D5A44]",
										errors.photo
											? "border-rose-400 dark:border-rose-600 bg-rose-50/40 dark:bg-rose-950/15"
											: "border-[#DCD4C3] dark:border-[#2A3D33] hover:border-[#2D5A44] dark:hover:border-[#3D6E54]",
									)}
								>
									<input
										ref={photoInputRef}
										id={photoInputId}
										name="proofPhoto"
										type="file"
										accept="image/*"
										capture="environment"
										required
										aria-invalid={Boolean(errors.photo)}
										aria-describedby={
											errors.photo
												? `${photoHelpId} ${photoErrorId}`
												: photoHelpId
										}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
										onChange={(e) => {
											if (e.target.files?.[0]) {
												handlePhotoChange(e.target.files[0]);
											}
										}}
									/>
									<div className="w-14 h-14 rounded-2xl bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
										<CameraIcon className="w-7 h-7" aria-hidden="true" />
									</div>
									<p className="font-bold text-sm text-[#1B3328] dark:text-[#EDF2EE]">
										Tap to take photo or choose image
									</p>
									<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-1">
										Supports Camera or Gallery upload (JPEG, PNG)
									</p>
								</div>
							)}

							{errors.photo && (
								<p
									id={photoErrorId}
									role="alert"
									className="mt-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400"
								>
									{errors.photo}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full min-h-12 px-5 py-3 rounded-full bg-[#1B4332] hover:bg-[#245540] disabled:opacity-60 disabled:cursor-not-allowed text-[#FCE8C6] text-sm font-bold shadow-[0_6px_18px_rgba(27,67,50,0.18)] flex items-center justify-center gap-2 transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
						>
							{isSubmitting ? (
								<>
									<Loader2
										className="w-4.5 h-4.5 animate-spin"
										aria-hidden="true"
									/>
									<span>{statusMessage || "Submitting..."}</span>
								</>
							) : (
								<>
									<CheckCircle2 className="w-4.5 h-4.5" aria-hidden="true" />
									<span>Submit Store Availability</span>
								</>
							)}
						</button>
					</form>
				</section>
			</main>
		</div>
	);
}
