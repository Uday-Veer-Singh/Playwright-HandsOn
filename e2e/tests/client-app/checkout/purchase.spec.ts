/** @format */

import { test, expect } from "../../../fixtures/test";
import { CLIENT_APP_USER } from "../../../config/test-config";
import { ClientAppCatalogPage } from "../../../pages/client-app/catalog-page";
import { ClientAppOrdersPage } from "../../../pages/client-app/orders-page";

test(
  "a customer can purchase a product and find the order in history",
  { tag: ["@ui", "@client-app", "@checkout", "@orders"] },
  async ({ authenticatedClientPage: page }) => {
    test.setTimeout(60_000);

    const productName = "iphone 13 pro";
    const catalogPage = new ClientAppCatalogPage(page);

    await catalogPage.expectLoaded();
    await catalogPage.addProductToCart(productName);
    await catalogPage.openCart();

    const cartProduct = page.locator(".cartSection").filter({
      hasText: productName,
    });
    await expect(cartProduct).toBeVisible();
    await expect(cartProduct).toContainText(productName);

    await page.getByText("Checkout", { exact: true }).click();

    const creditCardNumber = page
      .locator(".field")
      .filter({ hasText: "Credit Card Number" })
      .locator("input");
    await creditCardNumber.fill("123456789000");

    const expiryFields = page
      .locator(".field")
      .filter({ hasText: "Expiry Date" })
      .locator("select");
    await expiryFields.nth(0).selectOption("08");
    await expiryFields.nth(1).selectOption("27");

    await page
      .locator(".field")
      .filter({ hasText: "CVV Code ?" })
      .locator("input")
      .fill("123");
    await page
      .locator(".field")
      .filter({ hasText: "Name on Card" })
      .locator("input")
      .fill("abc");

    await page.locator("input[name='coupon']").fill("rahulshettyacademy");
    await page.getByRole("button", { name: "Apply Coupon" }).click();
    await expect(page.locator(".user__name [type='text']").first()).toHaveValue(
      CLIENT_APP_USER.email
    );

    const countryField = page.getByPlaceholder("Select Country");
    await countryField.fill("ind");
    const indiaOption = page
      .locator(".ta-results button:visible")
      .filter({ hasText: "India" });
    await expect(indiaOption).toBeVisible();
    await indiaOption.click();

    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toContainText(
      "Thankyou for the order"
    );

    const rawOrderId = await page
      .locator(".em-spacer-1 .ng-star-inserted")
      .textContent();
    const orderId = rawOrderId?.replaceAll("|", "").trim();
    expect(orderId, "The confirmation page should show an order ID").toBeTruthy();

    const ordersPage = new ClientAppOrdersPage(page);
    await ordersPage.open();
    await ordersPage.openOrderDetails(orderId!);
    await expect(ordersPage.orderIdOnDetailsPage).toContainText(orderId!);
  }
);
