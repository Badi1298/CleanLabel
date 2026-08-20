import { createServerOnlyFn } from "@tanstack/react-start";
import { env } from "#/env";

export const getDatabaseUrl = createServerOnlyFn(() => env.DATABASE_URL);
export const getDatabaseUrlUnpooled = createServerOnlyFn(
	() => env.DATABASE_URL_UNPOOLED,
);
export const getBetterAuthUrl = createServerOnlyFn(() => env.BETTER_AUTH_URL);
export const getBetterAuthSecret = createServerOnlyFn(
	() => env.BETTER_AUTH_SECRET,
);
export const getBetterAuthApiKey = createServerOnlyFn(
	() => env.BETTER_AUTH_API_KEY,
);
export const getNeonBranch = createServerOnlyFn(() => env.NEON_BRANCH);
export const getNeonAuthBaseUrl = createServerOnlyFn(
	() => env.NEON_AUTH_BASE_URL,
);
export const getNeonAuthJwksUrl = createServerOnlyFn(
	() => env.NEON_AUTH_JWKS_URL,
);
