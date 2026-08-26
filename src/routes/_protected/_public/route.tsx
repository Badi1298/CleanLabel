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
			{/* Sticky Bottom Navigation */}
			<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-[#FDFBF7] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
				<nav className="flex justify-between items-center w-full max-w-md px-4 py-1 h-[68px]">
					<Button
						variant="ghost"
						className="flex flex-col items-center justify-center gap-1 h-auto min-w-[72px] py-2 px-2 text-slate-500 [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400 [&.active]:bg-emerald-100/60 dark:[&.active]:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl"
						asChild
					>
						<Link to="/">
							<Home className="w-5 h-5" />
							<span className="text-[11px] font-medium">Home</span>
						</Link>
					</Button>

					<Button
						variant="ghost"
						className="flex flex-col items-center justify-center gap-1 h-auto min-w-[72px] py-2 px-2 text-slate-500 [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400 [&.active]:bg-emerald-100/60 dark:[&.active]:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl"
						asChild
					>
						<Link to="/search">
							<Search className="w-5 h-5" />
							<span className="text-[11px] font-medium">Search</span>
						</Link>
					</Button>

					<Button
						variant="ghost"
						onClick={() => setIsScannerOpen(true)}
						className="flex flex-col cursor-pointer items-center justify-center gap-1 h-auto min-w-[72px] py-2 px-2 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl"
						disabled={isFetching}
					>
						{isFetching ? (
							<div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
						) : (
							<ScanBarcode className="w-5 h-5" />
						)}
						<span className="text-[11px] font-medium">Scan</span>
					</Button>

					<Button
						variant="ghost"
						className="flex flex-col items-center justify-center gap-1 h-auto min-w-[72px] py-2 px-2 text-slate-500 [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400 [&.active]:bg-emerald-100/60 dark:[&.active]:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl"
						asChild
					>
						<Link to="/stores">
							<Store className="w-5 h-5" />
							<span className="text-[11px] font-medium">Stores</span>
						</Link>
					</Button>

					<Button
						variant="ghost"
						className="flex flex-col items-center justify-center gap-1 h-auto min-w-[72px] py-2 px-2 text-slate-500 [&.active]:text-emerald-700 dark:[&.active]:text-emerald-400 [&.active]:bg-emerald-100/60 dark:[&.active]:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl"
						asChild
					>
						<Link to="/profile">
							<User className="w-5 h-5" />
							<span className="text-[11px] font-medium">Profile</span>
						</Link>
					</Button>
				</nav>
			</div>

			<ScannerDialog
				isOpen={isScannerOpen}
				onClose={() => setIsScannerOpen(false)}
				onResult={handleScanBarcode}
			/>
		</div>
	);
}
