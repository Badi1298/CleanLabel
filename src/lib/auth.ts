import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getBetterAuthSecret, getBetterAuthUrl } from "#/utils/safe-envs";
import { db } from "@/db/index"; // your drizzle instance

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	baseURL: getBetterAuthUrl(),
	secret: getBetterAuthSecret(),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [tanstackStartCookies()],
});
