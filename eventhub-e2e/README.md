# EventHub E2E framework

This isolated Playwright framework creates a unique event, books one ticket,
verifies the booking record, and confirms that available seats decrease by one.

## Setup

1. Create your own account at `https://eventhub.rahulshettyacademy.com`.
2. Copy `.env.example` to `.env` inside this directory.
3. Replace the example email and password with your account credentials.

The `.env` file is ignored by Git and must not be committed.

## Run

From the repository root:

```powershell
npx playwright test --config=eventhub-e2e/playwright.config.ts
```

Open Playwright UI mode:

```powershell
npx playwright test --config=eventhub-e2e/playwright.config.ts --ui
```

Open the latest HTML report:

```powershell
npx playwright show-report playwright-report/eventhub
```
