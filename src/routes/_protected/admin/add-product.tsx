import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "#/components/ProductForm";

export const Route = createFileRoute("/_protected/admin/add-product")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="px-4 max-w-2xl mx-auto mb-12 bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
			<ProductForm
				isAdmin={true}
				onSubmit={(values) => {
					console.log("Admin submitted product:", values);
					alert("Product created as Admin!");
				}}
			/>
		</div>
	);
}
