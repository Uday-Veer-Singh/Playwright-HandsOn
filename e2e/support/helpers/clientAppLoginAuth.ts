/** @format */

import { expect, Page } from "@playwright/test";

export const BASE_URL = "https://rahulshettyacademy.com/client/#/auth";
export const email = "udaythakur.shely@gmail.com";
export const password = "Usually@12";

export async function clientAppLoginAuth(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/login`);

  await expect(page.getByText("Log in")).toBeVisible();

  await page.getByPlaceholder("email@example.com").fill(email);
  await page.getByPlaceholder("enter your passsword").fill(password);
  await page.locator("#login").click();

  await expect(page.locator(".logo-holder")).toBeVisible();
}
