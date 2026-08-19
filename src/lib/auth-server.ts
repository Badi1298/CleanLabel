import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		if (!request) {
			return null;
		}
		return await auth.api.getSession({
			headers: request.headers,
		});
	},
);
