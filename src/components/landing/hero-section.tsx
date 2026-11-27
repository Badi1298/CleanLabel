import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { HeroPhoneDemo } from "#/components/landing/hero-phone-demo";
import { Button } from "#/components/ui/button";
import { usePwaInstall } from "#/lib/pwa-install";
import { m } from "#/paraglide/messages.js";

export function HeroSection({
	heroHeadingId,
	isSignedIn,
}: {
	heroHeadingId: string;
	isSignedIn: boolean;
}) {
	const primaryCtaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const primaryCtaLabel = isSignedIn
		? m.landing_header_cta_signed_in()
		: m.landing_hero_cta_signed_out();
	const { canInstall, isInstalling, triggerInstall } = usePwaInstall();

	const secondaryLinkClassName =
		"inline-flex items-center justify-center sm:justify-start min-h-10 text-sm font-semibold text-[#FCE8C6]/90 hover:text-[#FCE8C6] underline underline-offset-4 decoration-[#D8AB54]/70 hover:decoration-[#D8AB54] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8AB54] rounded-sm";

	return (
		<section
			aria-labelledby={heroHeadingId}
			className="bg-[#1B4332] dark:bg-[#112A1F] text-[#FBF4E6]"
		>
			<div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-14 sm:pt-14 sm:pb-18 lg:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
					{/* Left Column: Copy + CTAs */}
					<div className="lg:mt-24 lg:col-span-6 space-y-6">
						<h1
							id={heroHeadingId}
							tabIndex={-1}
							className="display-title text-[2.5rem] sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight leading-[1.04] text-[#FCE8C6] text-balance outline-none"
						>
							<span lang="en">{m.landing_hero_slogan()}</span>
						</h1>

						<p className="text-base md:text-[17px] text-[#FBF4E6]/88 font-medium leading-relaxed max-w-xl text-pretty">
							{m.landing_hero_subtitle()}
						</p>

						<div className="pt-1 space-y-3">
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
								<Button
									asChild
									className="h-auto min-h-12 px-7 py-3.5 rounded-full bg-[#D8AB54] hover:bg-[#E2BA68] text-[#112A1F] text-sm sm:text-base font-extrabold shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
								>
									<Link to={primaryCtaTarget}>{primaryCtaLabel}</Link>
								</Button>

								<div
									className="pwa-install-slot w-full sm:w-auto"
									data-visible={canInstall ? "true" : "false"}
									aria-hidden={!canInstall}
									inert={!canInstall || undefined}
								>
									<Button
										type="button"
										variant="outline"
										tabIndex={canInstall ? undefined : -1}
										aria-disabled={isInstalling || undefined}
										onClick={triggerInstall}
										className="w-full sm:w-auto h-auto min-h-12 px-6 py-3.5 rounded-full border-[#FCE8C6]/35 dark:border-[#FCE8C6]/35 bg-[#FBF4E6]/10 dark:bg-[#FBF4E6]/10 hover:bg-[#FBF4E6]/18 dark:hover:bg-[#FBF4E6]/18 hover:text-[#FCE8C6] text-[#FCE8C6] text-sm sm:text-base font-bold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE8C6]"
									>
										<Download className="w-4 h-4 shrink-0" aria-hidden="true" />
										<span>
											{isInstalling
												? m.pwa_install_installing()
												: m.pwa_install_button()}
										</span>
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Interactive Phone Walkthrough */}
					<div className="lg:col-span-6">
						<HeroPhoneDemo />
					</div>
				</div>
			</div>
		</section>
	);
}
