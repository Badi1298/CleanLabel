import {
	createFileRoute,
	Link,
	Outlet,
	useRouteContext,
} from "@tanstack/react-router";
import { Heart, Home, Search, Store, User } from "lucide-react";
import { BrandLogo } from "#/components/brand-logo";
import { Onboarding } from "#/components/Onboarding";

export const Route = createFileRoute("/_protected/_public")({
	component: RouteComponent,
});

const NAV_ITEMS = [
	{ to: "/" as const, label: "Home", Icon: Home, exact: true },
	{ to: "/search" as const, label: "Search", Icon: Search, exact: false },
	{ to: "/favorites" as const, label: "Favorites", Icon: Heart, exact: false },
	{ to: "/stores" as const, label: "Stores", Icon: Store, exact: false },
	{ to: "/profile" as const, label: "Profile", Icon: User, exact: false },
];

function RouteComponent() {
	const { session } = useRouteContext({ from: "/_protected" });

	return (
		<div className="relative min-h-screen pb-20 md:pb-10 bg-[#FAF8F5] dark:bg-[#0E1612] text-[#1B3328] dark:text-[#EDF2EE]">
			<Onboarding user={session.user} />

			{/* Desktop & Tablet Slim Top Navigation */}
			<header className="hidden md:block sticky top-0 z-40 bg-[#FDFBF7]/92 dark:bg-[#131F19]/92 backdrop-blur-md border-b border-[#EAE4D7] dark:border-[#24362D]">
				<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
					<Link
						to="/"
						className="inline-flex items-center rounded-xl px-0.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
					>
						<BrandLogo surface="adaptive" size="md" />
					</Link>

					<nav
						aria-label="Primary navigation"
						className="flex items-center gap-1.5"
					>
						{NAV_ITEMS.map(({ to, label, Icon, exact }) => (
							<Link
								key={to}
								to={to}
								activeOptions={{ exact }}
								className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FBF4E6] hover:bg-[#F3EFE6]/80 dark:hover:bg-[#1A2922] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
								activeProps={{
									className:
										"bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-semibold hover:bg-[#E3EDE7] dark:hover:bg-[#1E3A2C]",
								}}
							>
								<Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
								<span>{label}</span>
							</Link>
						))}
					</nav>
				</div>
			</header>

			<Outlet />

			{/* Mobile Sticky Bottom Navigation */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 dark:bg-[#131F19]/95 backdrop-blur-md border-t border-[#EAE4D7] dark:border-[#24362D] shadow-[0_-4px_20px_rgba(27,67,50,0.06)] pb-[env(safe-area-inset-bottom)]">
				<nav
					aria-label="Mobile navigation"
					className="grid grid-cols-5 items-center max-w-md mx-auto px-2 py-1.5 h-16.5"
				>
					{NAV_ITEMS.map(({ to, label, Icon, exact }) => (
						<Link
							key={to}
							to={to}
							activeOptions={{ exact }}
							className="flex flex-col items-center justify-center gap-1 h-13 px-1 rounded-xl text-[#687069] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#CBE3D4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
							activeProps={{
								className:
									"bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] font-semibold",
							}}
						>
							{({ isActive }) => (
								<>
									<Icon
										className="w-5 h-5 shrink-0"
										strokeWidth={isActive ? 2.25 : 1.85}
										aria-hidden="true"
									/>
									<span className="text-[11px] leading-none tracking-tight">
										{label}
									</span>
								</>
							)}
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
