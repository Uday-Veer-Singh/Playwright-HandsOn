/** @format */

import { test, expect } from "../../../fixtures/test";
import { ClientAppCatalogPage } from "../../../pages/client-app/catalog-page";
import { ClientAppOrdersPage } from "../../../pages/client-app/orders-page";

test(
  "custom fixtures provide an authenticated page and an API-created order",
  { tag: ["@ui", "@api", "@fixtures", "@client-app", "@orders"] },
  async ({ authenticatedClientPage, apiCreatedOrder }) => {
    const catalogPage = new ClientAppCatalogPage(authenticatedClientPage);
    const ordersPage = new ClientAppOrdersPage(authenticatedClientPage);

    await catalogPage.expectLoaded();
    await ordersPage.open();
    await expect(ordersPage.orderRow(apiCreatedOrder.orderId)).toHaveCount(1);
  }
);
