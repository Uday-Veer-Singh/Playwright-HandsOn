import type { Locator, Page } from "@playwright/test";

export class EventsPage {
  readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.getByTestId("event-card");
  }

  async goto(): Promise<void> {
    await this.page.goto("/events");
  }

  cardByTitle(eventTitle: string): Locator {
    return this.cards.filter({ hasText: eventTitle });
  }

  bookNowButton(card: Locator): Locator {
    return card.getByTestId("book-now-btn");
  }

  async readSeatCount(card: Locator): Promise<number> {
    const seatText = await card.getByText(/\bseats?\b/i).innerText();
    const match =
      seatText.match(/(\d+)\s*seats?/i) ??
      seatText.match(/seats?\D*(\d+)/i);

    if (!match) {
      throw new Error(`Unable to parse a seat count from: "${seatText}"`);
    }

    return Number.parseInt(match[1], 10);
  }
}
