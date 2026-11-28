import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	Download,
	FolderTree,
	Heart,
	Package,
	RefreshCw,
	SlidersHorizontal,
	Store,
	Users,
} from "lucide-react";
import { useId } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "#/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart";
import {
	formatCalendarDateLabel,
	formatCalendarDateLong,
} from "#/lib/analytics-client";
import { cn } from "#/lib/utils";
import { adminDashboardStatsQueryOptions } from "#/queries/analytics-queries";

export const Route = createFileRoute("/_protected/admin/")({
	head: () => ({
		meta: [{ title: "Dashboard | PickItWell Admin" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(adminDashboardStatsQueryOptions());
	},
	component: AdminDashboardPage,
});

const activeUsersChartConfig = {
	activeUsers: {
		label: "Active Users",
		color: "var(--chart-2)",
	},
	standaloneActiveUsers: {
		label: "Standalone PWA Active",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

const acquisitionChartConfig = {
	signups: {
		label: "New Registered Users",
		color: "var(--chart-2)",
	},
	newInstalls: {
		label: "New App Installs",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

const cardShellClassName =
	"flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm";

function formatPercent(part: number, total: number): string {
	if (total <= 0) {
		return "0%";
	}
	return `${Math.round((part / total) * 100)}%`;
}

function AdminDashboardPage() {
	const { data, isFetching, refetch } = useQuery(
		adminDashboardStatsQueryOptions(),
	);
	const chartGradientBaseId = useId().replace(/:/g, "");

	if (!data) {
		return (
			<div className="p-6 text-sm text-muted-foreground">
				Loading dashboard metrics...
			</div>
		);
	}

	const { registeredUsers, activeUsers, appInstalls, dailySeries } = data;
	const { catalogSnapshot } = data;

	const activePeak = dailySeries.reduce(
		(max, point) => Math.max(max, point.activeUsers),
		0,
	);
	const totalSignups30d = dailySeries.reduce(
		(sum, point) => sum + point.signups,
		0,
	);
	const totalInstalls30d = dailySeries.reduce(
		(sum, point) => sum + point.newInstalls,
		0,
	);

	const activeGradientId = `${chartGradientBaseId}-active`;
	const standaloneGradientId = `${chartGradientBaseId}-standalone`;

	return (
		<div className="@container mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Founder KPI snapshot as of {formatCalendarDateLong(data.asOfDate)} (
						{data.timezone}) &middot; Admin accounts excluded
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => refetch()}
					disabled={isFetching}
					className="self-start sm:self-auto"
				>
					<RefreshCw
						aria-hidden="true"
						className={cn("size-4", isFetching && "animate-spin")}
					/>
					{isFetching ? "Refreshing..." : "Refresh"}
				</Button>
			</header>

			<section aria-labelledby="growth-heading" className="flex flex-col gap-5">
				<div className="flex items-baseline justify-between gap-2">
					<h2 id="growth-heading" className="text-lg font-semibold">
						Growth &amp; Usage
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Registered Users
								</h3>
								<Users
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
							<CardDescription className="sr-only">
								Total client accounts excluding admins
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<p className="text-3xl font-bold tracking-tight tabular-nums">
								{registeredUsers.total.toLocaleString()}
							</p>
							<dl className="grid grid-cols-3 gap-2 border-t pt-3 text-xs">
								<div>
									<dt className="text-muted-foreground">Last 7d</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										+{registeredUsers.newLast7d.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Last 30d</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										+{registeredUsers.newLast30d.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Onboarded</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{formatPercent(
											registeredUsers.onboardedCount,
											registeredUsers.total,
										)}
									</dd>
								</div>
							</dl>
						</CardContent>
						<CardFooter className="mt-auto text-xs text-muted-foreground tabular-nums">
							{registeredUsers.onboardedCount.toLocaleString()} of{" "}
							{registeredUsers.total.toLocaleString()} completed onboarding
						</CardFooter>
					</article>

					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Active Users
								</h3>
								<Activity
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
							<CardDescription className="sr-only">
								Daily, weekly, and monthly active registered users
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-baseline gap-2">
								<p className="text-3xl font-bold tracking-tight tabular-nums">
									{activeUsers.dauToday.toLocaleString()}
								</p>
								<span className="text-xs font-medium text-muted-foreground">
									DAU today (yesterday:{" "}
									<span className="tabular-nums">
										{activeUsers.dauYesterday.toLocaleString()}
									</span>
									)
								</span>
							</div>
							<dl className="grid grid-cols-3 gap-2 border-t pt-3 text-xs">
								<div>
									<dt className="text-muted-foreground">WAU (7d)</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{activeUsers.wau7d.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">MAU (30d)</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{activeUsers.mau30d.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">PWA Share (30d)</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{formatPercent(
											activeUsers.activeStandalone30d,
											activeUsers.mau30d,
										)}
									</dd>
								</div>
							</dl>
						</CardContent>
						<CardFooter className="mt-auto text-xs text-muted-foreground tabular-nums">
							{activeUsers.activeStandalone30d.toLocaleString()} MAU opened the
							installed PWA
						</CardFooter>
					</article>

					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									App Installs
								</h3>
								<Download
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
							<CardDescription className="sr-only">
								Distinct registered users who installed the standalone PWA
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-baseline gap-2">
								<p className="text-3xl font-bold tracking-tight tabular-nums">
									{appInstalls.total.toLocaleString()}
								</p>
								<span className="text-xs font-medium text-muted-foreground tabular-nums">
									{formatPercent(appInstalls.total, registeredUsers.total)} of
									users (+{appInstalls.newLast30d.toLocaleString()} in 30d)
								</span>
							</div>
							<dl className="grid grid-cols-3 gap-2 border-t pt-3 text-xs">
								<div>
									<dt className="text-muted-foreground">iOS</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{appInstalls.byPlatform.ios.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Android</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{appInstalls.byPlatform.android.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Desktop</dt>
									<dd className="mt-0.5 font-semibold tabular-nums">
										{appInstalls.byPlatform.desktop.toLocaleString()}
									</dd>
								</div>
							</dl>
						</CardContent>
						<CardFooter className="mt-auto text-xs text-muted-foreground">
							Verified on standalone launch or Chromium install
						</CardFooter>
					</article>
				</div>

				<div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
					<article className={cardShellClassName}>
						<CardHeader>
							<h3 className="text-base font-semibold leading-none">
								Daily Active Users (Last 30 Days)
							</h3>
							<CardDescription>
								All active client sessions vs. standalone PWA launches
							</CardDescription>
						</CardHeader>
						<CardContent>
							<figure className="flex flex-col gap-3">
								<ChartContainer
									config={activeUsersChartConfig}
									className="h-64 w-full"
								>
									<AreaChart
										data={dailySeries}
										margin={{ left: 4, right: 8, top: 8 }}
									>
										<defs>
											<linearGradient
												id={activeGradientId}
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="var(--color-activeUsers)"
													stopOpacity={0.35}
												/>
												<stop
													offset="95%"
													stopColor="var(--color-activeUsers)"
													stopOpacity={0.04}
												/>
											</linearGradient>
											<linearGradient
												id={standaloneGradientId}
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="var(--color-standaloneActiveUsers)"
													stopOpacity={0.35}
												/>
												<stop
													offset="95%"
													stopColor="var(--color-standaloneActiveUsers)"
													stopOpacity={0.04}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="date"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											minTickGap={24}
											tickFormatter={formatCalendarDateLabel}
										/>
										<YAxis
											allowDecimals={false}
											tickLine={false}
											axisLine={false}
											width={32}
										/>
										<ChartTooltip
											content={
												<ChartTooltipContent
													labelFormatter={(_value, payload) => {
														const isoDate = payload?.[0]?.payload?.date;
														return typeof isoDate === "string"
															? formatCalendarDateLong(isoDate)
															: "";
													}}
												/>
											}
										/>
										<ChartLegend content={<ChartLegendContent />} />
										<Area
											type="monotone"
											dataKey="activeUsers"
											stroke="var(--color-activeUsers)"
											fill={`url(#${activeGradientId})`}
											strokeWidth={2}
										/>
										<Area
											type="monotone"
											dataKey="standaloneActiveUsers"
											stroke="var(--color-standaloneActiveUsers)"
											fill={`url(#${standaloneGradientId})`}
											strokeWidth={2}
										/>
									</AreaChart>
								</ChartContainer>
								<figcaption className="text-xs text-muted-foreground tabular-nums">
									30-day peak: {activePeak.toLocaleString()} daily active users;{" "}
									{activeUsers.mau30d.toLocaleString()} unique active users
									overall.
								</figcaption>
								<details className="rounded-md border px-3 py-2 text-xs">
									<summary className="cursor-pointer font-medium text-foreground select-none">
										View 30-day data table
									</summary>
									<div className="mt-2 max-h-56 overflow-auto">
										<table className="w-full border-collapse text-left tabular-nums">
											<caption className="sr-only">
												Daily active users and standalone PWA active users over
												the last 30 days
											</caption>
											<thead>
												<tr className="border-b text-muted-foreground">
													<th scope="col" className="py-1.5 pr-3 font-medium">
														Date
													</th>
													<th scope="col" className="py-1.5 pr-3 font-medium">
														Active Users
													</th>
													<th scope="col" className="py-1.5 font-medium">
														Standalone PWA Active
													</th>
												</tr>
											</thead>
											<tbody>
												{dailySeries.map((point) => (
													<tr
														key={point.date}
														className="border-b last:border-b-0"
													>
														<th
															scope="row"
															className="py-1 pr-3 font-normal text-muted-foreground"
														>
															{formatCalendarDateLong(point.date)}
														</th>
														<td className="py-1 pr-3">
															{point.activeUsers.toLocaleString()}
														</td>
														<td className="py-1">
															{point.standaloneActiveUsers.toLocaleString()}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</details>
							</figure>
						</CardContent>
					</article>

					<article className={cardShellClassName}>
						<CardHeader>
							<h3 className="text-base font-semibold leading-none">
								New Signups &amp; App Installs (Last 30 Days)
							</h3>
							<CardDescription>
								Daily new registered users and first-time PWA installs
							</CardDescription>
						</CardHeader>
						<CardContent>
							<figure className="flex flex-col gap-3">
								<ChartContainer
									config={acquisitionChartConfig}
									className="h-64 w-full"
								>
									<BarChart
										data={dailySeries}
										margin={{ left: 4, right: 8, top: 8 }}
									>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="date"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											minTickGap={24}
											tickFormatter={formatCalendarDateLabel}
										/>
										<YAxis
											allowDecimals={false}
											tickLine={false}
											axisLine={false}
											width={32}
										/>
										<ChartTooltip
											content={
												<ChartTooltipContent
													labelFormatter={(_value, payload) => {
														const isoDate = payload?.[0]?.payload?.date;
														return typeof isoDate === "string"
															? formatCalendarDateLong(isoDate)
															: "";
													}}
												/>
											}
										/>
										<ChartLegend content={<ChartLegendContent />} />
										<Bar
											dataKey="signups"
											fill="var(--color-signups)"
											radius={[4, 4, 0, 0]}
										/>
										<Bar
											dataKey="newInstalls"
											fill="var(--color-newInstalls)"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ChartContainer>
								<figcaption className="text-xs text-muted-foreground tabular-nums">
									30-day totals: {totalSignups30d.toLocaleString()} new
									registered users and {totalInstalls30d.toLocaleString()} new
									app installs.
								</figcaption>
								<details className="rounded-md border px-3 py-2 text-xs">
									<summary className="cursor-pointer font-medium text-foreground select-none">
										View 30-day data table
									</summary>
									<div className="mt-2 max-h-56 overflow-auto">
										<table className="w-full border-collapse text-left tabular-nums">
											<caption className="sr-only">
												Daily new registered users and new app installs over the
												last 30 days
											</caption>
											<thead>
												<tr className="border-b text-muted-foreground">
													<th scope="col" className="py-1.5 pr-3 font-medium">
														Date
													</th>
													<th scope="col" className="py-1.5 pr-3 font-medium">
														New Registered Users
													</th>
													<th scope="col" className="py-1.5 font-medium">
														New App Installs
													</th>
												</tr>
											</thead>
											<tbody>
												{dailySeries.map((point) => (
													<tr
														key={point.date}
														className="border-b last:border-b-0"
													>
														<th
															scope="row"
															className="py-1 pr-3 font-normal text-muted-foreground"
														>
															{formatCalendarDateLong(point.date)}
														</th>
														<td className="py-1 pr-3">
															{point.signups.toLocaleString()}
														</td>
														<td className="py-1">
															{point.newInstalls.toLocaleString()}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</details>
							</figure>
						</CardContent>
					</article>
				</div>
			</section>

			<section
				aria-labelledby="catalog-heading"
				className="flex flex-col gap-5"
			>
				<h2 id="catalog-heading" className="text-lg font-semibold">
					Catalog &amp; Community Snapshot
				</h2>

				<div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @4xl:grid-cols-4">
					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Approved Products
								</h3>
								<Package
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<p className="text-3xl font-bold tracking-tight tabular-nums">
								{catalogSnapshot.approvedProductsTotal.toLocaleString()}
							</p>
							<div className="flex flex-wrap gap-1.5 tabular-nums">
								<Badge variant="secondary">
									Gold {catalogSnapshot.approvedByScore.gold.toLocaleString()}
								</Badge>
								<Badge variant="secondary">
									Silver{" "}
									{catalogSnapshot.approvedByScore.silver.toLocaleString()}
								</Badge>
								<Badge variant="secondary">
									Bronze{" "}
									{catalogSnapshot.approvedByScore.bronze.toLocaleString()}
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground tabular-nums">
								{catalogSnapshot.pendingReviewProducts.toLocaleString()} pending
								review
							</p>
						</CardContent>
						<CardFooter className="mt-auto">
							<Link
								to="/admin/all-products"
								className="text-xs font-medium text-primary underline-offset-4 hover:underline"
							>
								Manage products
							</Link>
						</CardFooter>
					</article>

					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Pending Store Submissions
								</h3>
								<Store
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-center gap-2">
								<p className="text-3xl font-bold tracking-tight tabular-nums">
									{catalogSnapshot.pendingStoreSubmissions.toLocaleString()}
								</p>
								{catalogSnapshot.pendingStoreSubmissions > 0 && (
									<Badge className="bg-amber-500 text-white hover:bg-amber-500">
										Needs review
									</Badge>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								User-submitted store availability proof awaiting moderation
							</p>
						</CardContent>
						<CardFooter className="mt-auto">
							<Link
								to="/admin/store-submissions"
								className="text-xs font-medium text-primary underline-offset-4 hover:underline"
							>
								Review submissions
							</Link>
						</CardFooter>
					</article>

					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Catalog Coverage
								</h3>
								<FolderTree
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<dl className="grid grid-cols-2 gap-3">
								<div>
									<dt className="text-xs text-muted-foreground">Stores</dt>
									<dd className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
										{catalogSnapshot.storesTotal.toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-xs text-muted-foreground">Categories</dt>
									<dd className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
										{catalogSnapshot.categoriesTotal.toLocaleString()}
									</dd>
								</div>
							</dl>
							<p className="text-xs text-muted-foreground">
								Active retail chains and taxonomy nodes
							</p>
						</CardContent>
						<CardFooter className="mt-auto flex gap-4">
							<Link
								to="/admin/all-stores"
								className="text-xs font-medium text-primary underline-offset-4 hover:underline"
							>
								All stores
							</Link>
							<Link
								to="/admin/all-categories"
								className="text-xs font-medium text-primary underline-offset-4 hover:underline"
							>
								All categories
							</Link>
						</CardFooter>
					</article>

					<article className={cardShellClassName}>
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between gap-2">
								<h3 className="text-sm font-medium text-muted-foreground">
									Personalization Adoption
								</h3>
								<SlidersHorizontal
									aria-hidden="true"
									className="size-4 text-muted-foreground"
								/>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<dl className="flex flex-col gap-2.5 text-sm">
								<div className="flex items-center justify-between gap-2">
									<dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<Heart aria-hidden="true" className="size-3.5" />
										Saved Favorites
									</dt>
									<dd className="font-semibold tabular-nums">
										{catalogSnapshot.usersWithFavorites.toLocaleString()}{" "}
										<span className="text-xs font-normal text-muted-foreground">
											(
											{formatPercent(
												catalogSnapshot.usersWithFavorites,
												registeredUsers.total,
											)}
											)
										</span>
									</dd>
								</div>
								<div className="flex items-center justify-between gap-2">
									<dt className="text-xs text-muted-foreground">
										Excluded Ingredients
									</dt>
									<dd className="font-semibold tabular-nums">
										{catalogSnapshot.usersWithExcludedIngredients.toLocaleString()}{" "}
										<span className="text-xs font-normal text-muted-foreground">
											(
											{formatPercent(
												catalogSnapshot.usersWithExcludedIngredients,
												registeredUsers.total,
											)}
											)
										</span>
									</dd>
								</div>
							</dl>
							<p className="text-xs text-muted-foreground">
								Registered users with at least one saved preference
							</p>
						</CardContent>
						<CardFooter className="mt-auto text-xs text-muted-foreground">
							Computed live from user preferences
						</CardFooter>
					</article>
				</div>
			</section>
		</div>
	);
}
