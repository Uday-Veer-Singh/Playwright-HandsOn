/** @format */

import { test, expect } from "../../../fixtures/test";
import { CLIENT_APP_API } from "../../../config/test-config";
import { ClientAppOrdersPage } from "../../../pages/client-app/orders-page";

test(
  "a changed order ID is rejected",
  { tag: ["@ui", "@network", "@security", "@client-app", "@orders"] },
  async ({ authenticatedClientPage: page }) => {
    const ordersPage = new ClientAppOrdersPage(page);
    await ordersPage.open();

    const firstViewButton = page
      .getByRole("button", { name: /view/i })
      .first();
    await expect(firstViewButton).toBeVisible();

    await page.route(CLIENT_APP_API.orderDetailsPattern, async (route) => {
      await route.continue({
        url: `${CLIENT_APP_API.orderDetails}?id=invalid-order-id`,
      });
    });

    try {
      const rejectedResponse = page.waitForResponse(
        (response) =>
          response.url().startsWith(CLIENT_APP_API.orderDetails) &&
          response.url().includes("invalid-order-id")
      );
      await firstViewButton.click();
      expect((await rejectedResponse).ok()).toBeFalsy();
    } finally {
      await page.unrouteAll({ behavior: "wait" });
    }
  }
);
