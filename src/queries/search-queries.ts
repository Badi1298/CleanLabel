import { queryOptions } from "@tanstack/react-query";
import { getSearchResults } from "#/server/search-functions";

type SearchOptionsArgs = {
	q?: string;
	storeId?: string;
	categoryId?: string;
	score?: "gold" | "silver" | "bronze" | "none";
};

export const searchQueryOptions = (args: SearchOptionsArgs) =>
	queryOptions({
		queryKey: ["searchResults", args],
		queryFn: () => getSearchResults({ data: args }),
	});
