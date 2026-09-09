/** @format */

import { expect, type Page } from "@playwright/test";
import {
  APP_URLS,
  EVENT_HUB_USER,
  type EmailCredentials,
} from "../../config/test-config";

export async function loginToEventHub(
  page: Page,
  credentials: EmailCredentials = EVENT_HUB_USER
): Promise<void> {
  await page.goto(APP_URLS.eventHub.login);
  await expect(
    page.getByRole("heading", { name: "Sign in to EventHub" })
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Email" }).fill(credentials.email);
  await page.locator('input[type="password"]').fill(credentials.password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByRole("link", { name: /Browse Events/ })
  ).toBeVisible();
}
