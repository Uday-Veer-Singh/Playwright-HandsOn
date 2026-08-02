import type { Locator, Page } from "@playwright/test";
import type { BookingCustomer } from "../types/eventhub";

export class BookingPage {
  readonly ticketCount: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmBookingButton: Locator;
  readonly bookingReference: Locator;
  readonly viewMyBookingsControl: Locator;

  constructor(private readonly page: Page) {
    this.ticketCount = page.locator("#ticket-count");
    this.fullNameInput = page.getByLabel(/^Full Name\*?$/);
    this.emailInput = page.locator("#customer-email");
    this.phoneInput = page.getByPlaceholder("+91 98765 43210");
    this.confirmBookingButton = page.locator(".confirm-booking-btn");
    this.bookingReference = page.locator(".booking-ref").first();
    this.viewMyBookingsControl = page.getByRole("button", {
      name: "View My Bookings",
    });
  }

  async fillCustomerDetails(customer: BookingCustomer): Promise<void> {
    await this.fullNameInput.fill(customer.fullName);
    await this.emailInput.fill(customer.email);
    await this.phoneInput.fill(customer.phone);
  }

  async confirmBooking(): Promise<void> {
    await this.confirmBookingButton.click();
  }
}
