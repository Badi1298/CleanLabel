import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import {
	AuthEmailField,
	AuthPasswordField,
	AuthSubmitButton,
	authValidationLogic,
	focusFirstInvalidField,
	useAuthErrorAnnouncer,
	validateEmail,
	validatePassword,
} from "#/components/auth/auth-fields";
import { AuthShell } from "#/components/auth/auth-shell";
import { authClient } from "#/lib/auth-client";
import { getLocalizedAuthError } from "#/lib/i18n";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/signup")({
	component: Signup,
});

function Signup() {
	const formRef = useRef<HTMLFormElement>(null);
	const { announceError, clearAnnouncement, liveRegion } =
		useAuthErrorAnnouncer();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		validationLogic: authValidationLogic,
		onSubmitInvalid: () => {
			clearAnnouncement();
			focusFirstInvalidField(formRef.current);
		},
		onSubmit: async ({ value }) => {
			clearAnnouncement();
			if (value.password !== value.confirmPassword) {
				toast.error(m.auth_passwords_mismatch());
				return;
			}

			const { error } = await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.email.split("@")[0],
			});
			if (!error) {
				window.location.href = "/";
			} else {
				toast.error(getLocalizedAuthError(error, m.auth_signup_failed()));
			}
		},
	});

	return (
		<AuthShell
			title={m.auth_signup_title()}
			subtitle={m.auth_signup_subtitle()}
			footer={
				<>
					{m.auth_signup_has_account()}{" "}
					<Link
						to="/login"
						className="font-bold text-[#1B4332] dark:text-emerald-300 hover:underline underline-offset-4"
					>
						{m.auth_signup_login_link()}
					</Link>
				</>
			}
		>
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
							id="email"
							label={m.auth_email_label()}
							autoComplete="username"
							enterKeyHint="next"
							onBlurError={announceError}
							onErrorCleared={clearAnnouncement}
						/>
					)}
				</form.Field>

				<form.Field
					name="password"
					validators={{
						onDynamic: ({ value }) => validatePassword(value),
					}}
				>
					{(field) => (
						<AuthPasswordField
							field={field}
							id="new-password"
							label={m.auth_password_label()}
							autoComplete="new-password"
							enterKeyHint="next"
							minLength={6}
							onBlurError={announceError}
							onErrorCleared={clearAnnouncement}
						/>
					)}
				</form.Field>

				<form.Field
					name="confirmPassword"
					validators={{
						onDynamic: ({ value, fieldApi }) => {
							if (!value) return m.auth_password_confirm_required();
							if (value !== fieldApi.form.getFieldValue("password")) {
								return m.auth_passwords_mismatch();
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<AuthPasswordField
							field={field}
							id="confirm-password"
							label={m.auth_confirm_password_label()}
							autoComplete="new-password"
							enterKeyHint="done"
							minLength={6}
							onBlurError={announceError}
							onErrorCleared={clearAnnouncement}
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<AuthSubmitButton
							isSubmitting={isSubmitting}
							idleLabel={m.auth_signup_submit()}
							submittingLabel={m.auth_signup_submitting()}
						/>
					)}
				</form.Subscribe>
			</form>
		</AuthShell>
	);
}
