/** @format */

import { test, expect } from "@playwright/test";
import { clientAppLoginAuth } from "../support/helpers/clientAppLoginAuth";

test("Security test: unauthorized order request @api", async ({ page }) => {
  // Log in using the same Page supplied to this test.
  await clientAppLoginAuth(page);

  // Open the Orders page and wait for an order to become available.
  await page.locator("button[routerlink*='myorders']").click();

  const firstViewButton = page.getByRole("button", { name: /view/i }).first();

  await expect(firstViewButton).toBeVisible();

  // Register interception before clicking View.
  await page.route(
    "**/api/ecom/order/get-orders-details?id=*",
    async (route) => {
      // Replace the real order ID with an invalid or unauthorized ID.
      await route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=ebfiweofkej",
      });
    }
  );

  // This request will now be changed by the route handler.
  await firstViewButton.click();

  // // Verify that the application rejected access to the modified order.
  // await expect(
  //   page.getByText(/not authori[sz]ed to view this order/i)
  // ).toBeVisible();

  // Wait for route callbacks before allowing the page to close.
  await page.unrouteAll({ behavior: "wait" });
});
