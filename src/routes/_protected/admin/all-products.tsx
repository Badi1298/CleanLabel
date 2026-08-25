import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useEffect, useMemo, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import { useDebounce } from "#/hooks/use-debounce";
import { allProductsQueryOptions } from "#/queries/product-queries";
import type { getAllProducts } from "#/server/product-functions";

export const Route = createFileRoute("/_protected/admin/all-products")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) =>
		await queryClient.ensureQueryData(
			allProductsQueryOptions({
				pageIndex: 0,
				pageSize: 10,
				globalFilter: "",
				statusFilter: "all",
			}),
		),
});

type ProductData = NonNullable<
	Awaited<ReturnType<typeof getAllProducts>>["data"]
>[0];

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
});
const columnHelper = createColumnHelper<typeof features, ProductData>();

const columns = [
	columnHelper.accessor((row) => row.product.name, {
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
	columnHelper.accessor((row) => row.category?.name, {
		id: "category",
		header: "Category",
		enableColumnFilter: false,
		cell: (info) => info.getValue() || "N/A",
	}),
	columnHelper.accessor((row) => row.product.status, {
		id: "status",
		header: "Status",
		enableColumnFilter: false,
		cell: (info) => {
			const status = info.getValue();
			return (
				<Badge
					variant={
						status === "rejected"
							? "destructive"
							: status === "approved"
								? "default"
								: "secondary"
					}
				>
					{status.replace("_", " ")}
				</Badge>
			);
		},
	}),
	columnHelper.accessor((row) => row.product.createdAt, {
		id: "date",
		header: "Date Added",
		enableColumnFilter: false,
		cell: (info) => {
			const date = new Date(info.getValue());
			return date.toLocaleDateString();
		},
	}),
	columnHelper.display({
		id: "actions",
		header: "Actions",
		enableColumnFilter: false,
		enableHiding: false,
		cell: (info) => (
			<Link
				to="/admin/add-product"
				search={{ productId: info.row.original.product.id }}
				className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
			>
				Review
			</Link>
		),
	}),
];

function RouteComponent() {
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
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [columnVisibility, setColumnVisibility] = useState<
		Record<string, boolean>
	>({});

	const queryArgs = useMemo(
		() => ({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			globalFilter: debouncedSearch,
			statusFilter,
		}),
		[pagination, debouncedSearch, statusFilter],
	);

	const { data: result } = useQuery({
		...allProductsQueryOptions(queryArgs),
		placeholderData: keepPreviousData,
	});

	const table = useTable<typeof features, ProductData>({
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
		<div className="w-full p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
					<div className="relative w-full sm:w-64">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
							<Search className="h-4 w-4" />
						</div>
						<Input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="pl-9 bg-white dark:bg-slate-900"
							placeholder="Search products or brands..."
						/>
					</div>

					<div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
						{["all", "approved", "pending_review", "rejected"].map((status) => (
							<Button
								key={status}
								variant={statusFilter === status ? "default" : "ghost"}
								size="sm"
								onClick={() => {
									setStatusFilter(status);
									setPagination((prev) => ({ ...prev, pageIndex: 0 }));
								}}
								className="h-7 text-xs px-3 font-medium transition-all cursor-pointer"
							>
								{status === "all"
									? "ALL"
									: status.replace("_", " ").toUpperCase()}
							</Button>
						))}
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
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left table-fixed">
						<thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const widthClass =
											{
												name: "w-[35%]",
												category: "w-[20%]",
												status: "w-[20%]",
												date: "w-[15%]",
												actions: "w-[10%]",
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
											<td
												key={cell.id}
												className="px-6 py-4 whitespace-nowrap truncate"
											>
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
										No products waiting for review.
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
