# Refactor Workflow

1. Establish baseline tests/build.
2. Define the architectural problem.
3. Map responsibility and dependencies.
4. Create characterization tests if behavior is sensitive.
5. Extract by domain responsibility, not by line count.
6. Keep public contracts stable unless intentionally migrated.
7. Migrate callers incrementally.
8. Delete obsolete implementation after verification.
9. Check duplicates and dead files.
10. Re-run targeted and full tests.
11. Compare complexity/file growth.
12. Record significant decisions in ADRs.
