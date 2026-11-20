import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
	getPaginatedSearchResults,
	getSearchCategorySections,
	getSearchResults,
} from "#/server/search-functions";

export type SearchOptionsArgs = {
	q?: string;
	storeId?: string;
	categoryId?: string;
	subCategoryIds?: string[];
	score?: "gold" | "silver" | "bronze" | "none";
};

export const searchQueryOptions = (args: SearchOptionsArgs) =>
	queryOptions({
		queryKey: ["searchResults", args],
		queryFn: () => getSearchResults({ data: args }),
	});

export type SearchCategorySectionsArgs = {
	q?: string;
	storeId?: string;
	score?: "gold" | "silver" | "bronze" | "none";
	limitPerCategory?: number;
};

export const searchCategorySectionsQueryOptions = (
	args: SearchCategorySectionsArgs,
) =>
	queryOptions({
		queryKey: ["searchCategorySections", args],
		queryFn: () => getSearchCategorySections({ data: args }),
	});

export const infiniteSearchQueryOptions = (
	args: SearchOptionsArgs & { pageSize?: number },
) => {
	const pageSize = args.pageSize ?? 24;
	return infiniteQueryOptions({
		queryKey: [
			"searchResultsInfinite",
			{
				q: args.q,
				storeId: args.storeId,
				categoryId: args.categoryId,
				subCategoryIds: args.subCategoryIds,
				score: args.score,
				pageSize,
			},
		],
		initialPageParam: 0,
		queryFn: ({ pageParam }) =>
			getPaginatedSearchResults({
				data: {
					q: args.q,
					storeId: args.storeId,
					categoryId: args.categoryId,
					subCategoryIds: args.subCategoryIds,
					score: args.score,
					limit: pageSize,
					offset: pageParam,
				},
			}),
		getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
	});
};
