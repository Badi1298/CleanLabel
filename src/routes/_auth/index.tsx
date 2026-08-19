import {
	createFileRoute,
	isRedirect,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { getSession } from "#/lib/auth-server";

export const Route = createFileRoute("/_auth/")({
	beforeLoad: async () => {
		try {
			const session = await getSession();
			if (!session) {
				throw redirect({
					to: "/login",
				});
			}
			return { session };
		} catch (error) {
			if (isRedirect(error)) throw error;
			throw redirect({
				to: "/login",
			});
		}
	},
	component: Home,
});

function Home() {
	const { session } = Route.useRouteContext();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/login" });
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">
					Welcome to TanStack Start, {session.user.name || session.user.email}
				</h1>
				<Button onClick={handleLogout} variant="outline">
					Logout
				</Button>
			</div>
			<p className="mt-4 text-lg">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>
		</div>
	);
}
