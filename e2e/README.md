# E2E architecture

The executable specs are grouped by application and feature—the behavior they protect. Technical concerns such as UI, API setup, authentication, network interception, and custom fixtures are represented with tags and reusable support code.

```text
e2e/
|-- tests/                         # Executable specifications
|   |-- angular-practice/
|   |-- client-app/
|   |   |-- authentication/
|   |   |-- catalog/
|   |   |-- checkout/
|   |   `-- orders/
|   |-- event-hub/
|   |   |-- bookings/
|   |   `-- events/
|   `-- practice/
|-- config/
|   `-- test-config.ts             # URLs, API routes, and test accounts
|-- fixtures/
|   `-- test.ts                    # Composable Playwright fixtures
|-- helpers/
|   |-- api/                       # Domain API clients
|   `-- auth/                      # Reusable login operations
|-- pages/
|   |-- client-app/                # Reused catalog and order behavior
|   `-- event-hub/                 # Reused booking behavior
`-- data/                          # Typed payloads and mocked responses
```

## DRY boundaries

- Specs contain business intent and assertions.
- Fixtures create isolated preconditions and automatically follow Playwright's test lifecycle.
- Page objects contain stable page behavior reused by multiple specs.
- Helpers contain reusable operations that do not need fixture lifecycle management.
- Config is the single source of truth for URLs, API routes, and credentials.
- Data modules contain request payloads and mocked responses, not browser actions.

Do not extract a one-off test step merely to reduce line count. Extract behavior when it is repeated and has one stable meaning.

## Custom fixtures

Import the shared `test` when a spec needs one of these preconditions:

| Fixture | Provides |
| --- | --- |
| `authenticatedClientPage` | A client-app page authenticated through the UI |
| `apiToken` | An API authentication token |
| `apiCreatedOrder` | An isolated order created through the API |
| `apiAuthenticatedClientPage` | A client-app page authenticated with the API token |
| `authenticatedEventHubPage` | An EventHub page authenticated through the UI |

```ts
import { test, expect } from "../../../fixtures/test";
```

Tests that need only Playwright's built-in fixtures should continue importing from `@playwright/test`.

## Tags

Tags describe cross-cutting execution types without controlling the folder layout:

- `@ui` — browser behavior
- `@api` — direct API interaction or API-created setup
- `@network` — request interception or response mocking
- `@auth` — authentication or storage-state behavior
- Application and feature tags such as `@client-app`, `@event-hub`, `@orders`, and `@checkout`

## Commands

```powershell
npm run test:e2e
npm run test:e2e:list
npm run test:e2e:ui
npm run test:e2e:api
npm run test:e2e:network
npm run test:e2e:auth
npm run test:e2e:fixtures
```

You can also select a feature directly:

```powershell
npx playwright test --grep "@client-app"
npx playwright test --grep "@event-hub"
npx playwright test --grep "(?=.*@client-app)(?=.*@orders)"
```

## Configuration overrides

The committed demo values remain defaults so the existing suite keeps working. Set these environment variables locally or in CI to use different accounts without changing test files:

- `CLIENT_APP_EMAIL`
- `CLIENT_APP_PASSWORD`
- `EVENT_HUB_EMAIL`
- `EVENT_HUB_PASSWORD`
- `PRACTICE_USERNAME`
- `PRACTICE_PASSWORD`

`mock-events-banner.spec.ts` derives its six-event and four-event scenarios from one typed event dataset.

Authentication state created by `storage-state.spec.ts` is written to that test's temporary output directory and cleaned by Playwright. Authentication state is never shared through a committed root-level JSON file.
