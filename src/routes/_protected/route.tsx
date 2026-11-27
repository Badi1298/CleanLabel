import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { hasLocaleCookie, isAppLocale } from "#/lib/i18n";
import { getLocale, setLocale } from "#/paraglide/runtime.js";
import { getSession } from "#/server/auth-functions";
import { updatePreferredLocale } from "#/server/locale-functions";

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
	const { session } = Route.useRouteContext();
	const hasBackfilledRef = useRef(false);

	useEffect(() => {
		const userRecord = session.user as { preferredLocale?: string | null };
		const dbLocale = isAppLocale(userRecord.preferredLocale)
			? userRecord.preferredLocale
			: null;
		const currentLocale = getLocale();

		if (dbLocale && dbLocale !== currentLocale) {
			setLocale(dbLocale);
			return;
		}

		if (
			!dbLocale &&
			!hasBackfilledRef.current &&
			hasLocaleCookie() &&
			isAppLocale(currentLocale)
		) {
			hasBackfilledRef.current = true;
			updatePreferredLocale({ data: { locale: currentLocale } }).catch(
				() => {},
			);
		}
	}, [session.user]);

	return <Outlet />;
}
