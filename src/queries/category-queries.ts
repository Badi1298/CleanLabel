import { queryOptions } from "@tanstack/react-query";
import { getCategories, getCategory } from "#/server/category-functions";

type CategoryQueryArgs = {
	pageIndex: number;
	pageSize: number;
	globalFilter?: string;
};

export const categoriesQueryOptions = (args: CategoryQueryArgs) =>
	queryOptions({
		queryKey: ["categories", args],
		queryFn: () => getCategories({ data: args }),
	});

export const categoryQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["categories", id],
		queryFn: () => getCategory({ data: { id } }),
	});
