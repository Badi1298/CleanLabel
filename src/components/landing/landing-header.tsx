import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { HEADER_LINKS } from "#/components/landing/landing-data";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";

export function LandingHeader({
	isSignedIn,
	isLandingPage = true,
}: {
	isSignedIn: boolean;
	isLandingPage?: boolean;
}) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const ctaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const ctaLabel = isSignedIn ? "Deschide aplicația" : "Începe acum";

	const brandClassName =
		"inline-flex items-center gap-2.5 rounded-xl px-1.5 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] dark:focus-visible:ring-[#FCE8C6] shrink-0";
	const brandContent = (
		<>
			<img
				src="/logo-192x192.png"
				alt=""
				width={36}
				height={36}
				className="w-9 h-9 rounded-xl object-contain"
			/>
			<span className="font-extrabold text-lg tracking-tight text-[#1B4332] dark:text-[#FBF4E6]">
				PickItWell
			</span>
		</>
	);

	const desktopNavLinkClassName =
		"inline-flex items-center min-h-9 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:bg-secondary/85 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]";
	const mobileNavLinkClassName =
		"flex items-center min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-[#1B4332] dark:hover:text-[#FCE8C6] hover:bg-secondary transition-colors";

	return (
		<header className="sticky top-0 z-40 bg-sidebar/92 backdrop-blur-md border-b border-border">
			<div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
				{isLandingPage ? (
					<a href="#top" className={brandClassName}>
						{brandContent}
					</a>
				) : (
					<Link to="/landing" className={brandClassName}>
						{brandContent}
					</Link>
				)}

				<nav
					aria-label="Principală"
					className="flex items-center gap-2 md:gap-6"
				>
					<ul className="hidden md:flex items-center gap-1">
						{HEADER_LINKS.map((item) => (
							<li key={item.href}>
								{isLandingPage ? (
									<a href={item.href} className={desktopNavLinkClassName}>
										{item.label}
									</a>
								) : (
									<Link
										to="/landing"
										hash={item.hash}
										className={desktopNavLinkClassName}
									>
										{item.label}
									</Link>
								)}
							</li>
						))}
					</ul>

					<Button
						asChild
						className="h-auto min-h-10 px-4 sm:px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs sm:text-sm font-bold shadow-xs shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
					>
						<Link to={ctaTarget}>{ctaLabel}</Link>
					</Button>

					<Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
						<SheetTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="icon"
								aria-label="Deschide meniul"
								className="md:hidden w-11 h-11 rounded-xl border-border bg-card text-foreground hover:bg-secondary touch-manipulation"
							>
								<Menu className="w-5 h-5" aria-hidden="true" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="bg-sidebar text-foreground border-border p-0 gap-0"
						>
							<SheetHeader className="p-5 pb-4 border-b border-border text-left">
								<SheetTitle className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-[#1B4332] dark:text-[#FBF4E6]">
									<img
										src="/logo-192x192.png"
										alt=""
										width={32}
										height={32}
										className="w-8 h-8 rounded-lg object-contain"
									/>
									<span>PickItWell</span>
								</SheetTitle>
								<SheetDescription className="sr-only">
									Meniu principal de navigare PickItWell
								</SheetDescription>
							</SheetHeader>

							<nav
								aria-label="Navigare mobilă"
								className="flex flex-col p-4 gap-1"
							>
								{HEADER_LINKS.map((item) =>
									isLandingPage ? (
										<a
											key={item.href}
											href={item.href}
											onClick={() => setMobileNavOpen(false)}
											className={mobileNavLinkClassName}
										>
											{item.label}
										</a>
									) : (
										<Link
											key={item.href}
											to="/landing"
											hash={item.hash}
											onClick={() => setMobileNavOpen(false)}
											className={mobileNavLinkClassName}
										>
											{item.label}
										</Link>
									),
								)}

								<Separator className="my-3" />

								<Button
									asChild
									className="w-full h-auto min-h-11 px-5 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-sm font-bold shadow-xs"
								>
									<Link to={ctaTarget} onClick={() => setMobileNavOpen(false)}>
										{ctaLabel}
									</Link>
								</Button>
							</nav>
						</SheetContent>
					</Sheet>
				</nav>
			</div>
		</header>
	);
}
