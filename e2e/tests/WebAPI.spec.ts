/** @format */

// Import Playwright's test runner, assertions, API factory, and context type.
import {
  test,
  expect,
  request,
  type APIRequestContext,
} from "@playwright/test";
// Match the exact capitalization of the APIUtils.ts filename.
import { APIUtils } from "../support/utils/APIUtils";
// Import reusable, strongly typed test data from fixture modules.
import { orderPayload } from "../support/fixtures/orderPayload";
import { loginPayload } from "../support/fixtures/loginPayload";

let apiContext: APIRequestContext; // Shared API context created before this file's tests.
let apiUtils: APIUtils; // Shared helper that performs the reusable API operations.
let loginToken: string; // Token produced during setup and injected into the browser.
let orderId: string; // Created order ID that the browser test must find and verify.

// Prepare the authenticated order exactly once before tests in this file run.
test.beforeAll(async () => {
  apiContext = await request.newContext(); // Create an isolated HTTP client.
  apiUtils = new APIUtils(apiContext, loginPayload); // Inject its dependencies.
  loginToken = await apiUtils.getToken(); // Await and retain the returned string.
  orderId = await apiUtils.createOrder(orderPayload, loginToken); // Create and retain the order ID.
});

// Release sockets and other API context resources after this file's tests finish.
test.afterAll(async () => {
  await apiContext?.dispose(); // Optional chaining also handles failed early setup safely.
});

// Verify through the UI that the order created through the API is visible.
test("check product in orders", async ({ page }) => {
  // Install this callback before navigation so the application starts authenticated.
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value); // Store the API token in the browser.
  }, loginToken);

  // Load the client application; its startup code reads the token from localStorage.
  await page.goto("https://rahulshettyacademy.com/client");

  // Open the signed-in user's Orders page.
  await page.locator("button[routerlink*='myorders']").click();
  const rows = page.locator("tbody tr"); // Locate all rows in the orders table.

  // Filter directly to the row containing our typed string order ID.
  const matchingOrderRow = rows.filter({ hasText: orderId });
  await expect(matchingOrderRow).toHaveCount(1); // Give a clear failure if it is absent.

  // Open the details page from the matching order row.
  await matchingOrderRow.locator("button").first().click();

  // Use a web-first assertion that waits for the details page to show the order ID.
  await expect(page.locator(".col-text")).toContainText(orderId);
});
