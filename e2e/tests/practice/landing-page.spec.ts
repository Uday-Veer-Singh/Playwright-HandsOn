/** @format */

import { test, expect } from "@playwright/test";
import { APP_URLS } from "../../config/test-config";

test(
  "the practice landing page is available",
  { tag: ["@ui", "@practice"] },
  async ({ page }) => {
    await page.goto(APP_URLS.practice.home);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Master QA Testing Through Practice",
      })
    ).toBeVisible();
  }
);
