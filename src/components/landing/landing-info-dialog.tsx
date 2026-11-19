import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
	AlertTriangle,
	CheckCircle2,
	ExternalLink,
	Info,
	X,
} from "lucide-react";
import { useId, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	INFO_MODAL_TOPIC_MAP,
	INFO_MODAL_TOPICS,
	type InfoModalTopic,
	SOCIAL_LINKS,
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
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { ScoreBadge } from "#/components/ui/score-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";

const reportErrorSchema = z.object({
	product: z
		.string()
		.trim()
		.min(1, "Te rugăm să introduci produsul sau brandul."),
	details: z.string().trim().min(1, "Te rugăm să descrii ce trebuie corectat."),
	email: z
		.string()
		.trim()
		.refine(
			(val) => val === "" || z.email().safeParse(val).success,
			"Adresa de e-mail nu este validă.",
		),
});

function getFieldErrorMessage(errors: unknown[]): string | undefined {
	if (!errors.length) return undefined;
	const messages = errors
		.map((err) => {
			if (typeof err === "string") return err;
			if (err && typeof err === "object" && "message" in err) {
				return String((err as { message: unknown }).message);
			}
			return String(err);
		})
		.filter(Boolean);
	return messages.length > 0 ? messages.join(", ") : undefined;
}

export function LandingInfoDialog({
	topic,
	onSelectTopic,
	onClose,
}: {
	topic: InfoModalTopic | null;
	onSelectTopic: (topic: InfoModalTopic) => void;
	onClose: () => void;
}) {
	const activeTopic: InfoModalTopic = topic ?? "metodologie";
	const activeConfig = INFO_MODAL_TOPIC_MAP[activeTopic];

	return (
		<Dialog
			open={topic !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex flex-col gap-0 p-0 w-[calc(100%-1.5rem)] max-w-2xl sm:max-w-2xl max-h-[88dvh] rounded-3xl border-border bg-card text-card-foreground shadow-2xl overflow-hidden"
			>
				{/* Dialog Header */}
				<DialogHeader className="px-5 py-4 sm:px-6 border-b border-border bg-sidebar flex-row items-start justify-between gap-3 text-left shrink-0">
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
							aria-label="Închide fereastra"
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
							aria-label="Subiecte informative PickItWell"
							className="h-auto w-full justify-start bg-transparent p-0 rounded-none flex items-center gap-1.5 overflow-x-auto no-scrollbar"
						>
							{INFO_MODAL_TOPICS.map((item) => (
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

					<div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm leading-relaxed text-[#4A554E] dark:text-[#B8C4BC]">
						<TabsContent value="metodologie" className="space-y-4">
							<p>
								PickItWell selectează produse alimentare cu puțini aditivi
								marcați pe etichetă (cu cod E sau clasă funcțională), după
								aceleași criterii cu care facem cumpărăturile pentru familia
								noastră.
							</p>
							<ul className="space-y-2.5">
								<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-center gap-3">
									<ScoreBadge score="gold" size="sm" />
									<span>
										Produse fără aditivi marcați pe etichetă sau cu un număr
										minim.
									</span>
								</li>
								<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-center gap-3">
									<ScoreBadge score="silver" size="sm" />
									<span>
										Produse cu un număr redus de aditivi marcați pe etichetă.
									</span>
								</li>
								<li className="rounded-2xl bg-background dark:bg-[#121D17] border border-border p-3.5 flex items-center gap-3">
									<ScoreBadge score="bronze" size="sm" />
									<span>
										Produse cu un număr moderat de aditivi marcați pe etichetă.
									</span>
								</li>
							</ul>
							<p className="text-xs text-muted-foreground border-t border-border pt-3">
								Grupa se bazează doar pe numărul de ingrediente marcate pe
								etichetă ca aditivi și nu reprezintă o evaluare a calității
								nutriționale sau generale a produsului.
							</p>
						</TabsContent>

						<TabsContent value="declinare" className="space-y-3">
							<div className="rounded-2xl bg-[#FBF4E6] dark:bg-[#121D17] border border-border p-4 flex items-start gap-3">
								<Info
									className="w-5 h-5 text-[#A67C37] dark:text-[#D4AF6A] shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<p className="text-xs sm:text-sm text-foreground">
									Informațiile afișate în PickItWell au caracter orientativ.
									Decizia de cumpărare îți aparține în întregime.
								</p>
							</div>
							<p>
								Listele de ingrediente sunt preluate de pe etichetele consultate
								la data menționată pe pagina produsului. Producătorii pot
								modifica rețetele în timp, așa că te rugăm să verifici
								întotdeauna eticheta fizică înainte de cumpărare sau consum (mai
								ales în caz de alergii sau intoleranțe).
							</p>
							<p>
								Magazinele indicate sunt cele în care produsul a fost găsit;
								disponibilitatea în stoc în timp real nu este verificată.
							</p>
						</TabsContent>

						<TabsContent value="raporteaza">
							<ReportErrorForm onSubmitted={onClose} />
						</TabsContent>

						<TabsContent value="contact" className="space-y-4">
							<p>
								Ne poți scrie pentru întrebări despre catalog, propuneri de
								produse sau colaborări prin canalele noastre oficiale de
								comunitate:
							</p>
							<ul className="space-y-2">
								{SOCIAL_LINKS.map((item) => {
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
							<p className="text-xs text-muted-foreground">
								E-mail suport: [e-mail]
							</p>
						</TabsContent>

						<TabsContent value="confidentialitate" className="space-y-3">
							<p>
								PickItWell colectează exclusiv datele necesare funcționării
								contului tău: adresa de e-mail, numele afișat, lista de produse
								favorite și ingredientele pe care alegi să le eviți.
							</p>
							<p>
								Poți modifica sau șterge oricând contul și datele asociate
								direct din pagina de Profil din aplicație.
							</p>
						</TabsContent>

						<TabsContent value="termeni" className="space-y-3">
							<p>
								Accesarea și utilizarea aplicației PickItWell presupun
								acceptarea caracterului informativ al datelor despre etichetele
								produselor alimentare și disponibilitatea acestora în magazine.
							</p>
							<p>
								PickItWell nu comercializează produse alimentare și nu oferă
								recomandări medicale sau nutriționale personalizate.
							</p>
						</TabsContent>

						<TabsContent value="cookies" className="space-y-3">
							<p>
								PickItWell utilizează cookie-uri strict necesare pentru
								autentificare, menținerea sesiunii și salvarea preferințelor
								esențiale de navigare.
							</p>
						</TabsContent>
					</div>
				</Tabs>

				{/* Dialog Footer */}
				<DialogFooter className="px-5 py-3.5 sm:px-6 border-t border-border bg-sidebar flex-row items-center justify-between sm:justify-between gap-3 shrink-0">
					<span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<AlertTriangle
							className="w-3.5 h-3.5 shrink-0"
							aria-hidden="true"
						/>
						<span>Informațiile sunt orientative</span>
					</span>
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-auto min-h-9 px-4 py-1.5 rounded-full border-border dark:border-[#2B3D33] bg-card text-xs font-bold text-foreground hover:bg-secondary"
						>
							Închide
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function FormFieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p
			id={id}
			role="alert"
			className="text-xs font-medium text-rose-700 dark:text-rose-300"
		>
			{message}
		</p>
	);
}

function ReportErrorForm({ onSubmitted }: { onSubmitted: () => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	const productInputId = useId();
	const productErrorId = useId();
	const detailsInputId = useId();
	const detailsErrorId = useId();
	const emailInputId = useId();
	const emailErrorId = useId();

	const form = useForm({
		defaultValues: {
			product: "",
			details: "",
			email: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: reportErrorSchema,
		},
		onSubmitInvalid: () => {
			requestAnimationFrame(() => {
				formRef.current
					?.querySelector<HTMLElement>('[aria-invalid="true"]')
					?.focus();
			});
		},
		onSubmit: () => {
			toast.success("Mulțumim! Sesizarea a fost trimisă spre verificare.");
			form.reset();
			onSubmitted();
		},
	});

	return (
		<form
			ref={formRef}
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<p className="text-xs sm:text-sm">
				Ai observat o schimbare de rețetă pe etichetă sau o informație care
				necesită actualizare? Trimite-ne detaliile mai jos.
			</p>

			<form.Field name="product">
				{(field) => {
					const errorMessage = getFieldErrorMessage(field.state.meta.errors);
					return (
						<div className="space-y-1.5">
							<Label
								htmlFor={productInputId}
								className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
							>
								Produs / Brand
							</Label>
							<Input
								id={productInputId}
								type="text"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={Boolean(errorMessage)}
								aria-describedby={errorMessage ? productErrorId : undefined}
								placeholder="Ex: Sos de roșii cu busuioc"
								className="h-auto min-h-11 px-3.5 py-2.5 rounded-xl bg-background dark:bg-[#121D17] border-border dark:border-[#2B3D33] text-sm md:text-sm text-foreground"
							/>
							<FormFieldError id={productErrorId} message={errorMessage} />
						</div>
					);
				}}
			</form.Field>

			<form.Field name="details">
				{(field) => {
					const errorMessage = getFieldErrorMessage(field.state.meta.errors);
					return (
						<div className="space-y-1.5">
							<Label
								htmlFor={detailsInputId}
								className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
							>
								Ce trebuie corectat?
							</Label>
							<Textarea
								id={detailsInputId}
								rows={3}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={Boolean(errorMessage)}
								aria-describedby={errorMessage ? detailsErrorId : undefined}
								placeholder="Descrie diferența observată pe etichetă sau magazinul..."
								className="p-3.5 rounded-xl bg-background dark:bg-[#121D17] border-border dark:border-[#2B3D33] text-sm md:text-sm text-foreground"
							/>
							<FormFieldError id={detailsErrorId} message={errorMessage} />
						</div>
					);
				}}
			</form.Field>

			<form.Field name="email">
				{(field) => {
					const errorMessage = getFieldErrorMessage(field.state.meta.errors);
					return (
						<div className="space-y-1.5">
							<Label
								htmlFor={emailInputId}
								className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
							>
								E-mail (opțional)
							</Label>
							<Input
								id={emailInputId}
								type="email"
								inputMode="email"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={Boolean(errorMessage)}
								aria-describedby={errorMessage ? emailErrorId : undefined}
								placeholder="nume@exemplu.ro"
								className="h-auto min-h-11 px-3.5 py-2.5 rounded-xl bg-background dark:bg-[#121D17] border-border dark:border-[#2B3D33] text-sm md:text-sm text-foreground"
							/>
							<FormFieldError id={emailErrorId} message={errorMessage} />
						</div>
					);
				}}
			</form.Field>

			<div className="flex justify-end gap-2 pt-1">
				<Button
					type="submit"
					className="h-auto min-h-10 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#245540] dark:bg-[#FCE8C6] dark:hover:bg-[#F7DDA9] text-[#FCE8C6] dark:text-[#1B3328] text-xs font-bold"
				>
					<CheckCircle2 className="w-4 h-4" aria-hidden="true" />
					<span>Trimite sesizarea</span>
				</Button>
			</div>
		</form>
	);
}
