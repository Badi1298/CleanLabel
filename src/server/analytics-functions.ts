import { createServerFn } from "@tanstack/react-start";
import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	categories,
	productStoreSubmissions,
	products,
	stores,
	userAppInstalls,
	userDailyActivity,
	userExcludedIngredients,
	userFavoriteProducts,
} from "#/db/app-schema";
import { user } from "#/db/auth-schema";
import { ensureSession } from "./auth-functions";

const ANALYTICS_TIMEZONE = "Europe/Bucharest";

const recordClientPresenceSchema = z.object({
	isStandalone: z.boolean(),
	isInstalled: z.boolean().default(false),
	platform: z.enum(["ios", "android", "desktop"]),
});

export const recordClientPresence = createServerFn({
	method: "POST",
})
	.validator((data: z.infer<typeof recordClientPresenceSchema>) =>
		recordClientPresenceSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		if (session.user.role !== "client") {
			return { recorded: false };
		}

		const activityDateExpr = sql`(NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date`;

		await db
			.insert(userDailyActivity)
			.values({
				userId: session.user.id,
				activityDate: activityDateExpr,
				usedStandalone: data.isStandalone,
			})
			.onConflictDoUpdate({
				target: [userDailyActivity.userId, userDailyActivity.activityDate],
				set: {
					usedStandalone: true,
					updatedAt: sql`NOW()`,
				},
				setWhere: sql`${userDailyActivity.usedStandalone} = false AND EXCLUDED.used_standalone = true`,
			});

		if (data.isStandalone || data.isInstalled) {
			if (data.isStandalone) {
				await db
					.insert(userAppInstalls)
					.values({
						userId: session.user.id,
						platform: data.platform,
						lastStandaloneAt: sql`NOW()`,
					})
					.onConflictDoUpdate({
						target: userAppInstalls.userId,
						set: {
							lastStandaloneAt: sql`NOW()`,
							updatedAt: sql`NOW()`,
						},
					});
			} else {
				await db
					.insert(userAppInstalls)
					.values({
						userId: session.user.id,
						platform: data.platform,
						lastStandaloneAt: null,
					})
					.onConflictDoNothing({
						target: userAppInstalls.userId,
					});
			}
		}

		return { recorded: true };
	});

export type DailyTrendPoint = {
	date: string;
	signups: number;
	activeUsers: number;
	standaloneActiveUsers: number;
	newInstalls: number;
};

export type AdminDashboardStats = {
	asOfDate: string;
	timezone: string;
	registeredUsers: {
		total: number;
		newLast7d: number;
		newLast30d: number;
		onboardedCount: number;
	};
	activeUsers: {
		dauToday: number;
		dauYesterday: number;
		wau7d: number;
		mau30d: number;
		activeStandalone30d: number;
	};
	appInstalls: {
		total: number;
		newLast7d: number;
		newLast30d: number;
		byPlatform: {
			ios: number;
			android: number;
			desktop: number;
		};
	};
	dailySeries: DailyTrendPoint[];
	catalogSnapshot: {
		approvedProductsTotal: number;
		approvedByScore: {
			gold: number;
			silver: number;
			bronze: number;
			none: number;
		};
		pendingReviewProducts: number;
		storesTotal: number;
		categoriesTotal: number;
		pendingStoreSubmissions: number;
		usersWithFavorites: number;
		usersWithExcludedIngredients: number;
	};
};

export const getAdminDashboardStats = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminDashboardStats> => {
	const session = await ensureSession();
	if (session.user.role !== "admin") {
		throw new Error("Unauthorized");
	}

	const [
		metaResult,
		userStatsResult,
		activeStatsResult,
		installStatsResult,
		dailySeriesResult,
		productScoreRows,
		productStatusRows,
		storesCountRows,
		categoriesCountRows,
		pendingSubmissionsRows,
		favoritesUsersResult,
		excludedUsersResult,
	] = await Promise.all([
		db.execute(sql<{ as_of_date: string }>`
			SELECT TO_CHAR((NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date, 'YYYY-MM-DD') AS as_of_date
		`),
		db.execute(sql<{
			total: string;
			new_last_7d: string;
			new_last_30d: string;
			onboarded_count: string;
		}>`
			WITH bounds AS (
				SELECT (NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS today
			)
			SELECT
				COUNT(*) AS total,
				COUNT(*) FILTER (
					WHERE (${user.createdAt} AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 6 FROM bounds)
				) AS new_last_7d,
				COUNT(*) FILTER (
					WHERE (${user.createdAt} AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 29 FROM bounds)
				) AS new_last_30d,
				COUNT(*) FILTER (WHERE ${user.hasCompletedOnboarding} = true) AS onboarded_count
			FROM ${user}
			WHERE ${user.role} = 'client'
		`),
		db.execute(sql<{
			dau_today: string;
			dau_yesterday: string;
			wau_7d: string;
			mau_30d: string;
			active_standalone_30d: string;
		}>`
			WITH bounds AS (
				SELECT (NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS today
			)
			SELECT
				COUNT(DISTINCT a.user_id) FILTER (WHERE a.activity_date = (SELECT today FROM bounds)) AS dau_today,
				COUNT(DISTINCT a.user_id) FILTER (WHERE a.activity_date = (SELECT today - 1 FROM bounds)) AS dau_yesterday,
				COUNT(DISTINCT a.user_id) FILTER (WHERE a.activity_date >= (SELECT today - 6 FROM bounds)) AS wau_7d,
				COUNT(DISTINCT a.user_id) FILTER (WHERE a.activity_date >= (SELECT today - 29 FROM bounds)) AS mau_30d,
				COUNT(DISTINCT a.user_id) FILTER (
					WHERE a.activity_date >= (SELECT today - 29 FROM bounds) AND a.used_standalone = true
				) AS active_standalone_30d
			FROM ${userDailyActivity} a
			INNER JOIN ${user} u ON u.id = a.user_id
			WHERE u.role = 'client'
				AND a.activity_date >= (SELECT today - 29 FROM bounds)
		`),
		db.execute(sql<{
			total: string;
			new_last_7d: string;
			new_last_30d: string;
			ios: string;
			android: string;
			desktop: string;
		}>`
			WITH bounds AS (
				SELECT (NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS today
			)
			SELECT
				COUNT(*) AS total,
				COUNT(*) FILTER (
					WHERE (i.first_installed_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 6 FROM bounds)
				) AS new_last_7d,
				COUNT(*) FILTER (
					WHERE (i.first_installed_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 29 FROM bounds)
				) AS new_last_30d,
				COUNT(*) FILTER (WHERE i.platform = 'ios') AS ios,
				COUNT(*) FILTER (WHERE i.platform = 'android') AS android,
				COUNT(*) FILTER (WHERE i.platform = 'desktop') AS desktop
			FROM ${userAppInstalls} i
			INNER JOIN ${user} u ON u.id = i.user_id
			WHERE u.role = 'client'
		`),
		db.execute(sql<{
			day: string;
			signups: string;
			active_users: string;
			standalone_active_users: string;
			new_installs: string;
		}>`
			WITH bounds AS (
				SELECT (NOW() AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS today
			),
			days AS (
				SELECT generate_series(
					(SELECT today - 29 FROM bounds),
					(SELECT today FROM bounds),
					interval '1 day'
				)::date AS day
			),
			signups_by_day AS (
				SELECT
					(u.created_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS day,
					COUNT(*) AS cnt
				FROM ${user} u
				WHERE u.role = 'client'
					AND (u.created_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 29 FROM bounds)
				GROUP BY 1
			),
			activity_by_day AS (
				SELECT
					a.activity_date AS day,
					COUNT(DISTINCT a.user_id) AS active_cnt,
					COUNT(DISTINCT a.user_id) FILTER (WHERE a.used_standalone = true) AS standalone_cnt
				FROM ${userDailyActivity} a
				INNER JOIN ${user} u ON u.id = a.user_id
				WHERE u.role = 'client'
					AND a.activity_date >= (SELECT today - 29 FROM bounds)
				GROUP BY 1
			),
			installs_by_day AS (
				SELECT
					(i.first_installed_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date AS day,
					COUNT(*) AS cnt
				FROM ${userAppInstalls} i
				INNER JOIN ${user} u ON u.id = i.user_id
				WHERE u.role = 'client'
					AND (i.first_installed_at AT TIME ZONE ${ANALYTICS_TIMEZONE})::date >= (SELECT today - 29 FROM bounds)
				GROUP BY 1
			)
			SELECT
				TO_CHAR(d.day, 'YYYY-MM-DD') AS day,
				COALESCE(s.cnt, 0) AS signups,
				COALESCE(a.active_cnt, 0) AS active_users,
				COALESCE(a.standalone_cnt, 0) AS standalone_active_users,
				COALESCE(i.cnt, 0) AS new_installs
			FROM days d
			LEFT JOIN signups_by_day s ON s.day = d.day
			LEFT JOIN activity_by_day a ON a.day = d.day
			LEFT JOIN installs_by_day i ON i.day = d.day
			ORDER BY d.day ASC
		`),
		db
			.select({
				score: products.score,
				count: count(),
			})
			.from(products)
			.where(eq(products.status, "approved"))
			.groupBy(products.score),
		db
			.select({
				status: products.status,
				count: count(),
			})
			.from(products)
			.groupBy(products.status),
		db.select({ value: count() }).from(stores),
		db.select({ value: count() }).from(categories),
		db
			.select({ value: count() })
			.from(productStoreSubmissions)
			.where(eq(productStoreSubmissions.status, "pending_review")),
		db.execute(sql<{ cnt: string }>`
			SELECT COUNT(DISTINCT f.user_id) AS cnt
			FROM ${userFavoriteProducts} f
			INNER JOIN ${user} u ON u.id = f.user_id
			WHERE u.role = 'client'
		`),
		db.execute(sql<{ cnt: string }>`
			SELECT COUNT(DISTINCT e.user_id) AS cnt
			FROM ${userExcludedIngredients} e
			INNER JOIN ${user} u ON u.id = e.user_id
			WHERE u.role = 'client'
		`),
	]);

	const asOfDate =
		(metaResult.rows[0] as { as_of_date?: string } | undefined)?.as_of_date ??
		"";

	const userRow = (userStatsResult.rows[0] ?? {}) as Record<string, unknown>;
	const activeRow = (activeStatsResult.rows[0] ?? {}) as Record<
		string,
		unknown
	>;
	const installRow = (installStatsResult.rows[0] ?? {}) as Record<
		string,
		unknown
	>;

	const approvedByScore = {
		gold: 0,
		silver: 0,
		bronze: 0,
		none: 0,
	};
	for (const row of productScoreRows) {
		approvedByScore[row.score] = Number(row.count ?? 0);
	}

	let approvedProductsTotal = 0;
	let pendingReviewProducts = 0;
	for (const row of productStatusRows) {
		if (row.status === "approved") {
			approvedProductsTotal = Number(row.count ?? 0);
		} else if (row.status === "pending_review") {
			pendingReviewProducts = Number(row.count ?? 0);
		}
	}

	const dailySeries: DailyTrendPoint[] = dailySeriesResult.rows.map((row) => {
		const r = row as Record<string, unknown>;
		return {
			date: String(r.day ?? ""),
			signups: Number(r.signups ?? 0),
			activeUsers: Number(r.active_users ?? 0),
			standaloneActiveUsers: Number(r.standalone_active_users ?? 0),
			newInstalls: Number(r.new_installs ?? 0),
		};
	});

	return {
		asOfDate,
		timezone: ANALYTICS_TIMEZONE,
		registeredUsers: {
			total: Number(userRow.total ?? 0),
			newLast7d: Number(userRow.new_last_7d ?? 0),
			newLast30d: Number(userRow.new_last_30d ?? 0),
			onboardedCount: Number(userRow.onboarded_count ?? 0),
		},
		activeUsers: {
			dauToday: Number(activeRow.dau_today ?? 0),
			dauYesterday: Number(activeRow.dau_yesterday ?? 0),
			wau7d: Number(activeRow.wau_7d ?? 0),
			mau30d: Number(activeRow.mau_30d ?? 0),
			activeStandalone30d: Number(activeRow.active_standalone_30d ?? 0),
		},
		appInstalls: {
			total: Number(installRow.total ?? 0),
			newLast7d: Number(installRow.new_last_7d ?? 0),
			newLast30d: Number(installRow.new_last_30d ?? 0),
			byPlatform: {
				ios: Number(installRow.ios ?? 0),
				android: Number(installRow.android ?? 0),
				desktop: Number(installRow.desktop ?? 0),
			},
		},
		dailySeries,
		catalogSnapshot: {
			approvedProductsTotal,
			approvedByScore,
			pendingReviewProducts,
			storesTotal: Number(storesCountRows[0]?.value ?? 0),
			categoriesTotal: Number(categoriesCountRows[0]?.value ?? 0),
			pendingStoreSubmissions: Number(pendingSubmissionsRows[0]?.value ?? 0),
			usersWithFavorites: Number(
				(favoritesUsersResult.rows[0] as { cnt?: unknown } | undefined)?.cnt ??
					0,
			),
			usersWithExcludedIngredients: Number(
				(excludedUsersResult.rows[0] as { cnt?: unknown } | undefined)?.cnt ??
					0,
			),
		},
	};
});
