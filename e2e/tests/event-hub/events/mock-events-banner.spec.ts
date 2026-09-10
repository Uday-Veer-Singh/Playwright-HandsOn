/** @format */

import { test, expect } from "../../../fixtures/test";
import {
  sixEventsResponse,
  fourEventsResponse,
} from "../../../data/mocks/event-response";
import { APP_URLS } from "../../../config/test-config";

test.describe("Event Hub - Mock Events Banner", () => {
  test(
    "a six-event API response displays the banner",
    { tag: ["@ui", "@network", "@event-hub", "@events"] },
    async ({ authenticatedEventHubPage: page }) => {
      await page.route("**/api/events*", async (route) => {
        await route.fulfill({ json: sixEventsResponse });
      });

      await page.getByTestId("nav-events").click();
      await expect(page).toHaveURL(APP_URLS.eventHub.events);

      const allEventCards = page.getByTestId("event-card");
      await expect(allEventCards.first()).toBeVisible();
      await expect(allEventCards).toHaveCount(6);

      const banner = page.getByText(/Your sandbox holds up to/i);
      await expect(banner).toBeVisible();
      await expect(banner).toHaveText(/9 bookings/i);
    }
  );

  test(
    "a four-event API response does not display the banner",
    { tag: ["@ui", "@network", "@event-hub", "@events"] },
    async ({ authenticatedEventHubPage: page }) => {
      await page.route("**/api/events*", async (route) => {
        await route.fulfill({ json: fourEventsResponse });
      });

      await page.getByTestId("nav-events").click();

      await expect(page).toHaveURL(APP_URLS.eventHub.events);

      const allEventCards = page.getByTestId("event-card");
      await expect(allEventCards.first()).toBeVisible();
      await expect(allEventCards).toHaveCount(4);

      const banner = page.getByText(/Your sandbox holds up to/i);
      await expect(banner).not.toBeVisible();
    }
  );
});
