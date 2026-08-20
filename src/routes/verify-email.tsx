import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/verify-email")({
	validateSearch: z.object({
		token: z.string().optional(),
		callbackURL: z.string().optional(),
	}),
	component: VerifyEmail,
});

function VerifyEmail() {
	const { token } = Route.useSearch();
	const navigate = useNavigate();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setErrorMessage("No verification token provided.");
			return;
		}

		const verify = async () => {
			const { error } = await authClient.verifyEmail({
				query: {
					token: token,
				},
			});

			if (error) {
				setStatus("error");
				setErrorMessage(error.message || "Failed to verify email.");
			} else {
				setStatus("success");
				// Redirect to login after 3 seconds
				setTimeout(() => {
					navigate({ to: "/login" });
				}, 3000);
			}
		};

		verify();
	}, [token, navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Email Verification
					</CardTitle>
					<CardDescription>
						{status === "loading" && "Verifying your email address..."}
						{status === "success" && "Email verified successfully!"}
						{status === "error" && "Verification failed"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{status === "loading" && (
						<div className="flex justify-center p-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900" />
						</div>
					)}
					{status === "success" && (
						<div className="p-4 text-sm text-green-600 bg-green-50 rounded-md">
							Your email has been verified. You will be redirected to login
							shortly.
						</div>
					)}
					{status === "error" && (
						<div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
							{errorMessage}
						</div>
					)}
				</CardContent>
				{status !== "loading" && (
					<CardFooter className="flex justify-center">
						<Button asChild variant="outline">
							<Link to="/login">Go to Login</Link>
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
