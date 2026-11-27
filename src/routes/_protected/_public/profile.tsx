import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowUpRight,
	Award,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Heart,
	Info,
	LogOut,
	MessageCircle,
	Package,
	Pencil,
	Plus,
	ShieldAlert,
	Store,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "#/components/home/product-card";
import { LanguageSwitcher } from "#/components/language-switcher";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "#/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { ScoreBadge } from "#/components/ui/score-badge";
import { Skeleton } from "#/components/ui/skeleton";
import { FacebookIcon, InstagramIcon } from "#/components/ui/social-icons";
import { authClient } from "#/lib/auth-client";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
import { ingredientsQueryOptions } from "#/queries/ingredient-queries";
import {
	userExcludedIngredientsQueryOptions,
	userFavoriteProductsQueryOptions,
} from "#/queries/profile-queries";
import { toggleExcludedIngredient } from "#/server/profile-functions";

export const Route = createFileRoute("/_protected/_public/profile")({
	component: ProfilePage,
});

type SessionUserProfile = {
	id?: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	hasCompletedOnboarding?: boolean;
};

type SampleFavoriteProduct = {
	id: string;
	name: string;
	brand: string;
	score: "gold" | "silver" | "bronze";
	storeName: string;
};

function getSampleFavorites(): SampleFavoriteProduct[] {
	return [
		{
			id: "sample-1",
			name: m.profile_sample1_name(),
			brand: "BioNature",
			score: "gold",
			storeName: "Mega Image",
		},
		{
			id: "sample-2",
			name: m.profile_sample2_name(),
			brand: "Olympus",
			score: "gold",
			storeName: "Kaufland",
		},
		{
			id: "sample-3",
			name: m.profile_sample3_name(),
			brand: "NordicBake",
			score: "silver",
			storeName: "Lidl",
		},
	];
}

function getCommunityLinks() {
	return [
		{
			id: "instagram",
			label: "Instagram",
			description: m.profile_community_instagram_desc(),
			href: "https://www.instagram.com/pickitwell?obrf=bDU5MWdqY3VjaTE4",
			Icon: InstagramIcon,
			iconStyle:
				"bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50",
			badge: null,
		},
		{
			id: "fb-group",
			label: m.profile_community_fb_group_title(),
			description: m.profile_community_fb_group_desc(),
			href: "https://www.facebook.com/groups/773704136519369",
			Icon: Users,
			iconStyle:
				"bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50",
			badge: null,
		},
		{
			id: "fb-page",
			label: m.profile_community_fb_page_title(),
			description: m.profile_community_fb_page_desc(),
			href: "https://www.facebook.com/profile.php?id=61595898309388",
			Icon: FacebookIcon,
			iconStyle:
				"bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/50",
			badge: null,
		},
	] as const;
}

function getInitials(displayName: string, email?: string | null): string {
	const cleaned = displayName.trim();
	if (cleaned) {
		const parts = cleaned.split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		if (parts[0]) {
			return parts[0].slice(0, 2).toUpperCase();
		}
	}
	if (email) {
		return email.slice(0, 2).toUpperCase();
	}
	return "PW";
}

function NativeModalDialog({
	open,
	onClose,
	titleId,
	initialFocusRef,
	children,
}: {
	open: boolean;
	onClose: () => void;
	titleId: string;
	initialFocusRef?: React.RefObject<HTMLElement | null>;
	children: React.ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
			initialFocusRef?.current?.focus();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open, initialFocusRef]);

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

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			{...({ closedby: "any" } as Record<string, string>)}
			className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] p-0 text-[#1B3328] dark:text-[#EDF2EE] shadow-2xl backdrop:bg-[#0E1612]/60 backdrop:backdrop-blur-xs"
		>
			{children}
		</dialog>
	);
}

function ProfilePage() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user as SessionUserProfile | undefined;

	const [isIngredientPickerOpen, setIsIngredientPickerOpen] = useState(false);
	const [isEditNameOpen, setIsEditNameOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// Local preview state for name editing while design/dummy data is in place
	const [previewNameOverride, setPreviewNameOverride] = useState<{
		firstName: string;
		lastName: string;
	} | null>(null);
	const [draftFirstName, setDraftFirstName] = useState("");
	const [draftLastName, setDraftLastName] = useState("");

	const editDialogTitleId = useId();
	const deleteDialogTitleId = useId();
	const firstNameInputId = useId();
	const lastNameInputId = useId();
	const keepAccountBtnRef = useRef<HTMLButtonElement>(null);
	const favoritesTrackRef = useRef<HTMLDivElement>(null);

	const scrollFavoritesBy = (direction: "prev" | "next") => {
		const track = favoritesTrackRef.current;
		if (!track) return;
		const step = Math.max(track.clientWidth * 0.75, 240);
		track.scrollBy({ left: direction === "next" ? step : -step });
	};

	const { data: excludedIngredients, refetch: refetchExcluded } = useQuery({
		...userExcludedIngredientsQueryOptions(),
		enabled: !!user,
	});

	const { data: favoriteProducts, isPending: isFavoritesPending } = useQuery({
		...userFavoriteProductsQueryOptions(),
		enabled: !!user,
	});

	const { data: allIngredients } = useQuery(
		ingredientsQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
		}),
	);

	const toggleIngredientFn = useServerFn(toggleExcludedIngredient);

	const sessionFullName =
		user?.firstName || user?.lastName
			? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
			: user?.name?.trim() || "";

	const displayName = previewNameOverride
		? `${previewNameOverride.firstName} ${previewNameOverride.lastName}`.trim()
		: sessionFullName || "Elena Popescu";

	const displayEmail = user?.email || "elena.popescu@pickitwell.ro";
	const initials = getInitials(displayName, displayEmail);
	const isAdmin = !isPending && user?.role === "admin";

	const availableIngredients =
		allIngredients?.data.filter(
			(ing) => !excludedIngredients?.some((ex) => ex.id === ing.id),
		) || [];

	const favoritesCount = favoriteProducts?.length ?? 0;
	const excludedCount = excludedIngredients?.length ?? 0;

	const sampleFavorites = getSampleFavorites();
	const communityLinks = getCommunityLinks();

	const handleOpenEditName = () => {
		const fallbackParts = displayName.split(/\s+/);
		setDraftFirstName(
			previewNameOverride?.firstName ??
				user?.firstName ??
				fallbackParts[0] ??
				"",
		);
		setDraftLastName(
			previewNameOverride?.lastName ??
				user?.lastName ??
				fallbackParts.slice(1).join(" ") ??
				"",
		);
		setIsEditNameOpen(true);
	};

	const handleSavePreviewName = (e: React.FormEvent) => {
		e.preventDefault();
		const first = draftFirstName.trim();
		const last = draftLastName.trim();
		if (!first) {
			toast.error(m.profile_toast_first_name_required());
			return;
		}
		setPreviewNameOverride({ firstName: first, lastName: last });
		setIsEditNameOpen(false);
		toast.success(m.profile_toast_name_updated());
	};

	const handleSelectIngredient = async (ingredientId: string) => {
		setIsIngredientPickerOpen(false);
		try {
			await toggleIngredientFn({ data: { ingredientId } });
			toast.success(m.profile_toast_excluded_added());
			refetchExcluded();
		} catch {
			toast.error(m.profile_toast_excluded_add_failed());
		}
	};

	const handleRemoveIngredient = async (ingredientId: string) => {
		try {
			await toggleIngredientFn({ data: { ingredientId } });
			toast.success(m.profile_toast_excluded_removed());
			refetchExcluded();
		} catch {
			toast.error(m.profile_toast_excluded_remove_failed());
		}
	};

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/login" });
	};

	const handleConfirmDeleteAccount = () => {
		setIsDeleteDialogOpen(false);
		toast.info(m.profile_toast_delete_soon());
	};

	return (
		<div className="bg-[#FAF8F5] dark:bg-[#0E1612] pb-8">
			{/* Deep Botanical Forest Hero Header */}
			<section className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-[1.75rem] md:rounded-b-[2.25rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)]">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.12),transparent_58%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-7 md:pt-10 md:pb-9">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						{/* Avatar + Name + Email */}
						<div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
							{user?.image ? (
								<img
									src={user.image}
									alt={displayName}
									className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl object-cover border-2 border-[#FCE8C6]/35 shadow-md shrink-0"
								/>
							) : (
								<div
									aria-hidden="true"
									className="w-15 h-15 sm:w-17 sm:h-17 rounded-2xl bg-[#FCE8C6] text-[#1B4332] border-2 border-[#FCE8C6]/40 shadow-md flex items-center justify-center font-extrabold text-xl sm:text-2xl tracking-tight shrink-0 select-none"
								>
									{initials}
								</div>
							)}

							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2 flex-wrap">
									{isPending ? (
										<Skeleton className="h-8 w-44 rounded-lg bg-[#FBF4E6]/15" />
									) : (
										<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-[#FCE8C6] truncate">
											{displayName}
										</h1>
									)}

									<button
										type="button"
										onClick={handleOpenEditName}
										aria-label={m.profile_edit_name_aria()}
										className="inline-flex items-center gap-1 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/22 border border-[#FBF4E6]/20 px-2.5 py-1 text-[11px] font-semibold text-[#FCE8C6] transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
									>
										<Pencil className="w-3 h-3" aria-hidden="true" />
										<span>{m.profile_edit_btn()}</span>
									</button>
								</div>

								<p className="mt-1 text-xs sm:text-sm text-[#FCE8C6]/80 font-medium truncate">
									{displayEmail}
								</p>
							</div>
						</div>

						{/* Admin shortcut when applicable */}
						<div className="flex items-center gap-2.5 self-start sm:self-center">
							{isPending ? (
								<Skeleton className="w-28 h-9 rounded-full bg-[#FBF4E6]/15" />
							) : (
								isAdmin && (
									<Link
										to="/admin/all-products"
										className="inline-flex items-center gap-1.5 min-h-9 px-3.5 py-1.5 rounded-full bg-[#FCE8C6] text-[#1B4332] text-xs font-bold shadow-xs hover:bg-[#F7DDA9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
									>
										<span>{m.profile_admin_panel()}</span>
										<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
									</Link>
								)
							)}
						</div>
					</div>

					{/* Compact Profile Summary Pills */}
					<div className="mt-5 flex flex-wrap items-center gap-2.5">
						<Link
							to="/favorites"
							className="inline-flex items-center gap-2 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 border border-[#FBF4E6]/20 px-3.5 py-1.5 text-xs font-semibold text-[#FCE8C6] transition-colors"
						>
							<Heart
								className="w-3.5 h-3.5 fill-rose-400 text-rose-300"
								aria-hidden="true"
							/>
							<span className="tabular-nums">
								{m.profile_favorites_pill({ count: favoritesCount })}
							</span>
						</Link>

						<a
							href="#excluded-ingredients"
							className="inline-flex items-center gap-2 rounded-full bg-[#FBF4E6]/12 hover:bg-[#FBF4E6]/20 border border-[#FBF4E6]/20 px-3.5 py-1.5 text-xs font-semibold text-[#FCE8C6] transition-colors"
						>
							<ShieldAlert
								className="w-3.5 h-3.5 text-[#FCE8C6]"
								aria-hidden="true"
							/>
							<span className="tabular-nums">
								{m.profile_excluded_pill({ count: excludedCount })}
							</span>
						</a>
					</div>
				</div>
			</section>

			{/* Main Profile Content */}
			<main className="flex flex-col max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-9 gap-y-7 md:gap-y-8">
				{/* 1. Favorites Section */}
				<section aria-labelledby="profile-favorites-heading">
					<div className="flex items-center justify-between gap-3 mb-4">
						<div className="flex items-center gap-2.5 min-w-0">
							<h2
								id="profile-favorites-heading"
								className="text-xl md:text-2xl font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
							>
								{m.profile_my_favorites()}
							</h2>
							{favoritesCount > 0 ? (
								<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2.5 py-0.5 text-xs font-semibold tabular-nums">
									{favoritesCount}
								</span>
							) : (
								!isFavoritesPending && (
									<span className="inline-flex items-center rounded-full bg-[#FEF3C7] dark:bg-amber-950/70 text-[#92400E] dark:text-amber-200 border border-[#F59E0B]/30 px-2.5 py-0.5 text-[11px] font-semibold">
										{m.profile_sample_preview()}
									</span>
								)
							)}
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<div className="hidden md:flex items-center gap-1">
								<button
									type="button"
									onClick={() => scrollFavoritesBy("prev")}
									aria-label={m.profile_scroll_left()}
									className="w-8 h-8 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:border-[#C9B382] flex items-center justify-center transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
								>
									<ChevronLeft className="w-4 h-4" aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={() => scrollFavoritesBy("next")}
									aria-label={m.profile_scroll_right()}
									className="w-8 h-8 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:border-[#C9B382] flex items-center justify-center transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
								>
									<ChevronRight className="w-4 h-4" aria-hidden="true" />
								</button>
							</div>

							<Link
								to="/favorites"
								className="text-sm font-semibold text-[#2D5A44] hover:text-[#1B4332] dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors shrink-0"
							>
								{m.common_see_all()}
							</Link>
						</div>
					</div>

					{isFavoritesPending ? (
						<div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-1">
							{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((key) => (
								<div
									key={key}
									className="w-[45vw] min-w-41.5 max-w-51.25 md:w-48 lg:w-52 md:min-w-0 md:max-w-none shrink-0"
								>
									<Skeleton className="aspect-4/5 rounded-2xl" />
								</div>
							))}
						</div>
					) : favoriteProducts && favoriteProducts.length > 0 ? (
						<div
							ref={favoritesTrackRef}
							className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-2 snap-x snap-proximity motion-safe:scroll-smooth touch-pan-x md:mx-0 md:px-0 md:scroll-px-0 md:pb-1 md:gap-4"
						>
							{favoriteProducts.map((product) => (
								<div
									key={product.id}
									className="w-[45vw] min-w-41.5 max-w-51.25 md:w-48 lg:w-52 md:min-w-0 md:max-w-none shrink-0 snap-start"
								>
									<ProductCard product={product} />
								</div>
							))}
							<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
						</div>
					) : (
						<div className="space-y-3">
							<div
								ref={favoritesTrackRef}
								className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 pb-2 snap-x snap-proximity motion-safe:scroll-smooth touch-pan-x md:mx-0 md:px-0 md:scroll-px-0 md:pb-1 md:gap-4"
							>
								{sampleFavorites.map((item) => (
									<article
										key={item.id}
										className="w-[45vw] min-w-41.5 max-w-51.25 md:w-48 lg:w-52 md:min-w-0 md:max-w-none shrink-0 snap-start rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_8px_rgba(27,67,50,0.03)] overflow-hidden flex flex-col"
									>
										<div className="relative aspect-square w-full bg-[#F5F1E8] dark:bg-[#1A2821] flex items-center justify-center border-b border-[#F5F1E8] dark:border-[#24362D]/80">
											<div className="absolute top-2.5 left-2.5">
												<ScoreBadge
													score={item.score}
													size="sm"
													className="drop-shadow-sm"
												/>
											</div>
											<span
												aria-hidden="true"
												className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#16221C]/90 border border-[#EAE4D7]/80 dark:border-[#2C4035] flex items-center justify-center shadow-sm"
											>
												<Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
											</span>
											<div className="text-[#9AA09A] dark:text-slate-500 flex flex-col items-center gap-1.5">
												<Package
													className="w-8 h-8 opacity-55"
													strokeWidth={1.5}
													aria-hidden="true"
												/>
												<span className="text-[11px] font-medium">
													{item.brand}
												</span>
											</div>
										</div>
										<div className="p-3.5 pt-3 flex-1 flex flex-col gap-2">
											<h3 className="text-[15px] font-bold text-[#1B3328] dark:text-[#EDF2EE] line-clamp-2 leading-snug">
												{item.name}
											</h3>
											<div className="mt-auto pt-0.5">
												<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F3EB] dark:bg-[#1E2C25] text-[#243B30] dark:text-[#CBE3D4] px-2 py-0.5 text-[11px] font-semibold border border-[#EAE4D7] dark:border-[#2B3D33]">
													<Store
														className="w-3 h-3 text-[#687069] dark:text-[#9AA89E] shrink-0"
														aria-hidden="true"
													/>
													<span className="truncate">{item.storeName}</span>
												</span>
											</div>
										</div>
									</article>
								))}
								<div className="w-0.5 shrink-0 md:hidden" aria-hidden="true" />
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-2xl bg-[#F3EFE6]/70 dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] px-4 py-3">
								<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E]">
									{m.profile_no_real_favorites()}
								</p>
								<Link
									to="/search"
									className="inline-flex items-center justify-center gap-1.5 self-start sm:self-auto px-3.5 py-2 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors shrink-0"
								>
									<span>{m.profile_browse_products()}</span>
									<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
								</Link>
							</div>
						</div>
					)}
				</section>

				{/* Responsive 2-column layout on desktop, clean stack on mobile */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* 2. Excluded Ingredients Section */}
					<section
						id="excluded-ingredients"
						aria-labelledby="excluded-ingredients-heading"
						className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden"
					>
						<div className="p-4 sm:p-5 border-b border-[#F0EAE0] dark:border-[#22332A]">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-start gap-3 min-w-0">
									<div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
										<ShieldAlert className="w-5 h-5" aria-hidden="true" />
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<h2
												id="excluded-ingredients-heading"
												className="text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
											>
												{m.profile_excluded_title()}
											</h2>
											<span className="inline-flex items-center rounded-full bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] px-2 py-0.5 text-[11px] font-semibold tabular-nums">
												{m.profile_excluded_active({ count: excludedCount })}
											</span>
										</div>
										<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
											{m.profile_excluded_subtitle()}
										</p>
									</div>
								</div>
							</div>

							{/* Searchable Popover + Command Ingredient Picker */}
							<div className="mt-4">
								<Popover
									open={isIngredientPickerOpen}
									onOpenChange={setIsIngredientPickerOpen}
								>
									<PopoverTrigger asChild>
										<button
											type="button"
											className="w-full min-h-11 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] hover:border-[#2D5A44] dark:hover:border-[#3D6E54] flex items-center justify-between gap-2 text-sm text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
										>
											<span className="flex items-center gap-2 text-[#5C665E] dark:text-[#9AA89E] font-medium truncate">
												<Plus
													className="w-4 h-4 text-[#1B4332] dark:text-[#CBE3D4] shrink-0"
													aria-hidden="true"
												/>
												<span>{m.profile_excluded_picker_btn()}</span>
											</span>
											<ChevronDown
												className="w-4 h-4 text-[#7D857E] shrink-0"
												aria-hidden="true"
											/>
										</button>
									</PopoverTrigger>
									<PopoverContent
										align="start"
										sideOffset={6}
										className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] shadow-xl overflow-hidden"
									>
										<Command className="bg-transparent">
											<CommandInput
												placeholder={m.profile_excluded_search_placeholder()}
											/>
											<CommandList className="max-h-60">
												<CommandEmpty>
													{m.profile_excluded_empty_search()}
												</CommandEmpty>
												<CommandGroup>
													{availableIngredients.map((ingredient) => (
														<CommandItem
															key={ingredient.id}
															value={ingredient.name}
															onSelect={() =>
																handleSelectIngredient(ingredient.id)
															}
															className="min-h-10 px-3 py-2 text-sm capitalize text-[#1B3328] dark:text-[#EDF2EE] cursor-pointer"
														>
															<Plus
																className="w-3.5 h-3.5 text-[#2D5A44] dark:text-emerald-400"
																aria-hidden="true"
															/>
															<span>{ingredient.name}</span>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>
						</div>

						{/* Active Exclusions Chips */}
						<div className="p-4 sm:p-5 bg-[#FAF8F5]/65 dark:bg-[#121D17]/60">
							{excludedIngredients && excludedIngredients.length > 0 ? (
								<ul className="flex flex-wrap gap-2">
									{excludedIngredients.map((ingredient) => (
										<li key={ingredient.id}>
											<span className="inline-flex items-center gap-1.5 min-h-9 rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2A3D33] pl-3.5 pr-1.5 py-1 text-[13px] font-semibold text-[#1B3328] dark:text-[#EDF2EE] shadow-[0_1px_2px_rgba(27,67,50,0.03)]">
												<span className="capitalize">{ingredient.name}</span>
												<button
													type="button"
													onClick={() => handleRemoveIngredient(ingredient.id)}
													aria-label={m.profile_excluded_remove_aria({
														name: ingredient.name,
													})}
													className="w-6 h-6 rounded-full flex items-center justify-center text-[#7D857E] hover:text-rose-700 hover:bg-rose-50 dark:hover:text-rose-300 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
												>
													<X className="w-3.5 h-3.5" aria-hidden="true" />
												</button>
											</span>
										</li>
									))}
								</ul>
							) : (
								<div className="text-center py-6 px-3 rounded-xl border border-dashed border-[#DCD4C3] dark:border-[#2A3D33] bg-white/60 dark:bg-[#16221C]/40">
									<p className="text-sm font-semibold text-[#1B3328] dark:text-[#EDF2EE]">
										{m.profile_excluded_empty_title()}
									</p>
									<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-1">
										{m.profile_excluded_empty_desc()}
									</p>
								</div>
							)}
						</div>
					</section>

					{/* Right Column: Language Preferences, Methodology + Disclaimer, Community Links, Account Actions */}
					<div className="lg:col-span-5 space-y-6">
						{/* Language Preference Card (accessible on mobile & desktop) */}
						<section
							aria-labelledby="language-preference-heading"
							className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden"
						>
							<div className="px-4 py-3.5 sm:px-5 border-b border-[#F0EAE0] dark:border-[#22332A] bg-[#FAF8F5]/70 dark:bg-[#121D17]/70">
								<h2
									id="language-preference-heading"
									className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
								>
									{m.profile_language_heading()}
								</h2>
							</div>
							<div className="px-4 py-3.5 sm:px-5 flex items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
										{m.profile_language_label()}
									</p>
									<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
										{m.profile_language_desc()}
									</p>
								</div>
								<LanguageSwitcher surface="light" isSignedIn showNativeLabel />
							</div>
						</section>

						{/* 3. Methodology & Disclaimer grouped in the same zone */}
						<section
							aria-labelledby="transparency-heading"
							className="profile-accordion rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden"
						>
							<div className="px-4 py-3.5 sm:px-5 border-b border-[#F0EAE0] dark:border-[#22332A] bg-[#FAF8F5]/70 dark:bg-[#121D17]/70">
								<h2
									id="transparency-heading"
									className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
								>
									{m.profile_transparency_heading()}
								</h2>
							</div>

							<div className="divide-y divide-[#F0EAE0] dark:divide-[#22332A]">
								{/* Methodology */}
								<details className="group">
									<summary className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 min-h-14 cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#1A2821] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B4332]">
										<div className="flex items-center gap-3 min-w-0">
											<span className="w-9 h-9 rounded-xl bg-[#FEF3C7] dark:bg-amber-950/60 border border-[#F59E0B]/30 text-[#92400E] dark:text-amber-300 flex items-center justify-center shrink-0">
												<Award className="w-4.5 h-4.5" aria-hidden="true" />
											</span>
											<div className="min-w-0">
												<span className="block text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
													{m.profile_methodology_title()}
												</span>
												<span className="block text-xs text-[#5C665E] dark:text-[#9AA89E] truncate">
													{m.profile_methodology_subtitle()}
												</span>
											</div>
										</div>
										<ChevronDown
											className="w-4 h-4 text-[#7D857E] shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
											aria-hidden="true"
										/>
									</summary>

									<div className="px-4 pb-4 pt-1 sm:px-5 text-xs sm:text-[13px] leading-relaxed text-[#4A554E] dark:text-[#B8C4BC] space-y-3 bg-[#FAF8F5]/45 dark:bg-[#121D17]/40">
										<p>{m.profile_methodology_intro()}</p>
										<ul className="space-y-2">
											<li className="flex items-center gap-2.5">
												<ScoreBadge score="gold" size="sm" />
												<span>{m.profile_methodology_gold()}</span>
											</li>
											<li className="flex items-center gap-2.5">
												<ScoreBadge score="silver" size="sm" />
												<span>{m.profile_methodology_silver()}</span>
											</li>
											<li className="flex items-center gap-2.5">
												<ScoreBadge score="bronze" size="sm" />
												<span>{m.profile_methodology_bronze()}</span>
											</li>
										</ul>
										<p className="text-[11px] text-[#687069] dark:text-[#8E9B92] pt-1 border-t border-[#EAE4D7]/70 dark:border-[#24362D]">
											{m.profile_methodology_note()}
										</p>
									</div>
								</details>

								{/* Disclaimer */}
								<details className="group">
									<summary className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 min-h-14 cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#1A2821] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B4332]">
										<div className="flex items-center gap-3 min-w-0">
											<span className="w-9 h-9 rounded-xl bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center shrink-0">
												<Info className="w-4.5 h-4.5" aria-hidden="true" />
											</span>
											<div className="min-w-0">
												<span className="block text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
													{m.profile_disclaimer_title()}
												</span>
												<span className="block text-xs text-[#5C665E] dark:text-[#9AA89E] truncate">
													{m.profile_disclaimer_subtitle()}
												</span>
											</div>
										</div>
										<ChevronDown
											className="w-4 h-4 text-[#7D857E] shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
											aria-hidden="true"
										/>
									</summary>

									<div className="px-4 pb-4 pt-1 sm:px-5 text-xs sm:text-[13px] leading-relaxed text-[#4A554E] dark:text-[#B8C4BC] space-y-2.5 bg-[#FAF8F5]/45 dark:bg-[#121D17]/40">
										<p>{m.profile_disclaimer_p1()}</p>
										<p>{m.profile_disclaimer_p2()}</p>
									</div>
								</details>
							</div>
						</section>

						{/* 4. Community Links Section */}
						<section
							aria-labelledby="community-links-heading"
							className="rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_2px_10px_rgba(27,67,50,0.03)] overflow-hidden"
						>
							<div className="px-4 py-3.5 sm:px-5 border-b border-[#F0EAE0] dark:border-[#22332A] bg-[#FAF8F5]/70 dark:bg-[#121D17]/70 flex items-center justify-between">
								<h2
									id="community-links-heading"
									className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
								>
									{m.profile_community_heading()}
								</h2>
							</div>

							<ul className="divide-y divide-[#F0EAE0] dark:divide-[#22332A]">
								{communityLinks.map((item) => {
									const { Icon } = item;
									return (
										<li key={item.id}>
											<a
												href={item.href}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 min-h-14 hover:bg-[#FAF8F5] dark:hover:bg-[#1A2821] transition-colors group focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B4332]"
											>
												<div className="flex items-center gap-3 min-w-0">
													<span
														className={cn(
															"w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
															item.iconStyle,
														)}
													>
														<Icon className="w-4.5 h-4.5" aria-hidden="true" />
													</span>
													<div className="min-w-0">
														<span className="block text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] transition-colors">
															{item.label}
														</span>
														<span className="block text-xs text-[#5C665E] dark:text-[#9AA89E] truncate">
															{item.description}
														</span>
													</div>
												</div>
												<ArrowUpRight
													className="w-4 h-4 text-[#7D857E] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
													aria-hidden="true"
												/>
											</a>
										</li>
									);
								})}

								{/* WhatsApp Group (link placeholder until client provides invite URL) */}
								<li>
									<button
										type="button"
										onClick={() =>
											toast.info(m.profile_community_whatsapp_toast())
										}
										className="w-full flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 min-h-14 text-left hover:bg-[#FAF8F5] dark:hover:bg-[#1A2821] transition-colors group cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B4332]"
									>
										<div className="flex items-center gap-3 min-w-0">
											<span className="w-9 h-9 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50 flex items-center justify-center shrink-0">
												<MessageCircle
													className="w-4.5 h-4.5"
													aria-hidden="true"
												/>
											</span>
											<div className="min-w-0">
												<span className="block text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE]">
													{m.profile_community_whatsapp_title()}
												</span>
												<span className="block text-xs text-[#5C665E] dark:text-[#9AA89E] truncate">
													{m.profile_community_whatsapp_desc()}
												</span>
											</div>
										</div>
										<span className="inline-flex items-center rounded-full bg-[#F3EFE6] dark:bg-[#1E2E26] border border-[#EAE4D7] dark:border-[#2B3D33] px-2.5 py-0.5 text-[11px] font-semibold text-[#5C665E] dark:text-[#9AA89E] shrink-0">
											{m.profile_community_soon()}
										</span>
									</button>
								</li>
							</ul>
						</section>

						{/* 5. Logout & Delete Account (at the bottom) */}
						<section
							aria-labelledby="account-actions-heading"
							className="space-y-3 pt-1"
						>
							<h2 id="account-actions-heading" className="sr-only">
								{m.profile_actions_aria()}
							</h2>

							<button
								type="button"
								onClick={handleLogout}
								className="w-full min-h-12 px-4 py-3 rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] hover:border-[#C9B382] dark:hover:border-[#365043] hover:bg-[#FAF8F5] dark:hover:bg-[#1A2821] shadow-[0_2px_10px_rgba(27,67,50,0.03)] flex items-center justify-center gap-2.5 text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
							>
								<LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
								<span>{m.profile_logout()}</span>
							</button>

							<div className="rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/15 px-4 py-3.5 flex items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="text-xs font-bold text-rose-800 dark:text-rose-300">
										{m.profile_delete_account_title()}
									</p>
									<p className="text-[11px] text-rose-700/80 dark:text-rose-300/75 mt-0.5">
										{m.profile_delete_account_desc()}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setIsDeleteDialogOpen(true)}
									className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-xl bg-white dark:bg-[#16221C] border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 dark:hover:bg-rose-700 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
								>
									<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
									<span>{m.profile_delete_btn()}</span>
								</button>
							</div>
						</section>
					</div>
				</div>
			</main>

			{/* Edit Name Native Modal Dialog */}
			<NativeModalDialog
				open={isEditNameOpen}
				onClose={() => setIsEditNameOpen(false)}
				titleId={editDialogTitleId}
			>
				<div className="p-5 sm:p-6">
					<div className="flex items-start justify-between gap-3">
						<div>
							<h3
								id={editDialogTitleId}
								className="text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
							>
								{m.profile_edit_dialog_title()}
							</h3>
							<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1">
								{m.profile_edit_dialog_desc()}
							</p>
						</div>
						<button
							type="button"
							onClick={() => setIsEditNameOpen(false)}
							aria-label={m.common_close_dialog()}
							className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer"
						>
							<X className="w-4 h-4" aria-hidden="true" />
						</button>
					</div>

					<form onSubmit={handleSavePreviewName} className="mt-5 space-y-4">
						<div className="space-y-1.5">
							<label
								htmlFor={firstNameInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								{m.profile_edit_first_name()}
							</label>
							<input
								id={firstNameInputId}
								type="text"
								required
								autoComplete="given-name"
								value={draftFirstName}
								onChange={(e) => setDraftFirstName(e.target.value)}
								placeholder="Elena"
								className="w-full min-h-11 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm text-[#1B3328] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor={lastNameInputId}
								className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
							>
								{m.profile_edit_last_name()}
							</label>
							<input
								id={lastNameInputId}
								type="text"
								autoComplete="family-name"
								value={draftLastName}
								onChange={(e) => setDraftLastName(e.target.value)}
								placeholder="Popescu"
								className="w-full min-h-11 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm text-[#1B3328] dark:text-[#EDF2EE] focus:outline-none focus:ring-2 focus:ring-[#2D5A44]"
							/>
						</div>

						<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={() => setIsEditNameOpen(false)}
								className="min-h-10 px-4 py-2 rounded-xl border border-[#EAE4D7] dark:border-[#2B3D33] text-xs font-bold text-[#5C665E] dark:text-[#9AA89E] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer"
							>
								{m.common_cancel()}
							</button>
							<button
								type="submit"
								className="min-h-10 px-5 py-2 rounded-xl bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
							>
								{m.profile_edit_save()}
							</button>
						</div>
					</form>
				</div>
			</NativeModalDialog>

			{/* Delete Account Confirmation Native Modal Dialog */}
			<NativeModalDialog
				open={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				titleId={deleteDialogTitleId}
				initialFocusRef={keepAccountBtnRef}
			>
				<div className="p-5 sm:p-6">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3">
							<span className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
								<AlertTriangle className="w-5 h-5" aria-hidden="true" />
							</span>
							<div>
								<h3
									id={deleteDialogTitleId}
									className="text-lg font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
								>
									{m.profile_delete_dialog_title()}
								</h3>
								<p className="text-xs sm:text-sm text-[#5C665E] dark:text-[#9AA89E] mt-1 leading-relaxed">
									{m.profile_delete_dialog_desc()}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => setIsDeleteDialogOpen(false)}
							aria-label={m.common_close_dialog()}
							className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
						>
							<X className="w-4 h-4" aria-hidden="true" />
						</button>
					</div>

					<div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
						<button
							ref={keepAccountBtnRef}
							type="button"
							onClick={() => setIsDeleteDialogOpen(false)}
							className="min-h-10 px-4 py-2 rounded-xl border border-[#EAE4D7] dark:border-[#2B3D33] bg-[#FAF8F5] dark:bg-[#1E2C25] text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#25362D] transition-colors cursor-pointer"
						>
							{m.profile_delete_keep()}
						</button>
						<button
							type="button"
							onClick={handleConfirmDeleteAccount}
							className="min-h-10 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
						>
							{m.profile_delete_confirm()}
						</button>
					</div>
				</div>
			</NativeModalDialog>
		</div>
	);
}
