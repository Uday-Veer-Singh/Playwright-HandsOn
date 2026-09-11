/** @format */

import { test, expect } from "@playwright/test";
import { purchaseData } from "../../data/angular-practice/purchase-data";
import { AngularPracticeCartPage } from "../../pages/angular-practice/cart-page";
import { AngularPracticeCheckoutPage } from "../../pages/angular-practice/checkout-page";
import { AngularPracticeShopPage } from "../../pages/angular-practice/shop-page";

test(
  "a customer can complete a product purchase",
  {
    tag: ["@ui", "@angular-practice", "@checkout"],
  },
  async ({ page }) => {
    const shopPage = new AngularPracticeShopPage(page);
    const cartPage = new AngularPracticeCartPage(page);
    const checkoutPage = new AngularPracticeCheckoutPage(page);

    await test.step("Add the selected product to the cart", async () => {
      await shopPage.open();
      await shopPage.addProductToCart(purchaseData.product.name);
      await shopPage.openCart(purchaseData.product.quantity);
    });

    await test.step("Verify the cart and continue to checkout", async () => {
      await cartPage.expectProduct(purchaseData.product);
      await cartPage.proceedToCheckout();
    });

    await test.step("Enter delivery details and complete the purchase", async () => {
      await checkoutPage.expectLoaded();
      await checkoutPage.selectCountry(purchaseData.delivery);
      await checkoutPage.acceptTerms();
      await checkoutPage.purchase();
      await expect(checkoutPage.successMessage).toBeVisible();
    });
  }
);
