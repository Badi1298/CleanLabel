import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "#/components/brand-logo";
import { getHeaderLinks } from "#/components/landing/landing-data";
import { LanguageSwitcher } from "#/components/language-switcher";
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
import { m } from "#/paraglide/messages.js";

export function LandingHeader({
	isSignedIn,
	isLandingPage = true,
}: {
	isSignedIn: boolean;
	isLandingPage?: boolean;
}) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const headerLinks = getHeaderLinks();
	const ctaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const ctaLabel = isSignedIn
		? m.landing_header_cta_signed_in()
		: m.landing_header_cta_signed_out();

	const brandClassName =
		"inline-flex items-center rounded-lg px-0.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8AB54] shrink-0";
	const brandContent = <BrandLogo surface="dark" size="md" />;

	const desktopNavLinkClassName =
		"inline-flex items-center min-h-9 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-[#FCE8C6]/82 hover:text-[#FCE8C6] hover:bg-[#FBF4E6]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54]";
	const mobileNavLinkClassName =
		"flex items-center min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#FCE8C6]/85 hover:text-[#FCE8C6] hover:bg-[#FBF4E6]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54]";

	return (
		<header className="sticky top-0 z-40 bg-[#1B4332]/95 dark:bg-[#112A1F]/95 backdrop-blur-md border-b border-[#FCE8C6]/12">
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
					aria-label={m.landing_header_nav_aria()}
					className="flex items-center gap-2 md:gap-4"
				>
					<ul className="hidden md:flex items-center gap-1">
						{headerLinks.map((item) => (
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

					<LanguageSwitcher
						surface="dark"
						isSignedIn={isSignedIn}
						className="hidden md:inline-flex"
					/>

					<Button
						asChild
						className="h-auto min-h-10 px-4 sm:px-5 py-2 rounded-full bg-[#D8AB54] hover:bg-[#E2BA68] text-[#112A1F] text-xs sm:text-sm font-extrabold shadow-xs shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
					>
						<Link to={ctaTarget}>{ctaLabel}</Link>
					</Button>

					<Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
						<SheetTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="icon"
								aria-label={m.landing_header_open_menu()}
								className="md:hidden w-11 h-11 rounded-xl border-[#FCE8C6]/22 bg-[#FBF4E6]/8 text-[#FCE8C6] hover:bg-[#FBF4E6]/15 hover:text-[#FCE8C6] touch-manipulation"
							>
								<Menu className="w-5 h-5" aria-hidden="true" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="bg-[#1B4332] dark:bg-[#112A1F] text-[#FBF4E6] border-[#FCE8C6]/15 p-0 gap-0"
						>
							<SheetHeader className="p-5 pb-4 border-b border-[#FCE8C6]/12 text-left">
								<SheetTitle className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#FCE8C6]">
									<BrandLogo surface="dark" size="sm" />
									<span className="sr-only">PickItWell</span>
								</SheetTitle>
								<SheetDescription className="sr-only">
									{m.landing_header_menu_description()}
								</SheetDescription>
							</SheetHeader>

							<nav
								aria-label={m.landing_header_mobile_nav_aria()}
								className="flex flex-col p-4 gap-1"
							>
								{headerLinks.map((item) =>
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

								<Separator className="my-3 bg-[#FCE8C6]/14" />

								<div className="flex items-center justify-between px-3.5 py-2">
									<span className="text-xs font-semibold text-[#FCE8C6]/80">
										{m.nav_language_switcher_label()}
									</span>
									<LanguageSwitcher
										surface="dark"
										isSignedIn={isSignedIn}
										showNativeLabel
									/>
								</div>

								<Separator className="my-3 bg-[#FCE8C6]/14" />

								<Button
									asChild
									className="w-full h-auto min-h-11 px-5 py-2.5 rounded-full bg-[#D8AB54] hover:bg-[#E2BA68] text-[#112A1F] text-sm font-extrabold shadow-xs"
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
