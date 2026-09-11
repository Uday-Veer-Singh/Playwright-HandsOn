/** @format */

import { test as base, expect, type Page } from "@playwright/test";
import {
  APP_URLS,
  CLIENT_APP_USER,
  EVENT_HUB_USER,
} from "../config/test-config";
import { orderPayload } from "../data/api/order-payload";
import { ClientAppApi } from "../helpers/api/client-app-api";
import { loginToClientApp } from "../helpers/auth/client-app-login";
import { loginToEventHub } from "../helpers/auth/event-hub-login";
import {
  EventHubApi,
  type CreatedEvent,
} from "../helpers/api/event-hub-api";

interface ApiCreatedOrder {
  orderId: string;
}

type AppFixtures = {
  authenticatedClientPage: Page;
  apiAuthenticatedClientPage: Page;
  authenticatedPage: Page;
  authenticatedEventHubPage: Page;
  apiToken: string;
  apiCreatedOrder: ApiCreatedOrder;
  createEvent: CreatedEvent;
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

  // Setup runs before the test receives this fixture.
  authenticatedPage: async ({ page }, use) => {
    await loginToEventHub(page, EVENT_HUB_USER);

    // The test starts using the already authenticated page at this point.
    await use(page);
  },

  // Keep the existing descriptive name as an alias for older EventHub specs.
  authenticatedEventHubPage: async ({ authenticatedPage }, use) => {
    await use(authenticatedPage);
  },

  createEvent: async ({ request }, use) => {
    const eventHubApi = new EventHubApi(request);
    const eventHubToken = await eventHubApi.login(EVENT_HUB_USER);
    const eventDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Setup: create server-side state before the test body starts.
    const createdEvent = await eventHubApi.createEvent(eventHubToken, {
      title: `Fixture Event ${Date.now()}`,
      description: "Created by the Playwright createEvent fixture",
      category: "Workshop",
      venue: "Playwright Test Lab",
      city: "Vancouver",
      eventDate,
      price: 25,
      totalSeats: 10,
    });

    try {
      // Yield: expose the typed event ID and title to the test.
      await use(createdEvent);
    } finally {
      // Teardown: remove the event even when the assertion fails.
      await eventHubApi.deleteEvent(eventHubToken, createdEvent.id);
    }
  },
});

export { expect };
