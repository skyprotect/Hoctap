# Universal AI Engineering Standard v2 — Antigravity Edition

## Use in a new project

1. Copy `AGENT.md` and `.agents/` into the project root.
2. Copy `docs/`, `scripts/`, `.github/`, and `release/` when applicable.
3. Open the project in Google Antigravity.
4. Run:

`/bootstrap-engineering`

5. After the baseline is certified, use:

- `/feature`
- `/bug-fix`
- `/audit`
- `/release`

## Important

This kit is universal. Project-specific rules belong in `.agents/rules/` and project-specific ADRs in `docs/adr/`.

Do not treat line-count limits as a mechanical design target. Use them as early-warning/review gates alongside cohesion, coupling, complexity, dependency direction, duplication, dead code, testability, and change locality.

Do not invent test/build/release commands. The bootstrap workflow must discover the real commands from the repository.
