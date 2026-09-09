/** @format */

import { test, expect } from "../../../fixtures/test";
import { CLIENT_APP_API } from "../../../config/test-config";
import { noOrdersResponse } from "../../../data/mocks/no-orders-response";
import { ClientAppOrdersPage } from "../../../pages/client-app/orders-page";

test(
  "an empty mocked orders response displays the no-orders state",
  { tag: ["@ui", "@network", "@client-app", "@orders"] },
  async ({ apiAuthenticatedClientPage: page }) => {
    const ordersPage = new ClientAppOrdersPage(page);

    await page.route(CLIENT_APP_API.customerOrdersPattern, async (route) => {
      const response = await route.fetch();
      await route.fulfill({ response, json: noOrdersResponse });
    });

    try {
      const ordersResponse = page.waitForResponse(
        CLIENT_APP_API.customerOrdersPattern
      );
      await ordersPage.open();
      await ordersResponse;

      await expect(ordersPage.rows).toHaveCount(0);
      await expect(page.getByText(/No Orders/i)).toBeVisible();
    } finally {
      await page.unrouteAll({ behavior: "wait" });
    }
  }
);
