/** @format */
import { test, expect } from "@playwright/test";

let webContext;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("https://rahulshettyacademy.com/client/auth/login");

  const email = "udaythakur.shely@gmail.com";

  const userNameField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginBtn = page.locator("#login");

  await userNameField.fill(email);
  await passwordField.fill("Usually@12");
  await loginBtn.click();

  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: "storageState.json" });
  webContext = await browser.newContext({ storageState: "storageState.json" });
});

test("client app login", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  const productName = "iphone 13 pro";
  const products = page.locator(".card-body");

  const productCard = products.filter({
    hasText: productName,
  });

  const addToCartButton = productCard.getByRole("button", {
    name: /Add To Cart/i,
  });

  await addToCartButton.click();

  // Synchronize with the completed add-to-cart operation.
  await expect(page.locator("#toast-container")).toContainText(
    "Product Added To Cart"
  );
});

test("Client app order history, verify order id", async () => {
  const page = await webContext.newPage();

  await page.goto("https://rahulshettyacademy.com/client");

  const ordersButton = page.locator("button[routerlink*='myorders']");
  await expect(ordersButton).toBeVisible();
  await ordersButton.click();
});
