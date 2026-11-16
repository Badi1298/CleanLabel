import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { cn } from "#/lib/utils";

type SearchBarProps = {
	initialQuery?: string;
	className?: string;
	variant?: "default" | "hero";
	placeholder?: string;
	trailingSlot?: React.ReactNode;
};

export function SearchBar({
	initialQuery = "",
	className = "",
	variant = "default",
	placeholder = "Search products, brands, or ingredients...",
	trailingSlot,
}: SearchBarProps) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState(initialQuery);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchQuery.trim();
		navigate({
			to: "/search",
			search: (prev: Record<string, unknown>) => ({
				...prev,
				q: trimmed ? trimmed : undefined,
			}),
		});
	};

	if (variant === "hero") {
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
					<button
						type="submit"
						aria-label="Search"
						className="pl-4 pr-2 h-full flex items-center justify-center text-[#687069] hover:text-[#1B4332] dark:text-[#9AA89E] dark:hover:text-[#FCE8C6] transition-colors cursor-pointer shrink-0"
					>
						<Search className="w-4.5 h-4.5" strokeWidth={2} />
					</button>

					<input
						type="search"
						placeholder={placeholder}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						aria-label="Search products, brands, or ingredients"
						className="flex-1 min-w-0 h-full bg-transparent text-sm md:text-[15px] text-[#1B3328] dark:text-[#EDF2EE] placeholder:text-[#7D857E] dark:placeholder:text-[#8E9B92] focus:outline-none pr-2 [&::-webkit-search-cancel-button]:hidden"
					/>

					{searchQuery.length > 0 && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							aria-label="Clear search"
							className="p-1.5 mr-1 rounded-full text-[#7D857E] hover:text-[#1B3328] hover:bg-[#FAF8F5] dark:hover:bg-[#1E2E26] transition-colors cursor-pointer shrink-0"
						>
							<X className="w-4 h-4" />
						</button>
					)}

					<button
						type="submit"
						className="hidden sm:inline-flex items-center justify-center mr-1.5 px-4 h-8 rounded-full bg-[#1B4332] text-[#FCE8C6] text-xs font-bold tracking-wide hover:bg-[#245540] transition-colors cursor-pointer shrink-0"
					>
						Search
					</button>
				</form>

				{trailingSlot && (
					<>
						<div
							className="w-px h-5.5 bg-[#EAE4D7] dark:bg-[#2C4035] shrink-0"
							aria-hidden="true"
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
			className={cn("flex-1 flex items-center gap-2 relative", className)}
		>
			<Search className="absolute left-3 text-slate-400 w-5 h-5" />
			<Input
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="pl-10 h-12 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-none shadow-none text-md"
			/>
			<Button type="submit" size="lg" className="h-12 px-8 font-bold">
				Search
			</Button>
		</form>
	);
}
