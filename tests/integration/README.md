# Integration tests

This directory contains integration tests that validate the interaction between multiple system components,
external services, and database operations. These tests ensure that different parts of the application
work correctly together in a near-production environment.

### Run

```shell
pnpm run test:integration
```

or, with coverage:

```shell
pnpm run test:integration:coverage
```

### Guidelines

- Files naming: `*.integration.ts`

### Configuration

- See [vitest-integration.config.ts](vitest-integration.config.ts) and [vitest-integration.setup.ts](vitest-integration.setup.ts)
