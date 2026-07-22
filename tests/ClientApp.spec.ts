/** @format */
import { test, expect } from "@playwright/test";
import { count } from "node:console";
import { text } from "node:stream/consumers";
import { beforeEach } from "node:test";

test("client app login", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("https://rahulshettyacademy.com/client/auth/login");

  const email = "udaythakur.shely@gmail.com";

  const userNameField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginBtn = page.locator("#login");
  const productName = "iphone 13 pro";
  const products = page.locator(".card-body");

  await userNameField.fill(email);
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

  const CCNumber = page
    .locator(".field")
    .filter({ hasText: "Credit Card Number" })
    .locator("input");
  await CCNumber.fill("123456789000");

  const expiryField = page
    .locator(".field")
    .filter({ hasText: "Expiry Date" })
    .locator("select");

  await expiryField.nth(0).selectOption("08");
  await expiryField.nth(1).selectOption("27");

  const CVV = page
    .locator(".field")
    .filter({ hasText: "CVV Code ?" })
    .locator("input");

  await CVV.fill("123");

  const nameOnCard = page
    .locator(".field")
    .filter({ hasText: "Name on Card" })
    .locator("input");

  await nameOnCard.fill("abc");

  const coupon = page.locator("input[name='coupon']");
  await coupon.fill("rahulshettyacademy");
  await page.getByRole("button", { name: "Apply Coupon" }).click();

  const emailField = page.locator(".user__name [type='text']");
  await expect(emailField.first()).toHaveText(email);

  const countryField = page.getByPlaceholder("Select Country");
  await countryField.fill("in");
  await countryField.press("d");

  const countryOptions = page.locator(".ta-results button:visible");
  await countryOptions.first().waitFor({ state: "visible", timeout: 10_000 });

  const optionCount = await countryOptions.count();

  for (let i = 0; i < optionCount; i++) {
    const option = countryOptions.nth(i);
    const optionText = (await option.textContent())?.trim();

    if (optionText === "India") {
      await option.click();
      break;
    }
  }

  const submitBtn = page.locator(".action__submit");
  await submitBtn.click();

  const confirmTxt = page.locator(".hero-primary");
  await expect(confirmTxt).toHaveText(" Thankyou for the order. ");

  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
});

test.only("Client app order history, verify order id", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/auth/login");

  const email = "udaythakur.shely@gmail.com";
  const orderId = "6a5fc14b85b8849b4900c4fe";
  const userNameField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginBtn = page.locator("#login");

  await userNameField.fill(email);
  await passwordField.fill("Usually@12");
  await loginBtn.click();

  const ordersButton = page.locator("button[routerlink*='myorders']");
  await expect(ordersButton).toBeVisible();
  await ordersButton.click();

  const matchingRow = page.locator("tbody tr").filter({
    has: page.locator("th", { hasText: orderId }),
  });

  await expect(matchingRow).toHaveCount(1);

  await matchingRow.getByRole("button", { name: /view/i }).click();

  await expect(page.locator(".col-text")).toHaveText(orderId);
});
