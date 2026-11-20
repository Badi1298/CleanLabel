# Graph Report - CleanLabel  (2026-11-16)

## Corpus Check
- 144 files · ~75,150 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1084 nodes · 2391 edges · 66 communities (57 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ebf3fa2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- product-queries.ts
- product-functions.ts
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- tooltip.tsx
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
- $productId.tsx
- scripts
- email-and-password-best-practices/SKILL.md
- store-submissions.tsx
- admin/route.tsx
- _protected/route.tsx
- __root.tsx
- profile.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- ingredient-functions.ts
- 0001_nice_rockslide.sql
- search.tsx
- product-card.tsx
- category-icon.tsx
- AGENTS.md
- dotenv
- store-avatar.tsx
- pnpm
- FileRoutesByPath
- seed-off.ts
- storesQueryOptions
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- ingredientsQueryOptions
- "product_store_submissions"
- store-submission-queries.ts
- _public/route.tsx
- ensureSession
- favorites.tsx
- drizzle-orm
- sheet.tsx
- category-functions.ts
- @tanstack/react-query
- admin/add-product.tsx
- off-functions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 132 edges
2. `react` - 50 edges
3. `lucide-react` - 37 edges
4. `ensureSession` - 36 edges
5. `@tanstack/react-query` - 35 edges
6. `@tanstack/react-router` - 33 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `FileRoutesByPath` - 27 edges
10. `Button()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `StoreChip()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/product-card.tsx → src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (66 total, 9 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.19
Nodes (20): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret, getBetterAuthUrl (+12 more)

### Community 1 - "product-queries.ts"
Cohesion: 0.21
Nodes (12): ActiveCategoriesFilters, allProductsQueryOptions(), productAlternativesQueryOptions(), productDetailsQueryOptions(), ProductQueryArgs, Route, Route, Route (+4 more)

### Community 2 - "product-functions.ts"
Cohesion: 0.22
Nodes (12): categories, productCategories, productIngredients, products, productStores, db, addProductSchema, deleteProduct (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.11
Nodes (26): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+18 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (39): Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute (+31 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (29): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, @base-ui/react (+21 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "tooltip.tsx"
Cohesion: 0.40
Nodes (4): Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "cn"
Cohesion: 0.10
Nodes (22): CardAction(), CardDescription(), CardFooter(), DialogOverlay(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+14 more)

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

### Community 21 - "$productId.tsx"
Cohesion: 0.17
Nodes (16): ProductCard(), ProductScoreTier, ScoreBadge(), ScoreBadgeProps, TIER_STYLES, userExcludedIngredientsQueryOptions(), userFavoriteProductsQueryOptions(), formatProductDate() (+8 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "store-submissions.tsx"
Cohesion: 0.06
Nodes (78): class-variance-authority, lucide-react, radix-ui, react, sonner, @tanstack/react-form, @tanstack/react-router, @tanstack/react-table (+70 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.19
Nodes (11): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+3 more)

### Community 27 - "__root.tsx"
Cohesion: 0.17
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), TanstackQueryProvider() (+1 more)

### Community 28 - "profile.tsx"
Cohesion: 0.16
Nodes (14): cmdk, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+6 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.28
Nodes (7): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (21): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+13 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "ingredient-functions.ts"
Cohesion: 0.12
Nodes (15): zod, offIngredientMappings, unmappedOffIngredients, clientEnvSchema, serverEnvSchema, addIngredient, addIngredientSchema, deleteIngredient (+7 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "search.tsx"
Cohesion: 0.08
Nodes (23): cn, CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), src_components_ui_combobox_combobox (+15 more)

### Community 36 - "product-card.tsx"
Cohesion: 0.21
Nodes (9): ProductCardProps, StoreChip(), StoreInfo, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+1 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "store-avatar.tsx"
Cohesion: 0.27
Nodes (8): getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, StoreCard(), StoreCardProps

### Community 43 - "FileRoutesByPath"
Cohesion: 0.17
Nodes (9): auth, Route, Route, Route, Route, Route, Route, Route (+1 more)

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "storesQueryOptions"
Cohesion: 0.17
Nodes (18): activeCategoriesQueryOptions(), SearchOptionsArgs, searchQueryOptions(), storeExclusiveProductsQueryOptions(), storesQueryOptions(), DeleteStoreDialog(), RouteComponent(), Route (+10 more)

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

### Community 54 - "ingredientsQueryOptions"
Cohesion: 0.31
Nodes (8): ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), Route, RouteComponent(), MappingRowActions(), Route, getIngredients, getUnmappedIngredients

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "store-submission-queries.ts"
Cohesion: 0.33
Nodes (8): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage(), getPendingStoreSubmissionsCount, getStoreSubmissions

### Community 59 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 61 - "ensureSession"
Cohesion: 0.12
Nodes (23): browser-image-compression, @tanstack/react-start, ref_tanstack_react_start_server, productStoreSubmissions, stores, ensureSession, addStore, addStoreSchema (+15 more)

### Community 63 - "favorites.tsx"
Cohesion: 0.20
Nodes (8): ref_better_auth_client_plugins, ref_better_auth_react, Skeleton(), clientEnv, FavoritesPage(), SCORE_FILTER_OPTIONS, ScoreFilter, SKELETON_KEYS

### Community 64 - "drizzle-orm"
Cohesion: 0.17
Nodes (10): drizzle-orm, ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user (+2 more)

### Community 65 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 66 - "category-functions.ts"
Cohesion: 0.15
Nodes (12): offCategoryMappings, unmappedOffTags, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategoriesSchema, getCategoriesSchema (+4 more)

### Community 67 - "@tanstack/react-query"
Cohesion: 0.36
Nodes (7): @tanstack/react-query, SearchBar(), homeQueryOptions(), CATEGORY_PALETTES, Home(), Route, getHomeData

### Community 68 - "admin/add-product.tsx"
Cohesion: 0.18
Nodes (15): react-zoom-pan-pinch, ProductForm(), useImageUploadMutation(), categoriesQueryOptions(), productQueryOptions(), Route, RouteComponent(), searchSchema (+7 more)

### Community 69 - "off-functions.ts"
Cohesion: 0.53
Nodes (5): getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

## Knowledge Gaps
- **450 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+445 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 524 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `ensureSession` to `safe-envs.ts`, `ingredient-functions.ts`, `category-functions.ts`, `product-functions.ts`, `product-card.tsx`, `admin/add-product.tsx`, `off-functions.ts`, `routeTree.gen.ts`, `package.json`, `$productId.tsx`, `store-submissions.tsx`, `profile.tsx`, `app-schema.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `sheet.tsx`, `search.tsx`, `product-card.tsx`, `category-icon.tsx`, `@tanstack/react-query`, `sidebar.tsx`, `store-avatar.tsx`, `tooltip.tsx`, `storesQueryOptions`, `$productId.tsx`, `store-submissions.tsx`, `admin/route.tsx`, `profile.tsx`, `favorites.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `react` connect `store-submissions.tsx` to `sheet.tsx`, `search.tsx`, `sidebar.tsx`, `product-card.tsx`, `@tanstack/react-query`, `package.json`, `tooltip.tsx`, `cn`, `storesQueryOptions`, `$productId.tsx`, `admin/route.tsx`, `profile.tsx`, `router.tsx`, `favorites.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _450 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Should `organization-best-practices/SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._