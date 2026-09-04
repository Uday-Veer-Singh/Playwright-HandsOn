/** @format */

import { test, expect } from "@playwright/test";
import { customTest } from "../support/utils/fixtures";

customTest("Fixtures Demo", async ({ authenticatedPage, createOrder }) => {
  // Login to application and create order and verify if the order is cretated from the history page.

  // The fixture has already navigated and logged in.
  const productCards = authenticatedPage.locator(".card-body");

  // Verify that the authenticated product page loaded.
  await expect(productCards.first()).toBeVisible();

  await authenticatedPage.locator("button[routerlink*='myorders']").click();
  await authenticatedPage.locator("tbody").waitFor();

  await expect(authenticatedPage.getByText("orderId").tob
});
