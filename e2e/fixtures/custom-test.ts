/** @format */

import { test as base, expect, type Page, request } from "@playwright/test";
import { APIUtils } from "../helpers/api/api-utils";
import { loginPayload } from "../data/api/login-payload";
import { orderPayload } from "../data/api/order-payload";

interface CreateOrder {
  orderId: string;
}

type CustomFixtures = {
  authenticatedPage: Page;
  createOrder: CreateOrder;
  loginAndGoToEvents: Page;
};

const userID = "udaythakur.shely@gmail.com";
const userPass = "Usually@12";

export const customTest = base.extend<CustomFixtures>({
  //Perform login and return the authenticated page to the test.
  authenticatedPage: async ({ page }, use) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(userID);
    await page.locator("#userPassword").fill(userPass);
    await page.locator("[value='Login']").click();
    await expect(page.locator(".logo-holder")).toBeVisible();

    await use(page);
  },

  // Create an order through the API and return the order ID to the test.
  createOrder: async ({}, use) => {
    const apiContext = await request.newContext();
    try {
      const apiUtils = new APIUtils(apiContext, loginPayload);

      const loginToken = await apiUtils.getToken();

      const orderId = await apiUtils.createOrder(orderPayload, loginToken);

      await use({ orderId });
    } finally {
      await apiContext.dispose();
    }
  },

  loginAndGoToEvents: async ({ page }, use) => {
    await page.goto("https://eventhub.rahulshettyacademy.com/login");
    await page.locator("#email").fill(userID);
    await page.locator("#password").fill(userPass);
    await page.locator("#login-btn").click();
    await expect(page.locator("h2")).toHaveText("Featured Events");

    await use(page);
  },
});
