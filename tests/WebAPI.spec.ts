/** @format */

import { test, expect, request } from "@playwright/test";

export const loginPayload = {
  userEmail: "udaythakur.shely@gmail.com",
  userPassword: "Usually@12",
};

const orderPayload = {
  orders: [{ country: "Canada", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};

let loginToken;
let orderId;

test.beforeAll(async () => {
  //Login API Call to get the token
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseBody = await loginResponse.json();
  loginToken = loginResponseBody.token;

  //Check for order creation
  const orderResponsne = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data: orderPayload,
      headers: {
        authorization: loginToken,
        "content-type": "application/json",
      },
    }
  );
  const orderResponseJson = await orderResponsne.json();
  orderId = orderResponseJson.orders[0];
});

test.beforeEach(() => {});

test("WebAPI login test", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, loginToken);

  await page.goto("https://rahulshettyacademy.com/client/");
});
