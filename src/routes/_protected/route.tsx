import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Home, ScanBarcode, Search, Store, User } from "lucide-react";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
			<Outlet />

			{/* Sticky Bottom Navigation */}
			<nav className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-end px-2 pb-4 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
				<Link
					to="/"
					className="flex flex-col items-center gap-1 text-slate-500 group [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400"
				>
					<div className="p-2 rounded-full transition-colors group-[.active]:bg-emerald-100 dark:group-[.active]:bg-emerald-900/30">
						<Home className="w-6 h-6" />
					</div>
					<span className="text-[11px] font-medium">Home</span>
				</Link>

				<Link
					to="/search"
					className="flex flex-col items-center gap-1 text-slate-500 group [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400"
				>
					<div className="p-2 rounded-full transition-colors group-[.active]:bg-emerald-100 dark:group-[.active]:bg-emerald-900/30">
						<Search className="w-6 h-6" />
					</div>
					<span className="text-[11px] font-medium">Search</span>
				</Link>

				{/* Elevated Scan Button */}
				<div className="relative flex flex-col items-center text-slate-600 -translate-y-6">
					<div className="bg-[#FDFBF7] dark:bg-slate-900 p-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex items-center justify-center">
						<ScanBarcode className="w-8 h-8" />
					</div>
					<span className="text-[11px] font-medium mt-2 absolute -bottom-6 whitespace-nowrap">
						Scan Barcode
					</span>
				</div>

				<Link
					to="/stores"
					className="flex flex-col items-center gap-1 text-slate-500 group [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400"
				>
					<div className="p-2 rounded-full transition-colors group-[.active]:bg-emerald-100 dark:group-[.active]:bg-emerald-900/30">
						<Store className="w-6 h-6" />
					</div>
					<span className="text-[11px] font-medium">Stores</span>
				</Link>

				<Link
					to="/profile"
					className="flex flex-col items-center gap-1 text-slate-500 group [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400"
				>
					<div className="p-2 rounded-full transition-colors group-[.active]:bg-emerald-100 dark:group-[.active]:bg-emerald-900/30">
						<User className="w-6 h-6" />
					</div>
					<span className="text-[11px] font-medium">Profile</span>
				</Link>
			</nav>
		</div>
	);
}
