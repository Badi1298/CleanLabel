import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import type * as React from "react";
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

export type StoreItem = {
	id: string;
	name: string;
	logoUrl?: string | null;
	productCount?: number | null;
};

type StoreNavListProps = {
	stores: StoreItem[];
	selectedStoreId?: string;
	activeCategories: CategoryItem[];
	categoryCounts: Map<string, number>;
	activeParentCategoryId?: string;
	isLoadingCategories?: boolean;
	onSelectAllStores: () => void;
	onSelectStore: (storeId: string) => void;
	onSelectCategory: (storeId: string, categoryId: string) => void;
};

export function StoreNavList({
	stores,
	selectedStoreId,
	activeCategories,
	categoryCounts,
	activeParentCategoryId,
	isLoadingCategories,
	onSelectAllStores,
	onSelectStore,
	onSelectCategory,
}: StoreNavListProps) {
	const isAllSelected = !selectedStoreId;

	return (
		<nav aria-label="Supermarkets" className="flex flex-col gap-1">
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
					<span className="truncate">All Stores</span>
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
					No stores available.
				</p>
			) : (
				<ul className="flex flex-col gap-1">
					{stores.map((store) => {
						const count = store.productCount ?? 0;
						const isSelected = selectedStoreId === store.id;
						const canExpand =
							count > 0 || (isSelected && activeCategories.length > 0);
						const isExpanded =
							isSelected &&
							(activeCategories.length > 0 || Boolean(isLoadingCategories));
						const isStoreDirectlySelected =
							isSelected && !activeParentCategoryId;

						const storeButton = (
							<Button
								type="button"
								variant="ghost"
								onClick={() => onSelectStore(store.id)}
								aria-current={isStoreDirectlySelected ? "page" : undefined}
								className={cn(
									"h-auto w-full justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-[13.5px] transition-colors",
									isStoreDirectlySelected
										? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] font-bold"
										: isSelected
											? "bg-[#F3EFE6]/70 dark:bg-[#1A2922] text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] font-semibold"
											: "text-[#1B3328] dark:text-[#EDF2EE] font-medium hover:bg-[#F3EFE6]/70 dark:hover:bg-[#1E2C25] hover:text-[#1B3328] dark:hover:text-[#EDF2EE]",
								)}
							>
								<span className="flex items-center gap-2.5 min-w-0">
									<StoreAvatar
										name={store.name}
										logoUrl={store.logoUrl}
										size="sm"
										className="w-7 h-7"
									/>
									<span className="truncate leading-snug">{store.name}</span>
								</span>

								<span className="flex items-center gap-1.5 shrink-0">
									<Badge
										variant="secondary"
										className={cn(
											"min-w-5.5 px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums",
											isStoreDirectlySelected
												? "bg-white/90 dark:bg-[#16221C] text-[#1B4332] dark:text-[#CBE3D4]"
												: "bg-[#F3EFE6] dark:bg-[#1E2E26] text-[#5C665E] dark:text-[#9AA89E]",
										)}
									>
										{count}
									</Badge>
									{canExpand &&
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
							</Button>
						);

						return (
							<li key={store.id} className="flex flex-col">
								{canExpand ? (
									<Collapsible open={isExpanded}>
										<CollapsibleTrigger asChild>
											{storeButton}
										</CollapsibleTrigger>
										<CollapsibleContent>
											<ul className="mt-1 ml-4 pl-3 border-l border-[#EAE4D7] dark:border-[#24362D] flex flex-col gap-0.5">
												{isLoadingCategories &&
												activeCategories.length === 0 ? (
													<li className="px-2.5 py-1.5 text-xs text-[#7D857E] dark:text-[#8E9B92]">
														Loading aisles...
													</li>
												) : (
													activeCategories.map((cat) => {
														const isCatSelected =
															activeParentCategoryId === cat.id;
														const catCount = categoryCounts.get(cat.id) ?? 0;

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
																	<span className="truncate leading-snug">
																		{cat.name}
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
									storeButton
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
	activeCategories: CategoryItem[];
	categoryCounts: Map<string, number>;
	activeParentCategoryId?: string;
	isLoadingCategories?: boolean;
	onSelectAllStores: () => void;
	onSelectStore: (storeId: string) => void;
	onSelectCategory: (storeId: string, categoryId: string) => void;
};

export function MobileStoreDrawer({
	id,
	isOpen,
	onOpenChange,
	trigger,
	stores,
	selectedStoreId,
	activeCategories,
	categoryCounts,
	activeParentCategoryId,
	isLoadingCategories,
	onSelectAllStores,
	onSelectStore,
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
						Stores
					</SheetTitle>
					<SheetDescription className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]">
						Select a supermarket to browse its aisles
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
					<StoreNavList
						stores={stores}
						selectedStoreId={selectedStoreId}
						activeCategories={activeCategories}
						categoryCounts={categoryCounts}
						activeParentCategoryId={activeParentCategoryId}
						isLoadingCategories={isLoadingCategories}
						onSelectAllStores={() => {
							onSelectAllStores();
							onOpenChange(false);
						}}
						onSelectStore={(storeId) => {
							const clickedStore = stores.find((s) => s.id === storeId);
							const isAlreadySelected = selectedStoreId === storeId;
							const hasProducts = (clickedStore?.productCount ?? 0) > 0;
							onSelectStore(storeId);
							if (isAlreadySelected || !hasProducts) {
								onOpenChange(false);
							}
						}}
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
							Show {selectedStore.name} products
						</Button>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
