# Graph Report - CleanLabel  (2026-10-02)

## Corpus Check
- 131 files · ~54,829 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1000 nodes · 2125 edges · 57 communities (49 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c4919a4`
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
- all-categories.tsx
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
- index.ts
- admin/route.tsx
- product-functions.ts
- __root.tsx
- utils.ts
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- category-functions.ts
- 0001_nice_rockslide.sql
- ingredientsQueryOptions
- @tanstack/react-query
- sheet.tsx
- AGENTS.md
- dropdown-menu.tsx
- profile-functions.ts
- auth-schema.ts
- FileRoutesByPath
- drizzle-orm
- home-queries.ts
- ingredient-functions.ts
- rules/graphify.md
- workflows/graphify.md
- dotenv
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- pnpm
- auth-functions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 45 edges
3. `Button()` - 33 edges
4. `@tanstack/react-query` - 31 edges
5. `@tanstack/react-router` - 30 edges
6. `lucide-react` - 29 edges
7. `@tanstack/react-start` - 29 edges
8. `ensureSession` - 29 edges
9. `FileRoutesByPath` - 25 edges
10. `storesQueryOptions()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `AddProductRoute()` --calls--> `categoriesQueryOptions()`  [EXTRACTED]
  src/routes/_protected/_public/add-product.tsx → src/queries/product-queries.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (57 total, 8 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.16
Nodes (21): browser-image-compression, getServerEnv(), getProductUploadUrls, getUploadUrlsSchema, generatePresignedUploadUrl(), s3, getBetterAuthApiKey, getBetterAuthSecret (+13 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (53): cn, lucide-react, react, sonner, @tanstack/react-form, @tanstack/react-router, AddIngredientDialog(), AddStoreDialog() (+45 more)

### Community 2 - "admin/add-product.tsx"
Cohesion: 0.17
Nodes (13): ProductForm(), useImageUploadMutation(), ProductQueryArgs, productQueryOptions(), Route, RouteComponent(), searchSchema, AddProductRoute() (+5 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (29): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+21 more)

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
Cohesion: 0.07
Nodes (28): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, @base-ui/react (+20 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "cn"
Cohesion: 0.12
Nodes (19): cmdk, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+11 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "all-categories.tsx"
Cohesion: 0.09
Nodes (42): @tanstack/react-start, @tanstack/react-table, AddCategoryDialog(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+34 more)

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
Cohesion: 0.11
Nodes (30): ref_better_auth_client_plugins, ref_better_auth_react, react-zoom-pan-pinch, ProductCard(), ProductCardProps, Card(), CardAction(), CardContent() (+22 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "index.ts"
Cohesion: 0.24
Nodes (9): better-auth, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, db, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory() (+1 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.23
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+1 more)

### Community 26 - "product-functions.ts"
Cohesion: 0.25
Nodes (7): productIngredients, addProductSchema, deleteProduct, deleteProductSchema, getProductsSchema, updateProduct, updateProductSchema

### Community 27 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 28 - "utils.ts"
Cohesion: 0.21
Nodes (7): class-variance-authority, radix-ui, Badge(), badgeVariants, Slider(), Switch(), Textarea()

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.13
Nodes (19): categories, categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategories, productCategoriesRelations, productIngredientsRelations (+11 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "category-functions.ts"
Cohesion: 0.11
Nodes (21): offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getCategoriesSchema (+13 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "ingredientsQueryOptions"
Cohesion: 0.27
Nodes (9): ingredientsQueryOptions(), unmappedIngredientsQueryOptions(), Route, RouteComponent(), MappingRowActions(), Route, RouteComponent(), getIngredients (+1 more)

### Community 36 - "@tanstack/react-query"
Cohesion: 0.20
Nodes (17): @tanstack/react-query, categoriesQueryOptions(), SearchOptionsArgs, searchQueryOptions(), storesQueryOptions(), Route, RouteComponent(), Route (+9 more)

### Community 37 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 39 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (9): DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger(), SidebarMenu() (+1 more)

### Community 41 - "profile-functions.ts"
Cohesion: 0.17
Nodes (10): zod, ingredients, userExcludedIngredients, userFavoriteProducts, clientEnvSchema, serverEnvSchema, toggleExcludedIngredient, toggleExcludedIngredientSchema (+2 more)

### Community 42 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 43 - "FileRoutesByPath"
Cohesion: 0.17
Nodes (9): auth, Route, Route, Route, Route, Route, Route, Route (+1 more)

### Community 44 - "drizzle-orm"
Cohesion: 0.27
Nodes (9): drizzle-orm, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool (+1 more)

### Community 45 - "home-queries.ts"
Cohesion: 0.50
Nodes (4): homeQueryOptions(), Home(), Route, getHomeData

### Community 46 - "ingredient-functions.ts"
Cohesion: 0.20
Nodes (9): offIngredientMappings, unmappedOffIngredients, addIngredientSchema, deleteIngredientSchema, getIngredient, getIngredientsSchema, mapOffIngredientSchema, mapOffIngredientToIngredient (+1 more)

### Community 50 - "0002_careful_colleen_wing.sql"
Cohesion: 0.50
Nodes (3): "off_category_mappings", "public"."categories", "unmapped_off_tags"

### Community 51 - "0003_dapper_jasper_sitwell.sql"
Cohesion: 0.50
Nodes (3): "off_ingredient_mappings", "public"."ingredients", "unmapped_off_ingredients"

### Community 52 - ""user_excluded_ingredients""
Cohesion: 0.50
Nodes (3): "public"."ingredients", "public"."user", "user_excluded_ingredients"

### Community 56 - "auth-functions.ts"
Cohesion: 0.47
Nodes (3): ref_tanstack_react_start_server, Route, getSession

## Knowledge Gaps
- **415 isolated node(s):** `ProductQueryArgs`, `addProductSchema`, `getProductsSchema`, `updateProductSchema`, `deleteProductSchema` (+410 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 486 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `all-categories.tsx` to `safe-envs.ts`, `react`, `admin/add-product.tsx`, `category-functions.ts`, `routeTree.gen.ts`, `package.json`, `profile-functions.ts`, `ingredient-functions.ts`, `$productId.tsx`, `auth-functions.ts`, `index.ts`, `product-functions.ts`, `app-schema.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `react`, `sidebar.tsx`, `sheet.tsx`, `dropdown-menu.tsx`, `all-categories.tsx`, `$productId.tsx`, `admin/route.tsx`, `utils.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `ProductQueryArgs`, `addProductSchema`, `getProductsSchema` to the rest of the system?**
  _415 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06651735722284434 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._