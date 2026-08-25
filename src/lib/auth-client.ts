import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "#/env";
import type { auth } from "#/lib/auth";

export const authClient = createAuthClient({
	baseURL: clientEnv.VITE_BETTER_AUTH_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
});
