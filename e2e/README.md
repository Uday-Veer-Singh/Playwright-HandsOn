# E2E test organization

The suite is organized first by **how a test works**, then by the application area when that adds useful context.

```text
e2e/
|-- tests/                 # Executable Playwright specs
|   |-- ui/                # Browser-only user journeys
|   |   |-- basics/
|   |   |-- ecommerce/
|   |   `-- event-hub/
|   |-- api/               # API-assisted setup followed by verification
|   |-- network/           # Request interception, response mocking, and blocking
|   |-- fixtures/          # Specs focused on custom Playwright fixtures
|   `-- auth/              # Authentication and storage-state scenarios
|-- fixtures/              # Custom Playwright test fixtures injected into specs
|-- helpers/               # Reusable actions that are not fixtures
|   |-- api/
|   `-- auth/
`-- data/                  # Typed request payloads and mock response bodies
    |-- api/
    `-- mocks/
```

## Where a new file belongs

| If the test mainly... | Put it in... |
| --- | --- |
| Drives the browser through a user journey | `tests/ui/` |
| Uses direct API calls for setup or validation | `tests/api/` |
| Uses `page.route()` to inspect, change, mock, or block traffic | `tests/network/` |
| Demonstrates or validates custom fixture behavior | `tests/fixtures/` |
| Reuses browser authentication or storage state | `tests/auth/` |
| Defines values injected through `test.extend()` | `fixtures/` |
| Provides reusable login or API operations | `helpers/` |
| Exports payloads or mock response objects | `data/` |

`create-order-and-verify.spec.ts` is in `tests/api/` because its distinguishing approach is API-created test setup, even though the final assertion is made in the UI.

`mock-events-banner.spec.ts` is kept as the current work-in-progress scaffold. It belongs in `tests/network/` because its intended approach is API response mocking; no missing assertions were invented during this folder-only reorganization.

## Run by approach

```powershell
npx playwright test
npx playwright test e2e/tests/ui
npx playwright test e2e/tests/api
npx playwright test e2e/tests/network
npx playwright test e2e/tests/fixtures
npx playwright test e2e/tests/auth
```

Use `npx playwright test --list` for a fast discovery and import check without running the browser scenarios.

## Naming conventions

- Use lowercase kebab-case filenames, ending executable specs with `.spec.ts`.
- Keep assertions in specs; extract only genuinely reusable actions into helpers or fixtures.
- Keep request payloads and mocked response bodies in `data/`, not in Playwright `fixtures/`.
- Add another application subfolder under `tests/ui/` when several UI specs cover the same application.
