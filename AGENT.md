# AGENT.md — Universal AI Engineering Constitution v2

> This repository is governed by evidence, modular architecture, automated quality gates, and release verification.

## 1. Mission

Keep the system correct, maintainable, testable, secure, observable, accessible where applicable, and easy for humans and AI agents to change as it grows.

## 2. Non-negotiable rules

1. Source code and executable evidence outrank reports, comments, and previous AI claims.
2. Never delete, skip, weaken, or rewrite tests merely to obtain green status.
3. Search before adding code. Do not duplicate business rules.
4. Prefer `DELETE → SIMPLIFY → REUSE → CONSOLIDATE → EXTRACT → ADD`.
5. Do not create mega-files or split files mechanically to satisfy a line-count target.
6. Every business responsibility has a clear owner and canonical implementation.
7. Avoid global mutable state. Any necessary global state requires explicit justification.
8. No circular dependencies.
9. Preserve public contracts unless an intentional migration is documented and verified.
10. Temporary migration code must have a removal condition and must not become permanent architecture.
11. Obsolete, duplicate, backup, scratch, and orphan production code must be removed after verified migration.
12. Bug fixes should include a regression test whenever practical.
13. Risky refactors require characterization tests before behavior changes.
14. Do not claim PASS, DONE, CERTIFIED, or RELEASED without evidence.
15. A failed quality gate blocks completion until fixed or formally excepted.

## 3. Evidence states

Use only:

- `PASS` — verified by an executable check or direct inspection with evidence.
- `FAIL` — verified defect or failed gate.
- `UNVERIFIED` — evidence is unavailable or insufficient.
- `N/A` — genuinely not applicable.

Never convert `UNVERIFIED` to `PASS`.

## 4. Architecture

Default conceptual flow:

`Presentation → Application → Domain → Infrastructure`

The actual project may use a different structure when justified by an ADR. Inner/domain logic must not depend unnecessarily on UI, browser, transport, or infrastructure implementation details.

Favor high cohesion, low coupling, explicit dependencies, one-way dependency flow, clear ownership, and bounded change locality.

## 5. Size and complexity

LOC is an early-warning metric, not a design target.

Typical review bands:

- JS/TS: 100–250 green, 250–400 review, >400 investigate/refactor.
- HTML: 50–200 green, 200–300 review, >300 investigate/refactor.
- CSS: 50–250 green, 250–350 review, >350 investigate/refactor.

Do not split a cohesive module simply to hit a number. Conversely, a small file with multiple unrelated responsibilities is still an architecture defect.

Always evaluate cohesion, coupling, cyclomatic/cognitive complexity, dependencies, public API surface, change frequency, and testability.

## 6. AI operating protocol

Before changing code:

`READ → DISCOVER → SEARCH → PLAN → CHANGE`

After changing code:

`TEST → STATIC CHECK → INSPECT → CLEAN → RE-TEST → REPORT`

Read the smallest bounded context needed for the task. Do not load the entire repository unless the task genuinely requires it.

## 7. Quality and release

A task is complete only after relevant tests and gates pass. A release is complete only after production build/package and runtime smoke validation pass where applicable.

## 8. Scope discipline

Do not perform unrelated rewrites. When a structural defect blocks correctness, fix the root cause, but preserve existing business behavior unless the task explicitly changes it.
