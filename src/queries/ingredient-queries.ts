import { queryOptions } from "@tanstack/react-query";
import { getIngredients, getUnmappedIngredients } from "#/server/ingredient-functions";

export const ingredientsQueryOptions = (args?: any) =>
	queryOptions({
		queryKey: ["ingredients", args],
		queryFn: () => getIngredients({ data: args || { pageIndex: 0, pageSize: 1000 } }),
	});

export const unmappedIngredientsQueryOptions = (args: any) =>
	queryOptions({
		queryKey: ["unmappedIngredients", args],
		queryFn: () => getUnmappedIngredients({ data: args }),
	});
