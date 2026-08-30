# AGENT.md — Universal AI Engineering Constitution

Status: Mandatory
Scope: Entire repository

## Mission
Keep the codebase correct, modular, testable, secure, maintainable and easy for AI agents to modify.

## Non-negotiable rules
1. Source code is the source of truth. Do not trust old reports or prior AI claims without verification.
2. Never delete tests to make a change pass.
3. Never hide errors with empty catches, silent fallbacks or arbitrary retries.
4. Never duplicate business logic. Search before implementing.
5. Never create a mega-file or split files mechanically just to satisfy LOC.
6. Prefer delete/simplify/reuse/consolidate before adding new abstractions.
7. Every business responsibility has one clear owner and one canonical implementation.
8. Avoid global mutable state. New global state requires explicit architectural justification.
9. No circular dependencies.
10. Domain/business logic must not depend directly on UI/framework/infrastructure details.
11. Every bug fix should include a regression test where practical.
12. Every risky migration must preserve behavior through characterization tests.
13. Temporary migration code must have an explicit removal condition.
14. Obsolete/duplicate/orphan files must be deleted after migration is verified.
15. Do not change public contracts silently.
16. Do not claim DONE without evidence from tests, static checks and build/release validation.

## File size policy
LOC is a signal, not the goal.
Typical review bands:
- Green: 100–250 LOC for JS/TS business modules
- Yellow: 250–400 LOC: review cohesion and complexity
- Red: >400 LOC: investigate and normally refactor
Do not split a cohesive module mechanically just to hit a number.
Do not keep a fragmented design merely because every file is small.

## Before coding
- Identify domain, module owner, state owner, dependencies and tests.
- Search for existing implementations.
- Read the minimum relevant context.
- State the smallest safe change.

## After coding
- Run targeted tests.
- Run relevant static checks.
- Run full tests before release.
- Verify no obsolete files, duplicates or unintended API changes remain.

## Definition of done
A task is complete only when behavior is correct, tests pass, architecture rules remain valid, obsolete code is removed and production build/release validation succeeds.
