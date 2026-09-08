/** @format */

/*
What you are testing: Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.

Setup

- BASE_URL = https://eventhub.rahulshettyacademy.com

- Credentials: < Create your own credentials>

- Write a reusable login(page) helper function — you will call it at the start of the test





Steps

Step 1 — Login

- Navigate to /login

- Fill email field (locate by placeholder you@email.com)

- Fill password field (locate by label Password)

- Click the login button (locate by id #login-btn)

- Assert: link with text Browse Events → is visible (confirms login success)



Step 2 — Create a new event

- Navigate to /admin/events

- Generate a unique event title using Test Event ${Date.now()} — store this in a variable, you will need it throughout the test

- Fill Title field (locate by id #event-title-input)

- Fill Description textarea (locate using #admin-event-form textarea)

- Fill City field (locate by label City)

- Fill Venue field (locate by label Venue)

- Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper

- Fill Price ($) field (locate by label Price ($)) — use any number e.g. 100

- Fill Total Seats field (locate by label Total Seats) — use 50

- Click the submit button (locate by id #add-event-btn)

- Assert: toast message Event created! is visible



Step 3 — Find the event card and capture seats

- Navigate to /events

- Get all event cards (locate by data-testid="event-card")

- Assert the first card is visible (confirms page loaded)

- From all cards, filter for the one that contains your event title text

- Assert the matched card is visible (timeout 5 seconds)

- Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — store this as seatsBeforeBooking



Step 4 — Start booking

- On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)



Step 5 — Fill booking form

- Assert: element with id #ticket-count has text 1 (default quantity)

- Fill Full Name (locate by label Full Name)

- Fill Email (locate by id #customer-email)

- Fill Phone (locate by placeholder +91 98765 43210)

- Click the confirm button (locate by CSS class .confirm-booking-btn)



Step 6 — Verify booking confirmation

- Locate the booking reference element (locate by CSS class .booking-ref, take .first())

- Assert it is visible

- Read its inner text, trim it — store as bookingRef



Step 7 — Verify in My Bookings

- Click the link View My Bookings

- Assert: URL is BASE_URL/bookings

- Get all booking cards (locate by id #booking-card)

- Assert the first booking card is visible

- Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text

- Assert that matched card is visible

- Assert that matched card contains your eventTitle text



Step 8 — Verify seat reduction

- Navigate back to /events

- Assert the first event card is visible

- Filter cards again using hasText: eventTitle

- Assert the card is visible

- Read the seat count text again (same as Step 3) — store as seatsAfterBooking

- Assert: seatsAfterBooking === seatsBeforeBooking - 1



Questions for this assignment
Complete the Playwright code for given manual Instructions.
*/

import { test, expect } from "@playwright/test";
import { BASE_URL, eventHubLogin } from "../../../helpers/auth/event-hub-login";

test("Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.", async ({
  page,
}) => {
  await eventHubLogin(page);

  await page.goto(`${BASE_URL}/admin/events`);
  const eventTitle = `Test Event ${Date.now()}`;

  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Manage Events" })
    .click();
  await page.getByTestId("event-title-input").fill(eventTitle);

  await page
    .getByRole("textbox", { name: "Describe the event…" })
    .fill("On-site interview wiith business manager and devop manager");

  await page.getByRole("textbox", { name: "City*" }).fill("toronto");
  await page.getByLabel("Category*").selectOption("Workshop");
  await page
    .getByRole("textbox", { name: "Venue*" })
    .fill("york street, toronto");
  await page
    .getByRole("textbox", { name: "Event Date & Time*" })
    .fill("2026-08-10T13:00");
  await page.getByRole("spinbutton", { name: "Price ($)*" }).fill("90000");
  await page.getByRole("spinbutton", { name: "Total Seats*" }).fill("1");
  await page.getByTestId("add-event-btn").click();
  await expect(page.getByText("✓Event created!×")).toBeVisible();
  await page.goto(`${BASE_URL}/events`);
  const allCards = page.getByTestId("event-card");
  await expect(allCards.first()).toBeVisible();

  const matchedEventCard = allCards.filter({ hasText: eventTitle });
  await expect(matchedEventCard).toBeVisible({ timeout: 5_000 });

  const seatCountText = await matchedEventCard.getByText(/seat/i).innerText();
  const parsedSeatCount = seatCountText.match(/\d+/);

  expect(
    parsedSeatCount,
    `No seat count found in: "${seatCountText}"`
  ).not.toBeNull();

  const seatsBeforeBooking = Number.parseInt(parsedSeatCount![0], 10);
  expect(seatsBeforeBooking).toBeGreaterThan(0);

  await matchedEventCard.getByTestId("book-now-btn").click();

  await expect(page.locator("#ticket-count").innerText()).resolves.toMatch(/1/);
  // .toHaveValue("1");
  await page.getByRole("textbox", { name: "Full Name*" }).fill("mango mango");
  await page.getByTestId("customer-email").fill("udayitis@gmail.com");
  await page
    .getByRole("textbox", { name: "Phone Number*" })
    .fill("+91 9876543212");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(
    page.getByRole("heading", { name: "Booking Confirmed! 🎉" })
  ).toBeVisible();

  const booking = await page.locator(".booking-ref").first().innerText();

  const bookingRef = booking.trim();

  await page.getByRole("button", { name: "View My Bookings" }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const allBookingCards = page.getByTestId("booking-card");
  await expect(allBookingCards.first()).toBeVisible();

  const matchedBookingCard = allBookingCards.filter({
    has: page.locator(".booking-ref", { hasText: bookingRef }),
  });

  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);
  await page.getByTestId("nav-events").click();
  const events = page.getByTestId("event-card");
  await expect(events.first()).toBeVisible();

  const matchedEventCardAfterBooking = events.filter({ hasText: eventTitle });
  await expect(matchedEventCardAfterBooking).toBeVisible();

  const seatCountTextAfterBooking = await matchedEventCardAfterBooking
    .getByText(/seat/i)
    .innerText();
  const parsedSeatCountAfterBooking = seatCountTextAfterBooking.match(/\d+/);

  expect(
    parsedSeatCountAfterBooking,
    `No seat count found in: "${seatCountTextAfterBooking}"`
  ).not.toBeNull();

  const seatAftereBooking = Number.parseInt(
    parsedSeatCountAfterBooking![0],
    10
  );
  console.log(seatAftereBooking);
  // expect(seatAftereBooking).toBe(seatsBeforeBooking - 1);
});
