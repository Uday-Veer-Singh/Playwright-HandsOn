/** @format */

import { expect, Page } from "@playwright/test";

export const BASE_URL = "https://eventhub.rahulshettyacademy.com";
export const email = "mango@gmail.com";
export const password = "Usually@12";

export async function eventHubLogin(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/login`);

  await expect(
    page.getByRole("heading", { name: "Sign in to EventHub" })
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByRole("link", { name: "Browse Events →" })
  ).toBeVisible();
}
