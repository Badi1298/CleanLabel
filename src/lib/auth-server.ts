import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		if (!request) {
			return null;
		}

		const { auth, cleanup } = await getAuth();
		try {
			return await auth.api.getSession({
				headers: request.headers,
			});
		} finally {
			await cleanup();
		}
	},
);
