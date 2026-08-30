# Architecture Rule

Evaluate responsibility boundaries before implementation.

Requirements:
- one clear owner per responsibility;
- one canonical business implementation;
- explicit imports/dependencies;
- no circular dependency;
- no accidental cross-domain state mutation;
- domain/business logic isolated from presentation and infrastructure where practical;
- no dumping-ground modules such as `utils`, `common`, or `manager` that accumulate unrelated behavior.

A new abstraction must solve a demonstrated problem. Do not add layers for appearance.
