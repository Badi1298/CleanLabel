import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { detectClientPlatform } from "#/lib/analytics-client";
import { hasLocaleCookie, isAppLocale } from "#/lib/i18n";
import { usePwaInstall } from "#/lib/pwa-install";
import { getLocale, setLocale } from "#/paraglide/runtime.js";
import { recordClientPresence } from "#/server/analytics-functions";
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
	const { isStandalone, isInstalled } = usePwaInstall();
	const hasBackfilledRef = useRef(false);
	const recordedPresenceRef = useRef<{
		userId: string;
		isStandalone: boolean;
		isInstalled: boolean;
	} | null>(null);

	useEffect(() => {
		if (session.user.role !== "client") {
			return;
		}

		const prev = recordedPresenceRef.current;
		const shouldRecord =
			!prev ||
			prev.userId !== session.user.id ||
			(!prev.isStandalone && isStandalone) ||
			(!prev.isInstalled && isInstalled);

		if (!shouldRecord) {
			return;
		}

		recordedPresenceRef.current = {
			userId: session.user.id,
			isStandalone,
			isInstalled,
		};

		recordClientPresence({
			data: {
				isStandalone,
				isInstalled,
				platform: detectClientPlatform(),
			},
		}).catch(() => {});
	}, [session.user.id, session.user.role, isStandalone, isInstalled]);

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
