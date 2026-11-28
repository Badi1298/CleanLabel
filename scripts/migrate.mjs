import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsFolder = resolve(projectRoot, "drizzle");
const envLocalPath = resolve(projectRoot, ".env.local");

if (existsSync(envLocalPath)) {
	const { config } = await import("dotenv");
	config({ path: envLocalPath, quiet: true });
}

const connectionString =
	process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
	console.error(
		"Missing DATABASE_URL_UNPOOLED or DATABASE_URL environment variable.",
	);
	process.exit(1);
}

let target = "database";
let isPooler = false;

try {
	const parsedUrl = new URL(connectionString);
	target = `${parsedUrl.host}${parsedUrl.pathname}`;
	isPooler = parsedUrl.host.includes("-pooler");
} catch {
	// Keep generic target label if URL parsing fails so credentials are never logged.
}

if (isPooler) {
	console.warn(
		"Warning: migration connection string uses a pooled (-pooler) host; Neon migrations should use the direct DATABASE_URL_UNPOOLED connection string.",
	);
}

const pool = new pg.Pool({ connectionString, max: 1 });
const db = drizzle(pool);

try {
	console.log(`Applying Drizzle migrations to ${target}...`);
	await migrate(db, { migrationsFolder });
	console.log("Migrations applied successfully.");
} catch (err) {
	console.error("Migration failed:", err);
	process.exitCode = 1;
} finally {
	await pool.end();
}
