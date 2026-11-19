import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	Award,
	Barcode,
	Calendar,
	CheckCircle2,
	ChevronRight,
	Flag,
	Heart,
	Info,
	Package,
	Plus,
	RotateCcw,
	ShieldAlert,
	Sparkles,
	Store,
	User,
	X,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { HighlightedIngredientsText } from "#/components/HighlightedIngredientsText";
import { ProductCard } from "#/components/home/product-card";
import { ProductReportErrorDialog } from "#/components/ProductReportErrorDialog";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { ScoreBadge } from "#/components/ui/score-badge";
import { isPhraseFoundInText } from "#/lib/additive-highlighting";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import {
	productAlternativesQueryOptions,
	productDetailsQueryOptions,
} from "#/queries/product-queries";
import {
	userExcludedIngredientsQueryOptions,
	userFavoriteProductsQueryOptions,
} from "#/queries/profile-queries";
import { toggleFavoriteProduct } from "#/server/profile-functions";

export const Route = createFileRoute("/_protected/_public/products/$productId")(
	{
		loader: async ({ context: { queryClient }, params: { productId } }) => {
			const [product] = await Promise.all([
				queryClient.ensureQueryData(productDetailsQueryOptions(productId)),
				queryClient.ensureQueryData(productAlternativesQueryOptions(productId)),
			]);
			if (!product) {
				throw notFound();
			}
		},
		notFoundComponent: () => (
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
		),
		component: ProductDetails,
	},
);

type ImageSide = "front" | "back";

function getScoreSpotlightConfig(score: string | null | undefined) {
	switch (score) {
		case "gold":
			return {
				title: "Gold Tier — Cleanest Pick",
				description: "Minimal or no marked additives declared on the label.",
				cardClass:
					"bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/70 to-[#FBF4E6] dark:from-amber-950/50 dark:via-amber-950/30 dark:to-[#16221C] border-[#F59E0B]/40 dark:border-amber-700/50",
				emblemClass:
					"bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700/50",
				titleClass: "text-[#78350F] dark:text-amber-200",
				Icon: Sparkles,
			};
		case "silver":
			return {
				title: "Silver Tier — Clean Pick",
				description: "Low number of marked label additives.",
				cardClass:
					"bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9]/80 to-white dark:from-slate-900/80 dark:via-slate-800/40 dark:to-[#16221C] border-[#CBD5E1] dark:border-slate-700",
				emblemClass:
					"bg-[#F1F5F9] text-[#334155] border-[#CBD5E1] dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
				titleClass: "text-[#1E293B] dark:text-slate-100",
				Icon: Award,
			};
		case "bronze":
			return {
				title: "Bronze Tier",
				description: "Moderate additives declared on the label.",
				cardClass:
					"bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5]/70 to-[#FAF8F5] dark:from-orange-950/50 dark:via-orange-950/30 dark:to-[#16221C] border-[#FDBA74]/60 dark:border-orange-800/50",
				emblemClass:
					"bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]/60 dark:bg-orange-900/60 dark:text-orange-200 dark:border-orange-800/60",
				titleClass: "text-[#7C2D12] dark:text-orange-200",
				Icon: Award,
			};
		default:
			return {
				title: "Score Pending",
				description:
					"This product has not been assigned a CleanLabel tier yet.",
				cardClass:
					"bg-[#FAF8F5] dark:bg-[#121D17] border-[#EAE4D7] dark:border-[#24362D]",
				emblemClass:
					"bg-[#E3EDE7] text-[#1B4332] border-[#C8DBD0] dark:bg-[#1E3A2C] dark:text-[#CBE3D4] dark:border-[#2E5440]",
				titleClass: "text-[#1B3328] dark:text-[#EDF2EE]",
				Icon: Info,
			};
	}
}

function formatProductDate(value: Date | string | null | undefined) {
	if (!value) return null;
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return {
		iso: date.toISOString(),
		formatted: date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		}),
		ddmmyyyy: `${day}.${month}.${year}`,
		dayKey: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
		timestamp: date.getTime(),
	};
}

function ProductImageLightbox({
	open,
	onClose,
	productName,
	imageFrontUrl,
	imageBackUrl,
	activeSide,
	onSelectSide,
}: {
	open: boolean;
	onClose: () => void;
	productName: string;
	imageFrontUrl: string | null | undefined;
	imageBackUrl: string | null | undefined;
	activeSide: ImageSide;
	onSelectSide: (side: ImageSide) => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => {
			dialog.returnValue = "";
			onClose();
		};

		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	// Progressive enhancement fallback for browsers lacking <dialog closedby="any">
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

		const isOutside = (e: PointerEvent) => {
			const rect = dialog.getBoundingClientRect();
			return (
				e.clientX < rect.left ||
				e.clientX > rect.right ||
				e.clientY < rect.top ||
				e.clientY > rect.bottom
			);
		};

		let pressedOutside = false;
		const onPointerDown = (e: PointerEvent) => {
			pressedOutside = isOutside(e);
		};
		const onPointerUp = (e: PointerEvent) => {
			if (pressedOutside && isOutside(e)) {
				dialog.close();
			}
			pressedOutside = false;
		};

		dialog.addEventListener("pointerdown", onPointerDown);
		dialog.addEventListener("pointerup", onPointerUp);
		return () => {
			dialog.removeEventListener("pointerdown", onPointerDown);
			dialog.removeEventListener("pointerup", onPointerUp);
		};
	}, []);

	const hasFront = Boolean(imageFrontUrl);
	const hasBack = Boolean(imageBackUrl);
	const hasBoth = hasFront && hasBack;
	const resolvedSide: ImageSide =
		activeSide === "back" && hasBack ? "back" : hasFront ? "front" : "back";
	const activeUrl = resolvedSide === "front" ? imageFrontUrl : imageBackUrl;

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			{...({ closedby: "any" } as Record<string, string>)}
			className="m-auto w-[calc(100%-1.5rem)] max-w-3xl max-h-[90dvh] rounded-3xl border border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#131F19] p-0 text-[#1B3328] dark:text-[#EDF2EE] shadow-2xl backdrop:bg-[#0E1612]/75 backdrop:backdrop-blur-xs open:flex open:flex-col overflow-hidden"
		>
			<div className="px-4 py-3 sm:px-5 border-b border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] flex items-center justify-between gap-3 shrink-0">
				<div className="min-w-0">
					<h2
						id={titleId}
						className="text-sm sm:text-base font-bold text-[#1B3328] dark:text-[#FBF4E6] truncate"
					>
						{productName}
					</h2>
					<p className="text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E]">
						{resolvedSide === "front"
							? "Front Packaging"
							: "Back & Ingredients Label"}
					</p>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{hasBoth && (
						<div className="bg-[#F3EFE6] dark:bg-[#1E2C25] p-1 rounded-full flex items-center gap-0.5 border border-[#EAE4D7] dark:border-[#2B3D33]">
							<button
								type="button"
								aria-pressed={resolvedSide === "front"}
								onClick={() => onSelectSide("front")}
								className={cn(
									"px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer touch-manipulation",
									resolvedSide === "front"
										? "bg-[#1B4332] text-[#FCE8C6] shadow-2xs"
										: "text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
								)}
							>
								Front
							</button>
							<button
								type="button"
								aria-pressed={resolvedSide === "back"}
								onClick={() => onSelectSide("back")}
								className={cn(
									"px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer touch-manipulation",
									resolvedSide === "back"
										? "bg-[#1B4332] text-[#FCE8C6] shadow-2xs"
										: "text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
								)}
							>
								Back
							</button>
						</div>
					)}

					<button
						type="button"
						onClick={onClose}
						aria-label="Close image viewer"
						className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FAF8F5] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] hover:border-[#2D5A44] transition-colors cursor-pointer touch-manipulation"
					>
						<X className="w-4 h-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<div className="relative flex-1 min-h-[55dvh] sm:min-h-[65dvh] bg-[#F5F1E8] dark:bg-[#0E1612] flex items-center justify-center overflow-hidden">
				{open && activeUrl && (
					<TransformWrapper
						key={resolvedSide}
						initialScale={1}
						minScale={1}
						maxScale={5}
						centerOnInit
						doubleClick={{ mode: "toggle" }}
					>
						{({ zoomIn, zoomOut, resetTransform }) => (
							<>
								<TransformComponent
									wrapperStyle={{ width: "100%", height: "100%" }}
									contentStyle={{
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<img
										src={activeUrl}
										alt={`${productName} ${resolvedSide === "front" ? "front" : "back label"}`}
										className="max-h-[66dvh] max-w-full w-auto object-contain select-none p-3 sm:p-6"
									/>
								</TransformComponent>

								<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-[#16221C]/95 backdrop-blur-md border border-[#EAE4D7] dark:border-[#24362D] px-2 py-1.5 shadow-lg">
									<button
										type="button"
										onClick={() => zoomOut()}
										aria-label="Zoom out"
										className="w-8 h-8 rounded-full flex items-center justify-center text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer touch-manipulation"
									>
										<ZoomOut className="w-4 h-4" aria-hidden="true" />
									</button>
									<button
										type="button"
										onClick={() => resetTransform()}
										aria-label="Reset zoom"
										className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-xs font-semibold text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer touch-manipulation"
									>
										<RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
										<span>Reset</span>
									</button>
									<button
										type="button"
										onClick={() => zoomIn()}
										aria-label="Zoom in"
										className="w-8 h-8 rounded-full flex items-center justify-center text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer touch-manipulation"
									>
										<ZoomIn className="w-4 h-4" aria-hidden="true" />
									</button>
								</div>
							</>
						)}
					</TransformWrapper>
				)}
			</div>

			<div className="px-4 py-2.5 border-t border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] text-[11px] font-medium text-[#5C665E] dark:text-[#9AA89E] text-center shrink-0">
				Pinch, scroll, or use + / − to zoom · Drag to pan · Esc or tap outside
				to close
			</div>
		</dialog>
	);
}

function ProductDetails() {
	const router = useRouter();
	const { productId } = Route.useParams();
	const { data: product } = useSuspenseQuery(
		productDetailsQueryOptions(productId),
	);
	const { data: alternatives } = useSuspenseQuery(
		productAlternativesQueryOptions(productId),
	);

	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
	const [activeImageSide, setActiveImageSide] = useState<ImageSide>("front");

	const { data: session } = authClient.useSession();
	const { data: excludedIngredients } = useQuery({
		...userExcludedIngredientsQueryOptions(),
		enabled: !!session?.user,
	});

	const { data: favoriteProducts, refetch: refetchFavorites } = useQuery({
		...userFavoriteProductsQueryOptions(),
		enabled: !!session?.user,
	});

	const toggleFavoriteFn = useServerFn(toggleFavoriteProduct);

	const isFavorited = favoriteProducts?.some((fav) => fav.id === product?.id);

	const handleFavoriteClick = async () => {
		if (!session?.user || !product) return;
		try {
			await toggleFavoriteFn({ data: { productId: product.id } });
			refetchFavorites();
		} catch (error) {
			console.error("Failed to toggle favorite", error);
		}
	};

	const openLightbox = (side: ImageSide) => {
		setActiveImageSide(side);
		setIsLightboxOpen(true);
	};

	if (!product) return null;

	const hasFront = Boolean(product.imageFrontUrl);
	const hasBack = Boolean(product.imageBackUrl);
	const hasBothImages = hasFront && hasBack;
	const hasAnyImage = hasFront || hasBack;

	const spotlight = getScoreSpotlightConfig(product.score);
	const SpotlightIcon = spotlight.Icon;

	const excludedIdSet = new Set(excludedIngredients?.map((ex) => ex.id) ?? []);
	const matchedExcludedIngredients =
		product.productIngredients
			?.filter(({ ingredient }) => excludedIdSet.has(ingredient.id))
			.map(({ ingredient }) => ingredient) ?? [];

	const sortedIngredients = [...(product.productIngredients ?? [])].sort(
		(a, b) => {
			const aEx = excludedIdSet.has(a.ingredient.id) ? 1 : 0;
			const bEx = excludedIdSet.has(b.ingredient.id) ? 1 : 0;
			return bEx - aEx;
		},
	);

	const hasReviewedAdditives = Array.isArray(product.highlightedAdditives);
	const markedAdditives = product.highlightedAdditives ?? [];
	const activeMarkedAdditives = product.rawIngredientsText
		? markedAdditives.filter((phrase) =>
				isPhraseFoundInText(product.rawIngredientsText ?? "", phrase),
			)
		: markedAdditives;
	const additiveCountToDisplay: number | null = hasReviewedAdditives
		? markedAdditives.length
		: product.score === "gold"
			? 0
			: null;

	const storeCount = product.productStores?.length ?? 0;

	const createdInfo = formatProductDate(product.createdAt);
	const updatedInfo = formatProductDate(product.updatedAt);
	const checkedDateInfo = formatProductDate(
		product.updatedAt ?? product.createdAt,
	);
	const hasMeaningfulUpdate = Boolean(
		createdInfo &&
			updatedInfo &&
			updatedInfo.timestamp - createdInfo.timestamp > 60_000,
	);
	const primaryDateLabel = hasMeaningfulUpdate ? "Last Updated" : "Date Added";
	const primaryDate = hasMeaningfulUpdate
		? updatedInfo
		: (createdInfo ?? updatedInfo);
	const showAddedSubnote = Boolean(
		hasMeaningfulUpdate &&
			createdInfo &&
			updatedInfo &&
			createdInfo.dayKey !== updatedInfo.dayKey,
	);

	const alternativesSearchLink = (() => {
		const parentCategory = product.productCategories?.find(
			(pc) => !pc.category.parentId,
		)?.category;
		const subCategories =
			product.productCategories
				?.filter((pc) => pc.category.parentId)
				?.map((pc) => pc.category) || [];
		const mainCategoryId = parentCategory?.id || subCategories[0]?.parentId;
		const subCategoryIds = subCategories.map((sc) => sc.id);

		if (!mainCategoryId) return null;
		return {
			categoryId: mainCategoryId,
			subCategoryIds: subCategoryIds.length > 0 ? subCategoryIds : undefined,
		};
	})();

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612]">
			{/* Sticky Botanical Sub-Header */}
			<div className="sticky top-0 md:top-16 z-30 bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D]">
				<div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
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
							{product.name}
						</span>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<ScoreBadge score={product.score} size="sm" />

						{session?.user && (
							<button
								type="button"
								onClick={handleFavoriteClick}
								aria-pressed={Boolean(isFavorited)}
								aria-label={
									isFavorited ? "Remove from favorites" : "Save to favorites"
								}
								className={cn(
									"inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]",
									isFavorited
										? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300"
										: "bg-white dark:bg-[#16221C] border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] hover:border-[#2D5A44]",
								)}
							>
								<Heart
									className={cn(
										"w-3.5 h-3.5 shrink-0 transition-colors",
										isFavorited
											? "fill-rose-500 text-rose-500"
											: "text-[#687069] dark:text-[#9AA89E]",
									)}
									aria-hidden="true"
								/>
								<span className="hidden sm:inline">
									{isFavorited ? "Saved" : "Save"}
								</span>
							</button>
						)}
					</div>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-9 space-y-7 md:space-y-9">
				{/* Hero Card: Photos + Score Spotlight + Identity + Metadata */}
				<section
					aria-label="Product overview"
					className="rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_4px_20px_rgba(27,67,50,0.04)] p-4 sm:p-6 md:p-7"
				>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
						{/* Left Column: Compact, Side-by-Side, Scroll-Safe Photo Triggers */}
						<div className="lg:col-span-5">
							{hasBothImages ? (
								<div className="grid grid-cols-2 gap-3 sm:gap-3.5">
									<button
										type="button"
										onClick={() => openLightbox("front")}
										aria-label={`Inspect ${product.name} front photo`}
										className="aspect-4/5 max-h-52 sm:max-h-60 w-full rounded-2xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] dark:hover:border-[#3D6E54] p-2.5 flex items-center justify-center relative overflow-hidden group cursor-pointer touch-manipulation transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
									>
										<span className="absolute top-2 left-2 z-10 rounded-full bg-white/90 dark:bg-[#16221C]/90 backdrop-blur-xs border border-[#EAE4D7] dark:border-[#2C4035] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B3328] dark:text-[#EDF2EE] shadow-2xs">
											Front
										</span>
										<img
											src={product.imageFrontUrl ?? undefined}
											alt={`${product.name} front`}
											fetchPriority="high"
											className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
										/>
										<span
											aria-hidden="true"
											className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] text-[#1B3328] dark:text-[#CBE3D4] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
										>
											<ZoomIn className="w-3.5 h-3.5" />
										</span>
									</button>

									<button
										type="button"
										onClick={() => openLightbox("back")}
										aria-label={`Inspect ${product.name} back label photo`}
										className="aspect-4/5 max-h-52 sm:max-h-60 w-full rounded-2xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] dark:hover:border-[#3D6E54] p-2.5 flex items-center justify-center relative overflow-hidden group cursor-pointer touch-manipulation transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
									>
										<span className="absolute top-2 left-2 z-10 rounded-full bg-white/90 dark:bg-[#16221C]/90 backdrop-blur-xs border border-[#EAE4D7] dark:border-[#2C4035] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B3328] dark:text-[#EDF2EE] shadow-2xs">
											Back · Label
										</span>
										<img
											src={product.imageBackUrl ?? undefined}
											alt={`${product.name} back label`}
											loading="lazy"
											className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
										/>
										<span
											aria-hidden="true"
											className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] text-[#1B3328] dark:text-[#CBE3D4] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
										>
											<ZoomIn className="w-3.5 h-3.5" />
										</span>
									</button>
								</div>
							) : hasAnyImage ? (
								<button
									type="button"
									onClick={() => openLightbox(hasFront ? "front" : "back")}
									aria-label={`Inspect ${product.name} photo`}
									className="aspect-square max-h-56 sm:max-h-64 max-w-[260px] sm:max-w-[300px] mx-auto w-full rounded-2xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] dark:hover:border-[#3D6E54] p-3 flex items-center justify-center relative overflow-hidden group cursor-pointer touch-manipulation transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
								>
									<span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-white/90 dark:bg-[#16221C]/90 backdrop-blur-xs border border-[#EAE4D7] dark:border-[#2C4035] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B3328] dark:text-[#EDF2EE] shadow-2xs">
										{hasFront ? "Front" : "Back · Label"}
									</span>
									<img
										src={
											(hasFront
												? product.imageFrontUrl
												: product.imageBackUrl) ?? undefined
										}
										alt={`${product.name} ${hasFront ? "front" : "back label"}`}
										fetchPriority="high"
										className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
									/>
									<span
										aria-hidden="true"
										className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] text-[#1B3328] dark:text-[#CBE3D4] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
									>
										<ZoomIn className="w-4 h-4" />
									</span>
								</button>
							) : (
								<div className="aspect-4/3 max-h-48 w-full rounded-2xl bg-[#F5F1E8] dark:bg-[#1A2821] border border-dashed border-[#DCD4C3] dark:border-[#2A3D33] flex flex-col items-center justify-center gap-2 text-[#7D857E] dark:text-[#8E9B92]">
									<Package
										className="w-10 h-10 opacity-50"
										strokeWidth={1.5}
										aria-hidden="true"
									/>
									<span className="text-xs font-medium">
										No product photos yet
									</span>
								</div>
							)}

							{hasAnyImage && (
								<p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-[#5C665E] dark:text-[#9AA89E]">
									<ZoomIn
										className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400"
										aria-hidden="true"
									/>
									<span>Tap a photo to open &amp; zoom</span>
								</p>
							)}
						</div>

						{/* Right Column: Score Spotlight, Identity, Exclusions, Metadata */}
						<div className="lg:col-span-7 flex flex-col gap-5">
							{/* Prominent Score Spotlight */}
							<div
								className={cn(
									"rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
									spotlight.cardClass,
								)}
							>
								<div className="flex items-start gap-3.5 min-w-0">
									<div
										className={cn(
											"w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs",
											spotlight.emblemClass,
										)}
									>
										<SpotlightIcon className="w-6 h-6" aria-hidden="true" />
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											{product.score && product.score !== "none" ? (
												<ScoreBadge score={product.score} size="md" />
											) : (
												<span className="inline-flex items-center rounded-full border border-[#EAE4D7] dark:border-[#2B3D33] bg-white dark:bg-[#16221C] px-2.5 py-1 text-xs font-bold text-[#5C665E] dark:text-[#9AA89E] leading-none">
													Unrated
												</span>
											)}
											<p
												className={cn(
													"text-sm sm:text-base font-extrabold tracking-tight",
													spotlight.titleClass,
												)}
											>
												{spotlight.title}
											</p>
										</div>
										<p className="mt-1 text-xs sm:text-[13px] text-[#4A554E] dark:text-[#B8C4BC] leading-snug">
											{spotlight.description}
										</p>
									</div>
								</div>

								<button
									type="button"
									onClick={() => {
										const prefersReducedMotion = window.matchMedia(
											"(prefers-reduced-motion: reduce)",
										).matches;
										document
											.getElementById("ingredients-section")
											?.scrollIntoView({
												behavior: prefersReducedMotion ? "auto" : "smooth",
												block: "start",
											});
									}}
									className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7] dark:border-[#2C4035] hover:border-[#2D5A44] px-3 py-1.5 text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE] shadow-2xs transition-colors cursor-pointer touch-manipulation shrink-0 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
								>
									<ShieldAlert
										className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400 shrink-0"
										aria-hidden="true"
									/>
									<span>
										{additiveCountToDisplay !== null
											? `${additiveCountToDisplay} marked ${additiveCountToDisplay === 1 ? "additive" : "additives"}`
											: "View ingredients"}
									</span>
								</button>
							</div>

							{/* Brand, Title, and Category Links */}
							<div>
								{product.brand && (
									<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2D5A44] dark:text-emerald-400">
										{product.brand}
									</p>
								)}

								<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#1B3328] dark:text-[#FBF4E6] mt-1">
									{product.name}
								</h1>

								{product.productCategories &&
									product.productCategories.length > 0 && (
										<div className="flex flex-wrap items-center gap-2 mt-3">
											{product.productCategories.map((pc) => (
												<Link
													key={pc.category.id}
													to="/search"
													search={{
														categoryId: pc.category.parentId || pc.category.id,
														subCategoryIds: pc.category.parentId
															? [pc.category.id]
															: undefined,
													}}
													className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] border border-[#EAE4D7] dark:border-[#2B3D33] px-3 py-1 text-xs font-semibold text-[#1B3328] dark:text-[#CBE3D4] transition-colors"
												>
													{pc.category.iconUrl && (
														<img
															src={pc.category.iconUrl}
															alt=""
															className="w-3.5 h-3.5 object-contain opacity-85"
														/>
													)}
													<span>{pc.category.name}</span>
												</Link>
											))}
										</div>
									)}
							</div>

							{/* Excluded Ingredients Status Banner */}
							{session?.user &&
								excludedIngredients &&
								excludedIngredients.length > 0 &&
								(matchedExcludedIngredients.length > 0 ? (
									<div className="rounded-2xl border border-rose-300/80 dark:border-rose-800/60 bg-rose-50/75 dark:bg-rose-950/30 p-3.5 sm:p-4 flex items-start gap-3">
										<AlertTriangle
											className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
											aria-hidden="true"
										/>
										<div className="min-w-0">
											<p className="text-xs sm:text-sm font-bold text-rose-800 dark:text-rose-200">
												Contains {matchedExcludedIngredients.length} excluded{" "}
												{matchedExcludedIngredients.length === 1
													? "ingredient"
													: "ingredients"}
											</p>
											<div className="mt-1.5 flex flex-wrap gap-1.5">
												{matchedExcludedIngredients.map((ing) => (
													<span
														key={ing.id}
														className="inline-flex items-center rounded-full bg-white dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/60 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-rose-700 dark:text-rose-200"
													>
														{ing.name}
													</span>
												))}
											</div>
										</div>
									</div>
								) : sortedIngredients.length > 0 ? (
									<div className="rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 bg-[#E3EDE7]/55 dark:bg-[#1E3A2C]/45 px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#1B4332] dark:text-[#CBE3D4]">
										<CheckCircle2
											className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
											aria-hidden="true"
										/>
										<span>
											Free from your {excludedIngredients.length} excluded{" "}
											{excludedIngredients.length === 1
												? "ingredient"
												: "ingredients"}
										</span>
									</div>
								) : (
									<div className="rounded-xl border border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#121D17] px-3.5 py-2.5 flex items-start gap-2.5 text-xs font-medium text-[#4A554E] dark:text-[#B8C4BC]">
										<Info
											className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5"
											aria-hidden="true"
										/>
										<span>
											Ingredient tags are not mapped for this product yet
											&mdash; please check the declared label below for your{" "}
											{excludedIngredients.length} excluded{" "}
											{excludedIngredients.length === 1
												? "ingredient"
												: "ingredients"}
											.
										</span>
									</div>
								))}

							{/* Metadata Bar: Date Added / Updated, Barcode, Submitted By */}
							{(primaryDate || product.barcode || product.submittedBy) && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-4 border-t border-[#F0EAE0] dark:border-[#22332A]">
									{primaryDate && (
										<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-3 py-2.5 flex items-start gap-2.5">
											<Calendar
												className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5"
												aria-hidden="true"
											/>
											<div className="min-w-0">
												<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
													{primaryDateLabel}
												</p>
												<time
													dateTime={primaryDate.iso}
													className="block text-xs sm:text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE]"
												>
													{primaryDate.formatted}
												</time>
												{showAddedSubnote && createdInfo && (
													<p className="text-[11px] text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
														Added {createdInfo.formatted}
													</p>
												)}
											</div>
										</div>
									)}

									{product.barcode && (
										<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-3 py-2.5 flex items-start gap-2.5">
											<Barcode
												className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5"
												aria-hidden="true"
											/>
											<div className="min-w-0">
												<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
													Barcode / EAN
												</p>
												<p className="font-mono text-xs sm:text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] truncate">
													{product.barcode}
												</p>
											</div>
										</div>
									)}

									{product.submittedBy && (
										<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-3 py-2.5 flex items-start gap-2.5">
											<User
												className="w-4 h-4 text-[#2D5A44] dark:text-emerald-400 shrink-0 mt-0.5"
												aria-hidden="true"
											/>
											<div className="min-w-0">
												<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
													Added by
												</p>
												<p className="text-xs sm:text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] truncate">
													{product.submittedBy.name || "Community member"}
												</p>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Ingredients Breakdown + Available Stores */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Ingredients Card */}
					<section
						id="ingredients-section"
						aria-labelledby="ingredients-heading"
						className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden scroll-mt-20 md:scroll-mt-36"
					>
						<div className="p-4 sm:p-5 border-b border-[#F0EAE0] dark:border-[#22332A] flex items-center justify-between gap-3">
							<div className="flex items-start gap-3 min-w-0">
								<span className="w-10 h-10 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
									<ShieldAlert className="w-5 h-5" aria-hidden="true" />
								</span>
								<div className="min-w-0">
									<h2
										id="ingredients-heading"
										className="text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
									>
										Declared Ingredients
									</h2>
									<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
										Ingredients declared by the producer, with marked additives
										highlighted
									</p>
								</div>
							</div>

							{additiveCountToDisplay !== null && (
								<span
									className={cn(
										"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0 border",
										additiveCountToDisplay > 0
											? "bg-amber-100/90 dark:bg-amber-950/60 border-amber-300/80 dark:border-amber-700/60 text-[#78350F] dark:text-amber-200"
											: "bg-[#E3EDE7] dark:bg-[#1E3A2C] border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4]",
									)}
								>
									{additiveCountToDisplay} marked{" "}
									{additiveCountToDisplay === 1 ? "additive" : "additives"}
								</span>
							)}
						</div>

						<div className="p-4 sm:p-5 space-y-5">
							{product.rawIngredientsText ? (
								<div className="space-y-2.5">
									<h3 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
										Label Ingredients
									</h3>
									<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-[#1B3328] dark:text-[#EDF2EE]">
										<HighlightedIngredientsText
											text={product.rawIngredientsText}
											highlightedAdditives={product.highlightedAdditives}
										/>
									</div>

									{activeMarkedAdditives.length > 0 ? (
										<p className="flex flex-wrap items-center gap-1.5 text-xs text-[#5C665E] dark:text-[#9AA89E]">
											<mark className="inline rounded-md bg-amber-100/95 dark:bg-amber-950/75 border border-amber-400/75 dark:border-amber-600/70 text-[#78350F] dark:text-amber-200 px-1.5 py-0.5 text-[11px] font-semibold">
												Additive
											</mark>
											<span>
												Highlighted items are additives marked on the label.
											</span>
										</p>
									) : (
										hasReviewedAdditives &&
										markedAdditives.length === 0 && (
											<p className="text-xs text-[#5C665E] dark:text-[#9AA89E]">
												No additives marked on this label.
											</p>
										)
									)}
								</div>
							) : (
								<div className="rounded-xl border border-dashed border-[#DCD4C3] dark:border-[#2A3D33] bg-[#FAF8F5]/65 dark:bg-[#121D17]/50 p-6 text-center">
									<p className="text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
										Label text not yet added
									</p>
									<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-1">
										{product.score === "gold"
											? "This product earned Gold with minimal or no marked additives."
											: "Detailed label ingredients are not yet available for this product."}
									</p>
								</div>
							)}

							{sortedIngredients.length > 0 && (
								<div className="space-y-2.5 pt-1 border-t border-[#F0EAE0] dark:border-[#22332A]">
									<h3 className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E] pt-2">
										Tagged Ingredients
									</h3>
									<ul className="space-y-2.5">
										{sortedIngredients.map(({ ingredient }) => {
											const isExcluded = excludedIdSet.has(ingredient.id);
											return (
												<li
													key={ingredient.id}
													className={cn(
														"rounded-xl border p-3.5 sm:p-4 transition-colors",
														isExcluded
															? "border-rose-300 dark:border-rose-800/70 bg-rose-50/60 dark:bg-rose-950/25"
															: "border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5]/70 dark:bg-[#121D17]/70",
													)}
												>
													<div className="flex items-center justify-between gap-2">
														<div className="flex items-center gap-2 min-w-0">
															{isExcluded && (
																<AlertTriangle
																	className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0"
																	aria-hidden="true"
																/>
															)}
															<span
																className={cn(
																	"font-bold text-sm sm:text-[15px] capitalize",
																	isExcluded
																		? "text-rose-800 dark:text-rose-200"
																		: "text-[#1B3328] dark:text-[#EDF2EE]",
																)}
															>
																{ingredient.name}
															</span>
														</div>
														{isExcluded && (
															<span className="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/60 border border-rose-200 dark:border-rose-700/60 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:text-rose-200 shrink-0">
																Excluded
															</span>
														)}
													</div>

													{ingredient.description && (
														<p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#5C665E] dark:text-[#9AA89E]">
															{ingredient.description}
														</p>
													)}
												</li>
											);
										})}
									</ul>
								</div>
							)}

							<div className="pt-3 border-t border-[#F0EAE0] dark:border-[#22332A] flex flex-wrap items-center justify-between gap-2 text-xs">
								{checkedDateInfo ? (
									<span className="inline-flex items-center gap-1.5 text-[#5C665E] dark:text-[#9AA89E] font-medium">
										<Calendar
											className="w-3.5 h-3.5 shrink-0"
											aria-hidden="true"
										/>
										<span>
											Label checked on:{" "}
											<time dateTime={checkedDateInfo.iso}>
												{checkedDateInfo.ddmmyyyy}
											</time>
										</span>
									</span>
								) : (
									<span />
								)}

								<button
									type="button"
									onClick={() => setIsReportDialogOpen(true)}
									className="inline-flex items-center gap-1.5 font-bold text-[#A67C37] dark:text-[#D4AF6A] hover:underline underline-offset-4 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
								>
									<Flag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
									<span>Report an error</span>
								</button>
							</div>
						</div>
					</section>

					{/* Available Stores Card */}
					<section
						aria-labelledby="stores-heading"
						className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden"
					>
						<div className="p-4 sm:p-5 border-b border-[#F0EAE0] dark:border-[#22332A] flex items-center justify-between gap-3">
							<div className="flex items-start gap-3 min-w-0">
								<span className="w-10 h-10 rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
									<Store className="w-5 h-5" aria-hidden="true" />
								</span>
								<div className="min-w-0">
									<h2
										id="stores-heading"
										className="text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
									>
										Available at
									</h2>
									<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
										Stores where this product was spotted
									</p>
								</div>
							</div>

							<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0">
								{storeCount} {storeCount === 1 ? "store" : "stores"}
							</span>
						</div>

						<div className="p-4 sm:p-5 space-y-3">
							{product.productStores && product.productStores.length > 0 ? (
								<>
									<ul className="space-y-2">
										{product.productStores.map(({ store }) => (
											<li key={store.id}>
												<Link
													to="/stores/$storeId"
													params={{ storeId: store.id }}
													className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#2D5A44] dark:hover:border-[#3D6E54] hover:bg-[#E3EDE7]/45 dark:hover:bg-[#1E3A2C]/55 transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
												>
													<div className="flex items-center gap-3 min-w-0">
														<StoreAvatar
															name={store.name}
															logoUrl={store.logoUrl}
															size="sm"
														/>
														<span className="text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] truncate">
															{store.name}
														</span>
													</div>
													<ChevronRight
														className="w-4 h-4 text-[#7D857E] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] group-hover:translate-x-0.5 transition-all shrink-0"
														aria-hidden="true"
													/>
												</Link>
											</li>
										))}
									</ul>

									<Link
										to="/products/$productId/add-store"
										params={{ productId: product.id }}
										className="w-full min-h-10 px-4 py-2 rounded-xl border border-dashed border-[#2D5A44]/45 dark:border-[#3D6E54] bg-[#E3EDE7]/35 dark:bg-[#1E3A2C]/35 hover:bg-[#E3EDE7]/70 dark:hover:bg-[#1E3A2C]/65 text-xs font-bold text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center gap-1.5 transition-colors"
									>
										<Plus className="w-3.5 h-3.5" aria-hidden="true" />
										<span>Found in another store? Report availability</span>
									</Link>
								</>
							) : (
								<div className="rounded-xl border border-dashed border-[#DCD4C3] dark:border-[#2A3D33] bg-[#FAF8F5]/65 dark:bg-[#121D17]/50 p-5 text-center space-y-3">
									<div className="w-10 h-10 rounded-full bg-[#F3EFE6] dark:bg-[#1E2C25] text-[#5C665E] dark:text-[#9AA89E] flex items-center justify-center mx-auto">
										<Store className="w-5 h-5" aria-hidden="true" />
									</div>
									<div>
										<p className="text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
											No stores listed yet
										</p>
										<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-1">
											Spotted this product on a shelf? Let the community know!
										</p>
									</div>
									<Link
										to="/products/$productId/add-store"
										params={{ productId: product.id }}
										className="inline-flex items-center gap-1.5 min-h-9 px-4 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors"
									>
										<Plus className="w-3.5 h-3.5" aria-hidden="true" />
										<span>Report Store</span>
									</Link>
								</div>
							)}
						</div>
					</section>
				</div>

				{/* Cleaner Alternatives Section */}
				{alternatives && alternatives.length > 0 && (
					<section aria-labelledby="alternatives-heading">
						<div className="flex items-baseline justify-between gap-3 mb-4 md:mb-5">
							<div>
								<h2
									id="alternatives-heading"
									className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
								>
									Cleaner Alternatives
								</h2>
								<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
									Similar products in this category
								</p>
							</div>
							{alternativesSearchLink && (
								<Link
									to="/search"
									search={alternativesSearchLink}
									className="text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors shrink-0"
								>
									See all
								</Link>
							)}
						</div>

						<div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-2 snap-x snap-proximity touch-pan-x md:mx-0 md:px-0 md:scroll-px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-5">
							{alternatives.map((alt) => (
								<div
									key={alt.id}
									className="w-[45vw] min-w-41.5 max-w-51.25 shrink-0 snap-start md:w-auto md:min-w-0 md:max-w-none"
								>
									<ProductCard product={alt} />
								</div>
							))}
							<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
						</div>
					</section>
				)}
			</main>

			{/* Native Lightbox Dialog for Pinch/Button Zoom */}
			<ProductImageLightbox
				open={isLightboxOpen}
				onClose={() => setIsLightboxOpen(false)}
				productName={product.name}
				imageFrontUrl={product.imageFrontUrl}
				imageBackUrl={product.imageBackUrl}
				activeSide={activeImageSide}
				onSelectSide={setActiveImageSide}
			/>

			{/* Native Modal Dialog for Reporting Label or Product Errors */}
			<ProductReportErrorDialog
				open={isReportDialogOpen}
				onClose={() => setIsReportDialogOpen(false)}
				productName={product.name}
				productBrand={product.brand}
				defaultEmail={session?.user?.email}
			/>
		</div>
	);
}
