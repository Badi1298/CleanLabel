import { queryOptions } from "@tanstack/react-query";
import { getSearchResults } from "#/server/search-functions";

type SearchOptionsArgs = {
	q?: string;
	storeId?: string;
	categoryId?: string;
	subCategoryIds?: string[];
	score?: "gold" | "silver" | "bronze" | "none" | "rejected";
};

export const searchQueryOptions = (args: SearchOptionsArgs) =>
	queryOptions({
		queryKey: ["searchResults", args],
		queryFn: () => getSearchResults({ data: args }),
	});
