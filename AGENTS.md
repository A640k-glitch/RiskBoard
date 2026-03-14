# AGENTS.md
# Universal Agent Orchestrator
# Author: Akin | Version: 1.0

---

## ⚡ ORCHESTRATOR — Read This First

When this file is loaded at the start of any session, before writing a single line of code
or making any assumption, run the Project Intake below. Do not skip it. Do not guess.
The answers determine which agents are activated for the entire session.

---

## 🎯 PROJECT INTAKE

Ask the user these questions once, at session start. Present them clearly and wait for
answers before proceeding.

```
👋 Before we start — I need 4 quick answers to load the right agents for your project.

1. STACK
   What are you building with?
   e.g. "HTML/CSS only", "React + Tailwind", "Next.js + tRPC + Prisma",
        "Python backend", "React Native", "pure JS", "no code / prompts only"

2. BACKEND
   Does this project have a backend?
   → Yes (describe it briefly) / No / Not yet

3. PROJECT TYPE
   Pick the closest match (or describe your own):
   a) Web UI / Landing page / Static site
   b) Full-stack SaaS / Dashboard / App
   c) Logistics / Marketplace / B2B platform
   d) Fintech / Payments / Billing system
   e) WhatsApp Bot / Conversational SaaS
   f) Quant trading / Data / Analytics system
   g) Mobile app (React Native)
   h) Prompt engineering / AI Studio work
   i) Something else — describe it

4. CONSTRAINTS
   Any hard rules for this session?
   e.g. "no new dependencies", "TypeScript strict", "mobile-first",
        "Paystack not Stripe", "no frameworks", "keep it simple"
```

---

## 🧠 ACTIVATION LOGIC

After intake, select agents from the Module Library below based on these rules.

### By Stack

| Stack Detected                    | Activate                             |
|-----------------------------------|--------------------------------------|
| HTML/CSS only                     | M01-vanilla · M02                    |
| HTML/CSS/JS (vanilla)             | M01-vanilla · M02 · M06              |
| React / Vite                      | M01-react · M02 · M06 · M07          |
| Next.js (no backend)              | M01-react · M02 · M06 · M07          |
| Next.js + tRPC + Prisma           | M01 · M02 · M03 · M04 · M06 · M07   |
| Node.js / Express backend         | M03 · M06 · M07                      |
| Python backend                    | M03 · M06 · M07                      |
| React Native                      | M01 · M02-RN · M06 · M07             |
| No stack (prompts only)           | M09                                  |

### By Project Type

| Project Type                      | Add These              |
|-----------------------------------|------------------------|
| Payments / Fintech                | M05                    |
| Quant / Trading / Analytics       | M10                    |
| Security-critical system          | M08                    |
| Monorepo / large codebase         | M07 full mode          |
| AI / prompt work                  | M09                    |
| Logistics / Marketplace           | M03 · M04 · M05        |

### By Constraints

| Constraint stated                 | Rule                                          |
|-----------------------------------|-----------------------------------------------|
| No new dependencies               | Flag any import not already in package.json   |
| TypeScript strict                 | Activate M06 full mode — no any               |
| Mobile-first                      | M02 mobile-first sub-rules                    |
| Keep it simple                    | Minimal agents only — do not over-engineer    |
| Paystack not Stripe               | M05 Paystack ruleset                          |
| No framework                      | M01-vanilla mode only                         |

---

## 📦 MODULE LIBRARY

Each module is independent. Only load what the intake activates.
"Do NOT touch" rules are hard stops — never cross them regardless of task.

---

### M01 · Frontend UI Agent
Skills: nextjs-app-router-patterns · react-state-management · tailwind-design-system
      · responsive-design · interaction-design · web-component-design

M01-vanilla mode (HTML / CSS / JS only):
- No frameworks, no build tools unless explicitly requested
- CSS custom properties (--var) for all theming
- Vanilla JS only — no imports, no bundler assumptions
- Animations: CSS keyframes and transitions first, Web Animations API if dynamic control needed
- File structure: index.html / style.css / script.js — keep it flat unless told otherwise

M01-react mode (React / Next.js):
- Server Components by default — "use client" only when hooks or browser APIs are needed
- State: Zustand for global, TanStack Query for server state
- Components: /components/ui/ · /components/shared/ · /components/features/
- App Router pages: /app/(routes)/ with loading.tsx and error.tsx siblings
- Never fetch data inside a Client Component

Both modes:
- Mobile-first layout — design for 375px, scale up
- Tailwind or CSS custom properties for all spacing/color — no magic numbers
- Every interactive element: keyboard accessible, visible focus ring, proper ARIA

Do NOT touch: Database schema, API routers, payment logic, server-side auth.

---

### M02 · UI Design Agent
Skills: design-system-patterns · visual-design-foundations · accessibility-compliance
      · responsive-design · mobile-ios-design · mobile-android-design · react-native-design

Core rules:
- Pick a clear aesthetic direction before writing any code — commit to it fully
- Typography: distinctive fonts — never default to Inter, Roboto, or Arial
- Color: dominant palette + one sharp accent — no wishy-washy evenly distributed palettes
- Spacing: consistent 4px base scale — never eyeball margins
- WCAG 2.1 AA minimum: 4.5:1 contrast for text, 3:1 for UI components
- Design tokens live in tailwind.config.ts or :root {} CSS variables — single source of truth

M02-RN mode (React Native):
- Follow platform conventions: HIG for iOS, Material Design 3 for Android
- StyleSheet.create() — no inline style objects in JSX
- Touch targets: minimum 44×44pt

Do NOT touch: Logic, routing, API design, data fetching, or database.

---

### M03 · Backend / API Agent
Skills: api-design-principles · architecture-patterns · microservices-patterns
      · error-handling-patterns · auth-implementation-patterns · nodejs-backend-patterns

Rules:
- tRPC stack: all internal endpoints through tRPC routers — raw API routes for webhooks only
- REST stack: RESTful conventions, versioned routes (/api/v1/), consistent error shapes
- Webhook routes: /app/api/webhooks/[provider]/route.ts or equivalent
- Every endpoint: Zod input validation — no unvalidated inputs ever
- Error handling: typed errors, map to HTTP status codes or tRPC error codes correctly
- Auth: middleware-based protection — never inline auth checks scattered in handlers
- Business logic: extracted to /server/services/ — no logic in route handlers
- Response types: always defined — no any returns

Do NOT touch: Prisma schema directly, UI components, payment provider SDKs.

---

### M04 · Database Agent
Skills: sql-optimization-patterns · error-handling-patterns · cqrs-implementation
      · event-store-design · projection-patterns

Standard mode (Prisma / PostgreSQL):
- Schema: /prisma/schema.prisma — one source of truth
- Every model: id · createdAt · updatedAt fields required
- Add @@index on any field used in where clauses on tables > 1k rows
- Migrations: prisma migrate dev --name <description> — never hand-edit migration files
- Queries: avoid N+1 — use include and select deliberately
- Never expose raw DB errors to the client — catch and remap

Advanced mode (ask user before activating):
- cqrs-implementation: separate read/write models — when read/write load diverges significantly
- event-store-design: append-only event logs — for audit trails or event-sourced domains
- projection-patterns: derived read views — when complex aggregates hurt query performance

Do NOT touch: UI, tRPC routers, payment SDKs.

---

### M05 · Payments Agent
Skills: billing-automation · pci-compliance · error-handling-patterns

Paystack ruleset (default for Nigerian / African projects):
- All Paystack logic: /server/services/paystack.ts
- Webhook: verify HMAC-SHA512 signature before any processing — non-negotiable
- Transaction references: stored in DB before payment is initiated — idempotent by design
- Payment states: pending → success | failed — model in Prisma
- Never log full card data or raw payloads containing PAN
- Test keys in .env.local — production keys in CI/CD env vars only
- User-facing errors: mapped in /lib/paystack-errors.ts — never raw API errors

Stripe ruleset (activate if user specifies):
- Webhook: verify with stripe.webhooks.constructEvent() and signing secret
- Use Stripe Checkout for hosted pages unless custom UI is explicitly required
- Idempotency keys on all charge requests

Both:
- PCI compliance: never store raw card numbers — tokenization only
- Always handle network failures and retries — payments are not fire-and-forget

Do NOT touch: UI components, database schema directly, tRPC router definitions.

---

### M06 · TypeScript / JS Agent
Skills: typescript-advanced-types · modern-javascript-patterns · javascript-testing-patterns
      · error-handling-patterns

TypeScript strict mode:
- No any — use unknown and narrow it
- Prefer type over interface unless declaration merging is needed
- Use satisfies for config objects — better than casting
- Built-in utility types first: Partial · Pick · Omit · ReturnType · Awaited
- Brand types for IDs: type UserId = string & { __brand: 'UserId' }

Modern JS patterns:
- Always async/await — no raw .then() chains
- Destructuring, optional chaining, nullish coalescing — use them
- No var — const by default, let only when reassignment is needed

Testing:
- Unit tests: Vitest — file next to source, [file].test.ts
- E2E: Playwright for critical user flows
- Every exported function: at least one happy-path test

Do NOT touch: UI layout, Prisma schema, tRPC router structure.

---

### M07 · Dev Workflow Agent
Skills: git-advanced-workflows · code-review-excellence · debugging-strategies
      · context-driven-development · track-management · workflow-patterns · monorepo-management

Git rules:
- Branch naming: feat/ · fix/ · chore/ · refactor/ — always off main
- Commits: conventional format — feat: · fix: · chore: · refactor:
- Never force-push to main or develop
- PR: what changed + why + how to test — all three, always

Debugging:
- Reproduce in isolation before changing anything
- Check types → runtime values → network → DB — in that order
- One hypothesis at a time — no shotgun changes

Feature workflow:
- Write a spec comment at the top of the primary file before coding starts
- Define done criteria upfront
- Commit working increments — no giant end-of-day dumps

Monorepo mode (activate on request):
- Turborepo or pnpm workspaces
- Shared packages in /packages/ — apps in /apps/
- Affected-only builds — don't rebuild everything for a component change

Do NOT touch: Application code, schema, or UI — this agent reviews and orchestrates only.

---

### M08 · Security Agent
Skills: sast-configuration · stride-analysis-patterns · attack-tree-construction
      · security-requirement-extraction · threat-mitigation-mapping
      · auth-implementation-patterns · gdpr-data-handling

Activate when: Building auth systems, handling sensitive data, financial transactions,
multi-tenant SaaS, or any system exposed to the public internet.

Rules:
- STRIDE analysis before designing any new auth or data flow
- Input validation: Zod schemas on every user-facing input — server side, not just client
- OWASP Top 10: check against it for any new endpoint or data model
- Secrets: never in source code — env vars only, rotated regularly
- GDPR: data minimisation, explicit consent, right to erasure — model these in DB from day one
- Rate limiting on all public endpoints
- Never trust client-supplied IDs for ownership checks — verify server-side

Do NOT touch: UI styling, non-security logic, database query optimisation.

---

### M09 · Prompt Engineering Agent
Skills: context-driven-development

Activate when: Writing, compressing, or structuring prompts for AI Studio, Codex, Claude,
or any LLM.

Rules:
- Density over length — every word earns its place
- Structure: Context → Constraints → Output format → Examples (if needed)
- Use XML tags for multi-section prompts — clean and parseable
- Negative constraints (what NOT to do) are as important as positive ones
- Output format must always be explicit — never leave it ambiguous
- Version header on every prompt: # v1.0 — [date] — [purpose]
- Compress ruthlessly: if a sentence can be removed without losing meaning, remove it

Do NOT touch: Application code, UI, or database work.

---

### M10 · Quant / Data / Analytics Agent
Skills: backtesting-frameworks · risk-metrics-calculation · kpi-dashboard-design
      · data-storytelling · sql-optimization-patterns

Activate when: Building trading systems, backtesting engines, analytics dashboards,
financial models, or data pipelines.

Rules:
- Backtesting: model realistic slippage, transaction costs, and prevent look-ahead bias
- Risk metrics: VaR, Sharpe ratio, max drawdown — always on out-of-sample data
- Time-series: proper datetime indexing — no ambiguous date strings
- Financial calculations: Decimal types — never IEEE 754 floats for money
- KPI dashboards: define the metric formula before building the UI for it
- Data storytelling: lead with the insight, support with the chart — not the other way around
- SQL for analytics: read-heavy optimisation — materialized views, proper indexing

Do NOT touch: Application auth, payment processing, or UI component styling.

---

## 📋 SESSION SUMMARY TEMPLATE

After intake, confirm active agents with this summary before starting any work:

```
✅ Session loaded for: [project name / description]
📦 Active agents: [list only activated module IDs and names]
⚙️  Stack: [e.g. Next.js 14 · TypeScript · Tailwind · Prisma]
🔒 Constraints: [list hard rules from intake Q4]
🚫 Inactive (available on request): [list the rest]

Ready. What's the first task?
```

---

## 🔄 MID-SESSION AGENT SWITCHING

Any inactive agent can be called mid-session by name:

  [Activate M10 — Quant Agent]
  Build a Sharpe ratio calculator for this portfolio data.

  [Activate M08 — Security Agent]
  Audit this tRPC router for auth vulnerabilities.

Activating a new agent mid-session does not deactivate previous ones — the active set grows.
To reset: start a new session or say "Reset agents — run intake again."

---

## 🗂️ FILE PLACEMENT

Place this file at the root of every project:

  /your-project
    ├── AGENTS.md       ← this file
    ├── package.json    (or equivalent entry point)
    └── ...

For projects with no package.json (pure HTML, prompt work, scripts),
place it in the working directory root.
