/** @format */

import { test, expect } from "@playwright/test";
import { loginToClientApp } from "../../../helpers/auth/client-app-login";
import { ClientAppCatalogPage } from "../../../pages/client-app/catalog-page";

test(
  "image requests can be blocked without preventing catalog use",
  { tag: ["@ui", "@network", "@client-app", "@catalog"] },
  async ({ page }) => {
    let abortedImageRequests = 0;

    await page.route("**/*", async (route) => {
      if (route.request().resourceType() === "image") {
        abortedImageRequests++;
        await route.abort("blockedbyclient");
        return;
      }

      await route.continue();
    });

    try {
      await loginToClientApp(page);
      await new ClientAppCatalogPage(page).expectLoaded();
      await expect.poll(() => abortedImageRequests).toBeGreaterThan(0);
    } finally {
      await page.unrouteAll({ behavior: "wait" });
    }
  }
);
