import { z } from "zod";

const serverEnvSchema = z.object({
	DATABASE_URL: z.url(),
	DATABASE_URL_UNPOOLED: z.url(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_API_KEY: z.string(),
	NEON_BRANCH: z.string(),
	NEON_AUTH_BASE_URL: z.url(),
	NEON_AUTH_JWKS_URL: z.url(),
});

const clientEnvSchema = z.object({
	VITE_APP_TITLE: z.string().min(1).optional(),
	VITE_BETTER_AUTH_URL: z.url(),
});

// Server environment variables are validated at runtime from process.env
export const getServerEnv = () => serverEnvSchema.parse(process.env);

// Client environment variables are injected at build time and can be validated immediately
export const clientEnv = clientEnvSchema.parse(import.meta.env);
