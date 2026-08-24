import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/lib/auth-client";

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

	return (
		<div className="container mx-auto p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Profile</h1>
				<div className="flex items-center gap-4">
					{!isPending && session?.user.role === "admin" ? (
						<Button
							asChild
							className="px-4 py-2 font-medium rounded-md transition-colors"
						>
							<Link to="/admin">Admin Panel</Link>
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
		</div>
	);
}
