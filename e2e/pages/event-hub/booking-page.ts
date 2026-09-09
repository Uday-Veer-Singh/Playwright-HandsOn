/** @format */

import { expect, type Page } from "@playwright/test";
import type { EventHubBookingCustomer } from "../../data/event-hub";

export class EventHubBookingPage {
  constructor(private readonly page: Page) {}

  async setTicketCount(targetCount: number): Promise<void> {
    const ticketCount = this.page.locator("#ticket-count");
    await expect(ticketCount).toBeVisible();

    const currentCount = Number.parseInt((await ticketCount.innerText()).trim(), 10);
    if (!Number.isInteger(currentCount) || targetCount < currentCount) {
      throw new Error(
        `Cannot increase ticket count from ${currentCount} to ${targetCount}`
      );
    }

    const incrementButton = this.page.getByRole("button", {
      name: "+",
      exact: true,
    });
    for (let count = currentCount; count < targetCount; count++) {
      await incrementButton.click();
    }

    await expect(ticketCount).toHaveText(String(targetCount));
  }

  async submit(customer: EventHubBookingCustomer): Promise<string> {
    await this.page
      .getByRole("textbox", { name: /Full Name/ })
      .fill(customer.fullName);
    await this.page.getByTestId("customer-email").fill(customer.email);
    await this.page
      .getByRole("textbox", { name: /Phone Number/ })
      .fill(customer.phone);
    await this.page.getByRole("button", { name: "Confirm Booking" }).click();

    await expect(
      this.page.getByRole("heading", { name: /Booking Confirmed!/ })
    ).toBeVisible();

    const bookingReference = this.page.locator(".booking-ref").first();
    await expect(bookingReference).toBeVisible();
    return (await bookingReference.innerText()).trim();
  }

  async openMyBookings(): Promise<void> {
    await this.page.getByText("View My Bookings", { exact: true }).click();
  }
}
