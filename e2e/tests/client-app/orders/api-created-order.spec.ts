/** @format */

import { test, expect } from "../../../fixtures/test";
import { ClientAppOrdersPage } from "../../../pages/client-app/orders-page";

test(
  "an order created through the API is visible in order history",
  { tag: ["@ui", "@api", "@client-app", "@orders"] },
  async ({ apiAuthenticatedClientPage, apiCreatedOrder }) => {
    const ordersPage = new ClientAppOrdersPage(apiAuthenticatedClientPage);

    await ordersPage.open();
    await ordersPage.openOrderDetails(apiCreatedOrder.orderId);
    await expect(ordersPage.orderIdOnDetailsPage).toContainText(
      apiCreatedOrder.orderId
    );
  }
);
