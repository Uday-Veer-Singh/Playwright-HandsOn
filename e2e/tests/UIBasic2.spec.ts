/** @format */

import { deserialize } from "node:v8";

const { test, expect } = require("@playwright/test");

test("UI Basics 2nd Part", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  expect(await page.getByRole("h1", { name: "Practice Page" }).isVisible());

  await page.locator("#confirmbtn").click();
  page.on("dialog", (dialog) => dialog.accept());

  await page.locator("#mousehover").hover();
  await page.locator(".mouse-hover-content").last().click();

  const iframePage = page.frameLocator("#courses-iframe");
  await iframePage.locator("li a[href*='lifetime-access']:visible").click();
  expect(await iframePage.locator("..header-text h2").isVisible());
});
