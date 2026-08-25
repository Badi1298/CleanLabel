import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generatePresignedUploadUrl } from "#/utils/r2.server";
import { ensureSession } from "./auth-functions";

const getUploadUrlsSchema = z.object({
	fileType: z.string(),
	type: z.enum(["front", "back"]),
});

export const getProductUploadUrls = createServerFn({ method: "POST" })
	.validator((data: z.infer<typeof getUploadUrlsSchema>) => data)
	.handler(async ({ data }) => {
		// Ensure the user is authenticated before giving an upload URL
		await ensureSession();

		const fileExtension = data.fileType.split("/")[1] || "jpeg";
		const uniqueKey = `products/${crypto.randomUUID()}-${data.type}.${fileExtension}`;

		return await generatePresignedUploadUrl(uniqueKey, data.fileType);
	});
