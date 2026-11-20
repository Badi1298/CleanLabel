import { cn } from "#/lib/utils";

const STORE_AVATAR_PALETTES = [
	"bg-[#E3EDE7] text-[#1B4332] border-[#C8DBD0] dark:bg-[#1E3A2C] dark:text-[#CBE3D4] dark:border-[#2E5440]",
	"bg-[#FCE8C6] text-[#6B4411] border-[#EED3A1] dark:bg-[#332714] dark:text-[#FCE8C6] dark:border-[#4D3B1E]",
	"bg-sky-50 text-sky-900 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800/50",
	"bg-rose-50 text-rose-900 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800/50",
	"bg-amber-50 text-amber-900 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800/50",
	"bg-purple-50 text-purple-900 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800/50",
] as const;

function getStoreInitials(name: string): string {
	const words = name
		.trim()
		.split(/\s+/)
		.filter((w) => w.length > 0);
	if (words.length === 0) return "S";
	if (words.length === 1) {
		return words[0].slice(0, 2).toUpperCase();
	}
	return (words[0][0] + words[1][0]).toUpperCase();
}

function getPaletteForStore(name: string) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
	}
	return STORE_AVATAR_PALETTES[hash % STORE_AVATAR_PALETTES.length];
}

type StoreAvatarProps = {
	name: string;
	logoUrl?: string | null;
	size?: "xs" | "sm" | "md" | "lg";
	className?: string;
};

const SIZE_CLASSES = {
	xs: "w-5 h-5 text-[9px] rounded-full",
	sm: "w-6 h-6 text-[10px] rounded-full",
	md: "w-10 h-10 text-xs rounded-xl",
	lg: "w-12 h-12 text-sm rounded-2xl",
} as const;

/**
 * Displays a store's custom icon if configured, or a crisp copyright-safe
 * monogram badge harmonized with the Botanical Grocery palette.
 */
export function StoreAvatar({
	name,
	logoUrl,
	size = "md",
	className,
}: StoreAvatarProps) {
	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt=""
				className={cn(
					"object-cover shrink-0 border border-[#EAE4D7] dark:border-[#24362D] bg-white",
					SIZE_CLASSES[size],
					className,
				)}
				loading="lazy"
			/>
		);
	}

	const initials = getStoreInitials(name);
	const palette = getPaletteForStore(name);

	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-flex items-center justify-center shrink-0 border font-extrabold tracking-tight select-none",
				SIZE_CLASSES[size],
				palette,
				className,
			)}
		>
			{initials}
		</span>
	);
}
