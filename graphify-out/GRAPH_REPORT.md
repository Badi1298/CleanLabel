# Graph Report - CleanLabel  (2026-11-19)

## Corpus Check
- 165 files · ~151,413 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1221 nodes · 2812 edges · 69 communities (60 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `031a8ed4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- auth-fields.tsx
- profile.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- storesQueryOptions
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- cn
- Create Auth Skill
- Building For Production
- Better Auth Integration Guide
- Lakebase Postgres
- devDependencies
- compilerOptions
- components.json
- additive-highlighting.ts
- scripts
- email-and-password-best-practices/SKILL.md
- carousel.tsx
- admin/route.tsx
- productDetailsQueryOptions
- __root.tsx
- search.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- dotenv
- 0001_nice_rockslide.sql
- react
- category-functions.ts
- category-icon.tsx
- AGENTS.md
- pnpm
- landing-data.ts
- drizzle-orm
- ingredient-mappings.tsx
- store-submission-queries.ts
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- auth-schema.ts
- "product_store_submissions"
- admin/add-product.tsx
- _public/route.tsx
- product-queries.ts
- ensureSession
- FileRoutesByPath
- $productId.tsx
- index.ts
- @tanstack/react-query
- utils.ts
- landing-header.tsx
- score-badge.tsx
- lucide-react
- zod

## God Nodes (most connected - your core abstractions)
1. `cn()` - 158 edges
2. `react` - 67 edges
3. `lucide-react` - 48 edges
4. `@tanstack/react-router` - 39 edges
5. `ensureSession` - 36 edges
6. `@tanstack/react-query` - 35 edges
7. `@tanstack/react-start` - 31 edges
8. `Button()` - 30 edges
9. `storesQueryOptions()` - 29 edges
10. `FileRoutesByPath` - 28 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (69 total, 9 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.19
Nodes (20): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret, getBetterAuthUrl (+12 more)

### Community 1 - "auth-fields.tsx"
Cohesion: 0.24
Nodes (19): @tanstack/react-form, AuthEmailField(), AuthEmailFieldProps, AuthFieldBaseProps, AuthPasswordField(), AuthPasswordFieldProps, AuthSubmitButton(), authValidationLogic() (+11 more)

### Community 2 - "profile.tsx"
Cohesion: 0.15
Nodes (14): ref_better_auth_client_plugins, ref_better_auth_react, ProductCardProps, StoreInfo, Popover(), PopoverContent(), PopoverTrigger(), FacebookIcon() (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+32 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.08
Nodes (35): AppSidebar(), SidebarGroupData, SidebarItem, DropdownMenuItem(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps (+27 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (40): Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LandingRoute (+32 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (29): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, @base-ui/react (+21 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "storesQueryOptions"
Cohesion: 0.20
Nodes (11): allProductsQueryOptions(), searchQueryOptions(), storesQueryOptions(), Route, Route, RouteComponent(), Route, StoresIndexPage() (+3 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "cn"
Cohesion: 0.10
Nodes (24): cmdk, StoreChip(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+16 more)

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

### Community 21 - "additive-highlighting.ts"
Cohesion: 0.17
Nodes (22): ProductForm(), detectAdditiveCandidates(), escapeRegex(), expandECodeInterval(), findBoundarySafeMatches(), FOLD_CHAR_MAP, foldDiacritics1To1(), FUNCTIONAL_CLASS_PATTERNS (+14 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "carousel.tsx"
Cohesion: 0.17
Nodes (16): embla-carousel-react, REVIEWS, ReviewsSection(), Carousel(), CarouselApi, CarouselConfig, CarouselContent(), CarouselCtx (+8 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.20
Nodes (11): radix-ui, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator() (+3 more)

### Community 26 - "productDetailsQueryOptions"
Cohesion: 0.25
Nodes (8): useImageUploadMutation(), productAlternativesQueryOptions(), productDetailsQueryOptions(), AddStoreToProductPage(), Route, Route, getProductAlternatives, getProductDetailsById

### Community 27 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 28 - "search.tsx"
Cohesion: 0.07
Nodes (39): CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), CategoryItem, CategoryNavList() (+31 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.08
Nodes (33): categories, categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategories, productCategoriesRelations (+25 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "react"
Cohesion: 0.05
Nodes (78): cn, react, sonner, @tanstack/react-start, @tanstack/react-table, AddCategoryDialog(), AddIngredientDialog(), AddStoreDialog() (+70 more)

### Community 36 - "category-functions.ts"
Cohesion: 0.15
Nodes (12): offCategoryMappings, unmappedOffTags, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategoriesSchema, getCategoriesSchema (+4 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "landing-data.ts"
Cohesion: 0.09
Nodes (27): class-variance-authority, ref_tanstack_react_start_server, FinalCtaSection(), HeroSection(), HowItWorksSection(), CATALOG_CATEGORIES, FOOTER_TOPIC_IDS, HEADER_LINKS (+19 more)

### Community 44 - "drizzle-orm"
Cohesion: 0.27
Nodes (9): drizzle-orm, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool (+1 more)

### Community 45 - "ingredient-mappings.tsx"
Cohesion: 0.12
Nodes (23): offIngredientMappings, unmappedOffIngredients, ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), RouteComponent(), columnHelper, features, MappingRowActions() (+15 more)

### Community 46 - "store-submission-queries.ts"
Cohesion: 0.36
Nodes (7): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage(), getPendingStoreSubmissionsCount

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

### Community 57 - "admin/add-product.tsx"
Cohesion: 0.18
Nodes (11): react-zoom-pan-pinch, WHY_CARDS, WhySection(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+3 more)

### Community 58 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 59 - "product-queries.ts"
Cohesion: 0.18
Nodes (16): ActiveCategoriesFilters, activeCategoriesQueryOptions(), categoriesQueryOptions(), ProductQueryArgs, productQueryOptions(), Route, RouteComponent(), AddProductRoute() (+8 more)

### Community 61 - "ensureSession"
Cohesion: 0.15
Nodes (17): ensureSession, addStore, addStoreSchema, deleteStore, deleteStoreSchema, getStores, storeIdSchema, updateStore (+9 more)

### Community 62 - "FileRoutesByPath"
Cohesion: 0.13
Nodes (10): auth, Route, Route, Route, Route, Route, Route, Route (+2 more)

### Community 63 - "$productId.tsx"
Cohesion: 0.16
Nodes (18): HighlightedIngredientsText(), ProductCard(), emailSchema, ProductReportErrorDialog(), validateDetails(), validateEmail(), userExcludedIngredientsQueryOptions(), userFavoriteProductsQueryOptions() (+10 more)

### Community 64 - "index.ts"
Cohesion: 0.39
Nodes (6): db, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 66 - "@tanstack/react-query"
Cohesion: 0.29
Nodes (8): @tanstack/react-query, SearchBar(), SearchBarProps, homeQueryOptions(), CATEGORY_PALETTES, Home(), Route, getHomeData

### Community 68 - "utils.ts"
Cohesion: 0.38
Nodes (4): Skeleton(), SCORE_FILTER_OPTIONS, ScoreFilter, SKELETON_KEYS

### Community 70 - "landing-header.tsx"
Cohesion: 0.23
Nodes (9): LandingHeader(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+1 more)

### Community 71 - "score-badge.tsx"
Cohesion: 0.20
Nodes (8): src_assets_bronze_badge, src_assets_gold_badge, src_assets_silver_badge, AuthShellProps, ProductScoreTier, ScoreBadge(), ScoreBadgeProps, TIER_BADGES

### Community 75 - "lucide-react"
Cohesion: 0.19
Nodes (13): lucide-react, @tanstack/react-router, getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps (+5 more)

### Community 76 - "zod"
Cohesion: 0.22
Nodes (7): browser-image-compression, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

## Knowledge Gaps
- **475 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+470 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 556 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `auth-fields.tsx`, `profile.tsx`, `@tanstack/react-query`, `react`, `category-icon.tsx`, `sidebar.tsx`, `score-badge.tsx`, `landing-header.tsx`, `landing-data.ts`, `utils.ts`, `lucide-react`, `admin/add-product.tsx`, `carousel.tsx`, `admin/route.tsx`, `productDetailsQueryOptions`, `search.tsx`, `$productId.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `auth-fields.tsx`, `profile.tsx`, `@tanstack/react-query`, `sidebar.tsx`, `utils.ts`, `landing-header.tsx`, `score-badge.tsx`, `package.json`, `landing-data.ts`, `lucide-react`, `admin/add-product.tsx`, `cn`, `ingredient-mappings.tsx`, `carousel.tsx`, `admin/route.tsx`, `search.tsx`, `router.tsx`, `$productId.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _475 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862679955703211 - nodes in this community are weakly interconnected._
- **Should `organization-best-practices/SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._