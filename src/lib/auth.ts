import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { createDbClient } from "@/db/index";

export const getAuth = async () => {
	const { db, cleanup } = await createDbClient();

	const auth = betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		baseURL: process.env.BETTER_AUTH_URL,
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
		},
		emailVerification: {
			sendOnSignUp: true,
			sendVerificationEmail: async ({ user, url }) => {
				// TODO: Replace with an actual email provider like Resend
				console.log(`[Email Verification] Send to ${user.email}: ${url}`);
			},
		},
		plugins: [tanstackStartCookies()],
	});

	return { auth, cleanup };
};
