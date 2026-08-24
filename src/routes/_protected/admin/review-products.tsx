import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { getPendingProducts } from "#/server/product-functions";

const pendingProductsQueryOptions = () =>
	queryOptions({
		queryKey: ["pendingProducts"],
		queryFn: () => getPendingProducts(),
	});

export const Route = createFileRoute("/_protected/admin/review-products")({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) =>
		await queryClient.ensureQueryData(pendingProductsQueryOptions()),
});

type ProductData = Awaited<ReturnType<typeof getPendingProducts>>[0];

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, ProductData>();

const columns = [
	columnHelper.accessor((row) => row.product.name, {
		id: "name",
		header: "Name",
		cell: (info) => (
			<span className="font-medium text-slate-900 dark:text-slate-100">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor((row) => row.category?.name, {
		id: "category",
		header: "Category",
		cell: (info) => info.getValue() || "N/A",
	}),
	columnHelper.accessor((row) => row.product.status, {
		id: "status",
		header: "Status",
		cell: (info) => (
			<span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
				{info.getValue().replace("_", " ")}
			</span>
		),
	}),
	columnHelper.accessor((row) => row.product.createdAt, {
		id: "date",
		header: "Date Added",
		cell: (info) => {
			const date = new Date(info.getValue());
			return date.toLocaleDateString();
		},
	}),
	columnHelper.display({
		id: "actions",
		header: "Actions",
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
		...pendingProductsQueryOptions(),
	});

	const table = useTable<typeof features, ProductData>({
		features,
		data: products,
		columns: columns as any,
	});

	return (
		<div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
					Review Products
				</h1>
				<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
					{products.length} pending
				</span>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
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
