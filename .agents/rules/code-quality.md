# Code Quality Rule

## Required
- Small, meaningful functions.
- Clear names.
- Explicit error handling.
- No commented-out legacy code.
- No debug-only artifacts in production code.
- No duplicated constants/business rules.
- No unnecessary wrappers, managers or service layers.
- Keep side effects at explicit boundaries.
- Prefer pure functions for business rules when practical.

## Complexity
Review cyclomatic/cognitive complexity, nesting depth, public API size, dependency count and change frequency.

LOC alone is never sufficient to approve or reject a refactor.
