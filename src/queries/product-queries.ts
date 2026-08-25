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
