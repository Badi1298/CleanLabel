import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_public/stores")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/stores"!</div>;
}
