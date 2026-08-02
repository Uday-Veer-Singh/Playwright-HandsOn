import type { Locator, Page } from "@playwright/test";
import type { EventData } from "../types/eventhub";

export class AdminEventsPage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly cityInput: Locator;
  readonly venueInput: Locator;
  readonly dateTimeInput: Locator;
  readonly priceInput: Locator;
  readonly totalSeatsInput: Locator;
  readonly addEventButton: Locator;
  readonly createdToast: Locator;

  constructor(private readonly page: Page) {
    this.titleInput = page.locator("#event-title-input");
    this.descriptionInput = page.locator("#admin-event-form textarea");
    this.cityInput = page.getByLabel(/^City\*?$/);
    this.venueInput = page.getByLabel(/^Venue\*?$/);
    this.dateTimeInput = page.getByLabel(/^Event Date & Time\*?$/);
    this.priceInput = page.getByLabel(/^Price \(\$\)\*?$/);
    this.totalSeatsInput = page.getByLabel(/^Total Seats\*?$/);
    this.addEventButton = page.locator("#add-event-btn");
    this.createdToast = page.getByText("Event created!", { exact: false });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/events");
  }

  async createEvent(event: EventData): Promise<void> {
    await this.titleInput.fill(event.title);
    await this.descriptionInput.fill(event.description);
    await this.cityInput.fill(event.city);
    await this.venueInput.fill(event.venue);
    await this.dateTimeInput.fill(event.dateTime);
    await this.priceInput.fill(String(event.price));
    await this.totalSeatsInput.fill(String(event.totalSeats));
    await this.addEventButton.click();
  }
}
