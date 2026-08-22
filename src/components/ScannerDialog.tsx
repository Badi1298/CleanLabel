import { Scanner } from "@yudiel/react-qr-scanner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";

interface ScannerDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onResult: (result: string) => void;
}

export function ScannerDialog({
	isOpen,
	onClose,
	onResult,
}: ScannerDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Scan Barcode</DialogTitle>
					<DialogDescription>
						Point your camera at a product's barcode to scan it.
					</DialogDescription>
				</DialogHeader>

				<div className="relative w-full aspect-[4/3] bg-black rounded-md overflow-hidden flex items-center justify-center">
					{isOpen && (
						<Scanner
							onScan={(detectedCodes) => {
								if (detectedCodes && detectedCodes.length > 0) {
									onResult(detectedCodes[0].rawValue);
								}
							}}
							onError={(error) => {
								console.error("Scanner Error:", error);
							}}
							components={{
								onOff: true,
								torch: true,
								zoom: true,
								finder: true,
							}}
							styles={{
								container: { width: "100%", height: "100%" },
							}}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
