# Unit tests (`node` environment)

This directory contains unit tests that run in the `node` test environment.
Use these tests for fast, isolated server-side checks that do not require
external services (databases, network, or third-party APIs). For tests that
exercise integrations or real services, use `tests/integration`.

### Run

```shell
pnpm run test:unit
```

or, with coverage:

```shell
pnpm run test:unit:coverage
```

### Guidelines

- File naming: `*.spec.ts`.
- Keep tests isolated, short, and focused.
- Aim for fast, deterministic assertions and avoid time-dependent flakiness.

### Configuration

- See [vitest-unit.config.ts](vitest-unit.config.ts) and [vitest-unit.setup.ts](vitest-unit.setup.ts).
