import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useDebounce } from "#/hooks/use-debounce";
import {
	categoriesQueryOptions,
	unmappedTagsQueryOptions,
} from "#/queries/category-queries";
import type { getUnmappedTags } from "#/server/category-functions";
import { mapOffTagToCategory } from "#/server/category-functions";

export const Route = createFileRoute("/_protected/admin/category-mappings")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(
			unmappedTagsQueryOptions({
				pageIndex: 0,
				pageSize: 10,
				globalFilter: "",
			}),
		);
		await queryClient.ensureQueryData(
			categoriesQueryOptions({
				pageIndex: 0,
				pageSize: 1000,
				globalFilter: "",
			}),
		);
	},
});

type UnmappedTagData = NonNullable<
	Awaited<ReturnType<typeof getUnmappedTags>>["data"]
>[0];

const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	globalFilteringFeature,
	rowPaginationFeature,
});
const columnHelper = createColumnHelper<typeof features, UnmappedTagData>();

function MappingRowActions({ tag }: { tag: string }) {
	const queryClient = useQueryClient();
	const mapTagFn = useServerFn(mapOffTagToCategory);
	const [selectedCategoryId, setSelectedCategoryId] = useState("");

	const { data: categoriesResult } = useQuery({
		...categoriesQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
			globalFilter: "",
		}),
	});

	const handleMap = async () => {
		if (!selectedCategoryId) return;

		try {
			const res = await mapTagFn({
				data: { tag, categoryId: selectedCategoryId },
			});
			toast.success(`Mapped tag. Updated ${res.updatedCount} products.`);
			setSelectedCategoryId("");
			queryClient.invalidateQueries({ queryKey: ["unmappedTags"] });
		} catch (e) {
			toast.error("Failed to map tag");
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select category..." />
				</SelectTrigger>
				<SelectContent>
					{categoriesResult?.data.map((cat) => (
						<SelectItem key={cat.id} value={cat.id}>
							{cat.parentName ? `${cat.parentName} > ${cat.name}` : cat.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button onClick={handleMap} disabled={!selectedCategoryId}>
				Map
			</Button>
		</div>
	);
}

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

	const queryArgs = useMemo(
		() => ({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			globalFilter: debouncedSearch,
		}),
		[pagination, debouncedSearch],
	);

	const { data: result } = useQuery({
		...unmappedTagsQueryOptions(queryArgs),
		placeholderData: keepPreviousData,
	});

	const columns = useMemo(
		() => [
			columnHelper.accessor("tag", {
				header: "OFF Tag",
				cell: (info) => (
					<span className="font-medium text-slate-900 dark:text-slate-100">
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("occurrences", {
				header: "Occurrences",
				cell: (info) => (
					<span className="text-slate-500">{info.getValue()}</span>
				),
			}),
			columnHelper.display({
				id: "actions",
				header: "Map to Category",
				cell: (info) => <MappingRowActions key={info.row.original.tag} tag={info.row.original.tag} />,
			}),
		],
		[],
	);

	const table = useTable<typeof features, UnmappedTagData>({
		features,
		data: result?.data ?? [],
		columns: columns as any,
		state: {
			pagination,
			globalFilter: debouncedSearch,
		},
		getRowId: (row) => row.tag,
		rowCount: result?.rowCount ?? 0,
		manualPagination: true,
		manualFiltering: true,
		onPaginationChange: setPagination,
	});

	return (
		<div className="min-w-0 w-full p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">Category Mappings (Admin Queue)</h1>
				<div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
					<div className="relative w-full sm:w-64">
						<Input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="bg-white dark:bg-slate-900"
							placeholder="Search tags..."
						/>
					</div>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-200 text-sm text-left">
						<thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th key={header.id} className="px-6 py-4 font-medium">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</th>
									))}
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
										No unmapped tags found.
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
