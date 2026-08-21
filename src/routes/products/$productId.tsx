import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
	component: ProductDetails,
});

function ProductDetails() {
	const { productId } = Route.useParams();
	return (
		<div className="p-8 text-center text-xl">
			Product Details for {productId}
		</div>
	);
}
