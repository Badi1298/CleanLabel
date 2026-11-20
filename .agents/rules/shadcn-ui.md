---
trigger: always_on
---

# Use Existing & Official shadcn/ui Components

Whenever building or modifying UI elements, forms, dialogs, tables, or layout primitives, strictly follow these rules:

## 1. Reuse Existing Project Components First
- Before writing custom UI primitives (buttons, inputs, modals, dropdowns, cards, badges, etc.), **inspect the project's existing UI components directory** (typically `src/components/ui` or `components/ui`, or check `components.json` for the configured `aliases.ui` path).
- Always compose features using the project's existing `shadcn/ui` components and styling conventions (`cn()`, Tailwind CSS tokens, and variants) rather than reinventing them.

## 2. Install Missing Official Components via CLI
- If a standard UI pattern is needed and the corresponding `shadcn/ui` component is **not yet installed** in the project, **install it using the official CLI** (`npx shadcn@latest add <component-name>`) rather than hand-coding a custom replica.
- Inspect the generated component after installation so you use its exact exported props and subcomponents cleanly.

## 3. When Custom Components Are Acceptable
- Only build custom components from scratch when no official `shadcn/ui` component (or composition of existing ones) fits the requirement—and build those custom components on top of existing `shadcn/ui` primitives and theme variables.