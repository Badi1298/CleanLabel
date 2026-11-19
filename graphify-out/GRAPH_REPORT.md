# Graph Report - CleanLabel  (2026-11-19)

## Corpus Check
- 168 files · ~152,766 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1242 nodes · 2887 edges · 66 communities (57 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b6e3794`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- auth-fields.tsx
- $productId.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- product-functions.ts
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- profile.tsx
- Create Auth Skill
- Building For Production
- Better Auth Integration Guide
- Lakebase Postgres
- devDependencies
- compilerOptions
- components.json
- carousel.tsx
- scripts
- email-and-password-best-practices/SKILL.md
- react
- cn
- product-queries.ts
- __root.tsx
- search.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- admin/add-product.tsx
- 0001_nice_rockslide.sql
- additive-highlighting.ts
- Use Existing & Official shadcn/ui Components
- utils.ts
- AGENTS.md
- lucide-react
- store-sidebar.tsx
- Ask Questions & Challenge Assumptions
- seed-off.ts
- ensureSession
- _public/route.tsx
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- auth-schema.ts
- "product_store_submissions"
- index.tsx
- badge.tsx
- ProductReportErrorDialog.tsx
- $.ts
- store-submission-functions.ts
- landing.tsx
- forgot-password.tsx
- drizzle-orm
- zod

## God Nodes (most connected - your core abstractions)
1. `cn()` - 166 edges
2. `react` - 66 edges
3. `lucide-react` - 48 edges
4. `@tanstack/react-router` - 38 edges
5. `Button()` - 36 edges
6. `ensureSession` - 36 edges
7. `@tanstack/react-query` - 33 edges
8. `@tanstack/react-start` - 31 edges
9. `storesQueryOptions()` - 23 edges
10. `sonner` - 22 edges

## Surprising Connections (you probably didn't know these)
- `1. Reuse Existing Project Components First` --references--> `cn()`  [INFERRED]
  .agents/rules/shadcn-ui.md → src/lib/utils.ts
- `StoreChip()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/product-card.tsx → src/lib/utils.ts
- `ProductImageLightbox()` --calls--> `cn()`  [EXTRACTED]
  src/routes/_protected/_public/products/$productId.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (66 total, 9 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.17
Nodes (22): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey (+14 more)

### Community 1 - "auth-fields.tsx"
Cohesion: 0.17
Nodes (23): ref_better_auth_client_plugins, ref_better_auth_react, @tanstack/react-form, AuthEmailField(), AuthEmailFieldProps, AuthFieldBaseProps, AuthPasswordField(), AuthPasswordFieldProps (+15 more)

### Community 2 - "$productId.tsx"
Cohesion: 0.16
Nodes (21): ProductCard(), ProductCardProps, StoreChip(), isPhraseFoundInText(), productAlternativesQueryOptions(), productDetailsQueryOptions(), userExcludedIngredientsQueryOptions(), userFavoriteProductsQueryOptions() (+13 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+32 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.08
Nodes (35): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+27 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (40): Route, Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute (+32 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (31): imports, name, pnpm, onlyBuiltDependencies, private, type, babel-plugin-react-compiler, @base-ui/react (+23 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "product-functions.ts"
Cohesion: 0.10
Nodes (24): categories, productCategories, productIngredients, products, productStores, db, getHomeData, addProductSchema (+16 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "profile.tsx"
Cohesion: 0.11
Nodes (20): cmdk, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+12 more)

### Community 14 - "Create Auth Skill"
Cohesion: 0.10
Nodes (20): Auth UI Implementation, Client Config (auth-client.ts), Common Plugins, Create Auth Skill, Database Adapters, Database Migrations, Drizzle Config (`drizzle.config.ts`), Drizzle + PostgreSQL Setup (+12 more)

### Community 15 - "Building For Production"
Cohesion: 0.10
Nodes (19): Adding a Database (Optional), Adding A Route, Adding Links, API Routes, Building For Production, Data Fetching, Deploy to Railway, Getting Started (+11 more)

### Community 16 - "Better Auth Integration Guide"
Cohesion: 0.11
Nodes (18): Better Auth Integration Guide, CLI Commands, Client, Common Gotchas, Core Config Options, Database, Email Flows, Environment Variables (+10 more)

### Community 17 - "Lakebase Postgres"
Cohesion: 0.11
Nodes (18): 1. Select the organization and project, 2. Get the connection string, 3. Pick the connection method and driver, 4. Set up the schema, Autoscaling, Branching, Connection Pooling, Gotchas (+10 more)

### Community 18 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, babel-plugin-react-compiler, @biomejs/biome, dotenv, @rolldown/plugin-babel, @tailwindcss/typography, @tanstack/devtools-event-client, @tanstack/devtools-vite (+11 more)

### Community 19 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 20 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 21 - "carousel.tsx"
Cohesion: 0.20
Nodes (14): embla-carousel-react, Carousel(), CarouselApi, CarouselConfig, CarouselContent(), CarouselCtx, CarouselHookParams, CarouselItem() (+6 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "react"
Cohesion: 0.05
Nodes (85): class-variance-authority, cn, react, sonner, @tanstack/react-query, @tanstack/react-router, @tanstack/react-start, @tanstack/react-table (+77 more)

### Community 25 - "cn"
Cohesion: 0.12
Nodes (21): CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogOverlay(), DropdownMenuCheckboxItem() (+13 more)

### Community 26 - "product-queries.ts"
Cohesion: 0.18
Nodes (13): ActiveCategoriesFilters, allProductsQueryOptions(), categoriesQueryOptions(), ProductQueryArgs, Route, AddProductRoute(), Route, searchSchema (+5 more)

### Community 27 - "__root.tsx"
Cohesion: 0.16
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext (+1 more)

### Community 28 - "search.tsx"
Cohesion: 0.06
Nodes (66): CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), StoreInfo, CatalogCategorySection (+58 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.28
Nodes (7): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (21): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+13 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "admin/add-product.tsx"
Cohesion: 0.21
Nodes (13): react-zoom-pan-pinch, ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), productQueryOptions(), Route, RouteComponent(), searchSchema, Route (+5 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "additive-highlighting.ts"
Cohesion: 0.13
Nodes (26): HighlightedIngredientsText(), ProductForm(), useImageUploadMutation(), detectAdditiveCandidates(), escapeRegex(), expandECodeInterval(), findBoundarySafeMatches(), FOLD_CHAR_MAP (+18 more)

### Community 36 - "Use Existing & Official shadcn/ui Components"
Cohesion: 0.40
Nodes (4): 1. Reuse Existing Project Components First, 2. Install Missing Official Components via CLI, 3. When Custom Components Are Acceptable, Use Existing & Official shadcn/ui Components

### Community 37 - "utils.ts"
Cohesion: 0.21
Nodes (8): radix-ui, CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon(), Slider(), Switch()

### Community 39 - "lucide-react"
Cohesion: 0.13
Nodes (19): lucide-react, HowItWorksSection(), CATALOG_CATEGORIES, INFO_MODAL_TOPIC_MAP, INFO_MODAL_TOPICS, InfoModalTopicConfig, REVIEWS, SOCIAL_LINKS (+11 more)

### Community 41 - "store-sidebar.tsx"
Cohesion: 0.14
Nodes (22): HEADER_LINKS, LandingHeader(), CategoryItem, CategoryNavListProps, MobileCategoryDrawer(), MobileCategoryDrawerProps, MobileStoreDrawer(), MobileStoreDrawerProps (+14 more)

### Community 43 - "Ask Questions & Challenge Assumptions"
Cohesion: 0.50
Nodes (3): 1. Ask Whenever Anything Is Unclear, 2. Challenge Suboptimal Approaches & Propose Alternatives, Ask Questions & Challenge Assumptions

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "ensureSession"
Cohesion: 0.10
Nodes (25): offCategoryMappings, offIngredientMappings, unmappedOffIngredients, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory (+17 more)

### Community 46 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 49 - ""user_favorite_products""
Cohesion: 0.50
Nodes (3): "public"."products", "public"."user", "user_favorite_products"

### Community 50 - "0002_careful_colleen_wing.sql"
Cohesion: 0.50
Nodes (3): "off_category_mappings", "public"."categories", "unmapped_off_tags"

### Community 51 - "0003_dapper_jasper_sitwell.sql"
Cohesion: 0.50
Nodes (3): "off_ingredient_mappings", "public"."ingredients", "unmapped_off_ingredients"

### Community 52 - ""user_excluded_ingredients""
Cohesion: 0.50
Nodes (3): "public"."ingredients", "public"."user", "user_excluded_ingredients"

### Community 54 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "index.tsx"
Cohesion: 0.13
Nodes (18): getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, StoreCard(), StoreCardProps (+10 more)

### Community 58 - "badge.tsx"
Cohesion: 0.16
Nodes (13): src_assets_bronze_badge, src_assets_gold_badge, src_assets_silver_badge, FinalCtaSection(), HeroSection(), HERO_STORES, SAMPLE_STORES, Badge() (+5 more)

### Community 59 - "ProductReportErrorDialog.tsx"
Cohesion: 0.60
Nodes (4): emailSchema, ProductReportErrorDialog(), validateDetails(), validateEmail()

### Community 61 - "store-submission-functions.ts"
Cohesion: 0.18
Nodes (10): productStoreSubmissions, stores, approveStoreSubmission, approveStoreSubmissionSchema, getPendingStoreSubmissionsCount, getStoreSubmissionsSchema, rejectStoreSubmission, rejectStoreSubmissionSchema (+2 more)

### Community 62 - "landing.tsx"
Cohesion: 0.18
Nodes (9): ref_tanstack_react_start_server, FOOTER_TOPIC_IDS, InfoModalTopic, LandingFooter(), ReviewsSection(), Separator(), Route, Route (+1 more)

### Community 64 - "drizzle-orm"
Cohesion: 0.43
Nodes (6): drizzle-orm, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 74 - "zod"
Cohesion: 0.22
Nodes (7): browser-image-compression, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

## Knowledge Gaps
- **488 isolated node(s):** `2. Install Missing Official Components via CLI`, `3. When Custom Components Are Acceptable`, `ProductCardProps`, `ScoreFilterValue`, `CatalogProductResult` (+483 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `auth-fields.tsx`, `$productId.tsx`, `additive-highlighting.ts`, `Use Existing & Official shadcn/ui Components`, `utils.ts`, `sidebar.tsx`, `lucide-react`, `store-sidebar.tsx`, `profile.tsx`, `carousel.tsx`, `react`, `index.tsx`, `badge.tsx`, `ProductReportErrorDialog.tsx`, `search.tsx`, `landing.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `react` to `drizzle-orm`, `admin/add-product.tsx`, `$productId.tsx`, `safe-envs.ts`, `routeTree.gen.ts`, `package.json`, `zod`, `product-functions.ts`, `profile.tsx`, `ensureSession`, `product-queries.ts`, `store-submission-functions.ts`, `landing.tsx`, `app-schema.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `auth-fields.tsx`, `$productId.tsx`, `additive-highlighting.ts`, `sidebar.tsx`, `utils.ts`, `lucide-react`, `package.json`, `store-sidebar.tsx`, `profile.tsx`, `carousel.tsx`, `router.tsx`, `cn`, `badge.tsx`, `ProductReportErrorDialog.tsx`, `search.tsx`, `landing.tsx`, `index.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `2. Install Missing Official Components via CLI`, `3. When Custom Components Are Acceptable`, `ProductCardProps` to the rest of the system?**
  _488 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862679955703211 - nodes in this community are weakly interconnected._
- **Should `organization-best-practices/SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._