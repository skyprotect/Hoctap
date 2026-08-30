# Release Workflow

1. Read release rule.
2. Run repository quality gates.
3. Run full automated tests.
4. Run typecheck/lint/security checks supported by the stack.
5. Run production build.
6. Package/installer using the repository's existing release mechanism.
7. Validate production paths and assets.
8. Launch the produced artifact.
9. Smoke-test critical user journeys.
10. Record exact artifact path/version and verification evidence.
11. Block release on critical failure.
12. Only then issue RELEASE CERTIFIED.
