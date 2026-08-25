import type { FieldApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/login")({
	component: Login,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
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

function Login() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
			});
			if (!error) {
				navigate({ to: "/" });
			} else {
				toast.error(error.message || "Failed to login");
			}
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white/10 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md border border-white/20 dark:bg-black/20">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-extrabold tracking-tight text-white">
						Welcome Back
					</h1>
					<p className="text-white/80 mt-2">
						Sign in to your account to continue
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
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
						children={(field) => (
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
					/>

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
						children={(field) => (
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<Label htmlFor={field.name} className="text-white">
										Password
									</Label>
									<a
										href="#"
										className="text-sm font-medium text-white/80 hover:text-white hover:underline"
									>
										Forgot password?
									</a>
								</div>
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
					/>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="w-full mt-4 bg-white text-purple-600 hover:bg-white/90 font-bold py-6 text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
							>
								{isSubmitting ? "Signing in..." : "Sign In"}
							</Button>
						)}
					/>
				</form>

				<div className="mt-8 text-center text-sm text-white/80">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="font-semibold text-white hover:underline"
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
