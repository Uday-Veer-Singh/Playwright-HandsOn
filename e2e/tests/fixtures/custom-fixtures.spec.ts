/** @format */

import { expect } from "@playwright/test";
import { customTest } from "../../fixtures/custom-test";

customTest("Fixtures Demo", async ({ authenticatedPage, createOrder }) => {
  // Login to application and create order and verify if the order is cretated from the history page.

  // The fixture has already navigated and logged in.
  const productCards = authenticatedPage.locator(".card-body");

  // Verify that the authenticated product page loaded.
  await expect(productCards.first()).toBeVisible();

  // Find the product card containing the API-created order ID.
  await authenticatedPage.locator("button[routerlink*='myorders']").click();
  await authenticatedPage.locator("tbody").waitFor();

  // Find the row containing the API-created order ID.
  const matchingOrderRow = authenticatedPage
    .locator("tbody tr")
    .filter({ hasText: createOrder.orderId });

  // Wait for and verify the matching order.
  await expect(matchingOrderRow).toHaveCount(1);
});
