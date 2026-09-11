/** @format */

import { expect, type Locator, type Page } from "@playwright/test";
import { APP_URLS } from "../../config/test-config";

export class AngularPracticeShopPage {
  private readonly productCards: Locator;
  private readonly shopNavbar: Locator;
  private readonly navbarToggle: Locator;
  private readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.locator("app-card");
    this.shopNavbar = page.locator("nav.navbar-expand-lg");
    this.navbarToggle = this.shopNavbar.locator(".navbar-toggler");
    // The app exposes this control as visible text rather than a link role.
    this.cartLink = this.shopNavbar.getByText(/Checkout/i);
  }

  private productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  async open(): Promise<void> {
    await this.page.goto(APP_URLS.angularPractice.shop);
    await expect(this.productCards.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.productCard(productName);
    const addButton = productCard.getByRole("button", { name: /Add/i });

    await expect(productCard).toHaveCount(1);
    await expect(productCard).toBeVisible();
    await expect(addButton).toBeEnabled();
    await addButton.click();
  }

  async openCart(expectedItemCount: number): Promise<void> {
    // Bootstrap hides the cart link behind this toggle at narrow viewports.
    if (!(await this.cartLink.isVisible())) {
      await expect(this.navbarToggle).toBeVisible();
      await this.navbarToggle.click();
    }

    await expect(this.cartLink).toBeVisible();
    await expect(this.cartLink).toContainText(
      new RegExp(`\\(\\s*${expectedItemCount}\\s*\\)`)
    );
    await this.cartLink.click();
  }
}
