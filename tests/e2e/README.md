# End-to-End (E2E) Tests

This directory contains end-to-end tests using Playwright Test Runner. These tests
validate the application's behavior from a user's perspective by running tests
against a complete, deployed version of the application.

### Run

```shell
pnpm run test:e2e
```

or, with UI:

```shell
pnpm run test:e2e:ui
```

### Guidelines

- File naming: `*.spec.ts`
- Use `auth.setup.ts` to authenticate and save the authentication state.
- Check `playwright.config.ts` for configuration options and storage of the authentication state.

### Configuration

If you need to run tests in a different browser, update the Playwright config accordingly.
