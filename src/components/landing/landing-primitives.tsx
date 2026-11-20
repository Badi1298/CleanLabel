import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

/**
 * Pure decorative botanical SVG accents echoing PickItWell's twin-leaf motif.
 */
export function BotanicalFlourish({
	variant = "divider",
	className,
}: {
	variant?: "divider" | "corner";
	className?: string;
}) {
	if (variant === "corner") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 220 220"
				fill="none"
				className={cn(
					"pointer-events-none select-none text-[#F2CF82]/14",
					className,
				)}
			>
				<path
					d="M12 204C58 184 96 146 130 98C152 67 176 38 206 16"
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="round"
				/>
				<path
					d="M84 146C74 124 81 98 103 86C112 108 105 134 84 146Z"
					stroke="currentColor"
					strokeWidth="1.15"
					fill="currentColor"
					fillOpacity="0.16"
				/>
				<path
					d="M126 102C146 109 170 100 180 79C160 72 136 81 126 102Z"
					stroke="currentColor"
					strokeWidth="1.15"
					fill="currentColor"
					fillOpacity="0.14"
				/>
				<path
					d="M158 60C151 42 158 24 176 16C183 34 176 52 158 60Z"
					stroke="currentColor"
					strokeWidth="1.1"
					fill="currentColor"
					fillOpacity="0.12"
				/>
			</svg>
		);
	}

	return (
		<div
			aria-hidden="true"
			className={cn("flex items-center justify-center gap-3", className)}
		>
			<span className="h-px w-12 sm:w-16 bg-linear-to-r from-transparent to-[#C99B42]/55 dark:to-[#E2B04E]/45" />
			<svg
				aria-hidden="true"
				viewBox="0 0 36 20"
				fill="none"
				className="w-8 h-4.5 text-[#A67C37] dark:text-[#E2B04E] shrink-0"
			>
				<path
					d="M18 17V9"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
				/>
				<path
					d="M18 12C13 11.5 9.5 8 9 3.5C13.5 4 17 7.5 18 12Z"
					stroke="currentColor"
					strokeWidth="1.35"
					fill="currentColor"
					fillOpacity="0.18"
					strokeLinejoin="round"
				/>
				<path
					d="M18 12C23 11.5 26.5 8 27 3.5C22.5 4 19 7.5 18 12Z"
					stroke="currentColor"
					strokeWidth="1.35"
					fill="currentColor"
					fillOpacity="0.18"
					strokeLinejoin="round"
				/>
			</svg>
			<span className="h-px w-12 sm:w-16 bg-linear-to-l from-transparent to-[#C99B42]/55 dark:to-[#E2B04E]/45" />
		</div>
	);
}

/**
 * Signature deep-emerald & fine-gold medallion matching PickItWell's category icon style.
 */
export function EmeraldGoldMedallion({
	Icon,
	className,
}: {
	Icon: LucideIcon;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative w-12 h-12 rounded-2xl bg-[radial-gradient(circle_at_50%_28%,#157050_0%,#0A4231_60%,#042A20_100%)] border border-[#E2B04E]/75 shadow-[0_6px_16px_rgba(4,42,32,0.22)] flex items-center justify-center shrink-0 before:content-[''] before:absolute before:inset-[3px] before:rounded-[13px] before:border before:border-[#F7E1A0]/30 before:pointer-events-none",
				className,
			)}
		>
			<Icon
				className="relative z-10 w-5 h-5 text-[#F3D58D]"
				strokeWidth={1.75}
				aria-hidden="true"
			/>
		</div>
	);
}

/**
 * Accessible scroll reveal wrapper using Motion while preserving static final visibility.
 */
export function ScrollReveal({
	children,
	delay = 0,
	className,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	const prefersReducedMotion = useReducedMotion();

	if (prefersReducedMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.16 }}
			transition={{
				duration: 0.55,
				delay,
				ease: [0.22, 1, 0.36, 1],
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
