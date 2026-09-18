# Graph Report - CleanLabel  (2026-09-18)

## Corpus Check
- 132 files · ~52,657 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 722 nodes · 1749 edges · 38 communities (34 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- UI Components
- Core Routing & Pages
- Package Dependencies
- Ingredients & Products Admin
- Category Management & Queries
- Generated Route Tree
- Sidebar & Mobile Hook
- Command, Popover & Tooltip
- Project Config & Refs
- S3 Upload & Env Vars
- Biome Config
- Badges & Sliders
- Auth & Store Actions
- Dropdown & Version Switcher
- Dev Dependencies
- Database Schema Relations
- TypeScript Config
- Components Config
- NPM Scripts
- Auth Client & Pages
- Product & Search API
- Database Seeding
- Auth Schema
- Breadcrumbs & Admin Route
- Sheet UI Component
- Ingredient API & Mappings
- Vite Configuration
- React Query Provider
- Core Routes
- Database & Auth Setup
- OpenFoodFacts Integrations
- Service Worker Build
- Scanner & Protected Routes
- Environment Validation
- Protected Auth Routes
- PNPM Config
- React Query Devtools

## God Nodes (most connected - your core abstractions)
1. `cn()` - 108 edges
2. `react` - 44 edges
3. `Button()` - 31 edges
4. `@tanstack/react-query` - 30 edges
5. `@tanstack/react-router` - 29 edges
6. `@tanstack/react-start` - 24 edges
7. `lucide-react` - 24 edges
8. `FileRoutesByPath` - 24 edges
9. `ensureSession` - 24 edges
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

## Communities (38 total, 4 thin omitted)

### Community 0 - "UI Components"
Cohesion: 0.08
Nodes (41): cn, lucide-react, react, sonner, @tanstack/react-start, AddStoreDialog(), ProductForm(), ProductFormValues (+33 more)

### Community 1 - "Core Routing & Pages"
Cohesion: 0.07
Nodes (47): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query, @tanstack/react-router, @tanstack/react-router-devtools, ProductCard(), NotFound() (+39 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, better-auth, browser-image-compression, class-variance-authority, clsx (+31 more)

### Community 3 - "Ingredients & Products Admin"
Cohesion: 0.09
Nodes (31): react-zoom-pan-pinch, AddIngredientDialog(), ProductCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+23 more)

### Community 4 - "Category Management & Queries"
Cohesion: 0.09
Nodes (30): @tanstack/react-table, AddCategoryDialog(), useDebounce(), categoriesQueryOptions(), CategoryQueryArgs, categoryQueryOptions(), unmappedTagsQueryOptions(), allProductsQueryOptions() (+22 more)

### Community 5 - "Generated Route Tree"
Cohesion: 0.06
Nodes (34): ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute, ProtectedAdminAddProductRoute, ProtectedAdminAllCategoriesRoute (+26 more)

### Community 6 - "Sidebar & Mobile Hook"
Cohesion: 0.10
Nodes (27): AppSidebar(), SidebarGroupData, SidebarItem, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+19 more)

### Community 7 - "Command, Popover & Tooltip"
Cohesion: 0.10
Nodes (22): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+14 more)

### Community 8 - "Project Config & Refs"
Cohesion: 0.07
Nodes (27): imports, name, private, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx (+19 more)

### Community 9 - "S3 Upload & Env Vars"
Cohesion: 0.16
Nodes (21): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, browser-image-compression, getServerEnv(), getProductUploadUrls, getUploadUrlsSchema, generatePresignedUploadUrl(), s3 (+13 more)

### Community 10 - "Biome Config"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 11 - "Badges & Sliders"
Cohesion: 0.18
Nodes (13): class-variance-authority, radix-ui, Badge(), badgeVariants, Separator(), Slider(), Switch(), Tooltip() (+5 more)

### Community 12 - "Auth & Store Actions"
Cohesion: 0.14
Nodes (17): ref_tanstack_react_start_server, offCategoryMappings, unmappedOffTags, ensureSession, addCategory, addCategorySchema, getCategoriesSchema, mapOffTagSchema (+9 more)

### Community 13 - "Dropdown & Version Switcher"
Cohesion: 0.12
Nodes (13): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+5 more)

### Community 14 - "Dev Dependencies"
Cohesion: 0.11
Nodes (19): devDependencies, babel-plugin-react-compiler, @biomejs/biome, dotenv, @rolldown/plugin-babel, @tailwindcss/typography, @tanstack/devtools-event-client, @tanstack/devtools-vite (+11 more)

### Community 15 - "Database Schema Relations"
Cohesion: 0.12
Nodes (17): drizzle-orm, categoriesRelations, ingredients, ingredientsRelations, offCategoryMappingsRelations, offIngredientMappingsRelations, productCategoriesRelations, productIngredientsRelations (+9 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 17 - "Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 18 - "NPM Scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 19 - "Auth Client & Pages"
Cohesion: 0.16
Nodes (8): ref_better_auth_client_plugins, ref_better_auth_react, @tanstack/react-form, clientEnv, authClient, Route, searchSchema, Route

### Community 20 - "Product & Search API"
Cohesion: 0.21
Nodes (11): categories, productCategories, productIngredients, products, productStores, stores, addProductSchema, getCategories (+3 more)

### Community 21 - "Database Seeding"
Cohesion: 0.21
Nodes (10): dotenv, drizzle-kit, ref_drizzle_orm_node_postgres, pg, db, getOrCreateUncategorized(), main(), mapNutriscore() (+2 more)

### Community 22 - "Auth Schema"
Cohesion: 0.18
Nodes (9): ref_drizzle_orm_pg_core, account, accountRelations, roleEnum, session, sessionRelations, user, userRelations (+1 more)

### Community 23 - "Breadcrumbs & Admin Route"
Cohesion: 0.27
Nodes (8): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SidebarInset()

### Community 24 - "Sheet UI Component"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 25 - "Ingredient API & Mappings"
Cohesion: 0.18
Nodes (10): offIngredientMappings, unmappedOffIngredients, addIngredient, addIngredientSchema, getIngredient, getIngredientsSchema, mapOffIngredientSchema, mapOffIngredientToIngredient (+2 more)

### Community 26 - "Vite Configuration"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 27 - "React Query Provider"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 28 - "Core Routes"
Cohesion: 0.20
Nodes (8): Route, Route, Route, Route, Route, Route, FileRoutesById, FileRoutesByPath

### Community 29 - "Database & Auth Setup"
Cohesion: 0.32
Nodes (5): better-auth, ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, db, auth

### Community 30 - "OpenFoodFacts Integrations"
Cohesion: 0.53
Nodes (5): getOrCreateUncategorized(), mapNutriscore(), processBarcodeScan, resolveOffCategory(), testFetchOffProduct

### Community 31 - "Service Worker Build"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 32 - "Scanner & Protected Routes"
Cohesion: 0.40
Nodes (3): ScannerDialog(), TODO: We use "as any" for search since we don't know if add-product has…, Route

### Community 33 - "Environment Validation"
Cohesion: 0.50
Nodes (3): zod, clientEnvSchema, serverEnvSchema

## Knowledge Gaps
- **247 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+242 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 300 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tanstack/react-start` connect `UI Components` to `Scanner & Protected Routes`, `Core Routing & Pages`, `Ingredients & Products Admin`, `Generated Route Tree`, `Project Config & Refs`, `S3 Upload & Env Vars`, `Auth & Store Actions`, `Database Schema Relations`, `Product & Search API`, `Ingredient API & Mappings`, `OpenFoodFacts Integrations`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Project Config & Refs`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `react` connect `UI Components` to `Scanner & Protected Routes`, `Core Routing & Pages`, `Ingredients & Products Admin`, `Category Management & Queries`, `Sidebar & Mobile Hook`, `Command, Popover & Tooltip`, `Project Config & Refs`, `Badges & Sliders`, `Dropdown & Version Switcher`, `Breadcrumbs & Admin Route`, `Sheet UI Component`, `React Query Provider`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _247 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0763000852514919 - nodes in this community are weakly interconnected._
- **Should `Core Routing & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06965174129353234 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._