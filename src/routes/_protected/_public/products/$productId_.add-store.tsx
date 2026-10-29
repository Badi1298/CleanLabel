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
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useImageUploadMutation } from "#/hooks/use-image-upload-mutation";
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

	const imageUploadMutation = useImageUploadMutation();
	const submitProductStoreFn = useServerFn(submitProductStore);

	if (!product) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Package className="w-16 h-16 text-slate-300" />
				<h2 className="text-xl font-medium text-slate-600">Product not found</h2>
				<Link to="/" className="text-emerald-600 hover:underline">
					Return to Home
				</Link>
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
		setPhotoFile(file);
		const previewUrl = URL.createObjectURL(file);
		setPhotoPreview(previewUrl);
		setErrors((prev) => ({ ...prev, photo: undefined }));
	};

	const removePhoto = () => {
		setPhotoFile(null);
		if (photoPreview) {
			URL.revokeObjectURL(photoPreview);
		}
		setPhotoPreview(null);
	};

	const validate = () => {
		const newErrors: {
			store?: string;
			otherStoreName?: string;
			photo?: string;
		} = {};

		if (!selectedStoreId) {
			newErrors.store = "Please select a store or choose 'Other'";
		} else if (selectedStoreId === "other" && !otherStoreName.trim()) {
			newErrors.otherStoreName = "Please enter the store name";
		}

		if (!photoFile) {
			newErrors.photo =
				"Please take or upload a photo of the front of the product";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		try {
			setIsSubmitting(true);
			setStatusMessage("Uploading verification photo...");

			const publicUrl = await imageUploadMutation.mutateAsync({
				file: photoFile!,
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
		} catch (error: any) {
			console.error("Failed to submit store report:", error);
			toast.error(
				error?.message ||
					"Failed to submit store report. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
			setStatusMessage("");
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center">
				<Button
					size="icon"
					variant="ghost"
					className="mr-3 cursor-pointer rounded-full"
					onClick={() => router.history.back()}
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="font-semibold text-lg truncate flex-1">
					Report Store Availability
				</h1>
			</header>

			<main className="max-w-xl mx-auto px-4 py-6 space-y-6">
				{/* Product Summary Card */}
				<Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
					<CardContent className="p-4 flex gap-4 items-center">
						{product.imageFrontUrl ? (
							<img
								src={product.imageFrontUrl}
								alt={product.name}
								className="w-16 h-20 object-contain rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0"
							/>
						) : (
							<div className="w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
								<Package className="w-8 h-8" />
							</div>
						)}
						<div className="min-w-0 flex-1">
							<Badge
								variant="secondary"
								className="text-[11px] mb-1 font-normal text-slate-600 dark:text-slate-300"
							>
								{product.brand}
							</Badge>
							<h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-snug truncate">
								{product.name}
							</h2>

							<div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
								<span className="font-medium">Currently listed at:</span>
								{product.productStores && product.productStores.length > 0 ? (
									product.productStores.map(({ store }) => (
										<span
											key={store.id}
											className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
										>
											{store.name}
										</span>
									))
								) : (
									<span className="italic text-slate-400">None</span>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Submission Form Card */}
				<Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl flex items-center gap-2">
							<Store className="w-5 h-5 text-emerald-600" />
							Where did you find this product?
						</CardTitle>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Select the store where you spotted this item and attach a quick
							front photo to help us verify the finding.
						</p>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Store Dropdown */}
							<div className="space-y-2">
								<Label htmlFor="store-select" className="text-sm font-medium">
									Select Store <span className="text-red-500">*</span>
								</Label>
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
										id="store-select"
										className="w-full h-11 bg-white dark:bg-slate-900 rounded-xl"
									>
										<SelectValue placeholder="Choose a store..." />
									</SelectTrigger>
									<SelectContent className="max-h-64">
										{availableStores.map((store) => (
											<SelectItem key={store.id} value={store.id}>
												<div className="flex items-center gap-2">
													{store.logoUrl ? (
														<img
															src={store.logoUrl}
															alt=""
															className="w-4 h-4 rounded-full object-cover"
														/>
													) : (
														<Store className="w-4 h-4 text-slate-400" />
													)}
													<span>{store.name}</span>
												</div>
											</SelectItem>
										))}
										<SelectItem
											value="other"
											className="font-medium text-emerald-600 dark:text-emerald-400"
										>
											<div className="flex items-center gap-2">
												<Plus className="w-4 h-4" />
												<span>Other (Store not in list)</span>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
								{errors.store && (
									<p className="text-xs text-red-500 font-medium">
										{errors.store}
									</p>
								)}
							</div>

							{/* Other Store Name input if "other" is selected */}
							{selectedStoreId === "other" && (
								<div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
									<Label htmlFor="other-store" className="text-sm font-medium">
										Store Name <span className="text-red-500">*</span>
									</Label>
									<Input
										id="other-store"
										type="text"
										placeholder="e.g., Whole Foods, Trader Joe's, Local Market..."
										value={otherStoreName}
										onChange={(e) => {
											setOtherStoreName(e.target.value);
											setErrors((prev) => ({
												...prev,
												otherStoreName: undefined,
											}));
										}}
										className="h-11 bg-white dark:bg-slate-900 rounded-xl"
										autoFocus
									/>
									{errors.otherStoreName && (
										<p className="text-xs text-red-500 font-medium">
											{errors.otherStoreName}
										</p>
									)}
									<p className="text-xs text-slate-500">
										An admin will review this store name and add it to the platform.
									</p>
								</div>
							)}

							{/* Photo Upload / Capture */}
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Front Photo of Product <span className="text-red-500">*</span>
								</Label>
								<p className="text-xs text-slate-500">
									Please take or upload a photo of the front of the product at
									the store to validate availability.
								</p>

								{photoPreview ? (
									<div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900/5 aspect-4/3 flex items-center justify-center">
										<img
											src={photoPreview}
											alt="Preview"
											className="w-full h-full object-contain"
										/>
										<div className="absolute top-2 right-2 flex gap-2">
											<Button
												type="button"
												size="icon"
												variant="secondary"
												className="rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md cursor-pointer"
												onClick={removePhoto}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</div>
								) : (
									<div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white dark:bg-slate-900/50 group">
										<Input
											id="proofPhoto"
											type="file"
											accept="image/*"
											capture="environment"
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
											onChange={(e) => {
												if (e.target.files?.[0]) {
													handlePhotoChange(e.target.files[0]);
												}
											}}
										/>
										<div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
											<CameraIcon className="w-7 h-7" />
										</div>
										<p className="font-medium text-sm text-slate-800 dark:text-slate-200">
											Tap to take photo or choose image
										</p>
										<p className="text-xs text-slate-500 mt-1">
											Supports Camera or Gallery upload (JPEG, PNG)
										</p>
									</div>
								)}

								{errors.photo && (
									<p className="text-xs text-red-500 font-medium">
										{errors.photo}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full h-12 rounded-xl text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
							>
								{isSubmitting ? (
									<div className="flex items-center gap-2">
										<Loader2 className="w-5 h-5 animate-spin" />
										<span>{statusMessage || "Submitting..."}</span>
									</div>
								) : (
									<div className="flex items-center gap-2">
										<CheckCircle2 className="w-5 h-5" />
										<span>Submit Store Availability</span>
									</div>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
