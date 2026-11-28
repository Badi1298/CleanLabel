import { queryOptions } from "@tanstack/react-query";
import { getAdminDashboardStats } from "#/server/analytics-functions";

export function adminDashboardStatsQueryOptions() {
	return queryOptions({
		queryKey: ["adminDashboardStats"],
		queryFn: () => getAdminDashboardStats(),
		staleTime: 1000 * 60,
	});
}
