# /release

Perform production release certification.

1. Read release rules and project baseline.
2. Run all mandatory quality gates.
3. Run full relevant test suite.
4. Run static/type/security/dependency checks supported by the stack.
5. Build using the repository's canonical production command.
6. Package/installer using the repository's actual release mechanism.
7. Validate production configuration and asset paths.
8. Launch the produced artifact where feasible.
9. Smoke-test critical user journeys.
10. Record exact version, commands, exit codes and artifact paths.
11. If any critical check fails, return `RELEASE BLOCKED`.
12. Otherwise return `RELEASE CERTIFIED`.
