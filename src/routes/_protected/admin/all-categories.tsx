import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	flexRender,
	globalFilteringFeature,
	rowPaginationFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AddCategoryDialog } from "#/components/AddCategoryDialog";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import { useDebounce } from "#/hooks/use-debounce";
import { categoriesQueryOptions } from "#/queries/category-queries";
import type { getCategories } from "#/server/category-functions";

export const Route = createFileRoute("/_protected/admin/all-categories")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) =>
		await queryClient.ensureQueryData(
			categoriesQueryOptions({
				pageIndex: 0,
				pageSize: 10,
				globalFilter: "",
			}),
		),
});

type CategoryData = NonNullable<
	Awaited<ReturnType<typeof getCategories>>["data"]
>[0];

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
});
const columnHelper = createColumnHelper<typeof features, CategoryData>();

function RouteComponent() {
	const [editingCategory, setEditingCategory] = useState<any>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				id: "name",
				header: "Name",
				enableColumnFilter: false,
				enableHiding: false,
				cell: (info) => (
					<span className="font-medium text-slate-900 dark:text-slate-100">
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("iconUrl", {
				id: "iconUrl",
				header: "Icon URL",
				enableColumnFilter: false,
				cell: (info) => {
					const url = info.getValue();
					if (!url) return <span className="text-slate-500">None</span>;
					return (
						<span className="truncate max-w-50 inline-block text-slate-500">
							{url}
						</span>
					);
				},
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableHiding: false,
				cell: (info) => (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setEditingCategory(info.row.original);
							setIsDialogOpen(true);
						}}
					>
						Edit
					</Button>
				),
			}),
		],
		[],
	);

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [searchInput, setSearchInput] = useState<string>("");
	const debouncedSearch = useDebounce(searchInput, 1000);

	const [prevSearch, setPrevSearch] = useState(debouncedSearch);
	if (debouncedSearch !== prevSearch) {
		setPrevSearch(debouncedSearch);
		setPagination((prev) =>
			prev.pageIndex !== 0 ? { ...prev, pageIndex: 0 } : prev,
		);
	}
	const [columnVisibility, setColumnVisibility] = useState<
		Record<string, boolean>
	>({});

	const queryArgs = useMemo(
		() => ({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			globalFilter: debouncedSearch,
		}),
		[pagination, debouncedSearch],
	);

	const { data: result } = useQuery({
		...categoriesQueryOptions(queryArgs),
		placeholderData: keepPreviousData,
	});

	const table = useTable<typeof features, CategoryData>({
		features,
		data: result?.data ?? [],
		columns: columns as any,
		state: {
			pagination,
			globalFilter: debouncedSearch,
			columnVisibility,
		},
		rowCount: result?.rowCount ?? 0,
		manualPagination: true,
		manualFiltering: true,
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
	});

	return (
		<div className="min-w-0 w-full p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
					<div className="relative w-full sm:w-64">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
							<Search className="h-4 w-4" />
						</div>
						<Input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="pl-9 bg-white dark:bg-slate-900"
							placeholder="Search categories..."
						/>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<span className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider">
						{result?.rowCount ?? 0} ROWS
					</span>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="ml-auto flex items-center gap-2"
							>
								Columns
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllLeafColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>

					<AddCategoryDialog
						trigger={<Button variant="outline">Add Category</Button>}
						categoryToEdit={editingCategory}
						isOpen={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) setEditingCategory(null);
						}}
					/>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-200 text-sm text-left">
						<thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const widthClass =
											{
												name: "w-[50%]",
												iconUrl: "w-[35%]",
												actions: "w-[15%]",
											}[header.id] || "";
										return (
											<th
												key={header.id}
												className={`px-6 py-4 font-medium ${widthClass}`}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
							{table.getRowModel().rows.length > 0 ? (
								table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
									>
										{row.getVisibleCells().map((cell: any) => (
											<td key={cell.id} className="px-6 py-4 whitespace-nowrap">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={columns.length}
										className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
									>
										No categories found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 gap-4">
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Prev
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
					<span className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider">
						PAGE {pagination.pageIndex + 1} /{" "}
						{Math.max(1, table.getPageCount()).toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	);
}
