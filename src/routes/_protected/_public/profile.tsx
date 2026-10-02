import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";
import { ingredientsQueryOptions } from "#/queries/ingredient-queries";
import { userExcludedIngredientsQueryOptions } from "#/queries/profile-queries";
import { toggleExcludedIngredient } from "#/server/profile-functions";

export const Route = createFileRoute("/_protected/_public/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/login" });
	};

	const { data: excludedIngredients, refetch: refetchExcluded } = useQuery({
		...userExcludedIngredientsQueryOptions(),
		enabled: !!session?.user,
	});

	const { data: allIngredients } = useQuery(
		ingredientsQueryOptions({
			pageIndex: 0,
			pageSize: 1000,
		}),
	);

	const toggleIngredientFn = useServerFn(toggleExcludedIngredient);
	const [selectedIngredient, setSelectedIngredient] = useState<string>("");

	const handleAddIngredient = async () => {
		if (!selectedIngredient) return;
		try {
			await toggleIngredientFn({ data: { ingredientId: selectedIngredient } });
			toast.success("Ingredient added to excluded list");
			setSelectedIngredient("");
			refetchExcluded();
		} catch (error) {
			toast.error("Failed to add ingredient");
		}
	};

	const handleRemoveIngredient = async (ingredientId: string) => {
		try {
			await toggleIngredientFn({ data: { ingredientId } });
			toast.success("Ingredient removed from excluded list");
			refetchExcluded();
		} catch (error) {
			toast.error("Failed to remove ingredient");
		}
	};

	// Filter out already excluded ingredients for the dropdown
	const availableIngredients =
		allIngredients?.data.filter(
			(ing) => !excludedIngredients?.some((ex) => ex.id === ing.id),
		) || [];

	return (
		<div className="container mx-auto p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Profile</h1>
				<div className="flex items-center gap-4">
					{!isPending && session?.user.role === "admin" ? (
						<Button
							asChild
							variant="outline"
							className="px-4 py-2 font-medium rounded-md transition-colors"
						>
							<Link to="/admin/all-products">Admin Panel</Link>
						</Button>
					) : (
						isPending && <Skeleton className="w-24 h-9 rounded-md" />
					)}
					<Button
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</div>
			</div>

			<div className="mt-8 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
				<h2 className="text-xl font-semibold mb-4">Excluded Ingredients</h2>
				<p className="text-sm text-slate-500 mb-6">
					Add ingredients you want to avoid. We'll warn you if a product
					contains any of them.
				</p>

				<div className="flex gap-4 mb-6">
					<div className="flex-1 max-w-md">
						<Select
							value={selectedIngredient}
							onValueChange={setSelectedIngredient}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select an ingredient to exclude..." />
							</SelectTrigger>
							<SelectContent>
								{availableIngredients.map((ingredient) => (
									<SelectItem key={ingredient.id} value={ingredient.id}>
										{ingredient.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button onClick={handleAddIngredient} disabled={!selectedIngredient}>
						Add to Exclusions
					</Button>
				</div>

				{excludedIngredients && excludedIngredients.length > 0 ? (
					<ul className="space-y-2">
						{excludedIngredients.map((ingredient) => (
							<li
								key={ingredient.id}
								className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md"
							>
								<span className="font-medium capitalize">
									{ingredient.name}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleRemoveIngredient(ingredient.id)}
									className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
								>
									Remove
								</Button>
							</li>
						))}
					</ul>
				) : (
					<div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
						You haven't excluded any ingredients yet.
					</div>
				)}
			</div>
		</div>
	);
}
