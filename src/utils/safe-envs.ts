import { createServerOnlyFn } from "@tanstack/react-start";
import { getServerEnv } from "#/env";

export const getDatabaseUrl = createServerOnlyFn(
	() => getServerEnv().DATABASE_URL,
);
export const getDatabaseUrlUnpooled = createServerOnlyFn(
	() => getServerEnv().DATABASE_URL_UNPOOLED,
);
export const getBetterAuthUrl = createServerOnlyFn(
	() => getServerEnv().BETTER_AUTH_URL,
);
export const getBetterAuthSecret = createServerOnlyFn(
	() => getServerEnv().BETTER_AUTH_SECRET,
);
export const getBetterAuthApiKey = createServerOnlyFn(
	() => getServerEnv().BETTER_AUTH_API_KEY,
);
export const getNeonBranch = createServerOnlyFn(
	() => getServerEnv().NEON_BRANCH,
);
export const getNeonAuthBaseUrl = createServerOnlyFn(
	() => getServerEnv().NEON_AUTH_BASE_URL,
);
export const getNeonAuthJwksUrl = createServerOnlyFn(
	() => getServerEnv().NEON_AUTH_JWKS_URL,
);
