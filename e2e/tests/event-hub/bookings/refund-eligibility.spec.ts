/** @format */

import { test, expect } from "../../../fixtures/test";
import { APP_URLS } from "../../../config/test-config";
import { eventHubBookingCustomer } from "../../../data/event-hub";
import { EventHubBookingPage } from "../../../pages/event-hub/booking-page";

const refundScenarios = [
  {
    ticketCount: 1,
    expectedStatus: "Eligible for refund",
    expectedReason: "Single-ticket bookings qualify for a full refund",
  },
  {
    ticketCount: 3,
    expectedStatus: "Not eligible for refund",
    expectedReason: "Group bookings (3 tickets) are non-refundable",
  },
] as const;

test.describe(
  "refund eligibility",
  { tag: ["@ui", "@event-hub", "@bookings"] },
  () => {
    for (const scenario of refundScenarios) {
      test(`${scenario.ticketCount}-ticket booking: ${scenario.expectedStatus}`, async ({
        authenticatedEventHubPage: page,
      }) => {
        const bookingPage = new EventHubBookingPage(page);

        await page.goto(APP_URLS.eventHub.events);
        const firstEventCard = page.getByTestId("event-card").first();
        await expect(firstEventCard).toBeVisible();
        await firstEventCard.getByTestId("book-now-btn").click();

        await bookingPage.setTicketCount(scenario.ticketCount);
        const bookingReference = await bookingPage.submit(
          eventHubBookingCustomer
        );
        await bookingPage.openMyBookings();
        await expect(page).toHaveURL(APP_URLS.eventHub.bookings);

        const bookingCard = page
          .getByTestId("booking-card")
          .filter({ hasText: bookingReference });
        await expect(bookingCard).toBeVisible();
        await bookingCard.getByRole("button", { name: "View Details" }).click();
        await expect(page.getByText("Booking Information")).toBeVisible();

        const detailReference = (
          await page.locator(".booking-ref").first().innerText()
        ).trim();
        const eventTitle = (await page.getByRole("heading", { level: 1 }).innerText()).trim();
        expect(detailReference[0]).toBe(eventTitle[0]);

        await page
          .getByRole("button", { name: "Check Refund Eligibility" })
          .click();
        const spinner = page.locator("#refund-spinner");
        await expect(spinner).toBeVisible();
        await expect(spinner).toBeHidden({ timeout: 6_000 });

        const result = page.locator("#refund-result");
        await expect(result).toBeVisible();
        await expect(result).toContainText(scenario.expectedStatus);
        await expect(result).toContainText(scenario.expectedReason);
      });
    }
  }
);
