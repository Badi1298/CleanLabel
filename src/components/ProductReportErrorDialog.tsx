import { CheckCircle2, Flag, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "#/lib/utils";

const emailSchema = z
	.string()
	.trim()
	.refine(
		(val) => val === "" || z.email().safeParse(val).success,
		"Please enter a valid email address.",
	);

function validateDetails(value: string): string | undefined {
	return value.trim().length === 0
		? "Please describe what needs to be corrected."
		: undefined;
}

function validateEmail(value: string): string | undefined {
	const result = emailSchema.safeParse(value);
	return result.success ? undefined : result.error.issues[0]?.message;
}

export function ProductReportErrorDialog({
	open,
	onClose,
	productName,
	productBrand,
	defaultEmail,
}: {
	open: boolean;
	onClose: () => void;
	productName: string;
	productBrand?: string | null;
	defaultEmail?: string | null;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const detailsRef = useRef<HTMLTextAreaElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const titleId = useId();
	const detailsId = useId();
	const detailsHelpId = useId();
	const detailsErrorId = useId();
	const emailId = useId();
	const emailErrorId = useId();

	const [details, setDetails] = useState("");
	const [email, setEmail] = useState(defaultEmail ?? "");
	const [detailsTouched, setDetailsTouched] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);
	const [detailsError, setDetailsError] = useState<string | undefined>();
	const [emailError, setEmailError] = useState<string | undefined>();

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			setEmail((prev) => prev || defaultEmail || "");
			dialog.showModal();
			detailsRef.current?.focus();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open, defaultEmail]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => {
			dialog.returnValue = "";
			onClose();
		};

		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	// Progressive enhancement fallback for browsers lacking <dialog closedby="any">
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

		const isOutside = (e: PointerEvent) => {
			const rect = dialog.getBoundingClientRect();
			return (
				e.clientX < rect.left ||
				e.clientX > rect.right ||
				e.clientY < rect.top ||
				e.clientY > rect.bottom
			);
		};

		let pressedOutside = false;
		const onPointerDown = (e: PointerEvent) => {
			pressedOutside = isOutside(e);
		};
		const onPointerUp = (e: PointerEvent) => {
			if (pressedOutside && isOutside(e)) {
				dialog.close();
			}
			pressedOutside = false;
		};

		dialog.addEventListener("pointerdown", onPointerDown);
		dialog.addEventListener("pointerup", onPointerUp);
		return () => {
			dialog.removeEventListener("pointerdown", onPointerDown);
			dialog.removeEventListener("pointerup", onPointerUp);
		};
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const nextDetailsError = validateDetails(details);
		const nextEmailError = validateEmail(email);

		setDetailsTouched(true);
		setEmailTouched(true);
		setDetailsError(nextDetailsError);
		setEmailError(nextEmailError);

		if (nextDetailsError) {
			detailsRef.current?.focus();
			return;
		}
		if (nextEmailError) {
			emailRef.current?.focus();
			return;
		}

		toast.success("Thank you! Your report has been submitted for review.");
		setDetails("");
		setDetailsTouched(false);
		setDetailsError(undefined);
		setEmailTouched(false);
		setEmailError(undefined);
		dialogRef.current?.close();
	};

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			{...({ closedby: "any" } as Record<string, string>)}
			className="m-auto w-[calc(100%-1.5rem)] max-w-lg max-h-[90dvh] rounded-3xl border border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] p-0 text-[#1B3328] dark:text-[#EDF2EE] shadow-2xl backdrop:bg-[#0E1612]/70 backdrop:backdrop-blur-xs open:flex open:flex-col overflow-hidden"
		>
			<div className="px-5 py-4 border-b border-[#EAE4D7] dark:border-[#24362D] bg-[#FAF8F5] dark:bg-[#131F19] flex items-start justify-between gap-3 shrink-0">
				<div className="flex items-start gap-3 min-w-0">
					<span className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-700/60 text-[#92400E] dark:text-amber-300 flex items-center justify-center shrink-0">
						<Flag className="w-4 h-4" aria-hidden="true" />
					</span>
					<div className="min-w-0">
						<h2
							id={titleId}
							className="text-base sm:text-lg font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]"
						>
							Report an error
						</h2>
						<p className="text-xs text-[#5C665E] dark:text-[#9AA89E] mt-0.5">
							Spotted a recipe change or label discrepancy? Let us know.
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={() => dialogRef.current?.close()}
					aria-label="Close dialog"
					className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] text-[#5C665E] dark:text-[#9AA89E] hover:text-[#1B3328] dark:hover:text-[#EDF2EE] hover:border-[#2D5A44] transition-colors cursor-pointer touch-manipulation shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
				>
					<X className="w-4 h-4" aria-hidden="true" />
				</button>
			</div>

			<form
				noValidate
				aria-labelledby={titleId}
				onSubmit={handleSubmit}
				className="p-5 space-y-4 overflow-y-auto"
			>
				<div className="rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] px-3.5 py-2.5">
					<p className="text-[10px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
						Product
					</p>
					<p className="text-xs sm:text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] mt-0.5">
						{productBrand ? `${productBrand} — ${productName}` : productName}
					</p>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor={detailsId}
						className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
					>
						What needs to be corrected?{" "}
						<span aria-hidden="true" className="text-rose-600">
							*
						</span>
					</label>
					<textarea
						ref={detailsRef}
						id={detailsId}
						name="details"
						rows={4}
						required
						value={details}
						onChange={(e) => {
							const next = e.target.value;
							setDetails(next);
							if (detailsTouched && !validateDetails(next)) {
								setDetailsError(undefined);
							}
						}}
						onBlur={() => {
							if (detailsTouched || details.length > 0) {
								setDetailsTouched(true);
								setDetailsError(validateDetails(details));
							}
						}}
						aria-invalid={Boolean(detailsError)}
						aria-describedby={
							detailsError
								? `${detailsHelpId} ${detailsErrorId}`
								: detailsHelpId
						}
						placeholder="Describe the ingredient change, missing additive, or store discrepancy..."
						className={cn(
							"w-full rounded-xl border bg-[#FAF8F5] dark:bg-[#121D17] px-3.5 py-2.5 text-base md:text-sm text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]",
							detailsError
								? "border-rose-500 dark:border-rose-500"
								: "border-[#EAE4D7] dark:border-[#2B3D33]",
						)}
					/>
					<p
						id={detailsHelpId}
						className="text-[11px] text-[#5C665E] dark:text-[#9AA89E]"
					>
						Include details from the current package label if available.
					</p>
					{detailsError && (
						<p
							id={detailsErrorId}
							role="alert"
							className="text-xs font-medium text-rose-700 dark:text-rose-300"
						>
							{detailsError}
						</p>
					)}
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor={emailId}
						className="block text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
					>
						Email (optional)
					</label>
					<input
						ref={emailRef}
						id={emailId}
						name="email"
						type="email"
						inputMode="email"
						autoComplete="email"
						autoCorrect="off"
						autoCapitalize="none"
						spellCheck={false}
						enterKeyHint="done"
						value={email}
						onChange={(e) => {
							const next = e.target.value;
							setEmail(next);
							if (emailTouched && !validateEmail(next)) {
								setEmailError(undefined);
							}
						}}
						onBlur={() => {
							if (emailTouched || email.trim().length > 0) {
								setEmailTouched(true);
								setEmailError(validateEmail(email));
							}
						}}
						aria-invalid={Boolean(emailError)}
						aria-describedby={emailError ? emailErrorId : undefined}
						placeholder="name@example.com"
						className={cn(
							"w-full min-h-11 rounded-xl border bg-[#FAF8F5] dark:bg-[#121D17] px-3.5 py-2 text-base md:text-sm text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]",
							emailError
								? "border-rose-500 dark:border-rose-500"
								: "border-[#EAE4D7] dark:border-[#2B3D33]",
						)}
					/>
					{emailError && (
						<p
							id={emailErrorId}
							role="alert"
							className="text-xs font-medium text-rose-700 dark:text-rose-300"
						>
							{emailError}
						</p>
					)}
				</div>

				<div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#F0EAE0] dark:border-[#22332A]">
					<button
						type="button"
						onClick={() => dialogRef.current?.close()}
						className="min-h-10 px-4 py-2 rounded-full border border-[#EAE4D7] dark:border-[#2B3D33] bg-white dark:bg-[#1E2C25] text-xs font-bold text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#24362D] transition-colors cursor-pointer touch-manipulation"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="inline-flex items-center gap-1.5 min-h-10 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-bold transition-colors cursor-pointer touch-manipulation"
					>
						<CheckCircle2 className="w-4 h-4" aria-hidden="true" />
						<span>Submit report</span>
					</button>
				</div>
			</form>
		</dialog>
	);
}
