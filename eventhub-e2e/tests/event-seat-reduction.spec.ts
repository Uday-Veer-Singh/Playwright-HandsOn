import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config/environment";
import { bookingCustomer, eventDefaults } from "../data/eventhub.data";
import { futureDateValue } from "../helpers/date";
import { login } from "../helpers/login";
import { AdminEventsPage } from "../pages/admin-events.page";
import { BookingPage } from "../pages/booking.page";
import { BookingsPage } from "../pages/bookings.page";
import { EventsPage } from "../pages/events.page";
import type { EventData } from "../types/eventhub";

test.describe("EventHub event booking", () => {
  test("reduces the available seat count by exactly one after booking", async ({
    page,
  }) => {
    const eventTitle = `Test Event ${Date.now()}`;
    const eventData: EventData = {
      ...eventDefaults,
      title: eventTitle,
      dateTime: futureDateValue(),
    };

    const adminEventsPage = new AdminEventsPage(page);
    const eventsPage = new EventsPage(page);
    const bookingPage = new BookingPage(page);
    const bookingsPage = new BookingsPage(page);

    let seatsBeforeBooking = 0;
    let bookingRef = "";

    await test.step("Step 1 - Login", async () => {
      await login(page);
    });

    await test.step("Step 2 - Create a unique event", async () => {
      await adminEventsPage.goto();
      await adminEventsPage.createEvent(eventData);

      await expect(adminEventsPage.createdToast).toBeVisible();
      await expect(adminEventsPage.createdToast).toContainText(
        "Event created!"
      );
    });

    await test.step("Step 3 - Find the event and capture available seats", async () => {
      await eventsPage.goto();
      await expect(eventsPage.cards.first()).toBeVisible();

      const matchedEventCard = eventsPage.cardByTitle(eventTitle);
      await expect(matchedEventCard).toBeVisible({ timeout: 5_000 });

      seatsBeforeBooking = await eventsPage.readSeatCount(matchedEventCard);
      expect(seatsBeforeBooking).toBe(eventData.totalSeats);
    });

    await test.step("Step 4 - Start booking the matched event", async () => {
      const matchedEventCard = eventsPage.cardByTitle(eventTitle);
      await eventsPage.bookNowButton(matchedEventCard).click();
    });

    await test.step("Step 5 - Complete the booking form", async () => {
      await expect(bookingPage.ticketCount).toHaveText("1");
      await bookingPage.fillCustomerDetails(bookingCustomer);

      await expect(bookingPage.fullNameInput).toHaveValue(
        bookingCustomer.fullName
      );
      await expect(bookingPage.emailInput).toHaveValue(bookingCustomer.email);
      await expect(bookingPage.phoneInput).toHaveValue(bookingCustomer.phone);

      await bookingPage.confirmBooking();
    });

    await test.step("Step 6 - Capture the booking reference", async () => {
      await expect(bookingPage.bookingReference).toBeVisible();

      bookingRef = (await bookingPage.bookingReference.innerText()).trim();
      expect(bookingRef).not.toHaveLength(0);
    });

    await test.step("Step 7 - Verify the booking in My Bookings", async () => {
      await bookingPage.viewMyBookingsControl.click();
      await expect(page).toHaveURL(`${BASE_URL}/bookings`);

      await expect(bookingsPage.cards.first()).toBeVisible();

      const matchedBookingCard = bookingsPage.cardByReference(bookingRef);
      await expect(matchedBookingCard).toBeVisible();
      await expect(matchedBookingCard).toContainText(eventTitle);
    });

    await test.step("Step 8 - Verify that one seat was deducted", async () => {
      await eventsPage.goto();
      await expect(eventsPage.cards.first()).toBeVisible();

      const matchedEventCard = eventsPage.cardByTitle(eventTitle);
      await expect(matchedEventCard).toBeVisible();

      const seatsAfterBooking = await eventsPage.readSeatCount(
        matchedEventCard
      );

      expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
    });
  });
});
