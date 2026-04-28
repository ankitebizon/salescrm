# SalesCRM

A modern, production-ready CRM built with Next.js 14, Supabase, and Prisma — deployable to Vercel in minutes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth & DB Host | Supabase |
| ORM | Prisma |
| UI | Tailwind CSS + shadcn/ui |
| State | Zustand + React Query |
| Charts | Recharts |
| Deployment | Vercel |
| AI Dev | Claude Code (GitHub) |

## Features

- **Dashboard** — KPI cards, revenue vs target chart, activity feed, recent deals table
- **Pipeline / Deals** — Kanban board with drag-and-drop, deal detail view, activity timeline
- **Contacts** — Table with search + status filters, contact profile
- **Accounts** — Card grid view with industry grouping and pipeline rollup
- **Activities** — Upcoming and completed tasks, calls, emails, meetings
- **Reports** — Revenue by month, pipeline by stage (pie), rep performance (bar)
- **Auth** — Supabase Auth with email/password, route protection via middleware
- **Multi-tenant** — Row Level Security keeps each organization's data isolated

## Project Structure

```
src/
├── app/
│   ├── api/                  # REST API routes
│   │   ├── auth/callback/    # Supabase OAuth callback
│   │   ├── contacts/         # CRUD
│   │   ├── deals/            # CRUD + [id]
│   │   ├── accounts/         # CRUD
│   │   ├── activities/       # CRUD
│   │   ├── pipelines/        # GET
│   │   └── dashboard/stats/  # Aggregated KPIs
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   └── dashboard/
│       ├── page.tsx          # Dashboard
│       ├── deals/            # Pipeline + [id] detail
│       ├── contacts/
│       ├── accounts/
│       ├── activities/
│       ├── reports/
│       └── settings/
├── components/
│   ├── auth/                 # LoginForm, RegisterForm
│   ├── crm/                  # DashboardStats, PipelineBoard, ContactsTable, etc.
│   ├── layout/               # Sidebar, Header, UserMenu
│   ├── providers/            # QueryProvider
│   └── ui/                   # Button, Input, Badge, Avatar, Toast, etc.
├── hooks/
│   └── use-crm.ts            # React Query hooks for all entities
├── lib/
│   ├── prisma.ts             # Prisma singleton
│   ├── supabase.ts           # Supabase client (client + server)
│   ├── store.ts              # Zustand global store
│   └── utils.ts              # cn(), formatCurrency(), formatDate(), etc.
├── types/
│   └── index.ts              # TypeScript interfaces
└── middleware.ts             # Auth guard
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/salescrm.git
cd salescrm
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database** and copy the connection strings
3. Go to **Project Settings → API** and copy the URL + anon key

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Push the database schema

```bash
npm run db:generate   # generates Prisma client
npm run db:push       # pushes schema to Supabase
```

### 5. Enable RLS policies

In the Supabase SQL editor, run the contents of:
```
supabase/migrations/001_rls_policies.sql
```

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 7. Deploy to Vercel

```bash
npx vercel
```

Add all `.env.local` values as Environment Variables in the Vercel dashboard.

## Using Claude Code

This project is optimized for development with Claude Code on GitHub.

### Setup

```bash
npm install -g @anthropic-ai/claude-code
claude-code auth
```

### Useful prompts

```bash
# Add a new module
claude "Add a Quotes module with line items. Use the existing Deal pattern."

# Generate a form
claude "Create a CreateDealForm component with react-hook-form and zod validation."

# Write tests
claude "Write Jest tests for the deals API route covering auth, CRUD, and RLS."

# Optimize queries
claude "Review the contacts API route and add pagination + index hints."
```

### GitHub Actions integration

Create `.github/workflows/claude-review.yml` to auto-review PRs:

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude Review
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Database Schema

```
organizations  ←─ users
     │
     ├── contacts   ←── accounts
     ├── accounts
     ├── deals      ←── pipeline_stages ←── pipelines
     ├── activities ←── deals / contacts / accounts
     └── pipelines  ←── pipeline_stages
```

All tables have `organization_id` for multi-tenancy with Supabase RLS.

## Roadmap

- [ ] Drag-and-drop Kanban (dnd-kit)
- [ ] Email integration (Resend)
- [ ] CSV import/export
- [ ] Custom pipeline stages UI
- [ ] Mobile responsive layout
- [ ] Notification system
- [ ] AI deal summary (Claude API)
- [ ] Two-factor authentication

## License

MIT
