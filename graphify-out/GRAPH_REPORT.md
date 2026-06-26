# Graph Report - .  (2026-06-26)

## Corpus Check
- Corpus is ~19,583 words - fits in a single context window. You may not need a graph.

## Summary
- 261 nodes · 454 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 41,007 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Scoring & Results View|Scoring & Results View]]
- [[_COMMUNITY_Shared UI, Theme & Chrome|Shared UI, Theme & Chrome]]
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Root Layout & Providers|Root Layout & Providers]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Architecture Docs & Decisions|Architecture Docs & Decisions]]
- [[_COMMUNITY_Upload & Screening Flow|Upload & Screening Flow]]
- [[_COMMUNITY_Design System (Capsule Hub)|Design System (Capsule Hub)]]
- [[_COMMUNITY_Dashboard & History Store|Dashboard & History Store]]
- [[_COMMUNITY_Favicon Mark|Favicon Mark]]
- [[_COMMUNITY_Clerk Middleware|Clerk Middleware]]
- [[_COMMUNITY_README  Project Overview|README / Project Overview]]
- [[_COMMUNITY_API Screen Proxy|API Screen Proxy]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `compilerOptions` - 16 edges
3. `Card()` - 11 edges
4. `normalizeScore()` - 11 edges
5. `Button` - 9 edges
6. `isQualified()` - 9 edges
7. `Logo()` - 7 edges
8. `useToast()` - 7 edges
9. `Aptiv Frontend (Resume Screening SaaS)` - 7 edges
10. `CandidateDetail()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `design-system-capsule-hub Skill` --semantically_similar_to--> `Capsule Hub Design System (DESIGN.md)`  [INFERRED] [semantically similar]
  SKILL (2).md → DESIGN.md
- `Design Tokens (SKILL)` --semantically_similar_to--> `Semantic Design Tokens`  [INFERRED] [semantically similar]
  SKILL (2).md → DESIGN.md
- `Strict Purple Palette` --semantically_similar_to--> `Color Palette Tokens`  [INFERRED] [semantically similar]
  context.md → DESIGN.md
- `WCAG 2.2 AA Accessibility (SKILL)` --semantically_similar_to--> `WCAG 2.2 AA Accessibility Requirements`  [INFERRED] [semantically similar]
  SKILL (2).md → DESIGN.md
- `DashboardPage()` --calls--> `useToast()`  [EXTRACTED]
  app/dashboard/page.tsx → components/ui/toast.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Upload to Webhook to Results Data Flow** — context_upload_flow, context_use_screening, context_screen_api_proxy, context_n8n_webhook, context_results_table [EXTRACTED 1.00]
- **Design Token Foundation** — design_color_palette, design_typography_scale, design_spacing_scale [EXTRACTED 1.00]

## Communities (19 total, 6 thin omitted)

### Community 0 - "Scoring & Results View"
Cohesion: 0.10
Nodes (24): formatDate(), ScreeningCard(), isQualified(), normalizeScore(), scoreTone, splitPhrases(), Candidate, ScreeningJob (+16 more)

### Community 1 - "Shared UI, Theme & Chrome"
Cohesion: 0.10
Nodes (22): compileShader(), createDoubleFBO(), createFBO(), createProgram(), DoubleFBO, FBO, GL, LiquidBlobBackground() (+14 more)

### Community 2 - "Landing Page Sections"
Cohesion: 0.09
Nodes (20): FEATURES, COLUMNS, Footer(), fade, Hero(), PILLS, ROTATING, HowItWorks() (+12 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.07
Nodes (26): dependencies, @clerk/nextjs, clsx, framer-motion, lucide-react, next, react, react-dom (+18 more)

### Community 4 - "Root Layout & Providers"
Cohesion: 0.11
Nodes (16): fraunces, geist, inter, metadata, Providers(), Theme, ThemeContext, ThemeContextValue (+8 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Architecture Docs & Decisions"
Cohesion: 0.15
Nodes (18): Webhook API Contract, Aptiv Frontend (Resume Screening SaaS), Clerk Authentication, Dark/Light Mode Theming, Liquid Blob WebGL2 Fluid Background, Aptiv Logo Component (ascending-A mark), Multi-tenancy Limitation (shared Sheet), n8n Webhook Backend (+10 more)

### Community 7 - "Upload & Screening Flow"
Cohesion: 0.19
Nodes (9): FileRejection, formatBytes(), isPdf(), validatePdfs(), useScreening(), FileList(), ProcessingState(), STAGES (+1 more)

### Community 8 - "Design System (Capsule Hub)"
Cohesion: 0.21
Nodes (12): WCAG 2.2 AA Accessibility Requirements, Capsule Hub Design System (DESIGN.md), Component State Rules, Semantic Design Tokens, Guideline Authoring Workflow, Quality Gates (must/should), Spacing Scale Tokens, Typography Scale (Inter) (+4 more)

### Community 9 - "Dashboard & History Store"
Cohesion: 0.35
Nodes (7): DashboardPage(), deleteJob(), getJob(), keyFor(), loadJobs(), saveJob(), useToast()

### Community 12 - "README / Project Overview"
Cohesion: 0.67
Nodes (3): Aptiv (Product Overview), Next.js Frontend App, Tech Stack (Next.js 15 / React 19 / TS)

## Knowledge Gaps
- **93 isolated node(s):** `size`, `inter`, `geist`, `fraunces`, `metadata` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Shared UI, Theme & Chrome` to `Scoring & Results View`, `Landing Page Sections`, `Root Layout & Providers`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `Button` connect `Landing Page Sections` to `Scoring & Results View`, `Dashboard & History Store`, `Shared UI, Theme & Chrome`, `Upload & Screening Flow`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Card()` connect `Landing Page Sections` to `Scoring & Results View`, `Dashboard & History Store`, `Shared UI, Theme & Chrome`, `Upload & Screening Flow`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `size`, `inter`, `geist` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Scoring & Results View` be split into smaller, more focused modules?**
  _Cohesion score 0.10042283298097252 - nodes in this community are weakly interconnected._
- **Should `Shared UI, Theme & Chrome` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.08712121212121213 - nodes in this community are weakly interconnected._