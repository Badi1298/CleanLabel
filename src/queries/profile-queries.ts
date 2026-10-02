import { queryOptions } from "@tanstack/react-query";
import {
	getUserExcludedIngredients,
	getUserFavoriteProducts,
} from "#/server/profile-functions";

export const userExcludedIngredientsQueryOptions = () =>
	queryOptions({
		queryKey: ["userExcludedIngredients"],
		queryFn: () => getUserExcludedIngredients(),
	});

export const userFavoriteProductsQueryOptions = () =>
	queryOptions({
		queryKey: ["userFavoriteProducts"],
		queryFn: () => getUserFavoriteProducts(),
	});
