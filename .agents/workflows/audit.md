# /audit

Perform an adversarial forensic quality audit. The purpose is to discover problems, not to confirm the system is good.

Check:
- functionality and edge cases;
- regression risk;
- state/event consistency;
- async/race conditions;
- duplicate logic;
- dead/orphan files;
- dependency/circular dependency;
- architecture drift;
- complexity and file growth;
- security;
- accessibility where applicable;
- data integrity;
- build/release integrity.

For each finding record:
`Severity | Evidence | Root Cause | Impact | Recommended Fix | Regression Test | Status`

Fix critical issues that are safely within scope, then re-run affected gates. Do not hide unresolved defects.
