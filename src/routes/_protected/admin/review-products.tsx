import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	tableFeatures,
	useTable,
	columnFilteringFeature,
	createFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { allProductsQueryOptions } from "#/queries/product-queries";
import type { getAllProducts } from "#/server/product-functions";

export const Route = createFileRoute("/_protected/admin/review-products")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) =>
		await queryClient.ensureQueryData(allProductsQueryOptions()),
});

type ProductData = Awaited<ReturnType<typeof getAllProducts>>[0];

const features = tableFeatures({
	columnFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
});
const columnHelper = createColumnHelper<typeof features, ProductData>();

const columns = [
	columnHelper.accessor((row) => row.product.name, {
		id: "name",
		header: "Name",
		enableColumnFilter: false,
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
		enableColumnFilter: true,
		cell: (info) => (
			<span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
				{info.getValue().replace("_", " ")}
			</span>
		),
		filterFn: (row, columnId, value) => {
			if (!value || value === "all") return true;
			return row.getValue(columnId) === value;
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
	const { data: products } = useSuspenseQuery({
		...allProductsQueryOptions(),
	});

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useTable<typeof features, ProductData>({
		features,
		data: products,
		columns: columns as any,
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
	});

	return (
		<div className="w-full p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
					Review Products
				</h1>
				<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
					{table.getRowModel().rows.length} products
				</span>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th key={header.id} className="px-6 py-4 font-medium align-top">
											{header.isPlaceholder ? null : (
												<div className="flex flex-col gap-2">
													<div>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
													</div>
													{header.column.getCanFilter() ? (
														<div>
															<select
																value={(header.column.getFilterValue() ?? "all") as string}
																onChange={(e) => {
																	const val = e.target.value;
																	header.column.setFilterValue(val === "all" ? undefined : val);
																}}
																className="block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs py-1 px-2"
															>
																<option value="all">All</option>
																<option value="pending_review">Pending Review</option>
																<option value="approved">Approved</option>
																<option value="rejected">Rejected</option>
															</select>
														</div>
													) : null}
												</div>
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
										{row.getAllCells().map((cell: any) => (
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
										No products waiting for review.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
