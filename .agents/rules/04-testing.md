# Testing Rule

Bug fix:
`REPRODUCE → FAILING TEST → FIX → PASS → REGRESSION`

Refactor:
`BASELINE → CHARACTERIZE → REFACTOR → COMPARE → FULL TEST`

Never:
- delete a failing test to get green;
- weaken assertions without evidence;
- silently skip coverage;
- mock away the behavior being tested.
