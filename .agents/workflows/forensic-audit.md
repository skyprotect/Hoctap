# Forensic Audit Workflow

Goal: find defects, regressions, architectural drift and repository pollution.

1. Inventory source tree and build system.
2. Identify large/high-complexity modules.
3. Analyze dependency graph and circular dependencies.
4. Detect duplicate implementations.
5. Detect dead/orphan files and unused exports where tooling allows.
6. Search for obsolete/legacy/backup/temp artifacts.
7. Review global state and side effects.
8. Review state/event ownership.
9. Review API contracts.
10. Review critical data invariants.
11. Run full automated tests.
12. Add targeted regression tests for discovered defects.
13. Fix root causes.
14. Re-run all checks.
15. Produce a prioritized findings table:
   Severity | Evidence | Root Cause | Fix | Regression Test | Status
