import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { ingredients, userExcludedIngredients } from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

export const getUserExcludedIngredients = createServerFn({
	method: "GET",
}).handler(async () => {
	const session = await ensureSession();

	const excluded = await db
		.select({
			id: ingredients.id,
			name: ingredients.name,
		})
		.from(userExcludedIngredients)
		.innerJoin(
			ingredients,
			eq(userExcludedIngredients.ingredientId, ingredients.id),
		)
		.where(eq(userExcludedIngredients.userId, session.user.id));

	return excluded;
});

const toggleExcludedIngredientSchema = z.object({
	ingredientId: z.string(),
});

export const toggleExcludedIngredient = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof toggleExcludedIngredientSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		const existing = await db.query.userExcludedIngredients.findFirst({
			where: and(
				eq(userExcludedIngredients.userId, session.user.id),
				eq(userExcludedIngredients.ingredientId, data.ingredientId),
			),
		});

		if (existing) {
			await db
				.delete(userExcludedIngredients)
				.where(
					and(
						eq(userExcludedIngredients.userId, session.user.id),
						eq(userExcludedIngredients.ingredientId, data.ingredientId),
					),
				);
			return { status: "removed" };
		} else {
			await db.insert(userExcludedIngredients).values({
				userId: session.user.id,
				ingredientId: data.ingredientId,
			});
			return { status: "added" };
		}
	});
