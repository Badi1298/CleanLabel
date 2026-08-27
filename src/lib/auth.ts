import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import {
	getBetterAuthSecret,
	getBetterAuthUrl,
	getGoogleClientId,
	getGoogleClientSecret,
} from "#/utils/safe-envs";
import { db } from "@/db/index"; // your drizzle instance

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	baseURL: getBetterAuthUrl(),
	secret: getBetterAuthSecret(),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: getGoogleClientId(),
			clientSecret: getGoogleClientSecret(),
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "client",
				input: false,
			},
		},
	},
	plugins: [tanstackStartCookies()],
});
