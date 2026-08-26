import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Home, ScanBarcode, Search, Store, User } from "lucide-react";
import { useState } from "react";
import { ScannerDialog } from "#/components/ScannerDialog";
import { Button } from "#/components/ui/button";
import { processBarcodeScan } from "#/server/off-functions";

export const Route = createFileRoute("/_protected/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	const processScan = useServerFn(processBarcodeScan);
	const navigate = useNavigate();
	const [isScannerOpen, setIsScannerOpen] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const handleScanBarcode = async (barcode: string) => {
		setIsScannerOpen(false);
		setIsFetching(true);
		try {
			const result = await processScan({ data: barcode });
			if (result.productId) {
				navigate({
					to: "/products/$productId",
					params: { productId: result.productId },
				});
			} else {
				// TODO: We use "as any" for search since we don't know if add-product has validateSearch set up yet
				navigate({ to: "/add-product", search: { barcode } as any });
			}
		} catch (e) {
			console.error("Error processing scan:", e);
			navigate({ to: "/add-product", search: { barcode } as any });
		} finally {
			setIsFetching(false);
		}
	};

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
				<Button
					onClick={() => setIsScannerOpen(true)}
					size="icon-lg"
					variant="secondary"
					className="-translate-y-6"
					disabled={isFetching}
				>
					{isFetching ? (
						<div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
					) : (
						<ScanBarcode />
					)}
				</Button>

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

			<ScannerDialog
				isOpen={isScannerOpen}
				onClose={() => setIsScannerOpen(false)}
				onResult={handleScanBarcode}
			/>
		</div>
	);
}
