export type AppInstallPlatform = "ios" | "android" | "desktop";

type NavigatorUAData = {
	platform?: string;
};

type TemporalPlainDateLike = {
	toLocaleString: (
		locales?: string | string[],
		options?: Intl.DateTimeFormatOptions,
	) => string;
};

type TemporalGlobal = {
	PlainDate?: {
		from: (item: string) => TemporalPlainDateLike;
	};
};

/**
 * Infers a coarse client platform using User-Agent Client Hints first,
 * falling back to minimal platform/touch checks when UA-CH is unavailable.
 */
export function detectClientPlatform(): AppInstallPlatform {
	if (typeof navigator === "undefined") {
		return "desktop";
	}

	const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData })
		.userAgentData;
	const hintedPlatform = uaData?.platform?.toLowerCase();

	if (hintedPlatform) {
		if (hintedPlatform === "android") {
			return "android";
		}
		if (hintedPlatform === "ios") {
			return "ios";
		}
		if (
			hintedPlatform === "macos" ||
			hintedPlatform === "windows" ||
			hintedPlatform === "linux" ||
			hintedPlatform === "chrome os" ||
			hintedPlatform === "chromeos"
		) {
			return "desktop";
		}
	}

	const ua = navigator.userAgent;
	const isIos =
		/iPad|iPhone|iPod/i.test(ua) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
	if (isIos) {
		return "ios";
	}

	if (/Android/i.test(ua)) {
		return "android";
	}

	return "desktop";
}

function formatCalendarDate(
	isoDate: string,
	options: Intl.DateTimeFormatOptions,
): string {
	const temporal = (globalThis as { Temporal?: TemporalGlobal }).Temporal;
	if (temporal?.PlainDate) {
		try {
			return temporal.PlainDate.from(isoDate).toLocaleString("en-US", options);
		} catch {
			// Fall back to explicit UTC Date conversion below if parsing fails.
		}
	}

	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
	if (!match) {
		return isoDate;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const utcDate = new Date(Date.UTC(year, month - 1, day));

	return new Intl.DateTimeFormat("en-US", {
		...options,
		timeZone: "UTC",
	}).format(utcDate);
}

/**
 * Formats a YYYY-MM-DD calendar date into a short location-agnostic label (e.g. "Nov 28").
 */
export function formatCalendarDateLabel(isoDate: string): string {
	return formatCalendarDate(isoDate, {
		month: "short",
		day: "numeric",
	});
}

/**
 * Formats a YYYY-MM-DD calendar date into a full location-agnostic label (e.g. "Nov 28, 2026").
 */
export function formatCalendarDateLong(isoDate: string): string {
	return formatCalendarDate(isoDate, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
