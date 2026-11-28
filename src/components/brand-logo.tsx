import { cn } from "#/lib/utils";

interface BrandLogoProps {
	/**
	 * "adaptive": subtle #1B4332 forest pill in light mode, bare on dark mode.
	 * "dark": always bare (for surfaces that are already #1B4332 / dark).
	 */
	surface?: "adaptive" | "dark";
	size?: "xs" | "sm" | "md" | "lg";
	alt?: string;
	loading?: "eager" | "lazy";
	className?: string;
}

const PILL_PADDING: Record<NonNullable<BrandLogoProps["size"]>, string> = {
	xs: "px-2 py-0.5",
	sm: "px-2.5 py-1",
	md: "px-3 py-1.5",
	lg: "px-3.5 py-2",
};

const ADAPTIVE_IMG_SIZE: Record<NonNullable<BrandLogoProps["size"]>, string> = {
	xs: "h-5 dark:h-6",
	sm: "h-6.5 dark:h-8",
	md: "h-9 dark:h-11",
	lg: "h-12 dark:h-14",
};

const DARK_IMG_SIZE: Record<NonNullable<BrandLogoProps["size"]>, string> = {
	xs: "h-6",
	sm: "h-7",
	md: "h-11",
	lg: "h-14",
};

export function BrandLogo({
	surface = "adaptive",
	size = "md",
	alt = "PickItWell",
	loading = "eager",
	className,
}: BrandLogoProps) {
	if (surface === "dark") {
		return (
			<img
				src="/pickitwell-logo.png"
				alt={alt}
				width={524}
				height={292}
				loading={loading}
				decoding="async"
				className={cn(
					DARK_IMG_SIZE[size],
					"w-auto object-contain shrink-0",
					className,
				)}
			/>
		);
	}

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center shrink-0 rounded-xl bg-[#1B4332] ring-1 ring-[#1B4332]/12 shadow-[0_2px_8px_rgba(27,67,50,0.16)] dark:bg-transparent dark:ring-0 dark:shadow-none dark:p-0",
				PILL_PADDING[size],
				className,
			)}
		>
			<img
				src="/pickitwell-logo.png"
				alt={alt}
				width={524}
				height={292}
				loading={loading}
				decoding="async"
				className={cn(ADAPTIVE_IMG_SIZE[size], "w-auto object-contain")}
			/>
		</span>
	);
}
