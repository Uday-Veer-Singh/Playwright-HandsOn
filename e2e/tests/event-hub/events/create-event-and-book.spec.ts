/** @format */

import type { Locator } from "@playwright/test";
import { test, expect } from "../../../fixtures/test";
import { APP_URLS } from "../../../config/test-config";
import { eventHubBookingCustomer } from "../../../data/event-hub";
import { EventHubBookingPage } from "../../../pages/event-hub/booking-page";

function futureDateValue(daysFromNow = 7): string {
  const futureDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().slice(0, 16);
}

async function readAvailableSeats(eventCard: Locator): Promise<number> {
  const seatText = await eventCard.getByText(/seat/i).innerText();
  const seatCount = seatText.match(/\d+/)?.[0];
  expect(seatCount, `No seat count found in: "${seatText}"`).toBeTruthy();
  return Number.parseInt(seatCount!, 10);
}

test(
  "creating and booking an event reduces its available seats",
  { tag: ["@ui", "@event-hub", "@events", "@bookings"] },
  async ({ authenticatedEventHubPage: page }) => {
    const eventTitle = `Test Event ${Date.now()}`;
    const bookingPage = new EventHubBookingPage(page);

    await page.goto(APP_URLS.eventHub.adminEvents);
    await page.getByTestId("event-title-input").fill(eventTitle);
    await page
      .getByRole("textbox", { name: /Describe the event/ })
      .fill("On-site interview with the business and DevOps managers");
    await page.getByRole("textbox", { name: /City/ }).fill("Toronto");
    await page.getByLabel(/Category/).selectOption("Workshop");
    await page
      .getByRole("textbox", { name: /Venue/ })
      .fill("York Street, Toronto");
    await page
      .getByRole("textbox", { name: /Event Date & Time/ })
      .fill(futureDateValue());
    await page.getByRole("spinbutton", { name: /Price/ }).fill("100");
    await page.getByRole("spinbutton", { name: /Total Seats/ }).fill("5");
    await page.getByTestId("add-event-btn").click();
    await expect(page.getByText("Event created!", { exact: false })).toBeVisible();

    await page.goto(APP_URLS.eventHub.events);
    const eventCards = page.getByTestId("event-card");
    await expect(eventCards.first()).toBeVisible();

    const eventCard = eventCards.filter({ hasText: eventTitle });
    await expect(eventCard).toBeVisible();
    const seatsBeforeBooking = await readAvailableSeats(eventCard);

    await eventCard.getByTestId("book-now-btn").click();
    await bookingPage.setTicketCount(1);
    const bookingReference = await bookingPage.submit(
      eventHubBookingCustomer
    );
    await bookingPage.openMyBookings();
    await expect(page).toHaveURL(APP_URLS.eventHub.bookings);

    const bookingCard = page.getByTestId("booking-card").filter({
      has: page.locator(".booking-ref", { hasText: bookingReference }),
    });
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard).toContainText(eventTitle);

    await page.goto(APP_URLS.eventHub.events);
    const updatedEventCard = page
      .getByTestId("event-card")
      .filter({ hasText: eventTitle });
    await expect(updatedEventCard).toBeVisible();
    const seatsAfterBooking = await readAvailableSeats(updatedEventCard);

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
  }
);
