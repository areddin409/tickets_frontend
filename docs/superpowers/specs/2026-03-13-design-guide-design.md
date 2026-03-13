# Design Guide — Spec

**Date:** 2026-03-13
**Status:** Approved
**Output:** `docs/DESIGN_GUIDE.md`

---

## Overview

A living markdown reference document that establishes the design language for the Ticket Event Platform frontend. Scoped to what currently exists in the codebase. Used as a reference when building or updating any page or component.

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Design direction | Zinc Dark (create-event form style) | More refined than older gray/purple style |
| Accent color | purple-700 (#7e22ce) | Existing brand color, bold on dark |
| Primary CTA | white/black | Minimal, high contrast |
| Font | Inter (Google Fonts) | Clean, modern, widely supported |
| Output format | Markdown doc only | Reference only — no CSS changes, no page updates |
| Location | `docs/DESIGN_GUIDE.md` | Project root docs folder |

---

## Design Guide Content Spec

The guide must cover exactly these six sections in order:

### Section 1: Color Palette

Document all semantic color roles with their Tailwind class, hex value, and usage context:

**Backgrounds (dark → light):**
- Page background: `bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800` — outermost page wrapper on form pages. List pages currently use `bg-black` and should be migrated to the gradient.
- Form wrapper: `bg-zinc-100/10 border border-zinc-700` — outer shell of a form (see Section 3 for full class string)
- Section card: `bg-zinc-900/50` with `border border-zinc-800` — each logical form section
- Input field: `bg-zinc-800/50` with `border border-zinc-700` — all text inputs
- Active toggle: `bg-zinc-700` with `border border-zinc-600` — selected toggle button state

**Text:**
- Primary: `text-white` — headings, input values, active labels
- Label: `text-zinc-300` — form field labels
- Secondary: `text-zinc-400` — metadata, back links, body copy
- Muted: `text-zinc-400` — page subtitles (same shade as secondary; visually de-emphasised via context)
- Placeholder: `text-zinc-500` (via `placeholder:text-zinc-500`) — input placeholders

**Accent & semantic:**
- Accent: `bg-purple-700 hover:bg-purple-500 text-white` — Create / primary list-page actions
- Primary CTA: `bg-white text-black hover:bg-zinc-200` — Save/submit inside forms
- Error background: `bg-red-500/10 border border-red-500/50` — inline error blocks
- Error text: `text-red-400` (title), `text-red-300` (body)
- Required asterisk: `text-red-400`

**Status badge colors:**
- Draft: `bg-gray-700 text-gray-200`
- Published: `bg-green-700 text-green-100`
- Cancelled: `bg-red-700 text-red-100`
- Completed: `bg-blue-700 text-blue-100`

---

### Section 2: Typography

Font: **Inter** — must be loaded via a `<link>` tag in `index.html` (Google Fonts). Not yet wired up; this is a pending implementation step. Fallback: `system-ui, sans-serif`.

| Role | Classes | Example usage |
|---|---|---|
| Page title | `text-2xl font-semibold text-white` | "Create new event" |
| Section heading | `text-lg font-medium text-white` | "Ticket Sales Window" |
| Form label | `text-sm font-medium text-zinc-300` | "Event title *" |
| Body / secondary | `text-sm text-zinc-400` | Metadata, descriptions |
| Page subtitle | `text-sm text-zinc-400` | Under page title |
| Badge / caption | `text-xs` | Status badges, card metadata |

---

### Section 3: Spacing & Layout

**Page wrapper (form/detail pages):**
```
container mx-auto px-4 py-8 max-w-3xl
```

**Section card:**
```
bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6
```

**Outer form shell:**
```
space-y-8 bg-zinc-100/10 p-6 rounded-lg border border-zinc-700
```

**Individual form field:**
```
space-y-2  (label + input stacked)
```

**Grid layout (2-col fields):**
```
grid grid-cols-1 lg:grid-cols-2 gap-6
```

---

### Section 4: Component Patterns

Document each component with its Tailwind classes and when to use it.

**Buttons:**

| Variant | Classes | When |
|---|---|---|
| Primary CTA | `bg-white text-black font-medium text-sm rounded-md hover:bg-zinc-200 transition-colors` | Save/submit inside forms |
| Accent | `bg-purple-700 text-white font-medium text-sm rounded-md hover:bg-purple-500 transition-colors` | Create actions on list pages |
| Ghost | `text-zinc-400 hover:text-white text-sm font-medium transition-colors` | Cancel / secondary actions |
| Destructive | `bg-red-700/80 text-white rounded-md hover:bg-red-500 transition-colors` | Delete actions |
| Icon button | `p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors` | Edit/delete icon buttons in cards |

**Text Input:**
```
bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500
rounded-md h-11
focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500
```

**Toggle Button Group (e.g. Status selector):**
- Active: `bg-zinc-700 text-white border border-zinc-600 px-4 py-2 text-sm font-medium rounded-md`
- Inactive: `bg-transparent text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300 px-4 py-2 text-sm rounded-md`

**Status Badge:**
```
px-2 py-1 rounded text-xs font-medium
```
Colors per status as listed in Section 1.

**Section Card:**
```
bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6
```

**Event Card (list pages):**
```
bg-zinc-900 border border-zinc-800 text-white rounded-lg
```
Note: existing code uses `bg-gray-900 border-gray-700` — should be migrated to zinc.

**Inline Error Block:**
```html
<div class="flex items-start gap-3 p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
  <AlertCircle class="w-5 h-5 text-red-400 shrink-0" />
  <div class="flex-1">
    <p class="text-sm font-medium text-red-400">Error</p>
    <p class="text-sm text-red-300 mt-1">{message}</p>
  </div>
</div>
```

---

### Section 5: Page Layout Patterns

**Form page (create/edit):**
1. `NavBar`
2. `container mx-auto px-4 py-8 max-w-3xl`
3. Back link (`← Back to X` in `text-sm text-zinc-400 hover:text-white`)
4. Page title (`text-2xl font-semibold text-white`) + subtitle (`text-sm text-zinc-400`)
5. `<form>` with outer shell `space-y-8 bg-zinc-100/10 p-6 rounded-lg border border-zinc-700`
6. Stacked section cards (`bg-zinc-900/50 border-zinc-800`)
7. Action bar: ghost "Cancel" (left) + white "Save/Create" (right)

**List page:**
1. `NavBar`
2. Header row: title (`text-2xl font-bold text-white`) + accent "Create X" button (right)
3. Content (cards or table)
4. Pagination (`SimplePagination`)

---

### Section 6: Interaction States

| State | Implementation |
|---|---|
| Input focus | `focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500` |
| Button hover | `transition-colors` on all buttons |
| Back link hover | `hover:text-white transition-colors` |
| Toggle hover (inactive) | `hover:border-zinc-600 hover:text-zinc-300` |
| Loading / disabled | TBD — not yet standardized in codebase |

---

## Pages That Need Updating

When implementing pages against this guide, the following diverge from the spec:

| Page | Issue |
|---|---|
| `dashboard-list-events-page.tsx` | Uses `bg-gray-900/border-gray-700` cards (→ migrate to zinc); create button should use standardized accent class; page wrapper is `bg-black` (→ gradient); container is `max-w-lg` (→ `max-w-3xl`) |
| `login-page.tsx` | No styling — just a redirect, low priority |
| `published-events-page.tsx` | Needs review against spec |
| `organizers-landing-page.tsx` | Needs review against spec |
| `purchase-ticket-page.tsx` | Needs review against spec |

---

## Out of Scope

- CSS variable / token changes to `index.css`
- Immediate page updates (this guide is reference only; updates happen page-by-page)
- Dark/light mode toggle (app is dark-only)
- Animation/motion tokens
- Responsive breakpoints beyond `lg:` grid splits already in use
