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

const searchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
	validateSearch: searchSchema,
	component: Signup,
});

function Signup() {
	const search = Route.useSearch();
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
				toast.error("Passwords do not match");
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
				toast.error(error.message || "Failed to sign up");
			}
		},
	});

	return (
		<AuthShell
			title="Create Account"
			subtitle="Join PickItWell to save favorites and flag ingredients you avoid."
			callbackURL="/"
			errorCallbackURL="/signup"
			oauthError={search.error}
			footer={
				<>
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-bold text-[#1B4332] dark:text-emerald-300 hover:underline underline-offset-4"
					>
						Sign in
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
							label="Email Address"
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
							label="Password"
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
							if (!value) return "Please confirm your password";
							if (value !== fieldApi.form.getFieldValue("password")) {
								return "Passwords do not match";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<AuthPasswordField
							field={field}
							id="confirm-password"
							label="Confirm Password"
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
							idleLabel="Create Account"
							submittingLabel="Creating account..."
						/>
					)}
				</form.Subscribe>
			</form>
		</AuthShell>
	);
}
