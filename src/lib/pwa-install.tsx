import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { PwaInstallDialog } from "#/components/pwa/pwa-install-dialog";
import { m } from "#/paraglide/messages.js";

export type PwaInstallMode =
	| "hidden"
	| "native"
	| "guide-ios-safari"
	| "guide-ios-browser"
	| "guide-in-app-ios"
	| "guide-in-app-android";

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms?: string[];
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

type NavigatorWithPwa = Navigator & {
	standalone?: boolean;
	install?: () => Promise<void>;
};

const IN_APP_BROWSER_RE =
	/FBAN|FBAV|FB_IAB|Instagram|TikTok|BytedanceWebview|Musical_ly|WhatsApp|Snapchat|Line\//i;
const IOS_DEVICE_RE = /iPad|iPhone|iPod/i;
const IOS_ALT_BROWSER_RE = /CriOS|EdgiOS|FxiOS|OPiOS/i;
const ANDROID_RE = /Android/i;

/**
 * Returns true when running inside an installed standalone PWA window.
 * Always returns false during SSR.
 */
export function isStandalonePwa(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	const nav = window.navigator as NavigatorWithPwa;
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		nav.standalone === true
	);
}

function supportsWebInstallApi(): boolean {
	if (typeof navigator === "undefined") {
		return false;
	}
	return typeof (navigator as NavigatorWithPwa).install === "function";
}

function detectIosDevice(): boolean {
	if (typeof navigator === "undefined") {
		return false;
	}
	return (
		IOS_DEVICE_RE.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
}

function resolveInstallMode(
	standalone: boolean,
	installed: boolean,
	hasDeferredPrompt: boolean,
): PwaInstallMode {
	if (standalone || installed) {
		return "hidden";
	}
	if (supportsWebInstallApi() || hasDeferredPrompt) {
		return "native";
	}
	if (typeof navigator === "undefined") {
		return "hidden";
	}

	const ua = navigator.userAgent;
	const isIos = detectIosDevice();

	if (IN_APP_BROWSER_RE.test(ua)) {
		if (isIos) {
			return "guide-in-app-ios";
		}
		if (ANDROID_RE.test(ua)) {
			return "guide-in-app-android";
		}
		return "hidden";
	}

	if (isIos) {
		return IOS_ALT_BROWSER_RE.test(ua)
			? "guide-ios-browser"
			: "guide-ios-safari";
	}

	return "hidden";
}

// Capture ultra-early events before React mounts so nothing is missed across routes.
interface PwaEarlyState {
	prompt: BeforeInstallPromptEvent | null;
	installed: boolean;
}

type WindowWithPwaEarly = Window & {
	__pwaEarly?: PwaEarlyState;
};

function getEarlyState(): PwaEarlyState | null {
	if (typeof window === "undefined") {
		return null;
	}
	const win = window as WindowWithPwaEarly;
	if (!win.__pwaEarly) {
		const state: PwaEarlyState = { prompt: null, installed: false };
		win.__pwaEarly = state;
		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			state.prompt = event as BeforeInstallPromptEvent;
		});
		window.addEventListener("appinstalled", () => {
			state.prompt = null;
			state.installed = true;
		});
	}
	return win.__pwaEarly;
}

if (typeof window !== "undefined") {
	getEarlyState();
}

interface PwaInstallContextValue {
	isStandalone: boolean;
	isInstalled: boolean;
	installMode: PwaInstallMode;
	canInstall: boolean;
	isInstalling: boolean;
	triggerInstall: () => Promise<void>;
}

const PwaInstallContext = createContext<PwaInstallContextValue>({
	isStandalone: false,
	isInstalled: false,
	installMode: "hidden",
	canInstall: false,
	isInstalling: false,
	triggerInstall: async () => {},
});

/**
 * Provides PWA standalone detection, one-click installation, and guided install UI.
 */
export function PwaInstallProvider({ children }: { children: ReactNode }) {
	const [isReady, setIsReady] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalling, setIsInstalling] = useState(false);
	const [guideOpen, setGuideOpen] = useState(false);
	const installingRef = useRef(false);

	useEffect(() => {
		const early = getEarlyState();
		const initialStandalone = isStandalonePwa();
		const initialInstalled = Boolean(early?.installed);
		const initialPrompt = early?.prompt ?? null;

		setIsStandalone(initialStandalone);
		setIsInstalled(initialInstalled);
		setDeferredPrompt(initialPrompt);
		setIsReady(true);

		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		const handleDisplayModeChange = () => {
			setIsStandalone(isStandalonePwa());
		};

		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			const promptEvent = event as BeforeInstallPromptEvent;
			const currentEarly = getEarlyState();
			if (currentEarly) {
				currentEarly.prompt = promptEvent;
			}
			setDeferredPrompt(promptEvent);
		};

		const handleAppInstalled = () => {
			const currentEarly = getEarlyState();
			if (currentEarly) {
				currentEarly.prompt = null;
				currentEarly.installed = true;
			}
			setDeferredPrompt(null);
			setIsInstalled(true);
		};

		mediaQuery.addEventListener("change", handleDisplayModeChange);
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			mediaQuery.removeEventListener("change", handleDisplayModeChange);
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const installMode: PwaInstallMode = isReady
		? resolveInstallMode(isStandalone, isInstalled, Boolean(deferredPrompt))
		: "hidden";

	const triggerInstall = useCallback(async () => {
		if (installingRef.current || isStandalone) {
			return;
		}

		if (installMode.startsWith("guide-")) {
			setGuideOpen(true);
			return;
		}

		if (installMode !== "native") {
			return;
		}

		installingRef.current = true;
		setIsInstalling(true);

		try {
			const nav = navigator as NavigatorWithPwa;
			const early = getEarlyState();
			if (typeof nav.install === "function") {
				// Call directly before any await to preserve transient user activation.
				await nav.install();
				if (early) {
					early.prompt = null;
					early.installed = true;
				}
				setDeferredPrompt(null);
				setIsInstalled(true);
				toast.success(m.pwa_install_success());
				return;
			}

			const promptEvent = deferredPrompt ?? early?.prompt;
			if (!promptEvent) {
				return;
			}

			// Clear single-use prompt reference before awaiting user choice.
			if (early) {
				early.prompt = null;
			}
			setDeferredPrompt(null);

			await promptEvent.prompt();
			const { outcome } = await promptEvent.userChoice;
			if (outcome === "accepted") {
				if (early) {
					early.installed = true;
				}
				setIsInstalled(true);
				toast.success(m.pwa_install_success());
			}
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				return;
			}
			console.error(error);
			toast.error(m.pwa_install_error());
		} finally {
			installingRef.current = false;
			setIsInstalling(false);
		}
	}, [deferredPrompt, installMode, isStandalone]);

	const canInstall = !isStandalone && installMode !== "hidden";

	return (
		<PwaInstallContext.Provider
			value={{
				isStandalone,
				isInstalled,
				installMode,
				canInstall,
				isInstalling,
				triggerInstall,
			}}
		>
			{children}
			<PwaInstallDialog
				open={guideOpen}
				onOpenChange={setGuideOpen}
				mode={installMode}
			/>
		</PwaInstallContext.Provider>
	);
}

/**
 * Returns standalone PWA status and install trigger state from PwaInstallProvider.
 */
export function usePwaInstall(): PwaInstallContextValue {
	return useContext(PwaInstallContext);
}
