import { queryOptions } from "@tanstack/react-query";
import { getUserExcludedIngredients } from "#/server/profile-functions";

export const userExcludedIngredientsQueryOptions = () =>
	queryOptions({
		queryKey: ["userExcludedIngredients"],
		queryFn: () => getUserExcludedIngredients(),
	});
