/** @format */

import { expect, type Page } from "@playwright/test";
import {
  APP_URLS,
  CLIENT_APP_USER,
  type EmailCredentials,
} from "../../config/test-config";

export async function loginToClientApp(
  page: Page,
  credentials: EmailCredentials = CLIENT_APP_USER
): Promise<void> {
  await page.goto(APP_URLS.clientApp.login);

  await expect(page.getByText("Log in")).toBeVisible();

  await page.getByPlaceholder("email@example.com").fill(credentials.email);
  await page
    .getByPlaceholder("enter your passsword")
    .fill(credentials.password);
  await page.locator("#login").click();

  await expect(page.locator(".logo-holder")).toBeVisible();
}
