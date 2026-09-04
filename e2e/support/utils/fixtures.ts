/** @format */

import { test as base, expect, type Page, request } from "@playwright/test";
import { APIUtils } from "./APIUtils";
import { loginPayload } from "../fixtures/loginPayload";
import { orderPayload } from "../fixtures/orderPayload";

type CustomFixtures = {
  authenticatedPage: Page;
  createOrder: any;
};

export const customTest = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    //Perform login
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("udaythakur.shely@gmail.com");
    await page.locator("#userPassword").fill("Usually@12");
    await page.locator("[value='Login']").click();
    await expect(page.locator(".logo-holder")).toBeVisible();

    await use(page);
  },

  createOrder: async ({}, use) => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    const response = await apiUtils.createOrder(orderPayload);
    use(response);
  },
});
