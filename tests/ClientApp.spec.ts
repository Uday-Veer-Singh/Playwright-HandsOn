/** @format */
import { test, expect } from "@playwright/test";

test("client app login", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/auth/login");

  const userNameField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginBtn = page.locator("#login");
  const productName = "iphone 13 pro";
  const products = page.locator(".card-body");

  await userNameField.fill("udaythakur.shely@gmail.com");
  await passwordField.fill("Usually@12");
  await loginBtn.click();

  await page.waitForLoadState("networkidle");

  const productCount = await products.count();

  for (let i = 0; i < productCount; i++) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }

  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();
  const itemCheck = await expect(
    page.locator("h3", { hasText: productName })
  ).toBeVisible();

  await page.getByText("Checkout", { exact: true }).click();
  await page.pause();
});
