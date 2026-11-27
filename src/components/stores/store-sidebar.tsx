import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import type * as React from "react";
import { CategoryIcon } from "#/components/categories/category-icon";
import type { CategoryItem } from "#/components/search/category-sidebar";
import { StoreAvatar } from "#/components/stores/store-avatar";
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

export type StoreItem = {
	id: string;
	name: string;
	logoUrl?: string | null;
	productCount?: number | null;
};

export type StoreCategoriesData = {
	categories: CategoryItem[];
	counts: Map<string, number>;
	isLoading: boolean;
};

type StoreNavListProps = {
	stores: StoreItem[];
	selectedStoreId?: string;
	expandedStoreIds: ReadonlySet<string>;
	storeCategoriesByStoreId: ReadonlyMap<string, StoreCategoriesData>;
	activeParentCategoryId?: string;
	onSelectAllStores: () => void;
	onSelectStore: (storeId: string) => void;
	onToggleStoreExpand: (storeId: string, open: boolean) => void;
	onSelectCategory: (storeId: string, categoryId: string) => void;
};

export function StoreNavList({
	stores,
	selectedStoreId,
	expandedStoreIds,
	storeCategoriesByStoreId,
	activeParentCategoryId,
	onSelectAllStores,
	onSelectStore,
	onToggleStoreExpand,
	onSelectCategory,
}: StoreNavListProps) {
	const isAllSelected = !selectedStoreId;

	return (
		<nav aria-label={m.stores_nav_aria()} className="flex flex-col gap-1">
			<Button
				type="button"
				variant="ghost"
				onClick={onSelectAllStores}
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
					<span className="truncate">{m.common_all_stores_title()}</span>
				</span>
				<Badge
					variant="secondary"
					className={cn(
						"min-w-6 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0",
						isAllSelected
							? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
							: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
					)}
				>
					{stores.length}
				</Badge>
			</Button>

			<Separator className="my-1.5 bg-[#EAE4D7]/80 dark:bg-[#24362D]" />

			{stores.length === 0 ? (
				<p className="px-3 py-4 text-xs text-[#5C665E] dark:text-[#9AA89E]">
					{m.stores_none_available()}
				</p>
			) : (
				<ul className="flex flex-col gap-1">
					{stores.map((store) => {
						const count = store.productCount ?? 0;
						const isSelected = selectedStoreId === store.id;
						const storeCategoryData = storeCategoriesByStoreId.get(store.id);
						const storeCategories = storeCategoryData?.categories ?? [];
						const storeCategoryCounts =
							storeCategoryData?.counts ?? new Map<string, number>();
						const isLoadingStoreCategories =
							storeCategoryData?.isLoading ?? false;
						const canExpand =
							count > 0 || (isSelected && storeCategories.length > 0);
						const isExpanded = canExpand && expandedStoreIds.has(store.id);
						const isStoreDirectlySelected =
							isSelected && !activeParentCategoryId;

						const rowContent = (
							<>
								<span className="flex items-center gap-2.5 min-w-0">
									<StoreAvatar
										name={store.name}
										logoUrl={store.logoUrl}
										size="sm"
										className="w-7 h-7"
									/>
									<span className="truncate leading-snug">{store.name}</span>
								</span>

								<Badge
									variant="secondary"
									className={cn(
										"min-w-5.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0",
										isStoreDirectlySelected
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
							isStoreDirectlySelected
								? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4]"
								: isSelected
									? "bg-[#F3EFE6]/70 dark:bg-[#1A2922] text-[#1B3328] dark:text-[#EDF2EE]"
									: "text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6]/70 dark:hover:bg-[#1E2C25]",
						);

						const rowFontWeightClass = isStoreDirectlySelected
							? "font-bold"
							: isSelected
								? "font-semibold"
								: "font-medium";

						return (
							<li key={store.id} className="flex flex-col">
								{canExpand ? (
									<Collapsible
										open={isExpanded}
										onOpenChange={(open) => onToggleStoreExpand(store.id, open)}
									>
										<div className={rowContainerClass}>
											<Button
												type="button"
												variant="ghost"
												onClick={() => onSelectStore(store.id)}
												aria-current={
													isStoreDirectlySelected ? "page" : undefined
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
													aria-label={m.stores_aisles_aria({
														store: store.name,
													})}
													className={cn(
														"h-auto min-w-7 min-h-7 pointer-coarse:min-w-10 pointer-coarse:min-h-10 p-1 mr-1 rounded-lg shrink-0 hover:bg-black/5 dark:hover:bg-white/10",
														isStoreDirectlySelected
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
												{isLoadingStoreCategories &&
												storeCategories.length === 0 ? (
													<li className="px-2.5 py-1.5 text-xs text-[#7D857E] dark:text-[#8E9B92]">
														{m.stores_loading_aisles()}
													</li>
												) : storeCategories.length === 0 ? (
													<li className="px-2.5 py-1.5 text-xs text-[#7D857E] dark:text-[#8E9B92]">
														{m.stores_no_matching_aisles()}
													</li>
												) : (
													storeCategories.map((cat) => {
														const isCatSelected =
															isSelected && activeParentCategoryId === cat.id;
														const catCount =
															storeCategoryCounts.get(cat.id) ?? 0;

														return (
															<li key={cat.id}>
																<Button
																	type="button"
																	variant="ghost"
																	onClick={() =>
																		onSelectCategory(store.id, cat.id)
																	}
																	aria-current={
																		isCatSelected ? "page" : undefined
																	}
																	className={cn(
																		"h-auto w-full justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-[13px] transition-colors",
																		isCatSelected
																			? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] font-bold"
																			: "text-[#5C665E] dark:text-[#9AA89E] font-medium hover:text-[#1B3328] dark:hover:text-[#EDF2EE] hover:bg-[#F3EFE6]/60 dark:hover:bg-[#1E2C25]",
																	)}
																>
																	<span className="flex items-center gap-2 min-w-0">
																		<CategoryIcon
																			name={cat.name}
																			iconUrl={cat.iconUrl}
																			className="w-5 h-5"
																		/>
																		<span className="truncate leading-snug">
																			{cat.name}
																		</span>
																	</span>
																	<span
																		className={cn(
																			"text-[11px] font-semibold tabular-nums shrink-0",
																			isCatSelected
																				? "text-[#1B4332] dark:text-[#CBE3D4]"
																				: "text-[#7D857E] dark:text-[#8E9B92]",
																		)}
																	>
																		{catCount}
																	</span>
																</Button>
															</li>
														);
													})
												)}
											</ul>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<Button
										type="button"
										variant="ghost"
										onClick={() => onSelectStore(store.id)}
										aria-current={isStoreDirectlySelected ? "page" : undefined}
										className={cn(
											"h-auto w-full justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-[13.5px] transition-colors",
											rowFontWeightClass,
											isStoreDirectlySelected
												? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4]"
												: isSelected
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

type MobileStoreDrawerProps = {
	id?: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	trigger?: React.ReactNode;
	stores: StoreItem[];
	selectedStoreId?: string;
	expandedStoreIds: ReadonlySet<string>;
	storeCategoriesByStoreId: ReadonlyMap<string, StoreCategoriesData>;
	activeParentCategoryId?: string;
	onSelectAllStores: () => void;
	onSelectStore: (storeId: string) => void;
	onToggleStoreExpand: (storeId: string, open: boolean) => void;
	onSelectCategory: (storeId: string, categoryId: string) => void;
};

export function MobileStoreDrawer({
	id,
	isOpen,
	onOpenChange,
	trigger,
	stores,
	selectedStoreId,
	expandedStoreIds,
	storeCategoriesByStoreId,
	activeParentCategoryId,
	onSelectAllStores,
	onSelectStore,
	onToggleStoreExpand,
	onSelectCategory,
}: MobileStoreDrawerProps) {
	const selectedStore = selectedStoreId
		? stores.find((s) => s.id === selectedStoreId)
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
						{m.nav_stores()}
					</SheetTitle>
					<SheetDescription className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
						{m.stores_drawer_subtitle()}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
					<StoreNavList
						stores={stores}
						selectedStoreId={selectedStoreId}
						expandedStoreIds={expandedStoreIds}
						storeCategoriesByStoreId={storeCategoriesByStoreId}
						activeParentCategoryId={activeParentCategoryId}
						onSelectAllStores={() => {
							onSelectAllStores();
							onOpenChange(false);
						}}
						onSelectStore={(storeId) => {
							onSelectStore(storeId);
							onOpenChange(false);
						}}
						onToggleStoreExpand={onToggleStoreExpand}
						onSelectCategory={(storeId, categoryId) => {
							onSelectCategory(storeId, categoryId);
							onOpenChange(false);
						}}
					/>
				</div>

				{selectedStore && (
					<SheetFooter className="px-4 py-3 border-t border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#0E1612] shrink-0">
						<Button
							type="button"
							onClick={() => onOpenChange(false)}
							className="w-full h-10 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold hover:bg-[#245540]"
						>
							{m.stores_drawer_show_store({ store: selectedStore.name })}
						</Button>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
