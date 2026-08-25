import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "#/db";
import { stores } from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

export const getStores = createServerFn({
	method: "GET",
}).handler(async () => {
	return await db.select().from(stores).orderBy(stores.name);
});

const addStoreSchema = z.object({
	name: z.string().min(1, "Name is required"),
	logoUrl: z.string().optional(),
});

export const addStore = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addStoreSchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [newStore] = await db
			.insert(stores)
			.values({
				name: data.name,
				logoUrl: data.logoUrl || undefined,
			})
			.returning();

		return newStore;
	});
