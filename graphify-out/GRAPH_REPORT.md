# Graph Report - CleanLabel  (2026-10-26)

## Corpus Check
- 139 files · ~66,007 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1041 nodes · 2302 edges · 57 communities (47 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cbf233e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- ProductForm.tsx
- @tanstack/react-query
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
- dropdown-menu.tsx
- Create Auth Skill
- Building For Production
- Better Auth Integration Guide
- Lakebase Postgres
- devDependencies
- compilerOptions
- components.json
- product-functions.ts
- scripts
- email-and-password-best-practices/SKILL.md
- index.ts
- react
- store-submission-functions.ts
- __root.tsx
- $productId.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- ensureSession
- 0001_nice_rockslide.sql
- store-submissions.tsx
- utils.ts
- sheet.tsx
- AGENTS.md
- store-submission-queries.ts
- ingredient-functions.ts
- auth-schema.ts
- store-functions.ts
- seed-off.ts
- dotenv
- _protected/route.tsx
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- pnpm
- forgot-password.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 110 edges
2. `react` - 48 edges
3. `ensureSession` - 36 edges
4. `Button()` - 35 edges
5. `@tanstack/react-query` - 35 edges
6. `lucide-react` - 32 edges
7. `@tanstack/react-router` - 32 edges
8. `@tanstack/react-start` - 32 edges
9. `storesQueryOptions()` - 29 edges
10. `Input()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (57 total, 10 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.11
Nodes (29): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, better-auth, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, browser-image-compression, ref_tanstack_react_start_server, getServerEnv() (+21 more)

### Community 1 - "ProductForm.tsx"
Cohesion: 0.06
Nodes (52): cn, lucide-react, @tanstack/react-router, AddCategoryDialog(), AddIngredientDialog(), ProductForm(), ProductFormValues, SearchBar() (+44 more)

### Community 2 - "@tanstack/react-query"
Cohesion: 0.08
Nodes (49): @tanstack/react-query, useDebounce(), ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), ActiveCategoriesFilters, activeCategoriesQueryOptions(), allProductsQueryOptions(), categoriesQueryOptions() (+41 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.10
Nodes (28): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+20 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (43): Route, Route, Route, Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo (+35 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): imports, name, private, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx (+20 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "cn"
Cohesion: 0.13
Nodes (20): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+12 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (9): DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger(), SidebarMenu() (+1 more)

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

### Community 21 - "product-functions.ts"
Cohesion: 0.16
Nodes (15): drizzle-orm, categories, productCategories, productIngredients, products, productStores, addProductSchema, deleteProduct (+7 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "index.ts"
Cohesion: 0.39
Nodes (6): db, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 25 - "react"
Cohesion: 0.16
Nodes (14): radix-ui, react, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+6 more)

### Community 26 - "store-submission-functions.ts"
Cohesion: 0.14
Nodes (12): zod, productStoreSubmissions, clientEnv, clientEnvSchema, serverEnvSchema, approveStoreSubmission, approveStoreSubmissionSchema, getStoreSubmissionsSchema (+4 more)

### Community 27 - "__root.tsx"
Cohesion: 0.16
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext (+1 more)

### Community 28 - "$productId.tsx"
Cohesion: 0.13
Nodes (27): ref_better_auth_client_plugins, ref_better_auth_react, ProductCard(), ProductCardProps, StoreInfo, Card(), CardAction(), CardContent() (+19 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.28
Nodes (7): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.12
Nodes (16): categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum, productsRelations (+8 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "ensureSession"
Cohesion: 0.15
Nodes (16): offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategoriesSchema (+8 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.10
Nodes (24): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+16 more)

### Community 35 - "store-submissions.tsx"
Cohesion: 0.08
Nodes (47): sonner, @tanstack/react-form, @tanstack/react-start, @tanstack/react-table, AddStoreDialog(), Onboarding(), ScannerDialog(), ScannerDialogProps (+39 more)

### Community 36 - "utils.ts"
Cohesion: 0.33
Nodes (4): class-variance-authority, Badge(), badgeVariants, Skeleton()

### Community 37 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 39 - "store-submission-queries.ts"
Cohesion: 0.27
Nodes (10): pendingStoreSubmissionsCountQueryOptions(), storeSubmissionsQueryOptions(), Route, RouteComponent(), Route, StoreSubmissionsAdminPage(), Route, FileRoutesByPath (+2 more)

### Community 41 - "ingredient-functions.ts"
Cohesion: 0.17
Nodes (11): ingredients, offIngredientMappings, unmappedOffIngredients, addIngredientSchema, deleteIngredient, deleteIngredientSchema, getIngredient, getIngredientsSchema (+3 more)

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 43 - "store-functions.ts"
Cohesion: 0.22
Nodes (8): stores, addStore, addStoreSchema, deleteStore, deleteStoreSchema, storeIdSchema, updateStore, updateStoreSchema

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

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

## Knowledge Gaps
- **429 isolated node(s):** `SidebarItem`, `SidebarGroupData`, `productScoreEnum`, `productStatusEnum`, `productsRelations` (+424 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 501 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `store-submissions.tsx` to `safe-envs.ts`, `ProductForm.tsx`, `@tanstack/react-query`, `ensureSession`, `routeTree.gen.ts`, `package.json`, `ingredient-functions.ts`, `store-functions.ts`, `product-functions.ts`, `index.ts`, `store-submission-functions.ts`, `$productId.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `ProductForm.tsx`, `@tanstack/react-query`, `store-submissions.tsx`, `sidebar.tsx`, `utils.ts`, `sheet.tsx`, `package.json`, `cn`, `dropdown-menu.tsx`, `$productId.tsx`, `router.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `SidebarItem`, `SidebarGroupData`, `productScoreEnum` to the rest of the system?**
  _429 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `safe-envs.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10634920634920635 - nodes in this community are weakly interconnected._
- **Should `ProductForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05673274094326726 - nodes in this community are weakly interconnected._
- **Should `@tanstack/react-query` be split into smaller, more focused modules?**
  _Cohesion score 0.07570621468926554 - nodes in this community are weakly interconnected._