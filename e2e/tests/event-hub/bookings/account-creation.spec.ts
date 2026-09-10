/** @format */

import { test, expect } from "../../../fixtures/test";
import {
  EVENT_HUB_API,
  YAHOO_USER,
  GMAIL_USER,
  APP_URLS,
} from "../../../config/test-config";

import { loginToEventHub } from "../../../helpers/auth/event-hub-login";
import { EventHubApi } from "../../../helpers/api/event-hub-api";
/*
What you are testing: User A (Yahoo) creates a booking via a direct API call — no browser UI involved. User B (Gmail) logs in through the browser and tries to open that booking's URL directly. User B must see an "Access Denied" error.
*/

test.describe("Event Hub - Create Two accounts with api", () => {
  test(
    "Account one with yahoo email creates a booking via api, account two with gmail email tries to access the booking and gets access denied",
    { tag: ["@ui", "@api", "@auth", "@event-hub", "@bookingss"] },
    async ({ request, page }) => {
      // Preliminary setup: create two isolated accounts.
      for (const user of [YAHOO_USER, GMAIL_USER]) {
        const registerResponse = await request.post(EVENT_HUB_API.register, {
          data: user,
        });
        expect(registerResponse.ok()).toBeTruthy();
      }

      // Step 1 — Login as Yahoo user via API
      const eventHubApi = new EventHubApi(request);
      const yahooToken = await eventHubApi.login(YAHOO_USER);

      const authorzation = {
        Authorization: `Bearer ${yahooToken}`,
      };

      // Step 2 — Fetch events via API to get a valid event ID
      const eventId = await eventHubApi.getFirstEventID(yahooToken);

      // Step 3 — Create a booking via API as Yahoo user
      const yahooBookingId = await eventHubApi.createBooking(yahooToken, {
        eventId,
        customerName: "Yahoo User",
        customerEmail: YAHOO_USER.email,
        customerPhone: "11234567890",
        quantity: 1,
      });

      // Step 4 — Login as Gmail user via browser UI
      await loginToEventHub(page, GMAIL_USER);

      // Step 5 — Navigate to Yahoo's booking URL as Gmail user
      await page.goto(`${APP_URLS.eventHub.bookings}/${yahooBookingId}`, {
        waitUntil: "networkidle",
      });

      // Step 6 — Validate Access Denied
      await expect(
        page.getByText("Access Denied", { exact: true })
      ).toBeVisible();
    }
  );
});
