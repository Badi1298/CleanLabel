import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { StoreAvatar } from "#/components/stores/store-avatar";
import { cn } from "#/lib/utils";

type StoreCardProps = {
	store: {
		id: string;
		name: string;
		logoUrl?: string | null;
		productCount?: number | null;
	};
	className?: string;
};

export function StoreCard({ store, className }: StoreCardProps) {
	const count = store.productCount ?? 0;

	return (
		<Link
			to="/stores"
			search={{ storeId: store.id }}
			className={cn(
				"group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]",
				className,
			)}
		>
			<article className="h-full rounded-2xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] p-4 sm:p-5 shadow-[0_2px_10px_rgba(27,67,50,0.03)] hover:shadow-[0_10px_24px_rgba(27,67,50,0.08)] hover:border-[#C9B382] dark:hover:border-[#365043] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4">
				<div className="flex items-start justify-between gap-2">
					<StoreAvatar name={store.name} logoUrl={store.logoUrl} size="lg" />
					<span className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#1E2C25] border border-[#EAE4D7] dark:border-[#2B3D33] flex items-center justify-center text-[#5C665E] dark:text-[#9AA89E] group-hover:bg-[#E3EDE7] group-hover:text-[#1B4332] group-hover:border-[#C8DBD0] dark:group-hover:bg-[#1E3A2C] dark:group-hover:text-[#CBE3D4] transition-colors shrink-0">
						<ChevronRight
							className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</span>
				</div>

				<div>
					<h3 className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#1B3328] dark:text-[#EDF2EE] group-hover:text-[#1B4332] dark:group-hover:text-[#FCE8C6] transition-colors leading-snug [text-wrap:balance]">
						{store.name}
					</h3>
					<p className="text-xs font-medium text-[#5C665E] dark:text-[#9AA89E] mt-1 tabular-nums">
						{count > 0
							? `${count} ${count === 1 ? "product" : "products"}`
							: "Browse aisles"}
					</p>
				</div>
			</article>
		</Link>
	);
}
