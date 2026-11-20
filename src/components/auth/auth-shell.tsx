import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "#/components/brand-logo";
import { ScoreBadge } from "#/components/ui/score-badge";
import { authClient } from "#/lib/auth-client";

type AuthShellProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
};

function GoogleMark() {
	return (
		<svg
			className="h-4.5 w-4.5 shrink-0"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<title>Google</title>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

/**
 * Shared botanical grocery shell for authentication routes.
 * Keeps the hero compact on mobile so inputs and submit stay above the keyboard.
 */
export function AuthShell({
	title,
	subtitle,
	children,
	footer,
}: AuthShellProps) {
	const [isGooglePending, setIsGooglePending] = useState(false);

	const handleGoogleSignIn = async () => {
		setIsGooglePending(true);
		try {
			const result = await authClient.signIn.social({
				provider: "google",
			});
			if (result?.error) {
				toast.error(result.error.message || "Failed to continue with Google");
				setIsGooglePending(false);
			}
		} catch {
			toast.error("Failed to continue with Google");
			setIsGooglePending(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0E1612] text-[#1B3328] dark:text-[#EDF2EE]">
			{/* Deep Botanical Forest Hero */}
			<header className="relative overflow-hidden bg-[#1B4332] text-[#FBF4E6] rounded-b-[1.75rem] md:rounded-b-[2.5rem] shadow-[0_12px_32px_rgba(27,67,50,0.16)] pt-7 pb-14 sm:pt-10 sm:pb-16 px-4">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,244,230,0.12),transparent_58%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 max-w-md mx-auto text-center">
					<Link
						to="/landing"
						className="inline-flex items-center justify-center rounded-2xl px-2 py-1 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
					>
						<BrandLogo surface="dark" size="lg" />
					</Link>

					<h1 className="mt-3.5 text-[2rem] sm:text-4xl font-extrabold tracking-tight leading-[1.06] text-[#FCE8C6]">
						{title}
					</h1>
					<p className="mt-1.5 text-xs sm:text-sm text-[#FCE8C6]/80 font-medium max-w-sm mx-auto">
						{subtitle}
					</p>
				</div>
			</header>

			{/* Centered Auth Card */}
			<main className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 -mt-8 sm:-mt-9 pb-10 flex flex-col items-center">
				<div className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] shadow-[0_12px_32px_rgba(27,67,50,0.08)] p-5 sm:p-7">
					{children}

					<div className="relative my-6">
						<div
							className="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<span className="w-full border-t border-[#EAE4D7] dark:border-[#24362D]" />
						</div>
						<div className="relative flex justify-center">
							<span className="bg-white dark:bg-[#16221C] px-3 text-[11px] font-bold uppercase tracking-wider text-[#5C665E] dark:text-[#9AA89E]">
								Or continue with
							</span>
						</div>
					</div>

					<button
						type="button"
						disabled={isGooglePending}
						onClick={handleGoogleSignIn}
						className="w-full min-h-12 px-4 rounded-xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#2B3D33] text-[#1B3328] dark:text-[#EDF2EE] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2E26] hover:border-[#C9B382] dark:hover:border-[#365043] font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A44] dark:focus-visible:ring-[#6EC89A]"
					>
						<GoogleMark />
						<span>
							{isGooglePending
								? "Connecting to Google..."
								: "Continue with Google"}
						</span>
					</button>

					<div className="mt-6 pt-5 border-t border-[#F0EAE0] dark:border-[#22332A] text-center text-sm text-[#5C665E] dark:text-[#9AA89E]">
						{footer}
					</div>
				</div>

				{/* Secondary scoring cue placed below the form so mobile keyboards never cover submit */}
				<div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5C665E] dark:text-[#9AA89E]">
					<span className="font-medium">Transparent ingredient scoring</span>
					<span aria-hidden="true" className="text-[#C9B382]">
						&bull;
					</span>
					<div className="inline-flex items-center gap-1.5">
						<ScoreBadge score="gold" size="sm" />
						<ScoreBadge score="silver" size="sm" />
						<ScoreBadge score="bronze" size="sm" />
					</div>
				</div>

				<div className="mt-3 text-center">
					<Link
						to="/landing"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D5A44] dark:text-emerald-400 hover:text-[#1B4332] dark:hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
					>
						<span>Vezi prezentarea aplicației</span>
						<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
					</Link>
				</div>
			</main>
		</div>
	);
}
