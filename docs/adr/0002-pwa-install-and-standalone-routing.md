# 0002. Unified PWA Scope with Client-Side Standalone Gating and Progressive Install

Status: accepted

## Context

PickItWell is delivered both as a regular website and as an installable Progressive Web App (`id: "/"`, `start_url: "/"`, `display: "standalone"`). Users need an obvious in-page **"Install app"** control on `/landing` and inside `/profile` when browsing on the web, while users launching the installed PWA should never land on or navigate into the `/landing` marketing page.

## Decision

We kept the **unified `/` manifest scope** (`id: "/"`, `start_url: "/"`) and gated standalone PWA behavior **purely on the client**:

1. **Standalone detection without cookies**: We detect standalone mode via `window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true` inside a root `PwaInstallProvider` (`src/lib/pwa-install.tsx`) and a defensive pre-paint `<script>` on `/landing`.
2. **Client-side `/landing` redirect & chrome stripping**: When running in standalone mode, `/landing` redirects to `/` (`beforeLoad` + pre-paint fallback + `useEffect`), and `AuthShell` / legal page chrome (`LandingHeader`, `LandingFooter`, `LandingLegalLayout`) hide `/landing` marketing links in favor of `/` (or `/profile` when opened from Profile via `?from=profile`).
3. **Progressive install flow**: Prefer `navigator.install()`, fall back to `beforeinstallprompt` (Chromium), display a tailored guided install dialog (`PwaInstallDialog`) for iOS Safari, iOS third-party browsers, and social in-app webviews, and hide the control when already installed or on unsupported desktop browsers.

## Considered Options

- **Split the app under `/app/*` with `scope: "/app/"`**: Rejected because it forces a breaking URL migration for bookmarks, auth redirects, and deep links.
- **Persist a `pwa=1` cookie for SSR redirects**: Rejected because Chrome/Android share cookies between regular browser tabs and the installed PWA, which would wrongly block `/landing` when a user opens it in a normal browser tab.
- **Chromium-only install button (hide on iOS)**: Rejected because mobile grocery shoppers on iPhone/iPad are a primary audience and Safari has no programmatic install API.

## Consequences

- Zero URL churn and zero cross-surface cookie leakage between browser tabs and the installed PWA.
- `/metodologie` and `/disclaimer` remain accessible directly from `/profile` (with `?from=profile` back navigation) and stay readable if opened inside the PWA without exposing `/landing` marketing navigation.
- Guided install steps for iOS and social in-app browsers carry a small copy-maintenance surface if OS/browser share menus change.
