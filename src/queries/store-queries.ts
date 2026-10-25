import { queryOptions } from "@tanstack/react-query";
import { getStoreExclusiveProducts, getStores } from "#/server/store-functions";

export function storesQueryOptions() {
	return queryOptions({
		queryKey: ["stores"],
		queryFn: () => getStores(),
	});
}

export function storeExclusiveProductsQueryOptions(storeId?: string | null) {
	return queryOptions({
		queryKey: ["storeExclusiveProducts", storeId],
		queryFn: () =>
			storeId
				? getStoreExclusiveProducts({ data: { id: storeId } })
				: Promise.resolve([]),
		enabled: !!storeId,
	});
}
