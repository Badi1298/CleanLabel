import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/review-products")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/admin/review-products"!</div>;
}
