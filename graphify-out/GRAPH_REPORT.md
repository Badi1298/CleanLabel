# Graph Report - CleanLabel  (2026-11-17)

## Corpus Check
- 147 files · ~137,763 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1125 nodes · 2485 edges · 67 communities (58 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34bda6fb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- auth-fields.tsx
- app-sidebar.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- search-functions.ts
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
- profile.tsx
- scripts
- email-and-password-best-practices/SKILL.md
- react
- admin/route.tsx
- auth-functions.ts
- @tanstack/react-router
- category-browse-card.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- ingredient-functions.ts
- 0001_nice_rockslide.sql
- combobox.tsx
- auth-schema.ts
- category-icon.tsx
- AGENTS.md
- dotenv
- cn
- pnpm
- FileRoutesByPath
- drizzle-orm
- product-queries.ts
- pendingStoreSubmissionsCountQueryOptions
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- zod
- "product_store_submissions"
- admin/add-product.tsx
- _public/route.tsx
- storesQueryOptions
- $categoryId.tsx
- ensureSession
- ingredientsQueryOptions
- productDetailsQueryOptions
- off-functions.ts
- $.ts
- category-functions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 139 edges
2. `react` - 56 edges
3. `lucide-react` - 37 edges
4. `ensureSession` - 36 edges
5. `@tanstack/react-query` - 35 edges
6. `@tanstack/react-router` - 33 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `FileRoutesByPath` - 27 edges
10. `Button()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `StoreChip()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/product-card.tsx → src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (67 total, 9 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.19
Nodes (20): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret, getBetterAuthUrl (+12 more)

### Community 1 - "auth-fields.tsx"
Cohesion: 0.23
Nodes (19): @tanstack/react-form, AuthEmailField(), AuthEmailFieldProps, AuthFieldBaseProps, AuthPasswordField(), AuthPasswordFieldProps, AuthSubmitButton(), authValidationLogic() (+11 more)

### Community 2 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (14): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel(), SidebarHeader() (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.12
Nodes (19): Sheet(), SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction() (+11 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (37): ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute, ProtectedAdminAddProductRoute, ProtectedAdminAllCategoriesRoute (+29 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, better-auth (+20 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "search-functions.ts"
Cohesion: 0.18
Nodes (18): infiniteSearchQueryOptions(), SearchCategorySectionsArgs, searchCategorySectionsQueryOptions(), SearchOptionsArgs, Route, SearchPage(), buildSearchWhereConditions(), categorySectionsSchema (+10 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (11): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+3 more)

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

### Community 21 - "profile.tsx"
Cohesion: 0.05
Nodes (60): ref_better_auth_client_plugins, ref_better_auth_react, cmdk, react-zoom-pan-pinch, src_assets_bronze_badge, src_assets_gold_badge, src_assets_silver_badge, AuthShell() (+52 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "react"
Cohesion: 0.07
Nodes (75): class-variance-authority, lucide-react, radix-ui, react, sonner, @tanstack/react-query, @tanstack/react-start, @tanstack/react-table (+67 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.27
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+1 more)

### Community 26 - "auth-functions.ts"
Cohesion: 0.47
Nodes (3): ref_tanstack_react_start_server, Route, getSession

### Community 27 - "@tanstack/react-router"
Cohesion: 0.18
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router, @tanstack/react-router-devtools, NotFound(), Toaster() (+1 more)

### Community 28 - "category-browse-card.tsx"
Cohesion: 0.18
Nodes (11): CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), CategoryItem, CategoryNavList() (+3 more)

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

### Community 33 - "ingredient-functions.ts"
Cohesion: 0.17
Nodes (11): offIngredientMappings, unmappedOffIngredients, addIngredient, addIngredientSchema, deleteIngredient, deleteIngredientSchema, getIngredient, getIngredientsSchema (+3 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "combobox.tsx"
Cohesion: 0.09
Nodes (16): @base-ui/react, cn, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxContent(), ComboboxEmpty(), ComboboxItem() (+8 more)

### Community 36 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "cn"
Cohesion: 0.15
Nodes (14): DialogOverlay(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SheetContent(), SheetDescription(), SheetFooter() (+6 more)

### Community 43 - "FileRoutesByPath"
Cohesion: 0.20
Nodes (8): Route, Route, Route, Route, Route, Route, FileRoutesById, FileRoutesByPath

### Community 44 - "drizzle-orm"
Cohesion: 0.27
Nodes (9): drizzle-orm, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool (+1 more)

### Community 45 - "product-queries.ts"
Cohesion: 0.19
Nodes (15): ActiveCategoriesFilters, activeCategoriesQueryOptions(), allProductsQueryOptions(), categoriesQueryOptions(), ProductQueryArgs, Route, AddProductRoute(), Route (+7 more)

### Community 46 - "pendingStoreSubmissionsCountQueryOptions"
Cohesion: 0.40
Nodes (6): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage()

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

### Community 54 - "zod"
Cohesion: 0.22
Nodes (7): browser-image-compression, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "admin/add-product.tsx"
Cohesion: 0.19
Nodes (12): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), productQueryOptions() (+4 more)

### Community 58 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 59 - "storesQueryOptions"
Cohesion: 0.23
Nodes (10): StoreCard(), StoreCardProps, storeExclusiveProductsQueryOptions(), storesQueryOptions(), DeleteStoreDialog(), RouteComponent(), Route, StoresIndexPage() (+2 more)

### Community 60 - "$categoryId.tsx"
Cohesion: 0.27
Nodes (9): getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, searchQueryOptions(), Route (+1 more)

### Community 61 - "ensureSession"
Cohesion: 0.12
Nodes (21): productStoreSubmissions, stores, ensureSession, updateCategory, updateIngredient, addStore, addStoreSchema, deleteStore (+13 more)

### Community 62 - "ingredientsQueryOptions"
Cohesion: 0.27
Nodes (9): ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), Route, RouteComponent(), MappingRowActions(), Route, RouteComponent(), getIngredients (+1 more)

### Community 63 - "productDetailsQueryOptions"
Cohesion: 0.33
Nodes (6): ProductForm(), useImageUploadMutation(), productDetailsQueryOptions(), AddStoreToProductPage(), Route, getProductDetailsById

### Community 64 - "off-functions.ts"
Cohesion: 0.53
Nodes (5): getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 66 - "category-functions.ts"
Cohesion: 0.10
Nodes (23): categories, offCategoryMappings, productCategories, productIngredients, products, productStores, unmappedOffTags, db (+15 more)

## Knowledge Gaps
- **461 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+456 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 538 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `auth-fields.tsx`, `app-sidebar.tsx`, `sidebar.tsx`, `category-icon.tsx`, `search-functions.ts`, `dropdown-menu.tsx`, `$categoryId.tsx`, `profile.tsx`, `react`, `admin/route.tsx`, `storesQueryOptions`, `category-browse-card.tsx`, `productDetailsQueryOptions`, `admin/add-product.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `react` to `off-functions.ts`, `ingredient-functions.ts`, `category-functions.ts`, `safe-envs.ts`, `routeTree.gen.ts`, `package.json`, `search-functions.ts`, `product-queries.ts`, `profile.tsx`, `zod`, `admin/add-product.tsx`, `auth-functions.ts`, `ensureSession`, `app-schema.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `auth-fields.tsx`, `app-sidebar.tsx`, `combobox.tsx`, `sidebar.tsx`, `package.json`, `cn`, `dropdown-menu.tsx`, `$categoryId.tsx`, `product-queries.ts`, `profile.tsx`, `admin/route.tsx`, `storesQueryOptions`, `category-browse-card.tsx`, `router.tsx`, `admin/add-product.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _461 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Should `organization-best-practices/SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._