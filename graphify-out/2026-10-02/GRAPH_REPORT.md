# Graph Report - CleanLabel  (2026-10-02)

## Corpus Check
- 130 files · ~54,083 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 959 nodes · 2032 edges · 48 communities (43 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ab33ea09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- all-categories.tsx
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
- react
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
- drizzle-orm
- admin/route.tsx
- product-functions.ts
- __root.tsx
- utils.ts
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- category-functions.ts
- profile-functions.ts
- auth-functions.ts
- storesQueryOptions
- app-sidebar.tsx
- AGENTS.md
- _public/add-product.tsx
- zod
- auth-schema.ts
- forgot-password.tsx
- seed-off.ts
- store-functions.ts
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 44 edges
3. `Button()` - 32 edges
4. `@tanstack/react-query` - 31 edges
5. `@tanstack/react-router` - 30 edges
6. `@tanstack/react-start` - 29 edges
7. `ensureSession` - 29 edges
8. `lucide-react` - 28 edges
9. `storesQueryOptions()` - 20 edges
10. `Input()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `PopoverContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `PopoverDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `PopoverHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `PopoverTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (48 total, 5 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.11
Nodes (29): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, ref_better_auth_adapters_drizzle, ref_better_auth_client_plugins, ref_better_auth_react, ref_better_auth_tanstack_start, clientEnv, clientEnvSchema (+21 more)

### Community 1 - "all-categories.tsx"
Cohesion: 0.06
Nodes (56): @tanstack/react-start, @tanstack/react-table, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+48 more)

### Community 2 - "admin/add-product.tsx"
Cohesion: 0.22
Nodes (11): react-zoom-pan-pinch, productDetailsQueryOptions(), ProductQueryArgs, productQueryOptions(), Route, RouteComponent(), searchSchema, Route (+3 more)

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
Nodes (43): Route, Route, Route, Route, Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById (+35 more)

### Community 8 - "package.json"
Cohesion: 0.08
Nodes (25): imports, name, pnpm, onlyBuiltDependencies, private, type, babel-plugin-react-compiler, better-auth (+17 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "cn"
Cohesion: 0.11
Nodes (20): cmdk, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+12 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "react"
Cohesion: 0.06
Nodes (64): @base-ui/react, cn, lucide-react, react, sonner, @tanstack/react-form, @tanstack/react-query, @tanstack/react-router (+56 more)

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
Cohesion: 0.12
Nodes (23): class-variance-authority, ProductCardProps, Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription() (+15 more)

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
Cohesion: 0.21
Nodes (10): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+2 more)

### Community 26 - "product-functions.ts"
Cohesion: 0.18
Nodes (14): categories, productCategories, productIngredients, products, productStores, stores, db, addProductSchema (+6 more)

### Community 27 - "__root.tsx"
Cohesion: 0.17
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext (+1 more)

### Community 28 - "utils.ts"
Cohesion: 0.14
Nodes (9): clsx, radix-ui, tailwind-merge, PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), Slider() (+1 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.28
Nodes (6): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.12
Nodes (15): categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappings, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum (+7 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "category-functions.ts"
Cohesion: 0.16
Nodes (15): offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getCategoriesSchema (+7 more)

### Community 34 - "profile-functions.ts"
Cohesion: 0.25
Nodes (7): ingredients, userExcludedIngredients, userFavoriteProducts, toggleExcludedIngredient, toggleExcludedIngredientSchema, toggleFavoriteProduct, toggleFavoriteProductSchema

### Community 35 - "auth-functions.ts"
Cohesion: 0.47
Nodes (3): ref_tanstack_react_start_server, Route, getSession

### Community 36 - "storesQueryOptions"
Cohesion: 0.18
Nodes (16): categoriesQueryOptions(), SearchOptionsArgs, searchQueryOptions(), storesQueryOptions(), Route, RouteComponent(), Route, SearchPage() (+8 more)

### Community 37 - "app-sidebar.tsx"
Cohesion: 0.13
Nodes (16): AppSidebar(), SidebarGroupData, SidebarItem, DropdownMenuItem(), Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel() (+8 more)

### Community 39 - "_public/add-product.tsx"
Cohesion: 0.29
Nodes (6): ProductForm(), useImageUploadMutation(), AddProductRoute(), Route, searchSchema, addProduct

### Community 41 - "zod"
Cohesion: 0.40
Nodes (4): browser-image-compression, zod, getProductUploadUrls, getUploadUrlsSchema

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 44 - "seed-off.ts"
Cohesion: 0.21
Nodes (10): dotenv, drizzle-kit, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore() (+2 more)

### Community 45 - "store-functions.ts"
Cohesion: 0.29
Nodes (6): addStore, addStoreSchema, deleteStore, deleteStoreSchema, updateStore, updateStoreSchema

## Knowledge Gaps
- **411 isolated node(s):** `ProductCardProps`, `productScoreEnum`, `productStatusEnum`, `productsRelations`, `categoriesRelations` (+406 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 472 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `all-categories.tsx` to `safe-envs.ts`, `category-functions.ts`, `admin/add-product.tsx`, `auth-functions.ts`, `profile-functions.ts`, `_public/add-product.tsx`, `package.json`, `zod`, `routeTree.gen.ts`, `react`, `store-functions.ts`, `$productId.tsx`, `drizzle-orm`, `product-functions.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `all-categories.tsx`, `sidebar.tsx`, `app-sidebar.tsx`, `react`, `$productId.tsx`, `admin/route.tsx`, `utils.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `ProductCardProps`, `productScoreEnum`, `productStatusEnum` to the rest of the system?**
  _411 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `safe-envs.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `all-categories.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06436487638533675 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._