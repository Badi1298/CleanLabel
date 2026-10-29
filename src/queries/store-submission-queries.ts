import { queryOptions } from "@tanstack/react-query";
import {
	getPendingStoreSubmissionsCount,
	getStoreSubmissions,
} from "#/server/store-submission-functions";

export function storeSubmissionsQueryOptions(
	status: "pending_review" | "approved" | "rejected" | "all" = "pending_review",
) {
	return queryOptions({
		queryKey: ["storeSubmissions", status],
		queryFn: () => getStoreSubmissions({ data: { status } }),
	});
}

export function pendingStoreSubmissionsCountQueryOptions() {
	return queryOptions({
		queryKey: ["pendingStoreSubmissionsCount"],
		queryFn: () => getPendingStoreSubmissionsCount(),
	});
}
