import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, ExternalLink, Flag, X } from "lucide-react";
import { useEffect, useRef } from "react";
import {
	getInfoModalTopicMap,
	getInfoModalTopics,
	getSocialLinks,
	type InfoModalTopic,
	SUPPORT_EMAIL,
} from "#/components/landing/landing-data";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { m } from "#/paraglide/messages.js";

export function LandingInfoDialog({
	topic,
	isSignedIn,
	onSelectTopic,
	onClose,
}: {
	topic: InfoModalTopic | null;
	isSignedIn: boolean;
	onSelectTopic: (topic: InfoModalTopic) => void;
	onClose: () => void;
}) {
	const infoModalTopics = getInfoModalTopics();
	const infoModalTopicMap = getInfoModalTopicMap();
	const socialLinks = getSocialLinks();

	const activeTopic: InfoModalTopic = topic ?? "contact";
	const activeConfig = infoModalTopicMap[activeTopic];
	const appCtaTarget = isSignedIn ? ("/" as const) : ("/signup" as const);
	const appCtaLabel = isSignedIn
		? m.landing_header_cta_signed_in()
		: m.landing_final_cta_signed_out();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (topic === null) return;
		const container = scrollContainerRef.current;
		if (container) {
			container.scrollTop = 0;
		}
	}, [topic]);

	return (
		<Dialog
			open={topic !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex flex-col gap-0 p-0 w-[calc(100%-1.5rem)] max-w-2xl sm:max-w-2xl h-[min(85dvh,36rem)] rounded-3xl border-border bg-card text-card-foreground shadow-2xl overflow-clip"
			>
				{/* Dialog Header */}
				<DialogHeader className="px-5 py-4 sm:px-6 min-h-[5.25rem] sm:min-h-0 border-b border-border bg-sidebar flex-row items-center justify-between gap-3 text-left shrink-0">
					<div className="min-w-0">
						<DialogTitle className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground dark:text-[#FBF4E6] leading-snug">
							{activeConfig.title}
						</DialogTitle>
						<DialogDescription className="sr-only">
							{activeConfig.description}
						</DialogDescription>
					</div>
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline"
							size="icon"
							aria-label={m.common_close_dialog()}
							className="w-9 h-9 rounded-full bg-card border-border dark:border-[#2B3D33] text-muted-foreground hover:text-foreground shrink-0"
						>
							<X className="w-4 h-4" aria-hidden="true" />
						</Button>
					</DialogClose>
				</DialogHeader>

				{/* Topic Tabs & Scrollable Body */}
				<Tabs
					value={activeTopic}
					onValueChange={(value) => onSelectTopic(value as InfoModalTopic)}
					className="flex-1 min-h-0 gap-0"
				>
					<div className="px-5 py-2.5 sm:px-6 border-b border-[#F0EAE0] dark:border-[#22332A] bg-card shrink-0">
						<TabsList
							aria-label={m.landing_modal_tabs_aria()}
							className="h-auto w-full justify-start bg-transparent p-0 rounded-none flex items-center gap-1.5 overflow-x-auto no-scrollbar"
						>
							{infoModalTopics.map((item) => (
								<TabsTrigger
									key={item.id}
									value={item.id}
									className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold shadow-none bg-background dark:bg-[#121D17] text-muted-foreground hover:text-foreground data-[state=active]:bg-[#1B4332] data-[state=active]:text-[#FCE8C6] dark:data-[state=active]:bg-[#FCE8C6] dark:data-[state=active]:text-[#1B3328] data-[state=active]:shadow-none"
								>
									{item.shortLabel}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<div
						ref={scrollContainerRef}
						className="landing-dialog-scroll flex-1 min-h-0 overflow-y-auto text-sm leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]"
					>
						<div className="p-5 sm:p-6">
							<TabsContent value="raporteaza" className="space-y-4">
								<div className="rounded-2xl bg-[#FBF4E6] dark:bg-[#121D17] border border-border p-4 flex items-start gap-3">
									<Flag
										className="w-5 h-5 text-[#A67C37] dark:text-[#D4AF6A] shrink-0 mt-0.5"
										aria-hidden="true"
									/>
									<p className="text-xs sm:text-sm text-foreground">
										{m.landing_modal_report_callout()}
									</p>
								</div>

								<div className="space-y-2.5">
									<h3 className="text-sm font-extrabold text-foreground dark:text-[#FBF4E6]">
										{m.landing_modal_report_steps_title()}
									</h3>
									<ol className="space-y-2.5">
										<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-start gap-3">
											<span
												aria-hidden="true"
												className="w-6 h-6 rounded-full bg-[#1B4332] dark:bg-[#FCE8C6] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
											>
												1
											</span>
											<span>{m.landing_modal_report_step1()}</span>
										</li>
										<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-start gap-3">
											<span
												aria-hidden="true"
												className="w-6 h-6 rounded-full bg-[#1B4332] dark:bg-[#FCE8C6] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
											>
												2
											</span>
											<span>
												{m.landing_modal_report_step2_prefix()}{" "}
												<strong className="font-bold text-foreground">
													{m.landing_modal_report_label()}
												</strong>
												.
											</span>
										</li>
										<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-start gap-3">
											<span
												aria-hidden="true"
												className="w-6 h-6 rounded-full bg-[#1B4332] dark:bg-[#FCE8C6] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
											>
												3
											</span>
											<span>{m.landing_modal_report_step3()}</span>
										</li>
									</ol>
								</div>

								<p className="text-xs text-muted-foreground">
									{m.landing_modal_report_general()}
								</p>

								<div className="flex flex-wrap items-center gap-2.5 pt-1">
									<Button
										asChild
										className="h-auto min-h-10 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-bold"
									>
										<Link to={appCtaTarget} onClick={onClose}>
											<span>{appCtaLabel}</span>
											<ArrowRight
												className="w-4 h-4 shrink-0"
												aria-hidden="true"
											/>
										</Link>
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => onSelectTopic("contact")}
										className="h-auto min-h-10 px-4 py-2 rounded-full border-border dark:border-[#2B3D33] bg-background dark:bg-[#121D17] text-xs font-bold text-foreground hover:bg-secondary"
									>
										{m.landing_modal_report_contact_btn()}
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="contact" className="space-y-4">
								<p>{m.landing_modal_contact_intro()}</p>
								<ul className="space-y-2">
									{socialLinks.map((item) => {
										const { Icon } = item;
										return (
											<li key={item.id}>
												<a
													href={item.href}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between gap-3 rounded-2xl bg-background dark:bg-[#121D17] border border-border hover:border-[#2D5A44] px-4 py-3 text-sm font-bold text-foreground transition-colors"
												>
													<span className="flex items-center gap-2.5">
														<Icon
															className="w-4 h-4 text-[#A67C37] dark:text-[#D4AF6A]"
															aria-hidden="true"
														/>
														<span>{item.label}</span>
													</span>
													<ExternalLink
														className="w-4 h-4 text-[#7D857E]"
														aria-hidden="true"
													/>
												</a>
											</li>
										);
									})}
								</ul>
								{/* TODO: Confirm client support email before launch */}
								<p className="text-xs text-muted-foreground">
									{m.landing_modal_contact_support_email({
										email: SUPPORT_EMAIL,
									})}
								</p>
							</TabsContent>

							<TabsContent value="confidentialitate" className="space-y-3">
								<p>{m.landing_modal_privacy_p1()}</p>
								<p>{m.landing_modal_privacy_p2()}</p>
							</TabsContent>

							<TabsContent value="termeni" className="space-y-3">
								<p>{m.landing_modal_terms_p1()}</p>
								<p>{m.landing_modal_terms_p2()}</p>
							</TabsContent>

							<TabsContent value="cookies" className="space-y-3">
								<p>{m.landing_modal_cookies_p1()}</p>
							</TabsContent>
						</div>
					</div>
				</Tabs>

				{/* Dialog Footer */}
				<DialogFooter className="px-5 py-3.5 sm:px-6 border-t border-border bg-sidebar flex-row items-center justify-between sm:justify-between gap-3 shrink-0">
					<span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<AlertTriangle
							className="w-3.5 h-3.5 shrink-0"
							aria-hidden="true"
						/>
						<span>{m.landing_modal_indicative_note()}</span>
					</span>
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-auto min-h-9 px-4 py-1.5 rounded-full border-border dark:border-[#2B3D33] bg-card text-xs font-bold text-foreground hover:bg-secondary"
						>
							{m.common_close()}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
