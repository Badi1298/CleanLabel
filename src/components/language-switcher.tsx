import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import type { AppLocale } from "#/lib/i18n";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";
import { getLocale, setLocale } from "#/paraglide/runtime.js";
import { updatePreferredLocale } from "#/server/locale-functions";

function RomaniaFlagIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 18"
			aria-hidden="true"
			className={cn(
				"w-4 h-3 rounded-[2px] shrink-0 shadow-[0_0_0_0.5px_rgba(0,0,0,0.16)]",
				className,
			)}
		>
			<rect width="8" height="18" x="0" y="0" fill="#002B7F" />
			<rect width="8" height="18" x="8" y="0" fill="#FCD116" />
			<rect width="8" height="18" x="16" y="0" fill="#CE1126" />
		</svg>
	);
}

function UkFlagIcon({ className }: { className?: string }) {
	const clipId = useId();
	return (
		<svg
			viewBox="0 0 24 18"
			aria-hidden="true"
			className={cn(
				"w-4 h-3 rounded-[2px] shrink-0 shadow-[0_0_0_0.5px_rgba(0,0,0,0.16)]",
				className,
			)}
		>
			<clipPath id={clipId}>
				<rect width="24" height="18" rx="1.5" />
			</clipPath>
			<g clipPath={`url(#${clipId})`}>
				<rect width="24" height="18" fill="#012169" />
				<path d="M0 0L24 18M24 0L0 18" stroke="#FFFFFF" strokeWidth="3.6" />
				<path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="1.8" />
				<path d="M12 0V18M0 9H24" stroke="#FFFFFF" strokeWidth="5.5" />
				<path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="3.2" />
			</g>
		</svg>
	);
}

function LocaleFlag({
	locale,
	className,
}: {
	locale: AppLocale;
	className?: string;
}) {
	return locale === "ro" ? (
		<RomaniaFlagIcon className={className} />
	) : (
		<UkFlagIcon className={className} />
	);
}

export function LanguageSwitcher({
	surface = "light",
	isSignedIn = false,
	showNativeLabel = false,
	className,
}: {
	surface?: "dark" | "light";
	isSignedIn?: boolean;
	showNativeLabel?: boolean;
	className?: string;
}) {
	const [isSwitching, setIsSwitching] = useState(false);
	const currentLocale: AppLocale = getLocale() === "en" ? "en" : "ro";

	const options: Array<{
		code: AppLocale;
		shortLabel: string;
		nativeLabel: string;
	}> = [
		{ code: "ro", shortLabel: "RO", nativeLabel: m.nav_language_ro() },
		{ code: "en", shortLabel: "EN", nativeLabel: m.nav_language_en() },
	];

	const activeOption =
		options.find((opt) => opt.code === currentLocale) ?? options[0];

	const handleSelectLocale = async (nextLocale: AppLocale) => {
		if (nextLocale === currentLocale || isSwitching) return;
		setIsSwitching(true);

		if (isSignedIn) {
			try {
				await updatePreferredLocale({ data: { locale: nextLocale } });
			} catch {
				// Cookie switch still proceeds locally even if DB sync fails
			}
		}

		setLocale(nextLocale);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					disabled={isSwitching}
					aria-label={m.nav_language_switcher_label()}
					className={cn(
						"inline-flex items-center justify-center gap-1.5 min-h-9 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer touch-manipulation shrink-0 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2",
						surface === "dark"
							? "bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 border border-[#FCE8C6]/20 text-[#FCE8C6] focus-visible:outline-[#D8AB54]"
							: "bg-white dark:bg-[#16221C] hover:bg-[#F3EFE6] dark:hover:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] focus-visible:outline-[#1B4332]",
						className,
					)}
				>
					<LocaleFlag locale={activeOption.code} />
					<span>
						{showNativeLabel
							? activeOption.nativeLabel
							: activeOption.shortLabel}
					</span>
					<ChevronDown className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				sideOffset={6}
				className="min-w-40 rounded-xl border-[#EAE4D7] dark:border-[#24362D] bg-white dark:bg-[#16221C] p-1 text-[#1B3328] dark:text-[#EDF2EE] shadow-xl"
			>
				{options.map((option) => {
					const isActive = option.code === currentLocale;
					return (
						<DropdownMenuItem
							key={option.code}
							onSelect={() => {
								void handleSelectLocale(option.code);
							}}
							className={cn(
								"flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer",
								isActive
									? "bg-[#E3EDE7] dark:bg-[#1E3A2C] text-[#1B4332] dark:text-[#CBE3D4]"
									: "text-[#1B3328] dark:text-[#EDF2EE] focus:bg-[#F3EFE6] dark:focus:bg-[#1E2C25]",
							)}
						>
							<span className="flex items-center gap-2.5">
								<LocaleFlag locale={option.code} />
								<span>{option.nativeLabel}</span>
							</span>
							{isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
