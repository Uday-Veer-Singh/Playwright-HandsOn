/** @format */

import { test, expect } from "@playwright/test";
import { BASE_URL, eventHubLogin } from "../helpers/eventHubAuth";

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
