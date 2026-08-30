# Universal AI Engineering Standard

Copy this package into a new repository, then customize only the project-specific parts.

## Quick start

1. Copy `.agents/` and `AGENT.md` into the project root.
2. Add project-specific rules under `.agents/rules/`.
3. Add the relevant stack checks under `scripts/quality/`.
4. Create `docs/adr/001-architecture-baseline.md`.
5. Connect the quality checks to CI.
6. Use workflows:
   - `/new-feature`
   - `/bug-fix`
   - `/forensic-audit`
   - `/refactor`
   - `/release`

## Important

Do not treat the LOC thresholds as a mechanical formatting rule.
Use them as review gates together with cohesion, coupling, complexity, dependency direction, duplication, dead code and change locality.

## Antigravity

This package is structured around Antigravity workspace conventions:
- `.agents/rules/`
- `.agents/workflows/`
- `.agents/agents/`
- `.agents/skills/`

Keep global, reusable principles separate from project-specific rules.

## First setup task for a new project

Ask the agent to:
"Read AGENT.md and `.agents/`. Audit the repository, establish the architecture baseline, create ADR-001, configure quality gates for this stack, and do not change production behavior until the baseline is recorded."
