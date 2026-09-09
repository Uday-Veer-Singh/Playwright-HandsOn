/** @format */

import { test, expect } from "../../../fixtures/test";
import { ClientAppCatalogPage } from "../../../pages/client-app/catalog-page";

test(
  "an authenticated customer can view the product catalog",
  { tag: ["@ui", "@client-app", "@catalog"] },
  async ({ authenticatedClientPage: page }) => {
    const catalogPage = new ClientAppCatalogPage(page);
    await catalogPage.expectLoaded();
    expect(await catalogPage.productCards.count()).toBeGreaterThan(0);
  }
);
