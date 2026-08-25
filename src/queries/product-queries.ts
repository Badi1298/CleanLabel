import { queryOptions } from "@tanstack/react-query";
import {
	getCategories,
	getPendingProducts,
	getProductById,
	getProductDetailsById,
} from "#/server/product-functions";

export const categoriesQueryOptions = () =>
	queryOptions({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});

export const productQueryOptions = (productId?: string) =>
	queryOptions({
		queryKey: ["product", productId],
		queryFn: () => (productId ? getProductById({ data: productId }) : null),
	});

export const pendingProductsQueryOptions = () =>
	queryOptions({
		queryKey: ["pendingProducts"],
		queryFn: () => getPendingProducts(),
	});

export const productDetailsQueryOptions = (productId: string) =>
	queryOptions({
		queryKey: ["productDetails", productId],
		queryFn: () => getProductDetailsById({ data: productId }),
	});
