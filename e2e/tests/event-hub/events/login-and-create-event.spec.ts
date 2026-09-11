/** @format */

import { APP_URLS } from "../../../config/test-config";
import { test, expect } from "../../../fixtures/test";

test(
  "an API-created event is visible to an authenticated user",
  { tag: ["@ui", "@api", "@fixtures", "@event-hub", "@events"] },
  async ({ authenticatedPage, createEvent }) => {
    await authenticatedPage.goto(APP_URLS.eventHub.events);
    await expect(authenticatedPage.getByTestId("event-card").filter({ hasText: createEvent.title })).toBeVisible();
  }
);
