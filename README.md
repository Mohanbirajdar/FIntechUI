# FinTrack — Modern Finance Dashboard

A full-featured, highly animated personal finance dashboard built with **Next.js 16**, **Tailwind CSS v4**, **Zustand v5**, **Framer Motion v12**, and **Recharts v3**. Includes a complete **Admin Panel** with platform-level analytics, user management, and reporting.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Pages & Routes](#pages--routes)
6. [User Flow](#user-flow)
7. [Admin Panel](#admin-panel)
8. [Animations](#animations)
9. [State Management](#state-management)
10. [Theming & Styling](#theming--styling)
11. [Mock Data](#mock-data)
12. [Key Design Decisions](#key-design-decisions)

---

## Features

### User Dashboard
- **Animated Onboarding** — 5-step onboarding flow collecting name, currency, income, budgets, and goals; persisted in localStorage via Zustand
- **Summary Cards** — Animated number counters for balance, income, expenses, and savings rate with spring-physics entrance animations
- **Balance Trend Chart** — 6-month line chart showing balance, income, and expenses
- **Spending Pie Chart** — Category breakdown donut chart
- **Monthly Bar Chart** — Side-by-side income vs. expense bars per month
- **Recent Transactions** — Last 6 transactions with stagger entrance and hover slide effects
- **Smart Insights** — AI-style insights derived from real spending data (savings rate, top categories, month-over-month trends)
- **Budget Tracker** — Animated progress bars per category with over-budget warnings
- **Goals Tracker** — Progress bars with countdown to deadline per financial goal
- **Spending Heatmap** — 12-week GitHub-style heatmap of daily spending; cells animate on mount with a wave and scale on hover
- **Dark / Light Mode** — Theme toggle persisted to localStorage

### Transactions Page
- Full paginated transaction list (15 per page)
- Filter by date range, category, type, amount range, and keyword search
- Sort by date, amount, or category
- Anomaly flagging for statistically unusual amounts
- Export to **CSV** and **JSON**
- Import from a JSON file
- Simulated voice input
- Stagger page-enter animations on all sections

### Insights Page
- Key metrics: savings rate, average monthly expense, anomaly count, total transactions
- Spending personality analysis (Saver / Balanced / Spender)
- Category breakdown with animated horizontal bars
- Smart recommendations derived from real spending patterns
- Anomaly alert list with timestamps and amounts

### Profile Page
- User info display
- Theme toggle (dark / light)
- Budget limit controls per category (±500 INR increment buttons)
- Full goal CRUD — add, edit, delete with animated modal
- Danger zone: full data reset

---

## Tech Stack

| Library | Version | Role |
|---|---|---|
| Next.js | 16.2.2 | App Router, SSR/SSG, file-based routing |
| React | 19.2.4 | UI rendering |
| TypeScript | ^5 | Static typing throughout |
| Tailwind CSS | ^4 | Utility-first styling (v4 `@import` format) |
| Framer Motion | ^12 | All animations and transitions |
| Zustand | ^5 | Global state + localStorage persistence |
| Recharts | ^3 | Charts (Line, Bar, Pie, Radar, Area) |
| Sonner | ^2 | Toast notifications |
| Lucide React | ^1.7 | Icon set |
| date-fns | ^4 | Date formatting utilities |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                 # Tailwind v4 + CSS custom properties + glass utilities
│   ├── layout.tsx                  # Root HTML layout
│   ├── page.tsx                    # Root redirect → /onboarding or /dashboard
│   ├── onboarding/page.tsx         # 5-step onboarding entry
│   ├── dashboard/page.tsx          # Main user dashboard
│   ├── transactions/page.tsx       # Transactions module
│   ├── insights/page.tsx           # Financial insights & analytics
│   ├── profile/page.tsx            # Profile & settings
│   └── admin/
│       ├── login/page.tsx          # Admin authentication (amber theme)
│       ├── dashboard/page.tsx      # Admin KPI dashboard
│       ├── users/page.tsx          # User management table
│       ├── analytics/page.tsx      # DAU/MAU + retention analytics
│       ├── spending/page.tsx       # Platform spending analysis
│       ├── transactions/page.tsx   # Global transaction management
│       ├── categories/page.tsx     # Category CRUD
│       ├── reports/page.tsx        # Export + AI-generated reports
│       └── notifications/page.tsx  # Notification composer & history
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx     # Animated floating blobs + layout wrapper
│   │   └── FloatingNavbar.tsx      # Glassmorphism bottom nav + theme toggle
│   ├── onboarding/
│   │   └── OnboardingFlow.tsx      # 5-step animated onboarding wizard
│   ├── dashboard/
│   │   ├── SummaryCards.tsx        # Animated counter summary cards
│   │   ├── Charts.tsx              # Recharts wrappers (Line, Pie, Bar)
│   │   ├── RecentTransactions.tsx  # Latest 6 transactions list
│   │   ├── SmartInsights.tsx       # AI-style insight cards
│   │   ├── BudgetProgress.tsx      # Category budget progress bars
│   │   ├── GoalsTracker.tsx        # Goal progress bars
│   │   └── SpendingHeatmap.tsx     # 12-week spending heatmap
│   ├── transactions/
│   │   ├── TransactionList.tsx     # Paginated list with AnimatePresence
│   │   ├── TransactionFilters.tsx  # Filter + sort controls
│   │   └── AddTransactionModal.tsx # Add / edit transaction modal
│   ├── insights/
│   │   ├── SpendingPersonality.tsx # Personality score card
│   │   ├── CategoryBreakdown.tsx   # Horizontal bar breakdown
│   │   └── SmartRecommendations.tsx# Actionable recommendation cards
│   ├── admin/
│   │   └── AdminLayout.tsx         # Collapsible amber sidebar layout
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx                # motion.div card (optional hover lift)
│       ├── Input.tsx               # Plain <input> (FM v12 type compat)
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Select.tsx
│       └── Skeleton.tsx
│
├── store/
│   ├── useAppStore.ts              # role, theme, onboarding state
│   ├── useTransactionStore.ts      # Transactions, budgets, goals, filters
│   └── useAdminStore.ts            # Admin auth, users, categories, notifications
│
├── lib/
│   ├── utils.ts                    # cn(), formatCurrency(), formatDate(), CSV/JSON download
│   ├── mockData.ts                 # 156 mock transactions, default budgets & goals
│   ├── adminMockData.ts            # 20 mock users, growth data, notifications
│   └── useAnimatedCounter.ts       # requestAnimationFrame counter hook
│
└── types/
    └── index.ts                    # Shared types: Transaction, Budget, Goal, Filters, etc.
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Navigate to the project folder
cd fintechUI

# Install all dependencies
npm install

# Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

All 16 routes compile as static pages (`○ Static`) with zero client-side errors.

---

## Pages & Routes

| Route | Description | Auth Required |
|---|---|---|
| `/` | Redirects to `/onboarding` or `/dashboard` | — |
| `/onboarding` | 5-step role selection + profile setup | None |
| `/dashboard` | Main finance dashboard | Onboarding complete |
| `/transactions` | Transaction list, filters, export/import | Onboarding complete |
| `/insights` | Spending analytics and recommendations | Onboarding complete |
| `/profile` | User settings, budgets, goals | Onboarding complete |
| `/admin/login` | Admin login form | None |
| `/admin/dashboard` | Admin KPI overview | Admin authenticated |
| `/admin/users` | User management table | Admin authenticated |
| `/admin/analytics` | DAU/MAU and retention charts | Admin authenticated |
| `/admin/spending` | Platform spending analysis | Admin authenticated |
| `/admin/transactions` | All-user transaction view | Admin authenticated |
| `/admin/categories` | Category CRUD | Admin authenticated |
| `/admin/reports` | Export and AI-generated reports | Admin authenticated |
| `/admin/notifications` | Notification system | Admin authenticated |

---

## User Flow

```
Visit /
  └─ Not onboarded → /onboarding
       ├─ Step 0: Welcome — choose role
       │    ├─ User → Steps 1–4 (name, currency, income, budgets & goals)
       │    │    └─ Complete → /dashboard
       │    └─ Admin → /admin/login
       │         Credentials: admin@fintrack.com / admin123
       │              └─ → /admin/dashboard
       └─ Already onboarded → /dashboard
```

---

## Admin Panel

The Admin Panel is a **fully separate application section** within the same Next.js project — different layout, collapsible sidebar, and amber/gold branding distinct from the user violet theme.

### Admin Credentials
| Field | Value |
|---|---|
| Email | `admin@fintrack.com` |
| Password | `admin123` |

### Admin Features

| Page | Key Features |
|---|---|
| **Dashboard** | Live user counter (auto-refreshes every 3s), area chart for 12-month user growth, animated SVG platform health ring, transaction trends bar chart, spending personality distribution, anomaly grid |
| **User Management** | Search by name/email, filter by status (active/suspended) and personality, sort by any column, click row for side-panel detail, per-row activate/suspend/delete, bulk checkbox operations |
| **Analytics** | DAU/MAU area chart, D1/D7/D30 retention line chart, top-5 power users table, spending personality pie chart |
| **Spending Analysis** | Horizontal bar chart by category, radar chart, monthly bar chart, anomaly detection grid, deep-dive table with avg transaction per category |
| **Transaction Management** | Global view of all transactions, bulk select and delete, edit individual rows |
| **Category Management** | Card grid with color accent bar, add/edit modal with 20 preset icons and 10 color swatches, delete with confirmation |
| **Reports & Export** | One-click CSV, JSON, and simulated PDF export, monthly summary bar chart, anomaly report stats, 4 AI-generated platform insights |
| **Notifications** | Compose with type selector (info/success/warning/alert), 4 quick-fill templates, send to all or specific users, notification history with read-rate progress bars |

---

## Animations

All animations use **Framer Motion v12** with spring physics for natural, physical feel.

### Layout
- **Floating background blobs** — Three blobs in `DashboardLayout` animate with slow `y` / `x` / `scale` loop keyframes (14–22 second cycles, `easeInOut`)
- **Page entrance** — Every page uses `staggerChildren` variants so sections cascade in on mount with spring physics

### Navbar (`FloatingNavbar`)
- Entrance: translates up from `y: 40` with `scale: 0.9 → 1`
- Active nav pill: `layoutId="nav-active-pill"` shared layout transition glides between tabs
- Active dot indicator: `layoutId="nav-dot"` shared layout transition
- Nav items: `whileHover={{ y: -2 }}` lift
- Theme toggle: `whileTap={{ scale: 0.88, rotate: 15 }}`; icon rotates on theme switch via `animate={{ rotate }}`

### Summary Cards (`SummaryCards.tsx`)
- Staggered spring entrance from `y: 20, opacity: 0`
- **Animated number counter** — `requestAnimationFrame` loop with ease-out cubic easing (`1 - (1-t)³`), each card delayed by `index × 100ms`
- Gradient blob appears on `group-hover` (opacity fade)
- Shimmer top-line slides in on hover
- Icon: `whileHover={{ rotate: 12, scale: 1.15 }}`
- Trend badge: springs in from `scale: 0`

### Transaction List
- Each row enters from `y: 10` with `AnimatePresence`
- Delete exit: `x: -20, height: 0` collapse
- `whileHover={{ x: 2 }}` nudge

### Spending Heatmap
- Each cell enters with `initial: scale: 0 → 1` and `delay = cellIndex × 0.002s` (creates a left-to-right wave)
- `whileHover={{ scale: 1.5 }}` zoom pop with spring

### Dashboard Cards (Budget, Goals, Insights, Recommendations)
- Progress bars: `width: 0 → target%` with `easeOut` on mount
- All rows: staggered spring slide-in (x or y)
- Insight/recommendation cards: `whileHover={{ x: 4, scale: 1.01 }}`
- Icons inside cards: `whileHover={{ rotate: 12, scale: 1.15 }}`

---

## State Management

Three Zustand v5 stores, all using `persist` middleware backed by `localStorage`.

### `useAppStore`
Handles global app state: role, theme, and onboarding.

```ts
state: { role, theme, onboarding, isOnboardingComplete }
actions: setRole, toggleTheme, setTheme, completeOnboarding, resetOnboarding, updateOnboarding
```

### `useTransactionStore`
The main data store for all user financial data.

```ts
state: { transactions, budgets, goals, filters, selectedIds }

computed:
  getFilteredTransactions()       // applies all active filters
  getMonthlyData()                // last 6 months aggregated
  getCategorySpending()           // totals per category
  getTotalIncome() / getTotalExpenses()
  getCurrentMonthBudgetUsage()    // spent vs limit per category

CRUD:
  addTransaction, updateTransaction, deleteTransaction, bulkDelete
  addGoal, updateGoal, deleteGoal
  updateBudget
  setFilters, toggleSelect, selectAll, clearSelection
  importTransactions, initializeMockData
```

### `useAdminStore`
Admin authentication and platform data management.

```ts
state: { users, categories, notifications, isAdminAuthenticated, isInitialized }
actions:
  adminLogin(email, password) → boolean
  adminLogout()
  initialize()                    // seeds mock data once
  addUser, updateUser, deleteUser
  addCategory, updateCategory, deleteCategory
  addNotification, markAsRead, deleteNotification
```

---

## Theming & Styling

Tailwind CSS v4 is used with the new `@import "tailwindcss"` format — **no `tailwind.config.ts` file** is needed. All design tokens are defined as CSS custom properties in `globals.css`.

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  /* ... all token mappings */
}

:root {
  /* Light theme */
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #f8fafc;
  --border: rgba(0,0,0,0.08);
  /* ... */
}

.dark {
  /* Dark theme */
  --background: #0a0a0f;
  --foreground: #f1f5f9;
  --card: #111118;
  --border: rgba(255,255,255,0.08);
  /* ... */
}
```

**Glass morphism** — `.glass-card` applies `backdrop-blur`, subtle border, and semi-transparent background. `.navbar-glass` is a stronger variant for the floating navbar.

**Gradient utilities** — `.gradient-primary` (violet → indigo), `.gradient-success` (emerald), `.gradient-warning` (amber), `.gradient-danger` (rose).

**Currency** — All values are formatted in Indian Rupees: `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`.

---

## Mock Data

### Transactions (`src/lib/mockData.ts`)
- **156 entries total**: 150 randomized transactions across all expense categories + 6 monthly salary income entries
- Each entry: `id`, `date`, `amount`, `category`, `type`, `notes`, `isAnomalous`
- **Anomaly detection**: transactions exceeding 2× the category mean are automatically flagged with `isAnomalous: true`
- Default budgets (per category) and default goals are seeded on first `initializeMockData()` call

### Admin Mock Data (`src/lib/adminMockData.ts`)
- **20 named users** with realistic profiles: spending personality, status (active/suspended), tags, join dates, transaction counts, total spend
- **12 months of user growth** data for charts
- **12 months of transaction trend** data
- **4 default notifications** (welcome message, security alert, feature announcements)

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| **Tailwind v4 with no config file** | Uses `@import "tailwindcss"` + `@theme inline` in CSS — config file not required; all tokens live in `globals.css` |
| **`motion.input` → plain `<input>`** | Framer Motion v12 types `onAnimationStart` as `(definition: AnimationDefinition) => void` which conflicts with the native HTML `AnimationEventHandler` type |
| **`type: "spring" as const`** | FM v12 `Variants` type requires the string literal `"spring"`, not a generic `string` |
| **No `ease: "easeOut"` in variant objects** | FM v12 does not accept `string` for `ease` inside variant `transition` definitions — transitions are set on the component `transition` prop instead |
| **`formatter={(v) => [formatCurrency(Number(v)), ""]}`** | Recharts v3 `formatter` receives `ValueType | undefined`, not `number` — explicit `Number()` cast required |
| **`OnboardingData` type in step props** | `ReturnType<typeof useAppStore>["onboarding"]` resolves to `unknown` in strict TypeScript; importing `OnboardingData` directly is the fix |
| **Admin panel fully separate layout** | `/admin/*` uses `AdminLayout` (sidebar + amber branding); user routes use `DashboardLayout` (floating navbar + violet branding) — completely isolated visual systems |
| **INR currency throughout** | Target market is India; `en-IN` locale with `₹` symbol |
| **No shadcn/ui CLI** | All UI primitives built from scratch (Button, Card, Input, Modal, Badge, Select, Skeleton) to avoid CLI conflicts with Tailwind v4 and Next.js 16 |
| **`useAnimatedCounter` with RAF** | CSS transitions cannot animate number text content — `requestAnimationFrame` with ease-out cubic gives smooth, performant counter animations |
