# Graph Report - CleanLabel  (2026-09-18)

## Corpus Check
- 129 files · ~53,173 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 984 nodes · 2044 edges · 55 communities (49 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `645ea0d5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- @tanstack/react-query
- dependencies
- $productId.tsx
- dropdown-menu.tsx
- routeTree.gen.ts
- sidebar.tsx
- cn
- package.json
- safe-envs.ts
- biome.json
- organization-best-practices/SKILL.md
- category-functions.ts
- better-auth-security-best-practices/SKILL.md
- devDependencies
- app-schema.ts
- compilerOptions
- components.json
- scripts
- Neon
- admin/add-product.tsx
- seed-off.ts
- auth-schema.ts
- admin/route.tsx
- combobox.tsx
- ingredient-functions.ts
- vite.config.ts
- router.tsx
- @tanstack/react-router
- profile-functions.ts
- index.ts
- generate-sw.mjs
- two-factor-authentication-best-practices/SKILL.md
- 0001_nice_rockslide.sql
- Create Auth Skill
- product-functions.ts
- __root.tsx
- Building For Production
- Better Auth Integration Guide
- Lakebase Postgres
- email-and-password-best-practices/SKILL.md
- store-functions.ts
- utils.ts
- lucide-react
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- zod
- AGENTS.md
- rules/graphify.md
- workflows/graphify.md
- 0000_next_ben_urich.sql
- home-queries.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 44 edges
3. `Button()` - 31 edges
4. `@tanstack/react-query` - 30 edges
5. `@tanstack/react-router` - 29 edges
6. `@tanstack/react-start` - 27 edges
7. `ensureSession` - 27 edges
8. `FileRoutesByPath` - 24 edges
9. `lucide-react` - 24 edges
10. `storesQueryOptions()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (55 total, 6 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (76): ref_better_auth_client_plugins, ref_better_auth_react, react, sonner, @tanstack/react-form, @tanstack/react-start, @tanstack/react-table, AddCategoryDialog() (+68 more)

### Community 1 - "@tanstack/react-query"
Cohesion: 0.22
Nodes (15): @tanstack/react-query, ProductCard(), SearchOptionsArgs, searchQueryOptions(), storesQueryOptions(), RouteComponent(), Route, SearchPage() (+7 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 3 - "$productId.tsx"
Cohesion: 0.13
Nodes (21): react-zoom-pan-pinch, ProductCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+13 more)

### Community 4 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (6): DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 5 - "routeTree.gen.ts"
Cohesion: 0.06
Nodes (36): Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute (+28 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.06
Nodes (39): AppSidebar(), SidebarGroupData, SidebarItem, DropdownMenuItem(), Sheet(), SheetContent(), SheetDescription(), SheetFooter() (+31 more)

### Community 7 - "cn"
Cohesion: 0.15
Nodes (21): ScannerDialogProps, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+13 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (26): imports, name, pnpm, onlyBuiltDependencies, private, type, babel-plugin-react-compiler, @biomejs/biome (+18 more)

### Community 9 - "safe-envs.ts"
Cohesion: 0.13
Nodes (24): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, better-auth, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, browser-image-compression, getServerEnv(), getProductUploadUrls (+16 more)

### Community 10 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 11 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 12 - "category-functions.ts"
Cohesion: 0.16
Nodes (15): offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getCategoriesSchema (+7 more)

### Community 13 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 14 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, babel-plugin-react-compiler, @biomejs/biome, dotenv, @rolldown/plugin-babel, @tailwindcss/typography, @tanstack/devtools-event-client, @tanstack/devtools-vite (+11 more)

### Community 15 - "app-schema.ts"
Cohesion: 0.14
Nodes (18): drizzle-orm, categories, categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategories, productCategoriesRelations (+10 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 17 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 18 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 19 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 20 - "admin/add-product.tsx"
Cohesion: 0.15
Nodes (19): ProductForm(), useImageUploadMutation(), allProductsQueryOptions(), categoriesQueryOptions(), ProductQueryArgs, productQueryOptions(), Route, RouteComponent() (+11 more)

### Community 21 - "seed-off.ts"
Cohesion: 0.21
Nodes (10): dotenv, drizzle-kit, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore() (+2 more)

### Community 22 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 23 - "admin/route.tsx"
Cohesion: 0.23
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+1 more)

### Community 24 - "combobox.tsx"
Cohesion: 0.09
Nodes (16): @base-ui/react, cn, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxContent(), ComboboxEmpty(), ComboboxItem() (+8 more)

### Community 25 - "ingredient-functions.ts"
Cohesion: 0.20
Nodes (9): offIngredientMappings, unmappedOffIngredients, addIngredientSchema, deleteIngredientSchema, getIngredient, getIngredientsSchema, mapOffIngredientSchema, mapOffIngredientToIngredient (+1 more)

### Community 26 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 27 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 28 - "@tanstack/react-router"
Cohesion: 0.15
Nodes (11): @tanstack/react-router, auth, Route, Route, Route, Route, Route, Route (+3 more)

### Community 29 - "profile-functions.ts"
Cohesion: 0.29
Nodes (5): ref_tanstack_react_start_server, ingredients, userExcludedIngredients, toggleExcludedIngredient, toggleExcludedIngredientSchema

### Community 30 - "index.ts"
Cohesion: 0.39
Nodes (6): db, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 31 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 32 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 33 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 34 - "Create Auth Skill"
Cohesion: 0.10
Nodes (20): Auth UI Implementation, Client Config (auth-client.ts), Common Plugins, Create Auth Skill, Database Adapters, Database Migrations, Drizzle Config (`drizzle.config.ts`), Drizzle + PostgreSQL Setup (+12 more)

### Community 35 - "product-functions.ts"
Cohesion: 0.25
Nodes (7): productIngredients, addProductSchema, deleteProduct, deleteProductSchema, getProductsSchema, updateProduct, updateProductSchema

### Community 36 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 38 - "Building For Production"
Cohesion: 0.10
Nodes (19): Adding a Database (Optional), Adding A Route, Adding Links, API Routes, Building For Production, Data Fetching, Deploy to Railway, Getting Started (+11 more)

### Community 39 - "Better Auth Integration Guide"
Cohesion: 0.11
Nodes (18): Better Auth Integration Guide, CLI Commands, Client, Common Gotchas, Core Config Options, Database, Email Flows, Environment Variables (+10 more)

### Community 40 - "Lakebase Postgres"
Cohesion: 0.11
Nodes (18): 1. Select the organization and project, 2. Get the connection string, 3. Pick the connection method and driver, 4. Set up the schema, Autoscaling, Branching, Connection Pooling, Gotchas (+10 more)

### Community 41 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 42 - "store-functions.ts"
Cohesion: 0.25
Nodes (7): stores, addStore, addStoreSchema, deleteStore, deleteStoreSchema, updateStore, updateStoreSchema

### Community 43 - "utils.ts"
Cohesion: 0.12
Nodes (12): class-variance-authority, clsx, radix-ui, tailwind-merge, Badge(), badgeVariants, PopoverContent(), PopoverDescription() (+4 more)

### Community 44 - "lucide-react"
Cohesion: 0.33
Nodes (4): lucide-react, ScannerDialog(), TODO: We use "as any" for search since we don't know if add-product has…, Route

### Community 45 - "0002_careful_colleen_wing.sql"
Cohesion: 0.50
Nodes (3): "off_category_mappings", "public"."categories", "unmapped_off_tags"

### Community 46 - "0003_dapper_jasper_sitwell.sql"
Cohesion: 0.50
Nodes (3): "off_ingredient_mappings", "public"."ingredients", "unmapped_off_ingredients"

### Community 47 - ""user_excluded_ingredients""
Cohesion: 0.50
Nodes (3): "public"."ingredients", "public"."user", "user_excluded_ingredients"

### Community 48 - "zod"
Cohesion: 0.40
Nodes (4): zod, clientEnv, clientEnvSchema, serverEnvSchema

### Community 54 - "home-queries.ts"
Cohesion: 0.50
Nodes (4): homeQueryOptions(), Home(), Route, getHomeData

## Knowledge Gaps
- **412 isolated node(s):** `CategoryData`, `features`, `columnHelper`, `ProductData`, `features` (+407 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 483 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `react` to `product-functions.ts`, `routeTree.gen.ts`, `package.json`, `safe-envs.ts`, `store-functions.ts`, `lucide-react`, `category-functions.ts`, `app-schema.ts`, `admin/add-product.tsx`, `ingredient-functions.ts`, `profile-functions.ts`, `index.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `@tanstack/react-query`, `$productId.tsx`, `dropdown-menu.tsx`, `sidebar.tsx`, `cn`, `package.json`, `utils.ts`, `lucide-react`, `admin/add-product.tsx`, `admin/route.tsx`, `combobox.tsx`, `router.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `CategoryData`, `features`, `columnHelper` to the rest of the system?**
  _412 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.059049207673060884 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `$productId.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._