# Capsule Hub

## Mission
Create implementation-ready, token-driven UI guidance for Capsule Hub that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Capsule Hub
- URL: https://capsulehub.tilantra.com/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=88px`
- Color palette: `color.text.primary=#020817`, `color.text.secondary=#475569`, `color.text.tertiary=#0f172a`, `color.surface.muted=#ffffff`, `color.surface.base=#000000`, `color.surface.raised=#2563eb`, `color.surface.strong=#7c3aed`, `color.border.default=#e2e8f0`, `color.border.muted=#cbd5e1`, `color.border.strong=#c7d2fe`
- Spacing scale: `space.1=4px`, `space.2=8px`, `space.3=16px`, `space.4=24px`, `space.5=32px`, `space.6=56px`, `space.7=96px`, `space.8=128px`
- Radius/shadow/motion tokens: `radius.xs=10px`, `radius.sm=12px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(99, 102, 241, 0.25) 0px 10px 15px -3px, rgba(99, 102, 241, 0.25) 0px 4px 6px -4px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`, `shadow.4=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(59, 130, 246, 0.4) 0px 10px 30px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (9), buttons (8), inputs (1), cards (1), navigation (1).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
