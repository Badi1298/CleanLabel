import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_protected/_public/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/login" });
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Profile</h1>
				<Button
					className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
					onClick={handleLogout}
				>
					Logout
				</Button>
			</div>
		</div>
	);
}
