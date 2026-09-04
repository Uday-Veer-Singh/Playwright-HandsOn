/** @format */

import { test, expect } from "@playwright/test";
import { clientAppLoginAuth } from "../support/helpers/clientAppLoginAuth";
import { request } from "node:http";

test("Abort Calls Intercept", async ({ page }) => {
  let abortedImageRequests = 0;

  page.on("request", (request) => console.log(request.url()));
  page.on("response", (response) =>
    console.log(response.url(), response.status())
  );

  // Match every request, then identify images by resource type.
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() === "image") {
      abortedImageRequests++;
      await route.abort("blockedbyclient");
      return;
    }

    // Non-image requests must be allowed to continue.
    await route.continue();
  });

  try {
    await clientAppLoginAuth(page);

    // The login helper only waits for the header/logo.
    // Wait separately for product data to render.
    await expect(page.locator(".card-body").first()).toBeVisible();

    // poll() allows late image requests time to reach the route handler.
    await expect.poll(() => abortedImageRequests).toBeGreaterThan(0);
  } finally {
    // This now runs even when an assertion fails.
    await page.unrouteAll({ behavior: "wait" });
  }
});
