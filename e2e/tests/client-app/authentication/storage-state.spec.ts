/** @format */

import { test, expect } from "../../../fixtures/test";
import { APP_URLS } from "../../../config/test-config";
import { ClientAppCatalogPage } from "../../../pages/client-app/catalog-page";

test(
  "authenticated storage state can be reused in a new browser context",
  { tag: ["@ui", "@auth", "@client-app"] },
  async ({ authenticatedClientPage, browser }, testInfo) => {
    const storageStatePath = testInfo.outputPath(
      "client-app-storage-state.json"
    );
    await authenticatedClientPage.context().storageState({
      path: storageStatePath,
    });

    const authenticatedContext = await browser.newContext({
      storageState: storageStatePath,
    });

    try {
      const page = await authenticatedContext.newPage();
      await page.goto(APP_URLS.clientApp.home);
      await expect(page.locator(".logo-holder")).toBeVisible();
      await new ClientAppCatalogPage(page).expectLoaded();
    } finally {
      await authenticatedContext.close();
    }
  }
);
