import {
	type AnyFieldApi,
	revalidateLogic,
	type ValidationLogicFn,
} from "@tanstack/react-form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Label } from "#/components/ui/label";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";

const baseRevalidateLogic = revalidateLogic({
	mode: "blur",
	modeAfterSubmission: "change",
});

/**
 * Validates fields on blur (after interaction) and submit, while also
 * re-validating on change whenever a field already has an error so feedback
 * clears as soon as the user fixes the value.
 */
export const authValidationLogic: ValidationLogicFn = (props) => {
	if (props.event.type === "change" && props.event.fieldName) {
		const meta = props.form.getFieldMeta(props.event.fieldName);
		if (meta?.errors && meta.errors.length > 0 && props.validators?.onDynamic) {
			return props.runValidation({
				validators: [{ fn: props.validators.onDynamic, cause: "dynamic" }],
				form: props.form,
			});
		}
	}

	return baseRevalidateLogic(props);
};

export function focusFirstInvalidField(formElement: HTMLFormElement | null) {
	if (!formElement) return;
	requestAnimationFrame(() => {
		const firstInvalid = formElement.querySelector<HTMLElement>(
			'[aria-invalid="true"]',
		);
		firstInvalid?.focus();
	});
}

export function useAuthErrorAnnouncer() {
	const [announcement, setAnnouncement] = useState("");
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const announceError = (label: string, error: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setAnnouncement("");
		timerRef.current = setTimeout(() => {
			setAnnouncement(`${label}: ${error}`);
		}, 450);
	};

	const clearAnnouncement = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setAnnouncement("");
	};

	const liveRegion = (
		<div aria-live="polite" className="sr-only">
			{announcement}
		</div>
	);

	return { announceError, clearAnnouncement, liveRegion };
}

function getFieldError(field: AnyFieldApi): string | undefined {
	if (!field.state.meta.errors.length) return undefined;
	return field.state.meta.errors.map(String).join(", ");
}

function getLatestFieldError(field: AnyFieldApi): string | undefined {
	const errors = field.form.getFieldMeta(field.name)?.errors;
	if (!errors?.length) return undefined;
	return errors.map(String).join(", ");
}

export function validateEmail(value: string) {
	if (!value.trim()) return m.auth_email_required();
	if (!/^\S+@\S+\.\S+$/.test(value)) return m.auth_email_invalid();
	return undefined;
}

export function validatePassword(value: string) {
	if (!value) return m.auth_password_required();
	if (value.length < 6) return m.auth_password_min_6();
	return undefined;
}

export function AuthSubmitButton({
	isSubmitting,
	idleLabel,
	submittingLabel,
}: {
	isSubmitting: boolean;
	idleLabel: string;
	submittingLabel: string;
}) {
	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className="w-full min-h-12 mt-1 px-5 py-3 rounded-xl bg-[#1B4332] text-[#FCE8C6] hover:bg-[#245540] dark:bg-[#CBE3D4] dark:text-[#12241B] dark:hover:bg-[#DCECE2] font-bold text-sm sm:text-[15px] shadow-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A44] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#6EC89A] dark:focus-visible:ring-offset-[#16221C]"
		>
			{isSubmitting ? submittingLabel : idleLabel}
		</button>
	);
}

const INPUT_BASE_CLASS =
	"w-full min-h-12 px-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border text-base sm:text-sm text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#7F8D84] transition-colors outline-none focus-visible:ring-2";

const INPUT_VALID_CLASS =
	"border-[#EAE4D7] dark:border-[#2B3D33] hover:border-[#C9B382] dark:hover:border-[#365043] focus-visible:border-[#2D5A44] focus-visible:ring-[#2D5A44]/25 dark:focus-visible:border-[#6EC89A] dark:focus-visible:ring-[#6EC89A]/25";

const INPUT_ERROR_CLASS =
	"border-rose-500 dark:border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 focus-visible:border-rose-600 focus-visible:ring-rose-500/25";

type AuthFieldBaseProps = {
	field: AnyFieldApi;
	id: string;
	label: string;
	labelRight?: ReactNode;
	placeholder?: string;
	autoComplete?: string;
	enterKeyHint?: "next" | "done";
	required?: boolean;
	onBlurError?: (label: string, error: string) => void;
	onErrorCleared?: () => void;
};

type AuthEmailFieldProps = AuthFieldBaseProps;

export function AuthEmailField({
	field,
	id,
	label,
	labelRight,
	placeholder = m.auth_email_placeholder(),
	autoComplete = "username",
	enterKeyHint = "next",
	required = true,
	onBlurError,
	onErrorCleared,
}: AuthEmailFieldProps) {
	const error = getFieldError(field);
	const hasError = Boolean(error);
	const errorId = `${id}-error`;

	return (
		<div>
			<div className="flex items-center justify-between gap-2 mb-1.5">
				<Label
					htmlFor={id}
					className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
				>
					{label}
				</Label>
				{labelRight}
			</div>

			<input
				id={id}
				name={field.name}
				type="email"
				required={required}
				autoComplete={autoComplete}
				autoCorrect="off"
				autoCapitalize="none"
				spellCheck={false}
				enterKeyHint={enterKeyHint}
				placeholder={placeholder}
				value={field.state.value}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={hasError ? errorId : undefined}
				onBlur={() => {
					field.handleBlur();
					const latestError = getLatestFieldError(field);
					if (latestError) {
						onBlurError?.(label, latestError);
					}
				}}
				onChange={(e) => {
					field.handleChange(e.target.value);
					if (hasError) onErrorCleared?.();
				}}
				className={cn(
					INPUT_BASE_CLASS,
					hasError ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS,
				)}
			/>

			<div className="min-h-5 mt-1.5">
				{hasError && (
					<p
						id={errorId}
						className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300"
					>
						<AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>{error}</span>
					</p>
				)}
			</div>
		</div>
	);
}

type AuthPasswordFieldProps = AuthFieldBaseProps & {
	minLength?: number;
};

export function AuthPasswordField({
	field,
	id,
	label,
	labelRight,
	placeholder = "••••••••",
	autoComplete = "current-password",
	enterKeyHint = "done",
	required = true,
	minLength,
	onBlurError,
	onErrorCleared,
}: AuthPasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false);
	const error = getFieldError(field);
	const hasError = Boolean(error);
	const errorId = `${id}-error`;
	const warningId = `${id}-toggle-warning`;

	return (
		<div>
			<div className="flex items-center justify-between gap-2 mb-1.5">
				<Label
					htmlFor={id}
					className="text-xs font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]"
				>
					{label}
				</Label>
				{labelRight}
			</div>

			<div className="relative">
				<input
					id={id}
					name={field.name}
					type={showPassword ? "text" : "password"}
					required={required}
					minLength={minLength}
					autoComplete={autoComplete}
					enterKeyHint={enterKeyHint}
					placeholder={placeholder}
					value={field.state.value}
					aria-invalid={hasError ? "true" : "false"}
					aria-describedby={hasError ? errorId : undefined}
					onBlur={() => {
						field.handleBlur();
						const latestError = getLatestFieldError(field);
						if (latestError) {
							onBlurError?.(label, latestError);
						}
					}}
					onChange={(e) => {
						field.handleChange(e.target.value);
						if (hasError) onErrorCleared?.();
					}}
					className={cn(
						INPUT_BASE_CLASS,
						"pr-12",
						hasError ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS,
					)}
				/>

				<button
					type="button"
					onClick={() => setShowPassword((prev) => !prev)}
					aria-pressed={showPassword}
					aria-label={
						showPassword
							? m.auth_hide_field({ field: label.toLowerCase() })
							: m.auth_show_field({ field: label.toLowerCase() })
					}
					aria-describedby={warningId}
					className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-[#687069] dark:text-[#9AA89E] hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:bg-[#EAE4D7]/50 dark:hover:bg-[#1E2E26] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A44] dark:focus-visible:ring-[#6EC89A]"
				>
					{showPassword ? (
						<EyeOff className="w-4 h-4" aria-hidden="true" />
					) : (
						<Eye className="w-4 h-4" aria-hidden="true" />
					)}
				</button>
				<span id={warningId} className="sr-only">
					{m.auth_password_visibility_warning()}
				</span>
			</div>

			<div className="min-h-5 mt-1.5">
				{hasError && (
					<p
						id={errorId}
						className="flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300"
					>
						<AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
						<span>{error}</span>
					</p>
				)}
			</div>
		</div>
	);
}
