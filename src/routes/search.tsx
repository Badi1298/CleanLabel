import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	q: z.string().optional(),
	storeId: z.string().optional(),
});

export const Route = createFileRoute("/search")({
	validateSearch: searchSchema,
	component: SearchPage,
});

function SearchPage() {
	const search = Route.useSearch();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Search Results</h1>
			<pre className="mt-4 p-4 bg-slate-100 rounded">
				{JSON.stringify(search, null, 2)}
			</pre>
		</div>
	);
}
