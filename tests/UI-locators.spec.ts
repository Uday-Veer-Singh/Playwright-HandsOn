/** @format */

import { test, expect } from "@playwright/test";

test("UI Locators", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");

  await page.locator('form input[name="name"]').fill("badshah");
  await page.locator('form input[name="email"]').fill("badshah@123");
  await page.getByPlaceholder("Password").fill("Usually@12");
  await page.getByLabel("Check me out if you Love IceCreams!").click();
  await page.getByLabel("Gender").selectOption("Male");
  await page.getByLabel("Employed").check();
  await page.locator('form input[name="bday"]').fill("2024-06-10");
  await page.getByRole("button", { name: "Submit" }).click();
  expect(page.locator(".alert-success")).toBeVisible();

  await page.getByRole("link", { name: "Shop" }).click();
  await page
    .locator("app-card")
    .filter({ hasText: "Blackberry" })
    .getByRole("button")
    .click();
});
