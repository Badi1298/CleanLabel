# Graph Report - CleanLabel  (2026-10-02)

## Corpus Check
- 130 files · ~54,083 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 996 nodes · 2095 edges · 56 communities (48 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4ad7ae9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- react
- admin/add-product.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- cn
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- ProductForm.tsx
- Create Auth Skill
- Building For Production
- Better Auth Integration Guide
- Lakebase Postgres
- devDependencies
- compilerOptions
- components.json
- product-card.tsx
- scripts
- email-and-password-best-practices/SKILL.md
- drizzle-orm
- admin/route.tsx
- product-functions.ts
- __root.tsx
- $productId.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- category-functions.ts
- 0001_nice_rockslide.sql
- _protected/route.tsx
- search.tsx
- app-sidebar.tsx
- AGENTS.md
- dropdown-menu.tsx
- @tanstack/react-start
- auth-schema.ts
- FileRoutesByPath
- seed-off.ts
- store-functions.ts
- ingredient-functions.ts
- rules/graphify.md
- workflows/graphify.md
- _public/route.tsx
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- pnpm

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 44 edges
3. `Button()` - 32 edges
4. `@tanstack/react-query` - 31 edges
5. `@tanstack/react-router` - 30 edges
6. `@tanstack/react-start` - 29 edges
7. `ensureSession` - 29 edges
8. `lucide-react` - 28 edges
9. `FileRoutesByPath` - 25 edges
10. `storesQueryOptions()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (56 total, 8 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.15
Nodes (23): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, clientEnv, clientEnvSchema, getServerEnv(), serverEnvSchema, generatePresignedUploadUrl(), s3 (+15 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (63): lucide-react, react, sonner, @tanstack/react-form, @tanstack/react-router, @tanstack/react-table, AddCategoryDialog(), SearchBarProps (+55 more)

### Community 2 - "admin/add-product.tsx"
Cohesion: 0.15
Nodes (19): react-zoom-pan-pinch, ProductForm(), useImageUploadMutation(), categoriesQueryOptions(), productDetailsQueryOptions(), ProductQueryArgs, productQueryOptions(), Route (+11 more)

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
Nodes (37): Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute (+29 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (30): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, @base-ui/react (+22 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "cn"
Cohesion: 0.14
Nodes (16): cmdk, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+8 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "ProductForm.tsx"
Cohesion: 0.06
Nodes (43): cn, @tanstack/react-query, AddIngredientDialog(), AddStoreDialog(), ProductFormValues, ScannerDialogProps, src_components_ui_combobox_combobox, ComboboxChip() (+35 more)

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

### Community 21 - "product-card.tsx"
Cohesion: 0.15
Nodes (18): ref_better_auth_client_plugins, ref_better_auth_react, ProductCard(), ProductCardProps, Card(), CardAction(), CardContent(), CardDescription() (+10 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "drizzle-orm"
Cohesion: 0.43
Nodes (6): drizzle-orm, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 25 - "admin/route.tsx"
Cohesion: 0.27
Nodes (8): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset()

### Community 26 - "product-functions.ts"
Cohesion: 0.19
Nodes (14): zod, categories, productCategories, productIngredients, products, productStores, stores, db (+6 more)

### Community 27 - "__root.tsx"
Cohesion: 0.16
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), TanstackQueryProvider() (+1 more)

### Community 28 - "$productId.tsx"
Cohesion: 0.18
Nodes (13): class-variance-authority, radix-ui, Badge(), badgeVariants, Separator(), Slider(), Switch(), Tooltip() (+5 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.29
Nodes (7): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (20): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+12 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "category-functions.ts"
Cohesion: 0.16
Nodes (15): offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getCategoriesSchema (+7 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 36 - "search.tsx"
Cohesion: 0.18
Nodes (16): SearchBar(), SearchOptionsArgs, searchQueryOptions(), storesQueryOptions(), Route, RouteComponent(), Route, SearchPage() (+8 more)

### Community 37 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (13): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel(), SidebarHeader() (+5 more)

### Community 39 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (10): DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger() (+2 more)

### Community 41 - "@tanstack/react-start"
Cohesion: 0.43
Nodes (4): @tanstack/react-start, ref_tanstack_react_start_server, getProductUploadUrls, getUploadUrlsSchema

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 43 - "FileRoutesByPath"
Cohesion: 0.17
Nodes (9): auth, Route, Route, Route, Route, Route, Route, Route (+1 more)

### Community 44 - "seed-off.ts"
Cohesion: 0.21
Nodes (10): dotenv, drizzle-kit, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore() (+2 more)

### Community 45 - "store-functions.ts"
Cohesion: 0.29
Nodes (6): addStore, addStoreSchema, deleteStore, deleteStoreSchema, updateStore, updateStoreSchema

### Community 46 - "ingredient-functions.ts"
Cohesion: 0.20
Nodes (9): offIngredientMappings, unmappedOffIngredients, addIngredient, addIngredientSchema, deleteIngredientSchema, getIngredient, getIngredientsSchema, mapOffIngredientSchema (+1 more)

### Community 49 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): ScannerDialog(), TODO: We use "as any" for search since we don't know if add-product has…, Route

### Community 50 - "0002_careful_colleen_wing.sql"
Cohesion: 0.50
Nodes (3): "off_category_mappings", "public"."categories", "unmapped_off_tags"

### Community 51 - "0003_dapper_jasper_sitwell.sql"
Cohesion: 0.50
Nodes (3): "off_ingredient_mappings", "public"."ingredients", "unmapped_off_ingredients"

### Community 52 - ""user_excluded_ingredients""
Cohesion: 0.50
Nodes (3): "public"."ingredients", "public"."user", "user_excluded_ingredients"

## Knowledge Gaps
- **415 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+410 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 486 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `@tanstack/react-start` to `safe-envs.ts`, `react`, `admin/add-product.tsx`, `category-functions.ts`, `routeTree.gen.ts`, `package.json`, `ProductForm.tsx`, `ingredient-functions.ts`, `store-functions.ts`, `_public/route.tsx`, `product-card.tsx`, `drizzle-orm`, `product-functions.ts`, `$productId.tsx`, `app-schema.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `react`, `sidebar.tsx`, `app-sidebar.tsx`, `dropdown-menu.tsx`, `ProductForm.tsx`, `product-card.tsx`, `admin/route.tsx`, `$productId.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _415 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06400208986415883 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._