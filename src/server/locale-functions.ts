import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { user } from "#/db/auth-schema";
import { ensureSession } from "./auth-functions";

const updatePreferredLocaleSchema = z.object({
	locale: z.enum(["ro", "en"]),
});

export const updatePreferredLocale = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof updatePreferredLocaleSchema>) =>
		updatePreferredLocaleSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		await db
			.update(user)
			.set({ preferredLocale: data.locale })
			.where(eq(user.id, session.user.id));

		return { locale: data.locale };
	});
