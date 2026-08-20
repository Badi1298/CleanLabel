import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema.ts";

export const createDbClient = async () => {
	// Access Cloudflare Hyperdrive binding if available, otherwise fallback to DATABASE_URL
	const hyperdrive = (process.env as any).HYPERDRIVE;
	
	// If hyperdrive is a string (some environments stringify bindings), parse it, otherwise use it directly
	const hyperdriveObj = typeof hyperdrive === "string" ? JSON.parse(hyperdrive) : hyperdrive;
	const connectionString = hyperdriveObj?.connectionString || process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL or HYPERDRIVE connection string is not defined");
	}

	const client = new Client({ connectionString });
	await client.connect();
	const db = drizzle(client, { schema });

	return {
		db,
		client,
		cleanup: async () => {
			await client.end();
		},
	};
};
