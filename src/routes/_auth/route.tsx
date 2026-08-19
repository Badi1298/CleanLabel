import {
	createFileRoute,
	isRedirect,
	Outlet,
	redirect,
} from "@tanstack/react-router";

import { getSession } from "#/lib/auth-server";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		try {
			const session = await getSession();
			if (!session) {
				throw redirect({
					to: "/login",
				});
			}
			return { session };
		} catch (error) {
			if (isRedirect(error)) throw error;
			throw redirect({
				to: "/login",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
