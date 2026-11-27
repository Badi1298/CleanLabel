import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
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

const searchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: searchSchema,
	component: Login,
});

function Login() {
	const search = Route.useSearch();
	const formRef = useRef<HTMLFormElement>(null);
	const { announceError, clearAnnouncement, liveRegion } =
		useAuthErrorAnnouncer();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validationLogic: authValidationLogic,
		onSubmitInvalid: () => {
			clearAnnouncement();
			focusFirstInvalidField(formRef.current);
		},
		onSubmit: async ({ value }) => {
			clearAnnouncement();
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
			});
			if (!error) {
				window.location.href = search.redirect || "/";
			} else {
				toast.error(getLocalizedAuthError(error, m.auth_login_failed()));
			}
		},
	});

	return (
		<AuthShell
			title={m.auth_login_title()}
			subtitle={m.auth_login_subtitle()}
			footer={
				<>
					{m.auth_login_no_account()}{" "}
					<Link
						to="/signup"
						className="font-bold text-[#1B4332] dark:text-emerald-300 hover:underline underline-offset-4"
					>
						{m.auth_login_signup_link()}
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
							id="password"
							label={m.auth_password_label()}
							autoComplete="current-password"
							enterKeyHint="done"
							minLength={6}
							onBlurError={announceError}
							onErrorCleared={clearAnnouncement}
							labelRight={
								<Link
									to="/forgot-password"
									className="text-xs font-semibold text-[#2D5A44] dark:text-emerald-400 hover:text-[#1B4332] dark:hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
								>
									{m.auth_forgot_password_link()}
								</Link>
							}
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<AuthSubmitButton
							isSubmitting={isSubmitting}
							idleLabel={m.auth_login_submit()}
							submittingLabel={m.auth_login_submitting()}
						/>
					)}
				</form.Subscribe>
			</form>
		</AuthShell>
	);
}
