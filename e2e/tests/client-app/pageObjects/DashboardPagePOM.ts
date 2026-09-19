/** @format */

import { Locator, Page } from "@playwright/test";

export interface DashboardPageElements {
  page: Page;
  products: Locator;
  productsText: Locator;
  cart: Locator;
}

export class DashboardPagePOM {
  readonly page: Page;
  readonly products: Locator;
  readonly productsText: Locator;
  readonly cart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator(".card-body");
    this.productsText = page.locator("card-body b");
    this.cart = page.locator("[routerlink*='cart']");
  }

  async searchProdcutAddCart(productName: string): Promise<void> {
    const productTitles = await this.productsText.allTextContents();
    console.log(productTitles);

    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }

  async navigateToCart(): Promise<void> {
    await this.cart.click();
  }
}
