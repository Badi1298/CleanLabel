import type { WhyIconKey } from "#/components/landing/landing-data";

/**
 * Custom fine gold line-art icons for the "De ce PickItWell?" cards,
 * echoing the botanical stroke language of the category icons.
 */
export function WhyBenefitIcon({
	iconKey,
	className,
}: {
	iconKey: WhyIconKey;
	className?: string;
}) {
	switch (iconKey) {
		case "criterii":
			return (
				<svg
					viewBox="0 0 32 32"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className={className}
				>
					<path d="M7 5.5h12.5l5.5 5.5v15.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-19a2 2 0 0 1 2-2Z" />
					<path d="M19.5 5.5V11H25" />
					<path d="m10 17.5 2.5 2.5 5.5-5.5" />
					<path d="M10 23.5h8" />
				</svg>
			);

		case "grupe":
			return (
				<svg
					viewBox="0 0 32 32"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className={className}
				>
					<circle cx="16" cy="12" r="7" />
					<circle cx="16" cy="12" r="3.5" />
					<path d="M12.2 17.9 10 27.5l6-3.2 6 3.2-2.2-9.6" />
				</svg>
			);

		case "magazine":
			return (
				<svg
					viewBox="0 0 32 32"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className={className}
				>
					<path d="M4.5 11.5 7 5.5h18l2.5 6" />
					<path d="M4.5 11.5a2.875 2.875 0 0 0 5.75 0 2.875 2.875 0 0 0 5.75 0 2.875 2.875 0 0 0 5.75 0 2.875 2.875 0 0 0 5.75 0" />
					<path d="M6.5 14v12.5h19V14" />
					<path d="M13 26.5v-7.5h6v7.5" />
				</svg>
			);

		case "alegere":
			return (
				<svg
					viewBox="0 0 32 32"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className={className}
				>
					<path d="M25.5 6.5c-9.5.5-15.5 5-17.5 13.5 5.5 1 12-1 15.5-7.5" />
					<path d="M8 20c-.5 2.5-.5 4.5-.5 6.5" />
					<path d="M8 20c3-4.5 7.5-8 14-10.5" />
				</svg>
			);
	}
}
