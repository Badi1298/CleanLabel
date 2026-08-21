import { drizzle } from "drizzle-orm/node-postgres";
import { getDatabaseUrl } from "#/utils/safe-envs";
import * as appSchema from "./app-schema";
import * as authSchema from "./auth-schema";

export const db = drizzle(getDatabaseUrl(), {
	schema: { ...authSchema, ...appSchema },
});
