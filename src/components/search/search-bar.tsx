import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages.js";

type SearchBarProps = {
	initialQuery?: string;
	className?: string;
	variant?: "default" | "hero";
	placeholder?: string;
	ariaLabel?: string;
	showSubmitButton?: boolean;
	trailingSlot?: React.ReactNode;
	onSubmitQuery?: (query: string | undefined) => void;
	onChangeQuery?: (value: string) => void;
};

export function SearchBar({
	initialQuery = "",
	className = "",
	variant = "default",
	placeholder,
	ariaLabel,
	showSubmitButton = true,
	trailingSlot,
	onSubmitQuery,
	onChangeQuery,
}: SearchBarProps) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const resolvedPlaceholder = placeholder ?? m.search_bar_placeholder();
	const resolvedAriaLabel = ariaLabel ?? m.search_bar_aria();

	const submitQuery = (nextQuery: string | undefined) => {
		if (onSubmitQuery) {
			onSubmitQuery(nextQuery);
			return;
		}
		navigate({
			to: "/search",
			search: (prev: Record<string, unknown>) => ({
				...prev,
				q: nextQuery,
			}),
		});
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchQuery.trim();
		submitQuery(trimmed ? trimmed : undefined);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		onChangeQuery?.(value);
	};

	const handleClear = () => {
		setSearchQuery("");
		onChangeQuery?.("");
		if (initialQuery.trim()) {
			submitQuery(undefined);
		}
	};

	const isHero = variant === "hero";

	const formFields = (
		<>
			<Button
				type="submit"
				variant="ghost"
				size="icon"
				aria-label={m.common_search()}
				className="w-auto h-full rounded-none pl-4 pr-2 py-0 text-[#687069] hover:text-[#1B4332] hover:bg-transparent dark:text-[#9AA89E] dark:hover:text-[#FCE8C6] dark:hover:bg-transparent shrink-0"
			>
				<Search className="w-4.5 h-4.5" strokeWidth={2} aria-hidden="true" />
			</Button>

			<Input
				type="search"
				placeholder={resolvedPlaceholder}
				value={searchQuery}
				onChange={handleInputChange}
				aria-label={resolvedAriaLabel}
				className={cn(
					"flex-1 min-w-0 h-full rounded-none border-0 bg-transparent dark:bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] [&::-webkit-search-cancel-button]:hidden",
					showSubmitButton ? "pr-2" : "pr-3",
				)}
			/>

			{searchQuery.length > 0 && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onClick={handleClear}
					aria-label={m.common_clear_search()}
					className="size-7 mr-1.5 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] shrink-0"
				>
					<X className="w-4 h-4" aria-hidden="true" />
				</Button>
			)}

			{showSubmitButton && (
				<Button
					type="submit"
					className={cn(
						"mr-1.5 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold tracking-wide hover:bg-[#245540] shrink-0",
						isHero
							? "hidden sm:inline-flex px-4 h-8"
							: "inline-flex px-4 sm:px-5 h-8 md:h-9",
					)}
				>
					{m.common_search()}
				</Button>
			)}
		</>
	);

	if (isHero) {
		return (
			<div
				className={cn(
					"flex items-center w-full rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7]/80 dark:border-[#2C4035] shadow-[0_8px_24px_rgba(11,31,22,0.2)] h-11 md:h-12 overflow-hidden focus-within:ring-2 focus-within:ring-[#FCE8C6]/70 transition-shadow",
					className,
				)}
			>
				<form
					onSubmit={handleSearchSubmit}
					className="flex-1 min-w-0 flex items-center h-full"
				>
					{formFields}
				</form>

				{trailingSlot && (
					<>
						<Separator
							orientation="vertical"
							className="data-[orientation=vertical]:h-5.5 bg-[#EAE4D7] dark:bg-[#2C4035] shrink-0"
						/>
						{trailingSlot}
					</>
				)}
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSearchSubmit}
			className={cn(
				"flex items-center w-full rounded-full bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#2C4035] shadow-[0_2px_10px_rgba(27,67,50,0.04)] h-11 md:h-12 overflow-hidden focus-within:ring-2 focus-within:ring-[#2D5A44]/35 focus-within:border-[#2D5A44] transition-all",
				className,
			)}
		>
			{formFields}
		</form>
	);
}
