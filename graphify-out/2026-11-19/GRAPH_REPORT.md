# Graph Report - CleanLabel  (2026-11-19)

## Corpus Check
- 168 files · ~152,934 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1244 nodes · 2913 edges · 61 communities (53 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b274ee2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- @tanstack/react-router
- search-functions.ts
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- category-functions.ts
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- utils.ts
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
- admin/route.tsx
- __root.tsx
- search.tsx
- vite.config.ts
- category-queries.ts
- app-schema.ts
- generate-sw.mjs
- pnpm
- 0001_nice_rockslide.sql
- product-functions.ts
- Use Existing & Official shadcn/ui Components
- category-icon.tsx
- AGENTS.md
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
- store-submission-queries.ts
- auth-functions.ts
- FileRoutesByPath
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
9. `FileRoutesByPath` - 26 edges
10. `storesQueryOptions()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `1. Reuse Existing Project Components First` --references--> `cn()`  [INFERRED]
  .agents/rules/shadcn-ui.md → src/lib/utils.ts
- `StoreChip()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/product-card.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (61 total, 8 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.17
Nodes (22): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey (+14 more)

### Community 1 - "@tanstack/react-router"
Cohesion: 0.12
Nodes (31): ref_better_auth_client_plugins, ref_better_auth_react, @tanstack/react-form, @tanstack/react-router, @tanstack/react-router-ssr-query, AuthEmailField(), AuthEmailFieldProps, AuthFieldBaseProps (+23 more)

### Community 2 - "search-functions.ts"
Cohesion: 0.27
Nodes (12): searchQueryOptions(), buildSearchWhereConditions(), categorySectionsSchema, getPaginatedSearchResults, getSearchCategorySections, getSearchResults, hydrateProductsInOrder(), paginatedSearchSchema (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+32 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (30): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+22 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (36): ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LandingRoute, LoginRoute, ProtectedAdminAddProductRoute (+28 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (29): imports, name, private, type, babel-plugin-react-compiler, @base-ui/react, better-auth, @biomejs/biome (+21 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "category-functions.ts"
Cohesion: 0.10
Nodes (24): categories, offCategoryMappings, productCategories, products, productStores, stores, unmappedOffTags, db (+16 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "utils.ts"
Cohesion: 0.05
Nodes (60): cmdk, ProductCard(), ProductCardProps, StoreChip(), StoreInfo, emailSchema, ProductReportErrorDialog(), validateDetails() (+52 more)

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
Cohesion: 0.16
Nodes (17): embla-carousel-react, REVIEWS, ReviewsSection(), Card(), Carousel(), CarouselApi, CarouselConfig, CarouselContent() (+9 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "react"
Cohesion: 0.06
Nodes (72): class-variance-authority, cn, react, sonner, @tanstack/react-query, @tanstack/react-start, @tanstack/react-table, AddCategoryDialog() (+64 more)

### Community 25 - "cn"
Cohesion: 0.09
Nodes (26): radix-ui, CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogOverlay() (+18 more)

### Community 26 - "admin/route.tsx"
Cohesion: 0.24
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset(), SidebarProvider() (+1 more)

### Community 27 - "__root.tsx"
Cohesion: 0.16
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), TanstackQueryProvider() (+1 more)

### Community 28 - "search.tsx"
Cohesion: 0.07
Nodes (57): lucide-react, CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), CatalogCategorySection (+49 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "category-queries.ts"
Cohesion: 0.25
Nodes (10): categoriesQueryOptions(), CategoryQueryArgs, categoryQueryOptions(), unmappedTagsQueryOptions(), Route, MappingRowActions(), Route, getCategories (+2 more)

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (21): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+13 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "product-functions.ts"
Cohesion: 0.06
Nodes (50): react-zoom-pan-pinch, HighlightedIngredientsText(), ProductForm(), productIngredients, detectAdditiveCandidates(), escapeRegex(), expandECodeInterval(), findBoundarySafeMatches() (+42 more)

### Community 36 - "Use Existing & Official shadcn/ui Components"
Cohesion: 0.40
Nodes (4): 1. Reuse Existing Project Components First, 2. Install Missing Official Components via CLI, 3. When Custom Components Are Acceptable, Use Existing & Official shadcn/ui Components

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "store-sidebar.tsx"
Cohesion: 0.06
Nodes (55): src_assets_bronze_badge, src_assets_gold_badge, src_assets_silver_badge, FinalCtaSection(), HeroSection(), HowItWorksSection(), CATALOG_CATEGORIES, FOOTER_TOPIC_IDS (+47 more)

### Community 43 - "Ask Questions & Challenge Assumptions"
Cohesion: 0.50
Nodes (3): 1. Ask Whenever Anything Is Unclear, 2. Challenge Suboptimal Approaches & Propose Alternatives, Ask Questions & Challenge Assumptions

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "ensureSession"
Cohesion: 0.10
Nodes (24): offIngredientMappings, productStoreSubmissions, unmappedOffIngredients, ensureSession, addCategory, mapOffTagToCategory, updateCategory, addIngredient (+16 more)

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

### Community 61 - "store-submission-queries.ts"
Cohesion: 0.33
Nodes (8): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage(), getPendingStoreSubmissionsCount, getStoreSubmissions

### Community 62 - "auth-functions.ts"
Cohesion: 0.24
Nodes (6): ref_tanstack_react_start_server, auth, Route, Route, Route, getSession

### Community 63 - "FileRoutesByPath"
Cohesion: 0.18
Nodes (9): Route, Route, Route, Route, Route, Route, Route, FileRoutesById (+1 more)

### Community 64 - "drizzle-orm"
Cohesion: 0.43
Nodes (6): drizzle-orm, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 74 - "zod"
Cohesion: 0.22
Nodes (7): browser-image-compression, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

## Knowledge Gaps
- **488 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+483 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `@tanstack/react-router`, `product-functions.ts`, `Use Existing & Official shadcn/ui Components`, `category-icon.tsx`, `sidebar.tsx`, `store-sidebar.tsx`, `utils.ts`, `carousel.tsx`, `react`, `admin/route.tsx`, `search.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `@tanstack/react-router`, `product-functions.ts`, `sidebar.tsx`, `package.json`, `store-sidebar.tsx`, `utils.ts`, `carousel.tsx`, `cn`, `admin/route.tsx`, `__root.tsx`, `search.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _488 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@tanstack/react-router` be split into smaller, more focused modules?**
  _Cohesion score 0.11522048364153627 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._