import { ChevronDown, ChevronRight, LayoutGrid, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { getCategoryVisual } from "#/components/categories/category-browse-card";
import { cn } from "#/lib/utils";

export type CategoryItem = {
	id: string;
	name: string;
	iconUrl?: string | null;
	parentId?: string | null;
};

type CategoryNavListProps = {
	topLevelCategories: CategoryItem[];
	categories: CategoryItem[];
	categoryCounts: Map<string, number>;
	activeParentId?: string;
	selectedCategoryId?: string;
	selectedSubCategoryId?: string;
	totalProductsCount?: number;
	onSelectAll: () => void;
	onSelectCategory: (categoryId: string, hasSubcategories: boolean) => void;
	onSelectSubcategory: (parentId: string, subcatId: string) => void;
};

export function CategoryNavList({
	topLevelCategories,
	categories,
	categoryCounts,
	activeParentId,
	selectedCategoryId,
	selectedSubCategoryId,
	totalProductsCount,
	onSelectAll,
	onSelectCategory,
	onSelectSubcategory,
}: CategoryNavListProps) {
	const isAllSelected = !selectedCategoryId && !selectedSubCategoryId;

	return (
		<nav aria-label="Product categories" className="flex flex-col gap-1">
			<button
				type="button"
				onClick={onSelectAll}
				aria-current={isAllSelected ? "page" : undefined}
				className={cn(
					"w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer",
					isAllSelected
						? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-bold"
						: "text-[#1B3328] dark:text-[#EDF2EE] font-semibold hover:bg-[#F3EFE6]/80 dark:hover:bg-[#1E2C25]",
				)}
			>
				<span className="flex items-center gap-2.5 min-w-0">
					<span
						className={cn(
							"w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
							isAllSelected
								? "bg-white/80 dark:bg-[#16221C] border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4]"
								: "bg-[#FAF8F5] dark:bg-[#1A2821] border-[#EAE4D7] dark:border-[#24362D] text-[#5C665E] dark:text-[#9AA89E]",
						)}
					>
						<LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
					</span>
					<span className="truncate">All Products</span>
				</span>
				{typeof totalProductsCount === "number" && (
					<span
						className={cn(
							"inline-flex items-center justify-center min-w-6 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0",
							isAllSelected
								? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
								: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
						)}
					>
						{totalProductsCount}
					</span>
				)}
			</button>

			<div className="h-px bg-[#EAE4D7]/80 dark:bg-[#24362D] my-1.5" />

			{topLevelCategories.length === 0 ? (
				<p className="px-3 py-4 text-xs text-[#5C665E] dark:text-[#9AA89E]">
					No categories match the current filters.
				</p>
			) : (
				<ul className="flex flex-col gap-1">
					{topLevelCategories.map((parentCat, index) => {
						const subcats = categories.filter(
							(c) => c.parentId === parentCat.id,
						);
						const hasSubcats = subcats.length > 0;
						const isExpanded = activeParentId === parentCat.id;
						const isParentDirectlySelected =
							isExpanded && !selectedSubCategoryId;
						const count = categoryCounts.get(parentCat.id) || 0;
						const { palette, Icon } = getCategoryVisual(parentCat.name, index);

						return (
							<li key={parentCat.id} className="flex flex-col">
								<button
									type="button"
									onClick={() => onSelectCategory(parentCat.id, hasSubcats)}
									aria-expanded={hasSubcats ? isExpanded : undefined}
									aria-current={isParentDirectlySelected ? "page" : undefined}
									className={cn(
										"w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-[13.5px] transition-colors cursor-pointer",
										isParentDirectlySelected
											? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-bold"
											: isExpanded
												? "bg-[#F3EFE6]/70 dark:bg-[#1A2922] text-[#1B3328] dark:text-[#EDF2EE] font-semibold"
												: "text-[#1B3328] dark:text-[#EDF2EE] font-medium hover:bg-[#F3EFE6]/70 dark:hover:bg-[#1E2C25]",
									)}
								>
									<span className="flex items-center gap-2.5 min-w-0">
										<span
											className={cn(
												"w-7 h-7 rounded-full border flex items-center justify-center shrink-0",
												palette.bg,
												palette.border,
											)}
										>
											{parentCat.iconUrl ? (
												<img
													src={parentCat.iconUrl}
													alt=""
													className="w-4.5 h-4.5 object-contain"
													loading="lazy"
												/>
											) : (
												<Icon
													className={cn("w-3.5 h-3.5", palette.iconText)}
													strokeWidth={2}
													aria-hidden="true"
												/>
											)}
										</span>
										<span className="truncate leading-snug">
											{parentCat.name}
										</span>
									</span>

									<span className="flex items-center gap-1.5 shrink-0">
										<span
											className={cn(
												"inline-flex items-center justify-center min-w-5.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums",
												isParentDirectlySelected
													? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
													: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
											)}
										>
											{count}
										</span>
										{hasSubcats &&
											(isExpanded ? (
												<ChevronDown
													className="w-3.5 h-3.5 text-[#5C665E] dark:text-[#9AA89E]"
													aria-hidden="true"
												/>
											) : (
												<ChevronRight
													className="w-3.5 h-3.5 text-[#7D857E] dark:text-[#8E9B92]"
													aria-hidden="true"
												/>
											))}
									</span>
								</button>

								{hasSubcats && isExpanded && (
									<ul className="mt-1 ml-4 pl-3 border-l border-[#EAE4D7] dark:border-[#24362D] flex flex-col gap-0.5">
										{subcats.map((subcat) => {
											const isSubSelected = selectedSubCategoryId === subcat.id;
											const subCount = categoryCounts.get(subcat.id) || 0;
											return (
												<li key={subcat.id}>
													<button
														type="button"
														onClick={() =>
															onSelectSubcategory(parentCat.id, subcat.id)
														}
														aria-current={isSubSelected ? "page" : undefined}
														className={cn(
															"w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-[13px] transition-colors cursor-pointer",
															isSubSelected
																? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-bold"
																: "text-[#5C665E] dark:text-[#9AA89E] font-medium hover:text-[#1B3328] dark:hover:text-[#EDF2EE] hover:bg-[#F3EFE6]/60 dark:hover:bg-[#1E2C25]",
														)}
													>
														<span className="truncate leading-snug">
															{subcat.name}
														</span>
														<span
															className={cn(
																"text-[11px] font-semibold tabular-nums shrink-0",
																isSubSelected
																	? "text-[#1B4332] dark:text-[#CBE3D4]"
																	: "text-[#7D857E] dark:text-[#8E9B92]",
															)}
														>
															{subCount}
														</span>
													</button>
												</li>
											);
										})}
									</ul>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</nav>
	);
}

type MobileCategoryDrawerProps = {
	id: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	topLevelCategories: CategoryItem[];
	categories: CategoryItem[];
	categoryCounts: Map<string, number>;
	activeParentId?: string;
	selectedCategoryId?: string;
	selectedSubCategoryId?: string;
	totalProductsCount?: number;
	onSelectAll: () => void;
	onSelectCategory: (categoryId: string, hasSubcategories: boolean) => void;
	onSelectSubcategory: (parentId: string, subcatId: string) => void;
};

export function MobileCategoryDrawer({
	id,
	isOpen,
	onOpenChange,
	topLevelCategories,
	categories,
	categoryCounts,
	activeParentId,
	selectedCategoryId,
	selectedSubCategoryId,
	totalProductsCount,
	onSelectAll,
	onSelectCategory,
	onSelectSubcategory,
}: MobileCategoryDrawerProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLElement>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const closeDrawer = useCallback(() => {
		const scroller = scrollerRef.current;
		const dialog = dialogRef.current;
		if (!dialog?.open) return;

		if (!scroller) {
			dialog.close();
			onOpenChange(false);
			return;
		}
		scroller.scrollTo({ left: scroller.offsetWidth, behavior: "auto" });
	}, [onOpenChange]);

	useEffect(() => {
		const dialog = dialogRef.current;
		const scroller = scrollerRef.current;
		const sheet = sheetRef.current;
		if (!dialog || !scroller || !sheet) return;

		const visibleThreshold = Math.max(0.001, 1 / (window.innerWidth || 375));
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries.at(-1);
				if (!entry) return;
				if (entry.intersectionRatio < visibleThreshold && dialog.open) {
					dialog.close();
					onOpenChange(false);
				}
			},
			{ root: dialog, threshold: [visibleThreshold, 1] },
		);
		observer.observe(sheet);

		let removeScrollFallback: (() => void) | undefined;
		if (!CSS.supports("animation-timeline: scroll()")) {
			const handleScroll = () => {
				const width = sheet.offsetWidth || 1;
				const ratio = Math.max(0, Math.min(1, 1 - scroller.scrollLeft / width));
				dialog.style.setProperty("--drawer-backdrop", String(ratio));
			};
			scroller.addEventListener("scroll", handleScroll, { passive: true });
			removeScrollFallback = () =>
				scroller.removeEventListener("scroll", handleScroll);
		}

		const handleBackdropClick = (event: MouseEvent) => {
			if (!sheet.contains(event.target as Node)) {
				closeDrawer();
			}
		};
		dialog.addEventListener("click", handleBackdropClick);

		return () => {
			observer.disconnect();
			removeScrollFallback?.();
			dialog.removeEventListener("click", handleBackdropClick);
		};
	}, [onOpenChange, closeDrawer]);

	useEffect(() => {
		const dialog = dialogRef.current;
		const scroller = scrollerRef.current;
		if (!dialog || !scroller) return;

		let cancelled = false;

		async function openDrawer() {
			if (!dialog || !scroller || dialog.open) return;
			dialog.showModal();
			closeBtnRef.current?.focus({ preventScroll: true });

			if (!CSS.supports("scroll-initial-target", "nearest")) {
				scroller.scrollTo({ left: scroller.offsetWidth, behavior: "instant" });
				await new Promise((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(resolve)),
				);
			}

			if (!cancelled) {
				scroller.scrollTo({ left: 0, behavior: "auto" });
			}
		}

		if (isOpen) {
			void openDrawer();
		} else if (dialog.open) {
			closeDrawer();
		}

		return () => {
			cancelled = true;
		};
	}, [isOpen, closeDrawer]);

	const activeParent = activeParentId
		? categories.find((c) => c.id === activeParentId)
		: undefined;

	return (
		<dialog
			ref={dialogRef}
			id={id}
			aria-label="Browse categories"
			className="CategoryDrawer"
			onCancel={(event) => {
				if (event.cancelable) {
					event.preventDefault();
					closeDrawer();
				}
			}}
			onClose={() => {
				if (isOpen) onOpenChange(false);
			}}
		>
			<div ref={scrollerRef} className="CategoryDrawer-scroller">
				<aside
					ref={sheetRef}
					className="CategoryDrawer-sheet bg-[#FDFBF7] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE] border-r border-[#EAE4D7] dark:border-[#24362D] shadow-2xl"
				>
					<div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[#EAE4D7] dark:border-[#24362D]">
						<div>
							<h2 className="text-base font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
								Categories
							</h2>
							<p className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
								Tap a category to explore subcategories
							</p>
						</div>
						<button
							ref={closeBtnRef}
							type="button"
							onClick={closeDrawer}
							aria-label="Close categories drawer"
							className="w-9 h-9 rounded-full flex items-center justify-center text-[#5C665E] dark:text-[#9AA89E] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] transition-colors cursor-pointer"
						>
							<X className="w-4.5 h-4.5" aria-hidden="true" />
						</button>
					</div>

					<div className="overflow-y-auto px-3 py-3">
						<CategoryNavList
							topLevelCategories={topLevelCategories}
							categories={categories}
							categoryCounts={categoryCounts}
							activeParentId={activeParentId}
							selectedCategoryId={selectedCategoryId}
							selectedSubCategoryId={selectedSubCategoryId}
							totalProductsCount={totalProductsCount}
							onSelectAll={() => {
								onSelectAll();
								closeDrawer();
							}}
							onSelectCategory={(categoryId, hasSubcategories) => {
								onSelectCategory(categoryId, hasSubcategories);
								if (!hasSubcategories) {
									closeDrawer();
								}
							}}
							onSelectSubcategory={(parentId, subcatId) => {
								onSelectSubcategory(parentId, subcatId);
								closeDrawer();
							}}
						/>
					</div>

					{activeParent && (
						<div className="px-4 py-3 border-t border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#0E1612]">
							<button
								type="button"
								onClick={closeDrawer}
								className="w-full h-10 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540] transition-colors cursor-pointer"
							>
								Show {activeParent.name} products
							</button>
						</div>
					)}
				</aside>
			</div>
		</dialog>
	);
}
