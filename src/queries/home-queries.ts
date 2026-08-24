import { queryOptions } from "@tanstack/react-query";
import { getHomeData } from "#/server/home-functions";

export const homeQueryOptions = (storeId?: string) =>
	queryOptions({
		queryKey: ["homeData", storeId],
		queryFn: () => getHomeData({ data: { storeId } }),
	});
