import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	productStoreSubmissions,
	productStores,
	products,
	stores,
} from "#/db/app-schema";
import { ensureSession } from "./auth-functions";

const submitProductStoreSchema = z
	.object({
		productId: z.string().min(1, "Product ID is required"),
		storeId: z.string().optional(),
		otherStoreName: z.string().optional(),
		proofImageUrl: z.string().min(1, "Proof photo is required"),
	})
	.refine(
		(data) => (data.storeId && data.storeId.trim().length > 0) || (data.otherStoreName && data.otherStoreName.trim().length > 0),
		{
			message: "Please choose a store or enter the store name",
			path: ["storeId"],
		},
	);

export const submitProductStore = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof submitProductStoreSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		// Verify product exists
		const product = await db.query.products.findFirst({
			where: eq(products.id, data.productId),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		// Insert store submission
		const [submission] = await db
			.insert(productStoreSubmissions)
			.values({
				productId: data.productId,
				storeId: data.storeId || null,
				otherStoreName: data.otherStoreName?.trim() || null,
				proofImageUrl: data.proofImageUrl,
				submittedById: session.user.id,
				status: "pending_review",
			})
			.returning();

		return submission;
	});

const getStoreSubmissionsSchema = z.object({
	status: z.enum(["pending_review", "approved", "rejected", "all"]).default("pending_review"),
});

export const getStoreSubmissions = createServerFn({
	method: "GET",
})
	.validator((data: z.infer<typeof getStoreSubmissionsSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		if (session.user.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const whereCondition =
			data.status === "all"
				? undefined
				: eq(productStoreSubmissions.status, data.status);

		const submissions = await db.query.productStoreSubmissions.findMany({
			where: whereCondition,
			orderBy: [desc(productStoreSubmissions.createdAt)],
			with: {
				product: true,
				store: true,
				submittedBy: true,
				reviewedBy: true,
			},
		});

		return submissions;
	});

export const getPendingStoreSubmissionsCount = createServerFn({
	method: "GET",
}).handler(async () => {
	const session = await ensureSession();
	if (session.user.role !== "admin") {
		return { count: 0 };
	}

	const [result] = await db
		.select({ value: count() })
		.from(productStoreSubmissions)
		.where(eq(productStoreSubmissions.status, "pending_review"));

	return { count: result?.value ?? 0 };
});

const approveStoreSubmissionSchema = z.object({
	submissionId: z.string(),
	storeId: z.string().optional(),
	newStoreName: z.string().optional(),
});

export const approveStoreSubmission = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof approveStoreSubmissionSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		if (session.user.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const submission = await db.query.productStoreSubmissions.findFirst({
			where: eq(productStoreSubmissions.id, data.submissionId),
		});

		if (!submission) {
			throw new Error("Submission not found");
		}

		let assignedStoreId = data.storeId || submission.storeId;

		// If a new store name is given (or submission was "Other" and admin confirmed creating it)
		if (!assignedStoreId && (data.newStoreName || submission.otherStoreName)) {
			const storeName = data.newStoreName || submission.otherStoreName;
			const [newStore] = await db
				.insert(stores)
				.values({
					name: storeName!.trim(),
				})
				.returning();
			assignedStoreId = newStore.id;
		}

		if (!assignedStoreId) {
			throw new Error("A valid store must be selected or created");
		}

		// Link product to store (if not already linked)
		await db
			.insert(productStores)
			.values({
				productId: submission.productId,
				storeId: assignedStoreId,
			})
			.onConflictDoNothing();

		// Update submission status
		await db
			.update(productStoreSubmissions)
			.set({
				status: "approved",
				storeId: assignedStoreId,
				reviewedAt: new Date(),
				reviewedById: session.user.id,
			})
			.where(eq(productStoreSubmissions.id, data.submissionId));

		return { success: true };
	});

const rejectStoreSubmissionSchema = z.object({
	submissionId: z.string(),
});

export const rejectStoreSubmission = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof rejectStoreSubmissionSchema>) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		if (session.user.role !== "admin") {
			throw new Error("Unauthorized");
		}

		await db
			.update(productStoreSubmissions)
			.set({
				status: "rejected",
				reviewedAt: new Date(),
				reviewedById: session.user.id,
			})
			.where(eq(productStoreSubmissions.id, data.submissionId));

		return { success: true };
	});
