# 0001. Bilingual i18n with Paraglide JS and Cookie-Only Locale Routing

Status: accepted

## Context

PickItWell targets consumers in Romania (defaulting to Romanian) while also serving English-speaking residents and students. Previously, the marketing/legal pages (`/landing`, `/metodologie`, `/disclaimer`) were written in Romanian while authentication and the authenticated application were written in English, and `/admin/*` was built as an internal English operations tool.

## Decision

We chose **`@inlang/paraglide-js`** with **cookie-only locale resolution** (`PARAGLIDE_LOCALE`, falling back to `Accept-Language` and then `ro`) paired with a nullable `user.preferred_locale` database column for cross-device synchronization when signed in.

We explicitly excluded `/admin/*` (kept strictly English) and database **Catalog Data** (products, brands, categories, stores, ingredients stay single-language as entered) from localization in this phase.

## Considered Options

- **URL-prefixed routing (`/en/...`)**: Rejected for now because it adds route-rewrite surface area across Better Auth OAuth callbacks, `/admin/*` exclusions, and PWA `start_url` handling, while the primary audience is in Romania.
- **Custom TypeScript dictionary or `i18next`**: Rejected in favor of Paraglide JS for compile-time missing-key safety, built-in TanStack Start SSR request isolation (`paraglideMiddleware`), native Romanian 3-form plural rules (`one` / `few` / `other`), and standard JSON message catalogs.

## Consequences

- Public URLs are identical across languages; shared links render in the recipient's active locale rather than encoding a language in the URL.
- Switching locale performs a clean page reload via Paraglide's `setLocale()` to guarantee React Compiler and SSR `<html lang>` / `<head>` metadata consistency.
- Moving to URL-prefixed localization later remains straightforward by updating Paraglide's routing strategy and TanStack Router `rewrite` hooks, without rewriting message catalogs.
