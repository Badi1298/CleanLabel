# Graph Report - CleanLabel  (2026-11-16)

## Corpus Check
- 144 files · ~72,997 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1081 nodes · 2395 edges · 70 communities (64 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6eeeb1ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- $productId.tsx
- product-functions.ts
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- category-browse-card.tsx
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
- profile-functions.ts
- scripts
- email-and-password-best-practices/SKILL.md
- store-submissions.tsx
- admin/route.tsx
- @tanstack/react-start
- __root.tsx
- profile.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- ingredient-functions.ts
- 0001_nice_rockslide.sql
- react
- product-card.tsx
- category-icon.tsx
- AGENTS.md
- category-mappings.tsx
- store-avatar.tsx
- score-badge.tsx
- button.tsx
- seed-off.ts
- product-queries.ts
- store-functions.ts
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- admin/add-product.tsx
- "product_store_submissions"
- storesQueryOptions
- ProductForm.tsx
- _public/route.tsx
- lucide-react
- ensureSession
- cn
- utils.ts
- auth-schema.ts
- sheet.tsx
- category-functions.ts
- @tanstack/react-query
- _public/add-product.tsx
- drizzle-orm

## God Nodes (most connected - your core abstractions)
1. `cn()` - 131 edges
2. `react` - 49 edges
3. `lucide-react` - 37 edges
4. `ensureSession` - 36 edges
5. `@tanstack/react-query` - 35 edges
6. `@tanstack/react-router` - 33 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `FileRoutesByPath` - 27 edges
10. `Button()` - 26 edges

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

## Communities (70 total, 6 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.13
Nodes (25): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, clientEnv, clientEnvSchema, getServerEnv(), serverEnvSchema, auth, Route (+17 more)

### Community 1 - "$productId.tsx"
Cohesion: 0.24
Nodes (12): react-zoom-pan-pinch, Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger(), productAlternativesQueryOptions(), productDetailsQueryOptions(), getScoreBadgeProps() (+4 more)

### Community 2 - "product-functions.ts"
Cohesion: 0.18
Nodes (14): categories, productCategories, productIngredients, products, productStores, stores, db, addProductSchema (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.10
Nodes (27): SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+19 more)

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
Cohesion: 0.06
Nodes (31): imports, name, pnpm, onlyBuiltDependencies, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner (+23 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "category-browse-card.tsx"
Cohesion: 0.33
Nodes (6): CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual()

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

### Community 21 - "profile-functions.ts"
Cohesion: 0.22
Nodes (11): userExcludedIngredientsQueryOptions(), userFavoriteProductsQueryOptions(), FavoritesPage(), getInitials(), ProfilePage(), getUserExcludedIngredients, getUserFavoriteProducts, toggleExcludedIngredient (+3 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "store-submissions.tsx"
Cohesion: 0.16
Nodes (23): class-variance-authority, @tanstack/react-router, @tanstack/react-table, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+15 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.18
Nodes (12): radix-ui, AppSidebar(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+4 more)

### Community 26 - "@tanstack/react-start"
Cohesion: 0.22
Nodes (8): browser-image-compression, @tanstack/react-start, ref_tanstack_react_start_server, zod, Route, getSession, getProductUploadUrls, getUploadUrlsSchema

### Community 27 - "__root.tsx"
Cohesion: 0.18
Nodes (8): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster(), MyRouterContext

### Community 28 - "profile.tsx"
Cohesion: 0.15
Nodes (15): cmdk, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+7 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.12
Nodes (16): categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations, productScoreEnum, productsRelations (+8 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "ingredient-functions.ts"
Cohesion: 0.17
Nodes (11): ingredients, offIngredientMappings, unmappedOffIngredients, addIngredientSchema, deleteIngredient, deleteIngredientSchema, getIngredient, getIngredientsSchema (+3 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "react"
Cohesion: 0.12
Nodes (12): cn, react, AddIngredientDialog(), ComboboxValue(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton() (+4 more)

### Community 36 - "product-card.tsx"
Cohesion: 0.14
Nodes (17): ProductCard(), ProductCardProps, StoreChip(), StoreInfo, SearchBar(), SearchBarProps, Popover(), PopoverContent() (+9 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 39 - "category-mappings.tsx"
Cohesion: 0.12
Nodes (23): useDebounce(), categoriesQueryOptions(), CategoryQueryArgs, categoryQueryOptions(), unmappedTagsQueryOptions(), unmappedIngredientsQueryOptions(), Route, RouteComponent() (+15 more)

### Community 41 - "store-avatar.tsx"
Cohesion: 0.23
Nodes (9): getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, StoreCard(), StoreCardProps (+1 more)

### Community 42 - "score-badge.tsx"
Cohesion: 0.40
Nodes (4): ProductScoreTier, ScoreBadge(), ScoreBadgeProps, TIER_STYLES

### Community 43 - "button.tsx"
Cohesion: 0.20
Nodes (6): @tanstack/react-form, Button(), buttonVariants, Route, searchSchema, Route

### Community 44 - "seed-off.ts"
Cohesion: 0.21
Nodes (10): dotenv, drizzle-kit, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore() (+2 more)

### Community 45 - "product-queries.ts"
Cohesion: 0.24
Nodes (13): ActiveCategoriesFilters, activeCategoriesQueryOptions(), allProductsQueryOptions(), categoriesQueryOptions(), ProductQueryArgs, Route, SearchPage(), Route (+5 more)

### Community 46 - "store-functions.ts"
Cohesion: 0.19
Nodes (11): storeExclusiveProductsQueryOptions(), DeleteStoreDialog(), addStore, addStoreSchema, deleteStore, deleteStoreSchema, getStoreExclusiveProducts, getStores (+3 more)

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

### Community 54 - "admin/add-product.tsx"
Cohesion: 0.29
Nodes (9): ingredientsQueryOptions(), productQueryOptions(), Route, RouteComponent(), searchSchema, Route, RouteComponent(), MappingRowActions() (+1 more)

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "storesQueryOptions"
Cohesion: 0.23
Nodes (13): storesQueryOptions(), pendingStoreSubmissionsCountQueryOptions(), Route, RouteComponent(), Route, RouteComponent(), Route, RouteComponent() (+5 more)

### Community 58 - "ProductForm.tsx"
Cohesion: 0.20
Nodes (17): AddCategoryDialog(), ProductFormValues, src_components_ui_combobox_combobox, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxContent(), ComboboxEmpty() (+9 more)

### Community 59 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 60 - "lucide-react"
Cohesion: 0.27
Nodes (11): lucide-react, sonner, AddStoreDialog(), ScannerDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter() (+3 more)

### Community 61 - "ensureSession"
Cohesion: 0.15
Nodes (17): productStoreSubmissions, storeSubmissionsQueryOptions(), ensureSession, addCategory, deleteCategory, updateCategory, addIngredient, updateIngredient (+9 more)

### Community 62 - "cn"
Cohesion: 0.19
Nodes (14): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogOverlay() (+6 more)

### Community 63 - "utils.ts"
Cohesion: 0.21
Nodes (8): ref_better_auth_client_plugins, ref_better_auth_react, Skeleton(), authClient, Route, SCORE_FILTER_OPTIONS, ScoreFilter, SKELETON_KEYS

### Community 64 - "auth-schema.ts"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 65 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 66 - "category-functions.ts"
Cohesion: 0.20
Nodes (9): offCategoryMappings, unmappedOffTags, addCategorySchema, deleteCategorySchema, getActiveCategoriesSchema, getCategoriesSchema, mapOffTagSchema, mapOffTagToCategory (+1 more)

### Community 67 - "@tanstack/react-query"
Cohesion: 0.43
Nodes (6): @tanstack/react-query, SearchOptionsArgs, searchQueryOptions(), Route, StoreCategoryProductsPage(), getSearchResults

### Community 68 - "_public/add-product.tsx"
Cohesion: 0.25
Nodes (7): ProductForm(), useImageUploadMutation(), AddProductRoute(), Route, searchSchema, AddStoreToProductPage(), addProduct

### Community 69 - "drizzle-orm"
Cohesion: 0.43
Nodes (6): drizzle-orm, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

## Knowledge Gaps
- **449 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+444 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `@tanstack/react-start` to `safe-envs.ts`, `$productId.tsx`, `product-functions.ts`, `routeTree.gen.ts`, `package.json`, `profile-functions.ts`, `store-submissions.tsx`, `profile.tsx`, `ingredient-functions.ts`, `react`, `product-card.tsx`, `category-mappings.tsx`, `store-functions.ts`, `admin/add-product.tsx`, `ProductForm.tsx`, `lucide-react`, `ensureSession`, `category-functions.ts`, `_public/add-product.tsx`, `drizzle-orm`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `$productId.tsx`, `sidebar.tsx`, `category-browse-card.tsx`, `dropdown-menu.tsx`, `profile-functions.ts`, `store-submissions.tsx`, `admin/route.tsx`, `profile.tsx`, `react`, `product-card.tsx`, `category-icon.tsx`, `store-avatar.tsx`, `score-badge.tsx`, `button.tsx`, `product-queries.ts`, `ProductForm.tsx`, `lucide-react`, `utils.ts`, `sheet.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `safe-envs.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._