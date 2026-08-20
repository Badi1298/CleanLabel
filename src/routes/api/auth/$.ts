import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "#/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const { auth, cleanup } = await getAuth();
				try {
					return await auth.handler(request);
				} finally {
					await cleanup();
				}
			},
			POST: async ({ request }) => {
				const { auth, cleanup } = await getAuth();
				try {
					return await auth.handler(request);
				} finally {
					await cleanup();
				}
			},
		},
	},
});
