# 0003. First-Party Founder KPIs in Neon Postgres

Status: accepted

## Context

PickItWell needs lightweight founder visibility into product traction inside `/admin` (starting with Registered Users, Active Users, and App Installs, alongside live catalog health). Because PickItWell is delivered as an installable PWA targeting EU users (`ro` default locale), we also want to avoid GDPR cookie-consent banners and keep infrastructure simple on Railway + Neon Postgres.

## Decision

We track founder KPIs **100% first-party in Neon Postgres** using existing domain tables plus two minimal tables (`user_daily_activity` and `user_app_installs`), surfaced on an `/admin` Dashboard:

1. **No custom event-tracking engine**: We explicitly scope this system to founder KPI snapshots and 30-day daily aggregates—not pageview streams, click tracking, funnels, or session replays. If behavioral analytics or anonymous `/landing` traffic attribution is ever needed later, adopt a dedicated external tool (such as cookieless Cloudflare Web Analytics or PostHog EU) instead of building an event pipeline in Postgres.
2. **Cookie-banner-free by design**: Zero third-party analytics scripts, zero anonymous `localStorage` tracking IDs, and zero IP or raw `User-Agent` logging. Presence rows tie strictly to `user.id` with `ON DELETE CASCADE` and exclude `admin` accounts.
3. **Cross-platform PWA App Install verification**: Because iOS Safari fires no install event and does not share `localStorage` with an installed PWA, an **App Install** is recorded per distinct `client` user upon their first authenticated standalone launch (`display-mode: standalone` / `navigator.standalone === true`) or authenticated Chromium install, with coarse platform classification (`ios`, `android`, or `desktop`).
4. **Calendar day alignment**: Daily activity and 30-day trend buckets are aligned to `Europe/Bucharest` calendar dates in Postgres rather than UTC container time.

## Considered Options

- **Third-party product analytics (PostHog EU, Umami)**: Rejected for now because core user, onboarding, catalog, and submission counts already live in Neon Postgres, third-party scripts suffer from ad-blocker loss, and external tools still cannot read iOS standalone PWA usage without custom instrumentation.
- **Device-level anonymous install tracking in `localStorage`**: Rejected because it complicates iOS deduplication (isolated PWA storage) and introduces persistent anonymous client identifiers that weaken our cookie-banner-free ePrivacy posture.
- **Better Auth `session` table only**: Rejected because long-lived sessions do not distinguish daily active usage from dormant logged-in sessions and disappear on sign-out or expiry.

## Consequences

- Zero vendor lock-in, zero ad-blocker blind spots on authenticated KPIs, and numbers that stay exact against the production database.
- Anonymous `/landing` pageviews before signup are intentionally not measured here.
- Pre-signup PWA installs on Android only count once the user signs in and opens or installs while authenticated.
