import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_public/stores")({
	component: StoresLayout,
});

function StoresLayout() {
	return <Outlet />;
}
