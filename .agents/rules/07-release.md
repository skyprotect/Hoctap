# Release Rule

Never equate `build PASS` with `release PASS`.

Release requires evidence for:
- full relevant quality gates;
- tests;
- production build;
- package/installer when applicable;
- critical runtime smoke tests;
- clean production configuration;
- no unresolved critical blocker.
