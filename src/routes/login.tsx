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
				toast.error(error.message || "Failed to login");
			}
		},
	});

	return (
		<AuthShell
			title="Welcome Back"
			subtitle="Sign in to your account to continue making clean grocery choices."
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link
						to="/signup"
						className="font-bold text-[#1B4332] dark:text-emerald-300 hover:underline underline-offset-4"
					>
						Sign up
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
							id="password"
							label="Password"
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
									Forgot password?
								</Link>
							}
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<AuthSubmitButton
							isSubmitting={isSubmitting}
							idleLabel="Sign In"
							submittingLabel="Signing in..."
						/>
					)}
				</form.Subscribe>
			</form>
		</AuthShell>
	);
}
