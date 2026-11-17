import bronzeBadge from "#/assets/bronze-badge.png";
import goldBadge from "#/assets/gold-badge.png";
import silverBadge from "#/assets/silver-badge.png";
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

const TIER_BADGES = {
	gold: {
		label: "Gold",
		src: goldBadge,
	},
	silver: {
		label: "Silver",
		src: silverBadge,
	},
	bronze: {
		label: "Bronze",
		src: bronzeBadge,
	},
} as const;

/**
 * Semantic tier image badge for Gold / Silver / Bronze product scores.
 */
export function ScoreBadge({ score, size = "sm", className }: ScoreBadgeProps) {
	if (score !== "gold" && score !== "silver" && score !== "bronze") {
		return null;
	}

	const badge = TIER_BADGES[score];

	return (
		<img
			src={badge.src}
			alt={badge.label}
			width={1650}
			height={476}
			decoding="async"
			draggable={false}
			className={cn(
				"w-auto shrink-0 object-contain select-none",
				size === "sm" ? "h-6" : "h-7",
				className,
			)}
		/>
	);
}
