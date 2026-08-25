import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <h1 className="px-4">Welcome to admin!</h1>;
}
