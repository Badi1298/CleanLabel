import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "#/db";
import { categories } from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

export const getCategories = createServerFn({
	method: "GET",
}).handler(async () => {
	return await db.select().from(categories).orderBy(categories.name);
});

const addCategorySchema = z.object({
	name: z.string().min(1, "Name is required"),
	iconUrl: z.string().optional(),
});

export const addCategory = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof addCategorySchema>) => data)
	.handler(async ({ data }) => {
		await ensureSession();

		const [newCategory] = await db
			.insert(categories)
			.values({
				name: data.name,
				iconUrl: data.iconUrl || undefined,
			})
			.returning();

		return newCategory;
	});
