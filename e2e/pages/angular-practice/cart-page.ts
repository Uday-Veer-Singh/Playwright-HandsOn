/** @format */

import { expect, type Locator, type Page } from "@playwright/test";
import type { PurchaseProductData } from "../../data/angular-practice/purchase-data";

export class AngularPracticeCartPage {
  private readonly rows: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator("tbody tr");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
  }

  private productRow(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  async expectProduct(product: PurchaseProductData): Promise<void> {
    const productRow = this.productRow(product.name);
    const quantityInput = productRow.getByRole("spinbutton");
    const totalRow = this.rows.filter({ hasText: "Total" });

    await expect(productRow).toHaveCount(1);
    await expect(productRow).toContainText(product.name);
    await expect(productRow).toContainText(product.expectedAvailability);
    await expect(productRow).toContainText(product.expectedPrice);
    await expect(quantityInput).toHaveValue(String(product.quantity));
    await expect(totalRow).toContainText(product.expectedPrice);
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
    await this.checkoutButton.click();
  }
}
