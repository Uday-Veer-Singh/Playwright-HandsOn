/** @format */

import { expect, type Locator, type Page } from "@playwright/test";

export class ClientAppOrdersPage {
  readonly rows: Locator;
  readonly orderIdOnDetailsPage: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator("tbody tr");
    this.orderIdOnDetailsPage = page.locator(".col-text");
  }

  orderRow(orderId: string): Locator {
    return this.rows.filter({ hasText: orderId });
  }

  async open(): Promise<void> {
    const ordersButton = this.page.locator("button[routerlink*='myorders']");
    await expect(ordersButton).toBeVisible();
    await ordersButton.click();
  }

  async openOrderDetails(orderId: string): Promise<void> {
    const row = this.orderRow(orderId);
    await expect(row).toHaveCount(1);
    await row.getByRole("button", { name: /view/i }).click();
  }
}
