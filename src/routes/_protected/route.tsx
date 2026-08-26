import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/server/auth-functions";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
				replace: true,
			});
		}

		return { session };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
