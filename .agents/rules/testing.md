# Testing Rule

Every feature or bug fix must have appropriate verification.

## Bug fix
REPRODUCE -> FAILING TEST -> FIX -> PASS -> REGRESSION CHECK

## Refactor
CHARACTERIZE behavior -> REFACTOR -> COMPARE -> FULL TEST

## Test layers
- Unit
- Integration
- End-to-end where applicable
- Static/type checks
- Build/package checks
- Production smoke tests

Never weaken assertions, skip tests or remove coverage merely to obtain green status.
