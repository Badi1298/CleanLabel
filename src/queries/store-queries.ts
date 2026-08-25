import { queryOptions } from "@tanstack/react-query";
import { getStores } from "#/server/store-functions";

export function storesQueryOptions() {
	return queryOptions({
		queryKey: ["stores"],
		queryFn: () => getStores(),
	});
}
