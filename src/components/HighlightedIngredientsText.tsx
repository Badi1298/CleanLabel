import { Fragment } from "react";
import { splitTextWithHighlights } from "#/lib/additive-highlighting";
import { cn } from "#/lib/utils";

export function HighlightedIngredientsText({
	text,
	highlightedAdditives,
	className,
}: {
	text: string;
	highlightedAdditives?: string[] | null;
	className?: string;
}) {
	const segments = splitTextWithHighlights(text, highlightedAdditives ?? []);

	let charOffset = 0;
	const keyedSegments = segments.map((segment) => {
		const key = `${segment.highlighted ? "mark" : "text"}-${charOffset}`;
		charOffset += segment.text.length;
		return { ...segment, key };
	});

	return (
		<p className={cn("whitespace-pre-wrap", className)}>
			{keyedSegments.map((segment) =>
				segment.highlighted ? (
					<mark
						key={segment.key}
						className="inline box-decoration-clone rounded-md bg-amber-100/95 dark:bg-amber-950/75 border border-amber-400/75 dark:border-amber-600/70 text-[#78350F] dark:text-amber-200 px-1 py-0.5 font-semibold"
					>
						{segment.text}
					</mark>
				) : (
					<Fragment key={segment.key}>{segment.text}</Fragment>
				),
			)}
		</p>
	);
}
