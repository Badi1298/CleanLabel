import { queryOptions } from "@tanstack/react-query";
import { getStoreExclusiveProducts, getStores } from "#/server/store-functions";

export type StoresQueryFilters = {
	score?: "gold" | "silver" | "bronze" | "none";
};

export function storesQueryOptions(filters?: StoresQueryFilters) {
	const score = filters?.score;
	return queryOptions({
		queryKey: score ? ["stores", { score }] : ["stores"],
		queryFn: () => getStores({ data: { score } }),
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
