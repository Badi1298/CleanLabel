# Graph Report - CleanLabel  (2026-10-02)

## Corpus Check
- 100 files · ~34,675 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 810 nodes · 1525 edges · 41 communities (35 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ccf7f1ef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app-schema.ts
- react
- product-functions.ts
- dependencies
- sidebar.tsx
- organization-best-practices/SKILL.md
- better-auth-security-best-practices/SKILL.md
- routeTree.gen.ts
- package.json
- Neon
- all-products.tsx
- two-factor-authentication-best-practices/SKILL.md
- biome.json
- multi-select.tsx
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
- dialog.tsx
- admin/route.tsx
- cn
- __root.tsx
- utils.ts
- vite.config.ts
- router.tsx
- FileRoutesByPath
- generate-sw.mjs
- _public/route.tsx
- dotenv
- $.ts
- homeQueryOptions
- forgot-password.tsx
- AGENTS.md
- pnpm

## God Nodes (most connected - your core abstractions)
1. `cn()` - 110 edges
2. `react` - 33 edges
3. `@tanstack/react-router` - 24 edges
4. `lucide-react` - 24 edges
5. `Button()` - 21 edges
6. `FileRoutesByPath` - 20 edges
7. `@tanstack/react-query` - 18 edges
8. `getServerEnv()` - 17 edges
9. `categoriesQueryOptions()` - 17 edges
10. `storesQueryOptions()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CommandDialog()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (41 total, 6 thin omitted)

### Community 0 - "app-schema.ts"
Cohesion: 0.05
Nodes (58): ref_better_auth_adapters_drizzle, ref_better_auth_tanstack_start, drizzle-orm, ref_drizzle_orm_node_postgres, ref_drizzle_orm_pg_core, pg, db, main() (+50 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (41): ref_better_auth_client_plugins, ref_better_auth_react, lucide-react, react, sonner, @tanstack/react-form, @tanstack/react-query, @tanstack/react-router (+33 more)

### Community 2 - "product-functions.ts"
Cohesion: 0.09
Nodes (34): browser-image-compression, @tanstack/react-start, ref_tanstack_react_start_server, zod, ProductForm(), stores, useImageUploadMutation(), categoriesQueryOptions() (+26 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, better-auth, browser-image-compression, class-variance-authority, clsx, cmdk (+29 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (31): AppSidebar(), SidebarGroupData, SidebarItem, Sheet(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps (+23 more)

### Community 5 - "organization-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (34): Active Organizations, Adding Members (Server-Side), Assigning Multiple Roles, Checking Permissions, Client-Side Setup, Complete Configuration Example, Controlling Organization Creation, Creating Custom Roles (+26 more)

### Community 6 - "better-auth-security-best-practices/SKILL.md"
Cohesion: 0.06
Nodes (30): Account Enumeration Prevention, Background Tasks, Complete Security Configuration Example, Configuration, Configuring the Secret, Configuring Trusted Origins, Cookie Security, Cross-Subdomain Cookies (+22 more)

### Community 7 - "routeTree.gen.ts"
Cohesion: 0.06
Nodes (30): ApiAuthSplatRoute, FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, ForgotPasswordRoute, LoginRoute, ProtectedAdminAddProductRoute, ProtectedAdminAddStoreRoute (+22 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (29): imports, name, private, type, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, babel-plugin-react-compiler, better-auth (+21 more)

### Community 9 - "Neon"
Cohesion: 0.07
Nodes (28): Architecture: How to Use Neon, Backend Primitives, Branch configuration, Branch-First Dev Flow, Choosing the Right Skill, Fetching Docs as Markdown, Finding the Right Page, Getting Started with Neon (+20 more)

### Community 10 - "all-products.tsx"
Cohesion: 0.10
Nodes (20): @tanstack/react-table, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+12 more)

### Community 11 - "two-factor-authentication-best-practices/SKILL.md"
Cohesion: 0.08
Nodes (25): Backup Code Configuration, Backup Codes, Client-Side Setup, Complete Configuration Example, Configuring OTP Delivery, Disabling 2FA, Displaying Backup Codes, Displaying the QR Code (+17 more)

### Community 12 - "biome.json"
Cohesion: 0.09
Nodes (22): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+14 more)

### Community 13 - "multi-select.tsx"
Cohesion: 0.13
Nodes (18): cmdk, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+10 more)

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
Cohesion: 0.23
Nodes (12): ProductCardProps, Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+4 more)

### Community 22 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check, db:generate, db:migrate, db:pull, db:push, db:seed:off (+7 more)

### Community 23 - "email-and-password-best-practices/SKILL.md"
Cohesion: 0.14
Nodes (13): Callback URLs, Client Side Validation, Custom Hashing Algorithm, Email Verification Setup, Password Hashing, Password Requirements, Password Reset Flows, Quick Start (+5 more)

### Community 24 - "dialog.tsx"
Cohesion: 0.20
Nodes (9): @yudiel/react-qr-scanner, ScannerDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+1 more)

### Community 25 - "admin/route.tsx"
Cohesion: 0.23
Nodes (9): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Separator() (+1 more)

### Community 26 - "cn"
Cohesion: 0.24
Nodes (8): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Skeleton(), cn()

### Community 27 - "__root.tsx"
Cohesion: 0.20
Nodes (7): next-themes, ref_styles_css_url, @tanstack/react-devtools, @tanstack/react-query-devtools, @tanstack/react-router-devtools, Toaster(), MyRouterContext

### Community 28 - "utils.ts"
Cohesion: 0.22
Nodes (7): radix-ui, Slider(), Switch(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 29 - "vite.config.ts"
Cohesion: 0.20
Nodes (9): ref_nitro_vite, @rolldown/plugin-babel, @tailwindcss/vite, @tanstack/devtools-vite, ref_tanstack_react_start_plugin_vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 30 - "router.tsx"
Cohesion: 0.24
Nodes (8): @tanstack/react-router-ssr-query, getContext(), TanstackQueryProvider(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 31 - "FileRoutesByPath"
Cohesion: 0.22
Nodes (9): Route, Route, Route, Route, Route, Route, Route, FileRoutesById (+1 more)

### Community 32 - "generate-sw.mjs"
Cohesion: 0.40
Nodes (3): ref_node_path, workbox-build, clientDist

### Community 33 - "_public/route.tsx"
Cohesion: 0.40
Nodes (3): ScannerDialog(), TODO: We use "as any" for search since we don't know if add-product has…, Route

### Community 36 - "homeQueryOptions"
Cohesion: 0.67
Nodes (3): homeQueryOptions(), Home(), Route

## Knowledge Gaps
- **373 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `react`, `sidebar.tsx`, `all-products.tsx`, `multi-select.tsx`, `$productId.tsx`, `dialog.tsx`, `admin/route.tsx`, `utils.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `@tanstack/react-start` connect `product-functions.ts` to `app-schema.ts`, `react`, `_public/route.tsx`, `routeTree.gen.ts`, `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05093167701863354 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08226768968456948 - nodes in this community are weakly interconnected._
- **Should `product-functions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09408033826638477 - nodes in this community are weakly interconnected._