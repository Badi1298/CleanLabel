import {
	Compass,
	MoreVertical,
	PlusSquare,
	Share,
	Smartphone,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import type { PwaInstallMode } from "#/lib/pwa-install";
import { m } from "#/paraglide/messages.js";

interface GuideStep {
	text: string;
	Icon: typeof Share;
}

function getGuideContent(mode: PwaInstallMode): {
	description: string;
	steps: readonly GuideStep[];
} | null {
	switch (mode) {
		case "guide-ios-safari":
			return {
				description: m.pwa_guide_ios_safari_desc(),
				steps: [
					{ text: m.pwa_guide_ios_safari_step1(), Icon: Share },
					{ text: m.pwa_guide_ios_safari_step2(), Icon: PlusSquare },
					{ text: m.pwa_guide_ios_safari_step3(), Icon: Smartphone },
				],
			};
		case "guide-ios-browser":
			return {
				description: m.pwa_guide_ios_browser_desc(),
				steps: [
					{ text: m.pwa_guide_ios_browser_step1(), Icon: Share },
					{ text: m.pwa_guide_ios_browser_step2(), Icon: PlusSquare },
					{ text: m.pwa_guide_ios_browser_step3(), Icon: Smartphone },
				],
			};
		case "guide-in-app-ios":
			return {
				description: m.pwa_guide_in_app_ios_desc(),
				steps: [
					{ text: m.pwa_guide_in_app_ios_step1(), Icon: Compass },
					{ text: m.pwa_guide_in_app_ios_step2(), Icon: Share },
					{ text: m.pwa_guide_in_app_ios_step3(), Icon: PlusSquare },
				],
			};
		case "guide-in-app-android":
			return {
				description: m.pwa_guide_in_app_android_desc(),
				steps: [
					{ text: m.pwa_guide_in_app_android_step1(), Icon: MoreVertical },
					{ text: m.pwa_guide_in_app_android_step2(), Icon: Smartphone },
				],
			};
		default:
			return null;
	}
}

/**
 * Guided installation dialog for browsers without programmatic install prompts
 * (iOS Safari, iOS third-party browsers, and social in-app webviews).
 */
export function PwaInstallDialog({
	open,
	onOpenChange,
	mode,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: PwaInstallMode;
}) {
	const content = getGuideContent(mode);
	if (!content) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-3xl bg-white dark:bg-[#16221C] border border-[#EAE4D7] dark:border-[#24362D] text-[#1B3328] dark:text-[#EDF2EE] sm:max-w-md p-6">
				<DialogHeader className="text-left space-y-2">
					<div className="w-11 h-11 rounded-2xl bg-[#E3EDE7] dark:bg-[#1E3A2C] border border-[#C8DBD0] dark:border-[#2E5440] text-[#1B4332] dark:text-[#CBE3D4] flex items-center justify-center">
						<Smartphone className="w-5 h-5" aria-hidden="true" />
					</div>
					<DialogTitle className="text-lg font-extrabold tracking-tight text-[#1B3328] dark:text-[#FBF4E6]">
						{m.pwa_guide_title()}
					</DialogTitle>
					<DialogDescription className="text-sm text-[#4A554E] dark:text-[#B8C4BC] leading-relaxed text-pretty">
						{content.description}
					</DialogDescription>
				</DialogHeader>

				<ol className="space-y-3 py-1">
					{content.steps.map((step, index) => {
						const StepIcon = step.Icon;
						return (
							<li
								key={step.text}
								className="flex items-start gap-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121D17] border border-[#EAE4D7] dark:border-[#24362D] p-3.5"
							>
								<span
									aria-hidden="true"
									className="w-6 h-6 rounded-full bg-[#1B4332] dark:bg-[#D8AB54] text-[#FCE8C6] dark:text-[#112A1F] text-xs font-extrabold tabular-nums flex items-center justify-center shrink-0 mt-0.5"
								>
									{index + 1}
								</span>
								<p className="flex-1 text-sm font-medium text-[#1B3328] dark:text-[#EDF2EE] leading-snug text-pretty">
									{step.text}
								</p>
								<StepIcon
									className="w-4 h-4 text-[#2D5A44] dark:text-[#D8AB54] shrink-0 mt-0.5"
									aria-hidden="true"
								/>
							</li>
						);
					})}
				</ol>

				<DialogFooter className="pt-1">
					<Button
						type="button"
						onClick={() => onOpenChange(false)}
						className="w-full sm:w-auto h-auto min-h-10 px-5 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#D8AB54] dark:hover:bg-[#E2BA68] text-[#FCE8C6] dark:text-[#112A1F] text-sm font-bold cursor-pointer"
					>
						{m.pwa_guide_close()}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
