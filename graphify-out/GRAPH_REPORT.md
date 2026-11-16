# Graph Report - CleanLabel  (2026-11-16)

## Corpus Check
- 143 files · ~69,392 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1069 nodes · 2357 edges · 60 communities (52 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `55d051bc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- product-functions.ts
- category-functions.ts
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- search.tsx
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- dropdown-menu.tsx
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
- off-functions.ts
- admin/route.tsx
- zod
- __root.tsx
- cn
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- dotenv
- 0001_nice_rockslide.sql
- store-submissions.tsx
- product-card.tsx
- category-icon.tsx
- AGENTS.md
- pnpm
- ensureSession
- auth-schema.ts
- FileRoutesByPath
- seed-off.ts
- categoriesQueryOptions
- store-functions.ts
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- _public/add-product.tsx
- "product_store_submissions"
- store-submission-queries.ts
- storesQueryOptions
- app-sidebar.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 125 edges
2. `react` - 48 edges
3. `ensureSession` - 36 edges
4. `@tanstack/react-query` - 35 edges
5. `lucide-react` - 35 edges
6. `@tanstack/react-router` - 32 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `Button()` - 28 edges
10. `FileRoutesByPath` - 27 edges

## Surprising Connections (you probably didn't know these)
- `StoreChip()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/product-card.tsx → src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (60 total, 8 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.19
Nodes (20): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret, getBetterAuthUrl (+12 more)

### Community 1 - "product-functions.ts"
Cohesion: 0.13
Nodes (20): productIngredients, ActiveCategoriesFilters, allProductsQueryOptions(), productAlternativesQueryOptions(), productDetailsQueryOptions(), ProductQueryArgs, Route, Route (+12 more)

### Community 2 - "category-functions.ts"
Cohesion: 0.14
Nodes (13): offCategoryMappings, unmappedOffTags, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategories, getActiveCategoriesSchema (+5 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (22): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SidebarContext (+14 more)

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
Cohesion: 0.07
Nodes (28): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, better-auth (+20 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "search.tsx"
Cohesion: 0.08
Nodes (23): @base-ui/react, CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), src_components_ui_combobox_combobox (+15 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (10): DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger() (+2 more)

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
Cohesion: 0.25
Nodes (8): radix-ui, Separator(), Slider(), Switch(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "off-functions.ts"
Cohesion: 0.53
Nodes (5): getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 25 - "admin/route.tsx"
Cohesion: 0.31
Nodes (8): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset()

### Community 26 - "zod"
Cohesion: 0.25
Nodes (6): browser-image-compression, zod, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

### Community 27 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 28 - "cn"
Cohesion: 0.14
Nodes (21): cmdk, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+13 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (21): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+13 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "store-submissions.tsx"
Cohesion: 0.06
Nodes (86): class-variance-authority, cn, lucide-react, react, sonner, @tanstack/react-form, @tanstack/react-query, @tanstack/react-router (+78 more)

### Community 36 - "product-card.tsx"
Cohesion: 0.08
Nodes (33): ref_better_auth_client_plugins, ref_better_auth_react, ProductCard(), ProductCardProps, StoreChip(), StoreInfo, SearchBar(), SearchBarProps (+25 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "ensureSession"
Cohesion: 0.10
Nodes (24): ref_tanstack_react_start_server, offIngredientMappings, unmappedOffIngredients, Route, ensureSession, getSession, addIngredient, addIngredientSchema (+16 more)

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 43 - "FileRoutesByPath"
Cohesion: 0.15
Nodes (10): Onboarding(), auth, Route, Route, Route, Route, NAV_ITEMS, Route (+2 more)

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "categoriesQueryOptions"
Cohesion: 0.22
Nodes (15): getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, activeCategoriesQueryOptions(), categoriesQueryOptions() (+7 more)

### Community 46 - "store-functions.ts"
Cohesion: 0.15
Nodes (17): drizzle-orm, categories, productCategories, products, productStores, stores, db, SearchOptionsArgs (+9 more)

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

### Community 54 - "_public/add-product.tsx"
Cohesion: 0.25
Nodes (7): ProductForm(), useImageUploadMutation(), AddProductRoute(), Route, searchSchema, AddStoreToProductPage(), addProduct

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "store-submission-queries.ts"
Cohesion: 0.36
Nodes (7): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage(), getPendingStoreSubmissionsCount

### Community 58 - "storesQueryOptions"
Cohesion: 0.21
Nodes (13): react-zoom-pan-pinch, productQueryOptions(), storeExclusiveProductsQueryOptions(), storesQueryOptions(), Route, RouteComponent(), searchSchema, DeleteStoreDialog() (+5 more)

### Community 59 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (14): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel(), SidebarHeader() (+6 more)

## Knowledge Gaps
- **441 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+436 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 515 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `store-submissions.tsx`, `product-card.tsx`, `category-icon.tsx`, `sidebar.tsx`, `search.tsx`, `categoriesQueryOptions`, `dropdown-menu.tsx`, `$productId.tsx`, `admin/route.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `store-submissions.tsx` to `safe-envs.ts`, `product-functions.ts`, `category-functions.ts`, `product-card.tsx`, `storesQueryOptions`, `routeTree.gen.ts`, `package.json`, `ensureSession`, `store-functions.ts`, `$productId.tsx`, `_public/add-product.tsx`, `off-functions.ts`, `zod`, `app-schema.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _441 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `product-functions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `category-functions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._