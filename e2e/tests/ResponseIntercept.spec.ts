/** @format */

import {
  test,
  expect,
  request,
  type APIRequestContext,
} from "@playwright/test";

import { APIUtils } from "../support/utils/apiUtils";
import { orderPayload } from "../support/fixtures/orderPayload";
import { loginPayload } from "../support/fixtures/loginPayload";
import { fakeOrderPayload } from "../support/fixtures/fakeOrderPayload";

let apiContext: APIRequestContext;
let apiUtils: APIUtils;
let loginToken: string;
let orderId: string;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  apiUtils = new APIUtils(apiContext, loginPayload);
  loginToken = await apiUtils.getToken();
  orderId = await apiUtils.createOrder(orderPayload, loginToken);
});

test.afterAll(async () => {
  await apiContext?.dispose();
});

test("check no-product in orders with intercept", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, loginToken);

  await page.goto("https://rahulshettyacademy.com/client");

  const orderApiUrl = `https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*`;

  await page.route(orderApiUrl, async (route) => {
    // const response = await page.request.fetch(route.request());
    const response = await route.fetch();

    await route.fulfill({
      response,
      json: fakeOrderPayload,
    });
  });

  // intercepting response -> API response -> (playwright fake response) -> browser -> render data

  await page.locator("button[routerlink*='myorders']").click();
  const rows = page.locator("tbody tr");

  await page.waitForResponse(orderApiUrl);

  await expect(rows).toHaveCount(0);
  await expect(page.getByText(/No Orders/i)).toBeVisible();
  await page.unrouteAll({ behavior: "wait" });
});
