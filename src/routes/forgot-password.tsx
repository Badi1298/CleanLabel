import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
	AuthEmailField,
	AuthSubmitButton,
	authValidationLogic,
	focusFirstInvalidField,
	useAuthErrorAnnouncer,
	validateEmail,
} from "#/components/auth/auth-fields";
import { AuthShell } from "#/components/auth/auth-shell";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword() {
	const formRef = useRef<HTMLFormElement>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { announceError, clearAnnouncement, liveRegion } =
		useAuthErrorAnnouncer();

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validationLogic: authValidationLogic,
		onSubmitInvalid: () => {
			clearAnnouncement();
			focusFirstInvalidField(formRef.current);
		},
		onSubmit: async ({ value }) => {
			clearAnnouncement();
			const { error } = await authClient.requestPasswordReset({
				email: value.email.trim(),
				redirectTo: `${window.location.origin}/reset-password`,
			});
			if (!error) {
				setIsSubmitted(true);
			} else {
				toast.error(
					error.message || "Could not send reset link. Please try again.",
				);
			}
		},
	});

	return (
		<AuthShell
			title="Forgot Password"
			subtitle="Enter your email address and we'll send you a link to reset your password."
			showSocialAuth={false}
			footer={
				<>
					Remember your password?{" "}
					<Link
						to="/login"
						className="font-bold text-[#1B4332] dark:text-emerald-300 hover:underline underline-offset-4"
					>
						Back to sign in
					</Link>
				</>
			}
		>
			{isSubmitted ? (
				<output aria-live="polite" className="block space-y-4 text-center">
					<div className="mx-auto w-12 h-12 rounded-2xl bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center">
						<MailCheck className="w-6 h-6" aria-hidden="true" />
					</div>
					<div className="space-y-1.5">
						<h2 className="text-lg font-extrabold text-[#1B3328] dark:text-[#EDF2EE]">
							Check your inbox
						</h2>
						<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] leading-relaxed">
							If an account exists for that email address, you&apos;ll receive a
							password reset link shortly.
						</p>
					</div>
					<div className="pt-2 flex flex-col gap-2.5">
						<button
							type="button"
							onClick={() => {
								setIsSubmitted(false);
								form.reset();
							}}
							className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-sm font-bold text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer"
						>
							Try another email
						</button>
					</div>
				</output>
			) : (
				<form
					ref={formRef}
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-2.5"
				>
					{liveRegion}

					<form.Field
						name="email"
						validators={{
							onDynamic: ({ value }) => validateEmail(value),
						}}
					>
						{(field) => (
							<AuthEmailField
								field={field}
								id="forgot-email"
								label="Email Address"
								autoComplete="username"
								enterKeyHint="done"
								onBlurError={announceError}
								onErrorCleared={clearAnnouncement}
							/>
						)}
					</form.Field>

					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								isSubmitting={isSubmitting}
								idleLabel="Send Reset Link"
								submittingLabel="Sending reset link..."
							/>
						)}
					</form.Subscribe>
				</form>
			)}
		</AuthShell>
	);
}
