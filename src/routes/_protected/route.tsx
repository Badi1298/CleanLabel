import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/server/auth-functions";

export const Route = createFileRoute("/_protected")({
	// Example of optimizing the beforeLoad with React Query
	beforeLoad: async ({ location, context }) => {
		// This will fetch from network once, and use cache for subsequent rapid calls
		const session = await context.queryClient.fetchQuery({
			queryKey: ["session"],
			queryFn: () => getSession(),
			staleTime: 1000 * 60 * 2, // 2 minutes
		});

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
