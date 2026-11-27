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
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) => {
			// TODO: Wire up transactional email provider (e.g. Resend / Postmark) to send reset password emails
			if (process.env.NODE_ENV !== "production") {
				console.info(`[auth] Password reset link for ${user.email}: ${url}`);
				return;
			}
			console.warn(
				`[auth] Password reset requested for ${user.email}, but no transactional email provider is configured yet.`,
			);
		},
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
			firstName: {
				type: "string",
				required: false,
			},
			lastName: {
				type: "string",
				required: false,
			},
			hasCompletedOnboarding: {
				type: "boolean",
				required: false,
				defaultValue: false,
			},
			preferredLocale: {
				type: "string",
				required: false,
				input: false,
			},
		},
	},
	plugins: [tanstackStartCookies()],
});
