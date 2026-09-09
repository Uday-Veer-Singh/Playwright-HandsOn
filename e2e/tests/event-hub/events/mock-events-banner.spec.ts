/** @format */

import { test, expect } from "../../../fixtures/test";
import {
  sixEventsResponse,
  fourEventsResponse,
} from "../../../data/mocks/event-response";
import { loginToEventHub } from "../../../helpers/auth/event-hub-login";

test.describe.only("Event Hub - Mock Events Banner", () => {
  test(
    "a six-event API response displays the banner",
    { tag: ["@ui", "@network", "@event-hub", "@events"] },
    async ({ authenticatedEventHubPage: page }) => {
      await page.route("**/api/events", (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(sixEventsResponse),
        });
      });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await loginToEventHub(page);

      const allEventCards = page.getByTestId("event-card");
      await expect(allEventCards.first()).toBeVisible();
      await expect(allEventCards).toHaveCount(6);

      await page.getByTestId("nav-events").click();
      const banner = page.getByText(/Your sandbox holds up to/i);
      await expect(banner).toBeVisible();
      await expect(banner).toHaveText(/9 bookings/i);
    }
  );

  test(
    "a four-event API response does not display the banner",
    { tag: ["@ui", "@network", "@event-hub", "@events"] },
    async ({ authenticatedEventHubPage: page }) => {
      await page.route("**/api/events", (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(fourEventsResponse),
        });
      });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await loginToEventHub(page);

      const allEventCards = page.getByTestId("event-card");
      await expect(allEventCards.first()).toBeVisible();
      await expect(allEventCards).toHaveCount(4);

      await page.getByTestId("nav-events").click();
      const banner = page.getByText(/Your sandbox holds up to/i);
      await expect(banner).not.toBeVisible();
    }
  );
});
