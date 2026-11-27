import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

export const SUPPORTED_LOCALES = ["ro", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_COOKIE_NAME = "PARAGLIDE_LOCALE";

export function isAppLocale(value: unknown): value is AppLocale {
	return value === "ro" || value === "en";
}

export function hasLocaleCookie(): boolean {
	if (typeof document === "undefined") return false;
	return document.cookie
		.split(";")
		.some((part) => part.trim().startsWith(`${LOCALE_COOKIE_NAME}=`));
}

export function getIntlLocale(locale: AppLocale = getLocale()): string {
	return locale === "ro" ? "ro-RO" : "en-US";
}

export function formatLocalizedDate(
	date: Date | string | number,
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
	locale: AppLocale = getLocale(),
): string {
	const parsed = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsed.getTime())) return "";
	return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(parsed);
}

export function formatLocalizedNumber(
	value: number,
	options?: Intl.NumberFormatOptions,
	locale: AppLocale = getLocale(),
): string {
	return new Intl.NumberFormat(getIntlLocale(locale), options).format(value);
}

type AuthErrorLike =
	| {
			code?: string | null;
			message?: string | null;
	  }
	| null
	| undefined;

export function getLocalizedAuthError(
	error: AuthErrorLike,
	fallback: string,
): string {
	const code = error?.code?.toUpperCase();
	switch (code) {
		case "INVALID_EMAIL_OR_PASSWORD":
			return m.auth_error_invalid_credentials();
		case "USER_ALREADY_EXISTS":
		case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
			return m.auth_error_user_exists();
		case "INVALID_TOKEN":
		case "TOKEN_EXPIRED":
			return m.auth_error_invalid_token();
		case "PASSWORD_TOO_SHORT":
			return m.auth_error_password_too_short();
		case "PASSWORD_TOO_LONG":
			return m.auth_error_password_too_long();
		case "INVALID_EMAIL":
			return m.auth_error_invalid_email();
		case "USER_NOT_FOUND":
			return m.auth_error_user_not_found();
		case "TOO_MANY_REQUESTS":
			return m.auth_error_too_many_requests();
		default:
			return fallback;
	}
}

export function getLocalizedServerError(
	error: unknown,
	fallback: string = m.errors_generic(),
): string {
	const rawMessage = error instanceof Error ? error.message.trim() : "";

	switch (rawMessage) {
		case "Unauthorized":
			return m.errors_unauthorized();
		case "Product not found":
			return m.errors_product_not_found();
		case "Submission not found":
			return m.errors_submission_not_found();
		case "At least one store is required.":
		case "A valid store must be selected or created":
			return m.errors_store_required();
		case "Category not found":
			return m.errors_category_not_found();
		case "Ingredient not found":
			return m.errors_ingredient_not_found();
		default:
			return fallback;
	}
}
