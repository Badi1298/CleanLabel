import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import type * as React from "react";
import { CategoryIcon } from "#/components/categories/category-icon";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import { Separator } from "#/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";

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
	expandedCategoryIds: ReadonlySet<string>;
	totalProductsCount?: number;
	onSelectAll: () => void;
	onSelectCategory: (categoryId: string, hasSubcategories: boolean) => void;
	onToggleCategoryExpand: (categoryId: string, open: boolean) => void;
	onSelectSubcategory: (parentId: string, subcatId: string) => void;
};

export function CategoryNavList({
	topLevelCategories,
	categories,
	categoryCounts,
	activeParentId,
	selectedCategoryId,
	selectedSubCategoryId,
	expandedCategoryIds,
	totalProductsCount,
	onSelectAll,
	onSelectCategory,
	onToggleCategoryExpand,
	onSelectSubcategory,
}: CategoryNavListProps) {
	const isAllSelected = !selectedCategoryId && !selectedSubCategoryId;

	return (
		<nav
			aria-label={m.search_categories_nav_aria()}
			className="flex flex-col gap-1"
		>
			<Button
				type="button"
				variant="ghost"
				onClick={onSelectAll}
				aria-current={isAllSelected ? "page" : undefined}
				className={cn(
					"h-auto w-full justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors",
					isAllSelected
						? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] font-bold"
						: "text-[#1B3328] dark:text-[#EDF2EE] font-semibold hover:bg-[#F3EFE6]/80 dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
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
					<span className="truncate">{m.common_all_products_title()}</span>
				</span>
				{typeof totalProductsCount === "number" && (
					<Badge
						variant="secondary"
						className={cn(
							"min-w-6 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0",
							isAllSelected
								? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
								: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
						)}
					>
						{totalProductsCount}
					</Badge>
				)}
			</Button>

			<Separator className="my-1.5 bg-[#EAE4D7]/80 dark:bg-[#24362D]" />

			{topLevelCategories.length === 0 ? (
				<p className="px-3 py-4 text-xs text-[#5C665E] dark:text-[#9AA89E]">
					{m.search_no_categories_match()}
				</p>
			) : (
				<ul className="flex flex-col gap-1">
					{topLevelCategories.map((parentCat) => {
						const subcats = categories.filter(
							(c) => c.parentId === parentCat.id,
						);
						const hasSubcats = subcats.length > 0;
						const isParentActive = activeParentId === parentCat.id;
						const isParentDirectlySelected =
							isParentActive && !selectedSubCategoryId;
						const isExpanded =
							hasSubcats && expandedCategoryIds.has(parentCat.id);
						const count = categoryCounts.get(parentCat.id) || 0;

						const rowContent = (
							<>
								<span className="flex items-center gap-2.5 min-w-0">
									<CategoryIcon
										name={parentCat.name}
										iconUrl={parentCat.iconUrl}
										className="w-7 h-7"
									/>
									<span className="truncate leading-snug">
										{parentCat.name}
									</span>
								</span>

								<Badge
									variant="secondary"
									className={cn(
										"min-w-5.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0",
										isParentDirectlySelected
											? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
											: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
									)}
								>
									{count}
								</Badge>
							</>
						);

						const rowContainerClass = cn(
							"flex items-center rounded-xl transition-colors",
							isParentDirectlySelected
								? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4]"
								: isParentActive
									? "bg-[#F3EFE6]/70 dark:bg-[#1A2922] text-[#1B3328] dark:text-[#EDF2EE]"
									: "text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6]/70 dark:hover:bg-[#1E2C25]",
						);

						const rowFontWeightClass = isParentDirectlySelected
							? "font-bold"
							: isParentActive
								? "font-semibold"
								: "font-medium";

						return (
							<li key={parentCat.id} className="flex flex-col">
								{hasSubcats ? (
									<Collapsible
										open={isExpanded}
										onOpenChange={(open) =>
											onToggleCategoryExpand(parentCat.id, open)
										}
									>
										<div className={rowContainerClass}>
											<Button
												type="button"
												variant="ghost"
												onClick={() =>
													onSelectCategory(parentCat.id, hasSubcats)
												}
												aria-current={
													isParentDirectlySelected ? "page" : undefined
												}
												className={cn(
													"flex-1 min-w-0 h-auto justify-between gap-2 pl-2.5 pr-1.5 py-2 rounded-xl text-left text-[13.5px] transition-colors hover:bg-transparent dark:hover:bg-transparent hover:text-inherit",
													rowFontWeightClass,
												)}
											>
												{rowContent}
											</Button>
											<CollapsibleTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													aria-label={m.search_subcategories_aria({
														category: parentCat.name,
													})}
													className={cn(
														"h-auto min-w-7 min-h-7 pointer-coarse:min-w-10 pointer-coarse:min-h-10 p-1 mr-1 rounded-lg shrink-0 hover:bg-black/5 dark:hover:bg-white/10",
														isParentDirectlySelected
															? "text-[#1B4332] dark:text-[#CBE3D4] hover:text-[#1B4332] dark:hover:text-[#CBE3D4]"
															: "text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
													)}
												>
													{isExpanded ? (
														<ChevronDown
															className="size-3.5"
															aria-hidden="true"
														/>
													) : (
														<ChevronRight
															className="size-3.5"
															aria-hidden="true"
														/>
													)}
												</Button>
											</CollapsibleTrigger>
										</div>
										<CollapsibleContent>
											<ul className="mt-1 ml-4 pl-3 border-l border-[#EAE4D7] dark:border-[#24362D] flex flex-col gap-0.5">
												{subcats.map((subcat) => {
													const isSubSelected =
														selectedSubCategoryId === subcat.id;
													const subCount = categoryCounts.get(subcat.id) || 0;
													return (
														<li key={subcat.id}>
															<Button
																type="button"
																variant="ghost"
																onClick={() =>
																	onSelectSubcategory(parentCat.id, subcat.id)
																}
																aria-current={
																	isSubSelected ? "page" : undefined
																}
																className={cn(
																	"h-auto w-full justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-[13px] transition-colors",
																	isSubSelected
																		? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] font-bold"
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
															</Button>
														</li>
													);
												})}
											</ul>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<Button
										type="button"
										variant="ghost"
										onClick={() => onSelectCategory(parentCat.id, hasSubcats)}
										aria-current={isParentDirectlySelected ? "page" : undefined}
										className={cn(
											"h-auto w-full justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-[13.5px] transition-colors",
											rowFontWeightClass,
											isParentDirectlySelected
												? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4]"
												: isParentActive
													? "bg-[#F3EFE6]/70 dark:bg-[#1A2922] text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]"
													: "text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6]/70 dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
										)}
									>
										{rowContent}
									</Button>
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
	id?: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	trigger?: React.ReactNode;
	topLevelCategories: CategoryItem[];
	categories: CategoryItem[];
	categoryCounts: Map<string, number>;
	activeParentId?: string;
	selectedCategoryId?: string;
	selectedSubCategoryId?: string;
	expandedCategoryIds: ReadonlySet<string>;
	totalProductsCount?: number;
	onSelectAll: () => void;
	onSelectCategory: (categoryId: string, hasSubcategories: boolean) => void;
	onToggleCategoryExpand: (categoryId: string, open: boolean) => void;
	onSelectSubcategory: (parentId: string, subcatId: string) => void;
};

export function MobileCategoryDrawer({
	id,
	isOpen,
	onOpenChange,
	trigger,
	topLevelCategories,
	categories,
	categoryCounts,
	activeParentId,
	selectedCategoryId,
	selectedSubCategoryId,
	expandedCategoryIds,
	totalProductsCount,
	onSelectAll,
	onSelectCategory,
	onToggleCategoryExpand,
	onSelectSubcategory,
}: MobileCategoryDrawerProps) {
	const activeParent = activeParentId
		? categories.find((c) => c.id === activeParentId)
		: undefined;

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent
				id={id}
				side="left"
				className="w-[min(21rem,84dvw)] sm:max-w-[21rem] p-0 gap-0 bg-[#FDFBF7] dark:bg-[#131F19] text-[#1B3328] dark:text-[#EDF2EE] border-r border-[#EAE4D7] dark:border-[#24362D]"
			>
				<SheetHeader className="px-4 py-3.5 pr-12 border-b border-[#EAE4D7] dark:border-[#24362D] text-left gap-0.5 shrink-0">
					<SheetTitle className="text-base font-bold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
						{m.search_categories_label()}
					</SheetTitle>
					<SheetDescription className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
						{m.search_drawer_subtitle()}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
					<CategoryNavList
						topLevelCategories={topLevelCategories}
						categories={categories}
						categoryCounts={categoryCounts}
						activeParentId={activeParentId}
						selectedCategoryId={selectedCategoryId}
						selectedSubCategoryId={selectedSubCategoryId}
						expandedCategoryIds={expandedCategoryIds}
						totalProductsCount={totalProductsCount}
						onSelectAll={() => {
							onSelectAll();
							onOpenChange(false);
						}}
						onSelectCategory={(categoryId, hasSubcategories) => {
							onSelectCategory(categoryId, hasSubcategories);
							onOpenChange(false);
						}}
						onToggleCategoryExpand={onToggleCategoryExpand}
						onSelectSubcategory={(parentId, subcatId) => {
							onSelectSubcategory(parentId, subcatId);
							onOpenChange(false);
						}}
					/>
				</div>

				{activeParent && (
					<SheetFooter className="px-4 py-3 border-t border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#0E1612] shrink-0">
						<Button
							type="button"
							onClick={() => onOpenChange(false)}
							className="w-full h-10 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540]"
						>
							{m.search_drawer_show_category({ category: activeParent.name })}
						</Button>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
