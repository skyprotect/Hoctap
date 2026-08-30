# /bootstrap-engineering

You are establishing the engineering baseline of an existing repository. Do not rewrite business behavior during this workflow.

## Objective
Create a verified, reproducible architecture and quality baseline for this project and configure the smallest practical set of automated gates for its actual technology stack.

## Mandatory execution

### Phase 1 — Discover
Inspect repository configuration and actual files. Determine:
- OS/runtime/languages;
- package manager;
- frameworks/libraries;
- database/storage;
- test framework;
- build system;
- packaging/release system;
- entry points;
- source/test roots;
- generated/vendor paths;
- CI configuration.

Never invent commands. Use commands discovered from the repository.

### Phase 2 — Baseline
Create or update `docs/adr/001-architecture-baseline.md` using evidence-backed facts.
Every important claim must be `FACT`, `EVIDENCE`, or `UNKNOWN`.

### Phase 3 — Forensics
Inspect:
- large/high-complexity modules;
- duplicate implementations;
- orphan/dead candidates;
- old/backup/scratch artifacts;
- dependency graph;
- circular dependencies;
- global mutable state;
- public/legacy APIs;
- build/release references.

Do not delete files based only on filenames.

### Phase 4 — Gates
Configure only gates supported by the actual stack. At minimum evaluate:
- static/type checks;
- tests;
- dependency/circular checks;
- duplicate/dead-code checks where tooling is available;
- complexity/file-growth checks;
- security checks;
- production build;
- runtime/release checks where applicable.

### Phase 5 — Execute
Run all configured gates. Record command, exit code, result, and evidence path.

### Phase 6 — Self-audit
Act as an independent reviewer and challenge the baseline. Search specifically for false PASS conditions, stale files, missing tests, broken dynamic references, and runtime-only defects.

### Phase 7 — Certification
Return `BASELINE CERTIFIED` only if all mandatory checks PASS. Otherwise return `BASELINE NOT CERTIFIED` and list blockers. Do not disguise `UNVERIFIED` as PASS.

## Output
Create/update:
- `docs/adr/001-architecture-baseline.md`
- project-specific quality-gate configuration
- machine-readable evidence under `docs/quality/` or `.quality/`

Do not change production behavior unless required to make a broken quality gate truthful; if so, explain the change and add tests.
