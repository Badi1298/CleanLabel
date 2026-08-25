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
export const getR2AccountId = createServerOnlyFn(
	() => getServerEnv().R2_ACCOUNT_ID,
);
export const getR2AccessKeyId = createServerOnlyFn(
	() => getServerEnv().R2_ACCESS_KEY_ID,
);
export const getR2SecretAccessKey = createServerOnlyFn(
	() => getServerEnv().R2_SECRET_ACCESS_KEY,
);
export const getR2BucketName = createServerOnlyFn(
	() => getServerEnv().R2_BUCKET_NAME,
);
export const getR2PublicDomain = createServerOnlyFn(
	() => getServerEnv().R2_PUBLIC_DOMAIN,
);
