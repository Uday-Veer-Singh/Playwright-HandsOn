/** @format */

import { test, expect } from "@playwright/test";
import { APP_URLS } from "../../config/test-config";

test(
  "handles dialogs, hover menus, and iframes",
  { tag: ["@ui", "@practice"] },
  async ({ page }) => {
    await page.goto(APP_URLS.practice.automation);
    await expect(
      page.getByRole("heading", { level: 1, name: "Practice Page" })
    ).toBeVisible();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await page.locator("#confirmbtn").click();

    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover-content").last().click();

    const iframePage = page.frameLocator("#courses-iframe");
    await iframePage
      .locator("li a[href*='lifetime-access']:visible")
      .click();
    await expect(iframePage.locator(".header-text h2")).toBeVisible();
  }
);
