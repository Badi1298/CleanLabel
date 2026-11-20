# Graph Report - CleanLabel  (2026-11-17)

## Corpus Check
- 146 files · ~135,710 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1104 nodes · 2443 edges · 62 communities (52 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `433dd2ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- category-functions.ts
- app-sidebar.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- utils.ts
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
- react
- scripts
- email-and-password-best-practices/SKILL.md
- store-submissions.tsx
- admin/route.tsx
- _protected/route.tsx
- __root.tsx
- cn
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- ingredient-functions.ts
- 0001_nice_rockslide.sql
- ProductForm.tsx
- drizzle-orm
- category-icon.tsx
- AGENTS.md
- dotenv
- sheet.tsx
- pnpm
- FileRoutesByPath
- seed-off.ts
- storesQueryOptions
- store-submission-queries.ts
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- @tanstack/react-start
- "product_store_submissions"
- homeQueryOptions
- _public/route.tsx
- forgot-password.tsx
- ensureSession
- product-functions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 137 edges
2. `react` - 54 edges
3. `lucide-react` - 36 edges
4. `ensureSession` - 36 edges
5. `@tanstack/react-query` - 35 edges
6. `@tanstack/react-router` - 33 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `FileRoutesByPath` - 27 edges
10. `Button()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Slider()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/slider.tsx → src/lib/utils.ts
- `Switch()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/switch.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (62 total, 10 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.17
Nodes (22): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey (+14 more)

### Community 1 - "category-functions.ts"
Cohesion: 0.14
Nodes (12): ref_drizzle_orm_pg_core, offCategoryMappings, unmappedOffTags, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategoriesSchema (+4 more)

### Community 2 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (14): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarFooter(), SidebarGroupLabel(), SidebarHeader() (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.11
Nodes (19): SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuSkeleton() (+11 more)

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
Nodes (27): imports, name, private, type, babel-plugin-react-compiler, @base-ui/react, better-auth, @biomejs/biome (+19 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "utils.ts"
Cohesion: 0.24
Nodes (5): radix-ui, Separator(), Slider(), Switch(), Textarea()

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

### Community 21 - "react"
Cohesion: 0.06
Nodes (71): ref_better_auth_client_plugins, ref_better_auth_react, lucide-react, react, @tanstack/react-form, @tanstack/react-query, @tanstack/react-router, src_assets_bronze_badge (+63 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "store-submissions.tsx"
Cohesion: 0.06
Nodes (67): class-variance-authority, sonner, @tanstack/react-table, AddCategoryDialog(), AddStoreDialog(), ScannerDialogProps, AlertDialog(), AlertDialogAction() (+59 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.31
Nodes (8): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset()

### Community 27 - "__root.tsx"
Cohesion: 0.16
Nodes (9): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), TanstackQueryProvider() (+1 more)

### Community 28 - "cn"
Cohesion: 0.18
Nodes (16): cmdk, StoreChip(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+8 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.29
Nodes (7): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.10
Nodes (22): categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, products (+14 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "ingredient-functions.ts"
Cohesion: 0.14
Nodes (14): offIngredientMappings, unmappedOffIngredients, addIngredient, addIngredientSchema, deleteIngredient, deleteIngredientSchema, getIngredient, getIngredients (+6 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "ProductForm.tsx"
Cohesion: 0.06
Nodes (37): cn, AddIngredientDialog(), CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual() (+29 more)

### Community 36 - "drizzle-orm"
Cohesion: 0.15
Nodes (14): drizzle-orm, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+6 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 43 - "FileRoutesByPath"
Cohesion: 0.18
Nodes (10): auth, Route, Route, Route, Route, Route, Route, Route (+2 more)

### Community 44 - "seed-off.ts"
Cohesion: 0.31
Nodes (8): ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool, resolveOffCategory()

### Community 45 - "storesQueryOptions"
Cohesion: 0.07
Nodes (49): react-zoom-pan-pinch, getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, Card() (+41 more)

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

### Community 54 - "@tanstack/react-start"
Cohesion: 0.22
Nodes (8): browser-image-compression, @tanstack/react-start, zod, clientEnv, clientEnvSchema, serverEnvSchema, getProductUploadUrls, getUploadUrlsSchema

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "homeQueryOptions"
Cohesion: 0.67
Nodes (3): homeQueryOptions(), Home(), Route

### Community 58 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 61 - "ensureSession"
Cohesion: 0.14
Nodes (18): ref_tanstack_react_start_server, stores, ensureSession, addStore, addStoreSchema, deleteStore, deleteStoreSchema, storeIdSchema (+10 more)

### Community 66 - "product-functions.ts"
Cohesion: 0.18
Nodes (13): categories, productCategories, productIngredients, productStores, db, getHomeData, addProductSchema, deleteProduct (+5 more)

## Knowledge Gaps
- **454 isolated node(s):** `SessionUserProfile`, `SampleFavoriteProduct`, `SAMPLE_FAVORITES`, `COMMUNITY_LINKS`, `SidebarGroupData` (+449 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 528 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `app-sidebar.tsx`, `ProductForm.tsx`, `sidebar.tsx`, `category-icon.tsx`, `sheet.tsx`, `utils.ts`, `storesQueryOptions`, `dropdown-menu.tsx`, `react`, `store-submissions.tsx`, `admin/route.tsx`, `homeQueryOptions`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `@tanstack/react-start` to `safe-envs.ts`, `category-functions.ts`, `product-functions.ts`, `ProductForm.tsx`, `ingredient-functions.ts`, `drizzle-orm`, `routeTree.gen.ts`, `package.json`, `storesQueryOptions`, `react`, `store-submissions.tsx`, `ensureSession`, `app-schema.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `app-sidebar.tsx`, `ProductForm.tsx`, `sidebar.tsx`, `package.json`, `sheet.tsx`, `utils.ts`, `storesQueryOptions`, `dropdown-menu.tsx`, `store-submissions.tsx`, `admin/route.tsx`, `__root.tsx`, `cn`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `SessionUserProfile`, `SampleFavoriteProduct`, `SAMPLE_FAVORITES` to the rest of the system?**
  _454 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `category-functions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._