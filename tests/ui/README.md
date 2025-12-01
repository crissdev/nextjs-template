# UI tests (component / browser)

This directory contains React component tests (component testing) that run in a
real browser using Playwright + Vitest. Use these tests for validating DOM behavior,
styling, accessibility, and user interactions of individual components or small
component compositions.

### Run

```shell
pnpm run test:ui
```

or, with coverage:

```shell
pnpm run test:ui:coverage
```

These scripts invoke Vitest with the UI/browser configuration (`vitest-ui.config.ts`) which uses Playwright to run tests in an actual browser.

> Note: Playwright browsers are installed automatically via the `postinstall` script in `package.json` (see `playwright install --with-deps`).

### Guidelines

- File naming: `*.spec.tsx` (React component tests).
- Keep tests focused on a single component or small composed UI.
- Prefer mounting components and asserting DOM, user interactions, and accessibility.
- Mock external services (network, databases) where possible — browser tests are slower than unit tests.
- Use Playwright's wait-for utilities rather than fixed time delays to keep tests deterministic.
- For faster feedback during development run Vitest in watch/headed mode by adjusting `vitest-ui.config.ts`.

### Configuration

- Test runner: Vitest with `vitest-ui.config.ts`.
- Browser runner: Playwright (running real browser instances).
- Default browser: Chrome/Chromium is configured as the default in the project's UI test config (`vitest-ui.config.ts`).

If you need to run tests in a different browser, update the Playwright/vitest UI config accordingly.
