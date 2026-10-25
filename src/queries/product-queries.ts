import { queryOptions } from "@tanstack/react-query";
import { getActiveCategories } from "#/server/category-functions";
import {
	getAllProducts,
	getCategories,
	getProductAlternatives,
	getProductById,
	getProductDetailsById,
} from "#/server/product-functions";

export const categoriesQueryOptions = () =>
	queryOptions({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});

export type ActiveCategoriesFilters = {
	storeId?: string;
	score?: "gold" | "silver" | "bronze" | "none" | "rejected";
};

export const activeCategoriesQueryOptions = (
	filters?: string | ActiveCategoriesFilters,
) => {
	const normalized: ActiveCategoriesFilters =
		typeof filters === "string" ? { storeId: filters } : filters || {};
	return queryOptions({
		queryKey: ["activeCategories", normalized],
		queryFn: () => getActiveCategories({ data: normalized }),
	});
};

export const productQueryOptions = (productId?: string) =>
	queryOptions({
		queryKey: ["product", productId],
		queryFn: () => (productId ? getProductById({ data: productId }) : null),
	});

type ProductQueryArgs = {
	pageIndex: number;
	pageSize: number;
	globalFilter?: string;
	statusFilter?: string;
};

export const allProductsQueryOptions = (args: ProductQueryArgs) =>
	queryOptions({
		queryKey: ["allProducts", args],
		queryFn: () => getAllProducts({ data: args }),
	});

export const productDetailsQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ["productDetails", productId],
		queryFn: () => getProductDetailsById({ data: productId }),
	});

export const productAlternativesQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ["productAlternatives", productId],
		queryFn: () => getProductAlternatives({ data: productId }),
	});
