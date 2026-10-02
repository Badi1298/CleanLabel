# Graph Report - CleanLabel  (2026-10-02)

## Corpus Check
- 129 files · ~53,359 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 949 nodes · 2003 edges · 49 communities (43 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dfca1119`
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
- AddStoreDialog.tsx
- admin/route.tsx
- app-schema.ts
- __root.tsx
- react
- vite.config.ts
- router.tsx
- FileRoutesByPath
- generate-sw.mjs
- category-functions.ts
- dotenv
- auth-functions.ts
- $categoryId.tsx
- app-sidebar.tsx
- AGENTS.md
- pnpm
- zod
- auth-schema.ts
- lucide-react
- seed-off.ts
- store-functions.ts
- label.tsx
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 44 edges
3. `Button()` - 31 edges
4. `@tanstack/react-query` - 30 edges
5. `@tanstack/react-router` - 29 edges
6. `@tanstack/react-start` - 27 edges
7. `ensureSession` - 27 edges
8. `lucide-react` - 26 edges
9. `storesQueryOptions()` - 20 edges
10. `Input()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Command()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandGroup()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandInput()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `CommandItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (49 total, 6 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.19
Nodes (20): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret, getBetterAuthUrl (+12 more)

### Community 1 - "all-categories.tsx"
Cohesion: 0.06
Nodes (69): sonner, @tanstack/react-form, @tanstack/react-query, @tanstack/react-router, @tanstack/react-start, @tanstack/react-table, AddCategoryDialog(), SearchBar() (+61 more)

### Community 2 - "admin/add-product.tsx"
Cohesion: 0.20
Nodes (12): react-zoom-pan-pinch, productDetailsQueryOptions(), ProductQueryArgs, productQueryOptions(), Route, RouteComponent(), searchSchema, Route (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.10
Nodes (20): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SidebarContext (+12 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (36): Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute, ProtectedAdminAddProductRoute (+28 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, @base-ui/react (+20 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "cn"
Cohesion: 0.10
Nodes (22): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+14 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "ProductForm.tsx"
Cohesion: 0.08
Nodes (22): class-variance-authority, cn, AddIngredientDialog(), AddStoreDialog(), ProductForm(), ProductFormValues, src_components_ui_combobox_combobox, ComboboxChip() (+14 more)

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
Cohesion: 0.20
Nodes (12): ProductCard(), ProductCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+4 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "AddStoreDialog.tsx"
Cohesion: 0.08
Nodes (27): cmdk, @yudiel/react-qr-scanner, ScannerDialog(), ScannerDialogProps, Command(), CommandDialog(), CommandGroup(), CommandInput() (+19 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.27
Nodes (8): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset()

### Community 26 - "app-schema.ts"
Cohesion: 0.10
Nodes (29): drizzle-orm, categories, categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategories (+21 more)

### Community 27 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 28 - "react"
Cohesion: 0.18
Nodes (14): radix-ui, react, Badge(), badgeVariants, Separator(), Slider(), Switch(), Textarea() (+6 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.28
Nodes (6): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, routeTree

### Community 31 - "FileRoutesByPath"
Cohesion: 0.20
Nodes (10): allProductsQueryOptions(), Route, RouteComponent(), Route, Route, Route, Route, FileRoutesById (+2 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "category-functions.ts"
Cohesion: 0.10
Nodes (24): offCategoryMappings, offIngredientMappings, unmappedOffIngredients, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory (+16 more)

### Community 35 - "auth-functions.ts"
Cohesion: 0.28
Nodes (5): ref_tanstack_react_start_server, auth, Route, Route, getSession

### Community 36 - "$categoryId.tsx"
Cohesion: 0.23
Nodes (12): categoriesQueryOptions(), SearchOptionsArgs, searchQueryOptions(), AddProductRoute(), Route, searchSchema, Route, SearchPage() (+4 more)

### Community 37 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (13): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel(), SidebarHeader() (+5 more)

### Community 41 - "zod"
Cohesion: 0.18
Nodes (9): ref_better_auth_client_plugins, ref_better_auth_react, browser-image-compression, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls (+1 more)

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 43 - "lucide-react"
Cohesion: 0.33
Nodes (8): lucide-react, storesQueryOptions(), RouteComponent(), Route, StoresIndexPage(), Route, StoreCategoriesPage(), getStores

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "store-functions.ts"
Cohesion: 0.25
Nodes (7): stores, addStore, addStoreSchema, deleteStore, deleteStoreSchema, updateStore, updateStoreSchema

### Community 46 - "label.tsx"
Cohesion: 0.33
Nodes (4): Label(), SidebarGroup(), SidebarGroupContent(), SidebarInput()

## Knowledge Gaps
- **407 isolated node(s):** `graphify`, `Workflow: graphify`, `name`, `private`, `type` (+402 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 468 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `all-categories.tsx` to `safe-envs.ts`, `category-functions.ts`, `admin/add-product.tsx`, `auth-functions.ts`, `$categoryId.tsx`, `routeTree.gen.ts`, `package.json`, `zod`, `store-functions.ts`, `AddStoreDialog.tsx`, `app-schema.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `all-categories.tsx`, `sidebar.tsx`, `app-sidebar.tsx`, `$categoryId.tsx`, `package.json`, `cn`, `lucide-react`, `ProductForm.tsx`, `label.tsx`, `product-card.tsx`, `AddStoreDialog.tsx`, `admin/route.tsx`, `router.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `graphify`, `Workflow: graphify`, `name` to the rest of the system?**
  _407 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `all-categories.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06383838383838383 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._