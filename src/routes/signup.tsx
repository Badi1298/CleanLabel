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

export const Route = createFileRoute("/signup")({
	component: Signup,
});

function Signup() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error } = await authClient.signUp.email({
					name: value.name,
					email: value.email,
					password: value.password,
				});

				if (error) {
					return {
						form: error.message || "Failed to create account",
					};
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
					<CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
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
							name="name"
							validators={{
								onChange: z
									.string()
									.min(2, "Name must be at least 2 characters"),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Name</Label>
									<Input
										id={field.name}
										type="text"
										placeholder="John Doe"
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
								onChange: z
									.string()
									.min(8, "Password must be at least 8 characters"),
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
									{isSubmitting ? "Creating account..." : "Sign Up"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-zinc-500">
						Already have an account?{" "}
						<Link to="/login" className="text-zinc-900 hover:underline">
							Log in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
