/** @format */
import { test, expect, request } from "@playwright/test";

const loginPayload = {
  userEmail: "udaythakur.shely@gmail.com",
  userPassword: "Usually@12",
};

const orderPayload = {
  orders: [
    {
      country: "India",
      productOrderedId: "6960eae1c941646b7a8b3ed3",
    },
  ],
};

let loginToken: string;
let orderId: string;

//client app login with API call
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    { data: loginPayload }
  );
  expect(loginResponse.ok()).toBeTruthy(); //200, 201

  const loginResponseJson = await loginResponse.json();
  loginToken = loginResponseJson.token;

  const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data: orderPayload,
      headers: {
        Authorization: loginToken,
        "content-type": "application/json",
      },
    }
  );
  expect(orderResponse.ok()).toBeTruthy();
  const orderResponseJson = await orderResponse.json();
  console.log(orderResponseJson);
  orderId = await orderResponseJson.orders[0];
});

test.beforeEach(() => {});

test("Add product to cart", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, loginToken);

  await page.goto("https://rahulshettyacademy.com/client");

  for(l)
});
