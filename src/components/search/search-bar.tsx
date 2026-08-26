import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type SearchBarProps = {
	initialQuery?: string;
	className?: string;
};

export function SearchBar({ initialQuery = "", className = "" }: SearchBarProps) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState(initialQuery);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate({ to: "/search", search: (prev: any) => ({ ...prev, q: searchQuery }) });
		} else {
			// If empty, remove the 'q' parameter
			navigate({ to: "/search", search: (prev: any) => ({ ...prev, q: undefined }) });
		}
	};

	return (
		<form
			onSubmit={handleSearchSubmit}
			className={`flex-1 flex items-center gap-2 relative ${className}`}
		>
			<Search className="absolute left-3 text-slate-400 w-5 h-5" />
			<Input
				placeholder="Search products, brands, or ingredients..."
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
