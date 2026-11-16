import { Award, Sparkles } from "lucide-react";
import { cn } from "#/lib/utils";

export type ProductScoreTier =
	| "gold"
	| "silver"
	| "bronze"
	| "none"
	| string
	| null
	| undefined;

type ScoreBadgeProps = {
	score: ProductScoreTier;
	size?: "sm" | "md";
	className?: string;
};

const TIER_STYLES = {
	gold: {
		label: "Gold",
		container:
			"bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/50",
		Icon: Sparkles,
	},
	silver: {
		label: "Silver",
		container:
			"bg-[#F1F5F9] text-[#334155] border-[#CBD5E1] dark:bg-slate-800/90 dark:text-slate-200 dark:border-slate-700",
		Icon: Award,
	},
	bronze: {
		label: "Bronze",
		container:
			"bg-[#FFEDD5] text-[#9A3412] border-[#FDBA74]/60 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800/50",
		Icon: Award,
	},
} as const;

/**
 * Semantic tier pill badge for Gold / Silver / Bronze product scores.
 */
export function ScoreBadge({ score, size = "sm", className }: ScoreBadgeProps) {
	if (score !== "gold" && score !== "silver" && score !== "bronze") {
		return null;
	}

	const config = TIER_STYLES[score];
	const { Icon } = config;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full border font-bold tracking-tight shadow-2xs select-none",
				size === "sm"
					? "px-2 py-0.5 text-[11px] leading-none"
					: "px-2.5 py-1 text-xs leading-none",
				config.container,
				className,
			)}
		>
			<Icon
				className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5", "shrink-0")}
				strokeWidth={2.2}
				aria-hidden="true"
			/>
			<span>{config.label}</span>
		</span>
	);
}
