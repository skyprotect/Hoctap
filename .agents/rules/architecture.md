# Architecture Rule

Apply continuously.

## Principles
- High cohesion, low coupling.
- Explicit dependencies.
- One-way dependency flow.
- Stable domain rules independent of delivery/framework details.
- Feature/domain ownership must be obvious from the tree.
- Prefer composition over inheritance when practical.
- Avoid shared mutable state.
- Avoid "god" modules and dumping-ground files such as utils/common/helpers that accumulate unrelated behavior.

## Change locality
A normal feature should be understandable through a bounded context: its owning module/domain, a small set of direct dependencies and its tests.

If a small change requires touching many unrelated modules, treat it as an architecture smell and reassess before proceeding.

## Architecture drift
Any new circular dependency, global mutable state, duplicate business rule, unexplained dependency growth or major complexity increase is a quality failure unless documented by an ADR.
