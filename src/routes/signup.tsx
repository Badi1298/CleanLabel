import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Chrome } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: Signup,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<div className="min-h-5 mt-1">
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<em className="text-sm text-red-200">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className="text-sm text-white/70">Validating...</span>
			) : null}
		</div>
	);
}

function Signup() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			if (value.password !== value.confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}

			const { error } = await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.name,
			});
			if (!error) {
				navigate({ to: "/", replace: true });
			} else {
				toast.error(error.message || "Failed to sign up");
			}
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600 p-4">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white/10 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md border border-white/20 dark:bg-black/20">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-extrabold tracking-tight text-white">
						Create Account
					</h1>
					<p className="text-white/80 mt-2">Join us and start your journey</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-2"
				>
					<form.Field
						name="name"
						validators={{
							onChange: ({ value }) =>
								!value
									? "Name is required"
									: value.length < 2
										? "Name must be at least 2 characters"
										: undefined,
						}}
					>
						{(field) => (
							<div className="space-y-1">
								<Label htmlFor={field.name} className="text-white">
									Full Name
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
									placeholder="John Doe"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					</form.Field>

					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) =>
								!value
									? "Email is required"
									: !/^\S+@\S+\.\S+$/.test(value)
										? "Invalid email format"
										: undefined,
						}}
					>
						{(field) => (
							<div className="space-y-1">
								<Label htmlFor={field.name} className="text-white">
									Email Address
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
									placeholder="you@example.com"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					</form.Field>

					<form.Field
						name="password"
						validators={{
							onChange: ({ value }) =>
								!value
									? "Password is required"
									: value.length < 6
										? "Password must be at least 6 characters"
										: undefined,
						}}
					>
						{(field) => (
							<div className="space-y-1">
								<Label htmlFor={field.name} className="text-white">
									Password
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
									placeholder="••••••••"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					</form.Field>

					<form.Field
						name="confirmPassword"
						validators={{
							onChange: ({ value, fieldApi }) => {
								if (!value) return "Please confirm your password";
								if (value !== fieldApi.form.getFieldValue("password")) {
									return "Passwords do not match";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="space-y-1">
								<Label htmlFor={field.name} className="text-white">
									Confirm Password
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50"
									placeholder="••••••••"
								/>
								<FieldInfo field={field} />
							</div>
						)}
					</form.Field>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="w-full mt-4 bg-white text-teal-700 hover:bg-white/90 font-bold py-6 text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
							>
								{isSubmitting ? "Creating account..." : "Create Account"}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="relative mt-8">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-white/20" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-[#14b8a6] px-2 text-white/80 rounded-md">
							Or continue with
						</span>
					</div>
				</div>

				<Button
					variant="outline"
					type="button"
					className="w-full mt-6 bg-transparent text-white border-white/30 hover:bg-white/20 hover:text-white font-medium py-6 text-lg rounded-xl transition-all shadow-sm"
					onClick={async () => {
						await authClient.signIn.social({
							provider: "google",
						});
					}}
				>
					<Chrome className="mr-2 h-5 w-5" />
					Google
				</Button>

				<div className="mt-6 text-center text-sm text-white/80">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-semibold text-white hover:underline"
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
