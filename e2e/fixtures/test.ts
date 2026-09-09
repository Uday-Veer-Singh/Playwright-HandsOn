/** @format */

import { test as base, expect, type Page } from "@playwright/test";
import { APP_URLS, CLIENT_APP_USER } from "../config/test-config";
import { orderPayload } from "../data/api/order-payload";
import { ClientAppApi } from "../helpers/api/client-app-api";
import { loginToClientApp } from "../helpers/auth/client-app-login";
import { loginToEventHub } from "../helpers/auth/event-hub-login";

interface ApiCreatedOrder {
  orderId: string;
}

type AppFixtures = {
  authenticatedClientPage: Page;
  apiAuthenticatedClientPage: Page;
  authenticatedEventHubPage: Page;
  apiToken: string;
  apiCreatedOrder: ApiCreatedOrder;
};

export const test = base.extend<AppFixtures>({
  authenticatedClientPage: async ({ page }, use) => {
    await loginToClientApp(page);
    await use(page);
  },

  apiToken: async ({ request }, use) => {
    const clientAppApi = new ClientAppApi(request);
    const token = await clientAppApi.login(CLIENT_APP_USER);
    await use(token);
  },

  apiCreatedOrder: async ({ request, apiToken }, use) => {
    const clientAppApi = new ClientAppApi(request);
    const orderId = await clientAppApi.createOrder(orderPayload, apiToken);
    await use({ orderId });
  },

  apiAuthenticatedClientPage: async ({ page, apiToken }, use) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem("token", token);
    }, apiToken);
    await page.goto(APP_URLS.clientApp.home);
    await expect(page.locator(".logo-holder")).toBeVisible();
    await use(page);
  },

  authenticatedEventHubPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginToEventHub(page);
    await use(page);
    await context.close();
  },
});

export { expect };
