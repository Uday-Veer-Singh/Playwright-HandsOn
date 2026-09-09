/** @format */

import { expect, type Locator, type Page } from "@playwright/test";

export class ClientAppCatalogPage {
  readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.locator(".card-body");
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.productCard(productName);
    await expect(productCard).toBeVisible();
    await productCard.getByRole("button", { name: /Add To Cart/i }).click();
    await expect(this.page.locator("#toast-container")).toContainText(
      "Product Added To Cart"
    );
  }

  async openCart(): Promise<void> {
    const cartButton = this.page.locator("[routerlink*='cart']");
    await expect(cartButton).toBeVisible();
    await cartButton.click();
  }
}
