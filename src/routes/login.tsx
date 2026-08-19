import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error } = await authClient.signIn.email({
					email: value.email,
					password: value.password,
				});

				if (error) {
					return error.message || "Failed to login";
				}
				return null;
			},
		},
		onSubmit: async () => {
			navigate({ to: "/" });
		},
	});

	return (
		<div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.Subscribe selector={(state) => [state.errorMap]}>
							{([errorMap]) =>
								errorMap.onSubmit ? (
									<div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
										{errorMap.onSubmit.toString()}
									</div>
								) : null
							}
						</form.Subscribe>

						<form.Field
							name="email"
							validators={{
								onChange: z.string().email("Invalid email address"),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Email</Label>
									<Input
										id={field.name}
										type="email"
										placeholder="m@example.com"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors ? (
										<p className="text-sm text-red-500">
											{field.state.meta.errors
												.map((err) =>
													typeof err === "string"
														? err
														: (err as { message?: string })?.message ||
															String(err),
												)
												.join(", ")}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field
							name="password"
							validators={{
								onChange: z.string().min(1, "Password is required"),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Password</Label>
									<Input
										id={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors ? (
										<p className="text-sm text-red-500">
											{field.state.meta.errors
												.map((err) =>
													typeof err === "string"
														? err
														: (err as { message?: string })?.message ||
															String(err),
												)
												.join(", ")}
										</p>
									) : null}
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
									className="w-full"
								>
									{isSubmitting ? "Logging in..." : "Login"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-zinc-500">
						Don't have an account?{" "}
						<Link to="/signup" className="text-zinc-900 hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
