import type { Locator, Page } from "@playwright/test";

export class BookingsPage {
  readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator("#booking-card");
  }

  cardByReference(bookingReference: string): Locator {
    return this.cards.filter({
      has: this.page.locator(".booking-ref", {
        hasText: bookingReference,
      }),
    });
  }
}
