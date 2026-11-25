import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	AuthPasswordField,
	AuthSubmitButton,
	authValidationLogic,
	focusFirstInvalidField,
	useAuthErrorAnnouncer,
} from "#/components/auth/auth-fields";
import { AuthShell } from "#/components/auth/auth-shell";
import { authClient } from "#/lib/auth-client";

const searchSchema = z.object({
	token: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
	validateSearch: searchSchema,
	component: ResetPassword,
});

function validateNewPassword(value: string) {
	if (!value) return "Password is required";
	if (value.length < 8) return "Password must be at least 8 characters";
	return undefined;
}

function ResetPassword() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const formRef = useRef<HTMLFormElement>(null);
	const { announceError, clearAnnouncement, liveRegion } =
		useAuthErrorAnnouncer();

	const hasInvalidToken = search.error === "INVALID_TOKEN" || !search.token;

	const form = useForm({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validationLogic: authValidationLogic,
		onSubmitInvalid: () => {
			clearAnnouncement();
			focusFirstInvalidField(formRef.current);
		},
		onSubmit: async ({ value }) => {
			clearAnnouncement();
			if (!search.token) return;

			if (value.newPassword !== value.confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}

			const { error } = await authClient.resetPassword({
				newPassword: value.newPassword,
				token: search.token,
			});
			if (!error) {
				toast.success("Password updated. You can now sign in.");
				navigate({ to: "/login" });
			} else {
				toast.error(
					error.message ||
						"Failed to reset password. Your link may have expired.",
				);
			}
		},
	});

	return (
		<AuthShell
			title="Reset Password"
			subtitle="Choose a new password of at least 8 characters for your account."
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
			{hasInvalidToken ? (
				<output aria-live="polite" className="block space-y-4 text-center">
					<div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 flex items-center justify-center">
						<AlertTriangle className="w-6 h-6" aria-hidden="true" />
					</div>
					<div className="space-y-1.5">
						<h2 className="text-lg font-extrabold text-[#1B3328] dark:text-[#EDF2EE]">
							Invalid or expired link
						</h2>
						<p className="text-sm text-[#5C665E] dark:text-[#9AA89E] leading-relaxed">
							This password reset link is missing or has expired. Please request
							a new one.
						</p>
					</div>
					<Link
						to="/forgot-password"
						className="inline-flex w-full min-h-12 items-center justify-center px-5 py-3 rounded-xl bg-[#1B4332] text-[#FCE8C6] hover:bg-[#245540] dark:bg-[#CBE3D4] dark:text-[#12241B] dark:hover:bg-[#DCECE2] font-bold text-sm transition-colors"
					>
						Request New Reset Link
					</Link>
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
						name="newPassword"
						validators={{
							onDynamic: ({ value }) => validateNewPassword(value),
						}}
					>
						{(field) => (
							<AuthPasswordField
								field={field}
								id="reset-new-password"
								label="New Password"
								autoComplete="new-password"
								enterKeyHint="next"
								minLength={8}
								onBlurError={announceError}
								onErrorCleared={clearAnnouncement}
							/>
						)}
					</form.Field>

					<form.Field
						name="confirmPassword"
						validators={{
							onDynamic: ({ value, fieldApi }) => {
								if (!value) return "Please confirm your password";
								if (value !== fieldApi.form.getFieldValue("newPassword")) {
									return "Passwords do not match";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<AuthPasswordField
								field={field}
								id="reset-confirm-password"
								label="Confirm Password"
								autoComplete="new-password"
								enterKeyHint="done"
								minLength={8}
								onBlurError={announceError}
								onErrorCleared={clearAnnouncement}
							/>
						)}
					</form.Field>

					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								isSubmitting={isSubmitting}
								idleLabel="Reset Password"
								submittingLabel="Resetting password..."
							/>
						)}
					</form.Subscribe>
				</form>
			)}
		</AuthShell>
	);
}
