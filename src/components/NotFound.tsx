import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "#/components/ui/button";

export function NotFound({ children }: { children?: React.ReactNode }) {
	const router = useRouter();

	return (
		<div className="flex h-dvh w-full flex-col items-center justify-center bg-background p-4 text-center">
			<div className="flex max-w-md flex-col items-center justify-center space-y-6">
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
					<SearchX className="h-12 w-12 text-muted-foreground" />
				</div>

				<div className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
						404
					</h1>
					<p className="text-xl font-medium text-foreground">Page not found</p>
					<p className="text-base text-muted-foreground">
						{children ||
							"The page you are looking for doesn't exist or has been moved."}
					</p>
				</div>

				<div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
					<Button
						variant="outline"
						className="gap-2"
						onClick={() => router.history.back()}
					>
						<ArrowLeft className="h-4 w-4" />
						Go Back
					</Button>

					<Button asChild className="gap-2" variant="outline">
						<Link to="/">
							<Home className="h-4 w-4" />
							Back to Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
