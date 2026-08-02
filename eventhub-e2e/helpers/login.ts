import { expect, type Page } from "@playwright/test";
import { getEventHubCredentials } from "../config/environment";
import { LoginPage } from "../pages/login.page";

/**
 * Reusable authenticated precondition for EventHub UI tests.
 */
export async function login(page: Page): Promise<void> {
  const credentials = getEventHubCredentials();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.signIn(credentials.email, credentials.password);

  // A user-facing navigation link confirms that authentication succeeded.
  await expect(loginPage.browseEventsLink).toBeVisible();
}
