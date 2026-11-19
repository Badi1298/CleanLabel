# Graph Report - CleanLabel  (2026-11-18)

## Corpus Check
- 149 files · ~144,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .ico 1, .css 1)

## Summary
- 1147 nodes · 2502 edges · 72 communities (61 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd2910ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- safe-envs.ts
- auth-fields.tsx
- AddCategoryDialog.tsx
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- $productId.tsx
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
- store-submissions.tsx
- admin/route.tsx
- _protected/route.tsx
- @tanstack/react-query
- category-browse-card.tsx
- vite.config.ts
- router.tsx
- app-schema.ts
- generate-sw.mjs
- landing.tsx
- 0001_nice_rockslide.sql
- ProductForm.tsx
- category-functions.ts
- category-icon.tsx
- AGENTS.md
- dotenv
- lucide-react
- pnpm
- $.ts
- drizzle-orm
- ingredient-functions.ts
- store-submission-queries.ts
- rules/graphify.md
- workflows/graphify.md
- "user_favorite_products"
- 0002_careful_colleen_wing.sql
- 0003_dapper_jasper_sitwell.sql
- "user_excluded_ingredients"
- 0000_next_ben_urich.sql
- auth-schema.ts
- "product_store_submissions"
- cn
- _public/route.tsx
- storesQueryOptions
- forgot-password.tsx
- ensureSession
- Route
- product-card.tsx
- index.ts
- category-mappings.tsx
- product-functions.ts
- favorites.tsx
- react
- score-badge.tsx
- sheet.tsx
- profile-functions.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `react` - 58 edges
3. `lucide-react` - 38 edges
4. `ensureSession` - 36 edges
5. `@tanstack/react-query` - 35 edges
6. `@tanstack/react-router` - 35 edges
7. `@tanstack/react-start` - 31 edges
8. `storesQueryOptions()` - 29 edges
9. `Button()` - 22 edges
10. `sonner` - 21 edges

## Surprising Connections (you probably didn't know these)
- `LandingPage()` --calls--> `cn()`  [EXTRACTED]
  src/routes/landing.tsx → src/lib/utils.ts
- `ReviewsSection()` --calls--> `cn()`  [EXTRACTED]
  src/routes/landing.tsx → src/lib/utils.ts
- `LandingInfoDialog()` --calls--> `cn()`  [EXTRACTED]
  src/routes/landing.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (72 total, 11 thin omitted)

### Community 0 - "safe-envs.ts"
Cohesion: 0.17
Nodes (22): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, getServerEnv(), generatePresignedUploadUrl(), s3, getBetterAuthApiKey (+14 more)

### Community 1 - "auth-fields.tsx"
Cohesion: 0.14
Nodes (26): ref_better_auth_client_plugins, ref_better_auth_react, @tanstack/react-form, AuthEmailField(), AuthEmailFieldProps, AuthFieldBaseProps, AuthPasswordField(), AuthPasswordFieldProps (+18 more)

### Community 2 - "AddCategoryDialog.tsx"
Cohesion: 0.26
Nodes (14): sonner, AddStoreDialog(), ScannerDialogProps, Button(), buttonVariants, Dialog(), DialogContent(), DialogDescription() (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (30): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+22 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (42): Route, Route, ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesById, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute (+34 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (27): imports, name, private, type, babel-plugin-react-compiler, @base-ui/react, better-auth, @biomejs/biome (+19 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "$productId.tsx"
Cohesion: 0.24
Nodes (13): react-zoom-pan-pinch, ProductCard(), userExcludedIngredientsQueryOptions(), userFavoriteProductsQueryOptions(), formatProductDate(), getScoreSpotlightConfig(), ImageSide, ProductDetails() (+5 more)

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

### Community 21 - "profile.tsx"
Cohesion: 0.14
Nodes (16): cmdk, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+8 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "store-submissions.tsx"
Cohesion: 0.17
Nodes (22): @tanstack/react-start, @tanstack/react-table, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+14 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.20
Nodes (11): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+3 more)

### Community 27 - "@tanstack/react-query"
Cohesion: 0.15
Nodes (11): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query, @tanstack/react-query-devtools, @tanstack/react-router-devtools, NotFound(), Toaster() (+3 more)

### Community 28 - "category-browse-card.tsx"
Cohesion: 0.18
Nodes (11): CATEGORY_ICON_RULES, CATEGORY_PALETTES, CategoryBrowseCard(), CategoryBrowseCardProps, CategoryBrowseSubcategory, getCategoryVisual(), CategoryItem, CategoryNavList() (+3 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.33
Nodes (6): @tanstack/react-router-ssr-query, getContext(), getRouter(), Register, @tanstack/react-router, routeTree

### Community 31 - "app-schema.ts"
Cohesion: 0.09
Nodes (26): ref_drizzle_orm_pg_core, categories, categoriesRelations, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategories, productCategoriesRelations (+18 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "landing.tsx"
Cohesion: 0.12
Nodes (13): CATALOG_CATEGORIES, HEADER_LINKS, INFO_MODAL_TOPICS, InfoModalTopic, LandingInfoDialog(), LandingPage(), REVIEWS, ReviewsSection() (+5 more)

### Community 34 - "0001_nice_rockslide.sql"
Cohesion: 0.13
Nodes (21): "account", account_issuer_accountId_uidx, account_userId_idx, "categories", "ingredients", "product_categories", "product_ingredients", "product_stores" (+13 more)

### Community 35 - "ProductForm.tsx"
Cohesion: 0.09
Nodes (19): cn, AddIngredientDialog(), ProductFormValues, src_components_ui_combobox_combobox, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxContent() (+11 more)

### Community 36 - "category-functions.ts"
Cohesion: 0.15
Nodes (12): offCategoryMappings, unmappedOffTags, addCategory, addCategorySchema, deleteCategory, deleteCategorySchema, getActiveCategoriesSchema, getCategoriesSchema (+4 more)

### Community 37 - "category-icon.tsx"
Cohesion: 0.47
Nodes (5): CATEGORY_ICON_RULES, CategoryIconTile(), CategoryIconTileProps, normalizeCategoryName(), resolveCategoryIcon()

### Community 41 - "lucide-react"
Cohesion: 0.20
Nodes (13): lucide-react, @tanstack/react-router, SearchBar(), SearchBarProps, Select(), SelectContent(), SelectItem(), SelectTrigger() (+5 more)

### Community 44 - "drizzle-orm"
Cohesion: 0.27
Nodes (9): drizzle-orm, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore(), pool (+1 more)

### Community 45 - "ingredient-functions.ts"
Cohesion: 0.15
Nodes (12): offIngredientMappings, unmappedOffIngredients, addIngredient, addIngredientSchema, deleteIngredient, deleteIngredientSchema, getIngredient, getIngredientsSchema (+4 more)

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

### Community 54 - "auth-schema.ts"
Cohesion: 0.22
Nodes (8): account, accountRelations, roleEnum, session, sessionRelations, user, userRelations, verification

### Community 56 - ""product_store_submissions""
Cohesion: 0.40
Nodes (4): "product_store_submissions", "public"."products", "public"."stores", "public"."user"

### Community 57 - "cn"
Cohesion: 0.18
Nodes (15): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DialogOverlay() (+7 more)

### Community 58 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): Onboarding(), NAV_ITEMS, Route

### Community 59 - "storesQueryOptions"
Cohesion: 0.05
Nodes (67): ProductForm(), getPaletteForStore(), getStoreInitials(), SIZE_CLASSES, STORE_AVATAR_PALETTES, StoreAvatar(), StoreAvatarProps, StoreCard() (+59 more)

### Community 61 - "ensureSession"
Cohesion: 0.12
Nodes (20): browser-image-compression, ref_tanstack_react_start_server, ensureSession, addStore, addStoreSchema, deleteStore, deleteStoreSchema, storeIdSchema (+12 more)

### Community 62 - "Route"
Cohesion: 0.67
Nodes (3): Route, Route, FileRoutesByPath

### Community 63 - "product-card.tsx"
Cohesion: 0.17
Nodes (14): ProductCardProps, StoreChip(), StoreInfo, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+6 more)

### Community 64 - "index.ts"
Cohesion: 0.39
Nodes (6): db, getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 65 - "category-mappings.tsx"
Cohesion: 0.16
Nodes (18): AddCategoryDialog(), useDebounce(), categoriesQueryOptions(), CategoryQueryArgs, categoryQueryOptions(), unmappedTagsQueryOptions(), Route, RouteComponent() (+10 more)

### Community 66 - "product-functions.ts"
Cohesion: 0.16
Nodes (12): zod, productIngredients, AddProductRoute(), Route, searchSchema, addProduct, addProductSchema, deleteProduct (+4 more)

### Community 67 - "favorites.tsx"
Cohesion: 0.29
Nodes (6): Skeleton(), FavoritesPage(), Route, SCORE_FILTER_OPTIONS, ScoreFilter, SKELETON_KEYS

### Community 68 - "react"
Cohesion: 0.35
Nodes (5): class-variance-authority, radix-ui, react, Badge(), badgeVariants

### Community 69 - "score-badge.tsx"
Cohesion: 0.25
Nodes (7): src_assets_bronze_badge, src_assets_gold_badge, src_assets_silver_badge, ProductScoreTier, ScoreBadge(), ScoreBadgeProps, TIER_BADGES

### Community 70 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 72 - "profile-functions.ts"
Cohesion: 0.25
Nodes (7): ingredients, userExcludedIngredients, userFavoriteProducts, toggleExcludedIngredient, toggleExcludedIngredientSchema, toggleFavoriteProduct, toggleFavoriteProductSchema

## Knowledge Gaps
- **474 isolated node(s):** `AuthShellProps`, `ProtectedRouteRoute`, `ForgotPasswordRoute`, `LandingRoute`, `LoginRoute` (+469 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 554 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `auth-fields.tsx`, `AddCategoryDialog.tsx`, `sidebar.tsx`, `$productId.tsx`, `dropdown-menu.tsx`, `profile.tsx`, `store-submissions.tsx`, `admin/route.tsx`, `category-browse-card.tsx`, `landing.tsx`, `ProductForm.tsx`, `category-icon.tsx`, `lucide-react`, `storesQueryOptions`, `product-card.tsx`, `favorites.tsx`, `react`, `score-badge.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `auth-fields.tsx`, `AddCategoryDialog.tsx`, `sidebar.tsx`, `package.json`, `$productId.tsx`, `dropdown-menu.tsx`, `profile.tsx`, `store-submissions.tsx`, `admin/route.tsx`, `@tanstack/react-query`, `category-browse-card.tsx`, `landing.tsx`, `ProductForm.tsx`, `lucide-react`, `cn`, `storesQueryOptions`, `product-card.tsx`, `category-mappings.tsx`, `favorites.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `store-submissions.tsx` to `index.ts`, `category-mappings.tsx`, `AddCategoryDialog.tsx`, `product-functions.ts`, `category-functions.ts`, `safe-envs.ts`, `routeTree.gen.ts`, `package.json`, `lucide-react`, `$productId.tsx`, `profile-functions.ts`, `ingredient-functions.ts`, `profile.tsx`, `storesQueryOptions`, `app-schema.ts`, `ensureSession`, `product-card.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `AuthShellProps`, `ProtectedRouteRoute`, `ForgotPasswordRoute` to the rest of the system?**
  _474 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth-fields.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14015151515151514 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._