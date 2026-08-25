import { queryOptions } from "@tanstack/react-query";
import {
	getAllProducts,
	getCategories,
	getProductById,
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

export const allProductsQueryOptions = () =>
	queryOptions({
		queryKey: ["allProducts"],
		queryFn: () => getAllProducts(),
	});
