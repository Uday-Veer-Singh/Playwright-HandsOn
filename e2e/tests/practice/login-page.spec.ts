/** @format */

import { test, expect, type Page } from "@playwright/test";
import { APP_URLS, PRACTICE_USER } from "../../config/test-config";

async function submitStudentLogin(page: Page, password: string): Promise<void> {
  await page.locator("#username").fill(PRACTICE_USER.username);
  await page.locator("#password").fill(password);
  await page.locator(".customradio").first().click();
  await page.locator("#terms").check();
  await page.locator("#signInBtn").click();
}

test.describe(
  "practice login page",
  { tag: ["@ui", "@practice", "@login"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(APP_URLS.practice.login);
    });

    test("rejects invalid credentials", async ({ page }) => {
      await submitStudentLogin(page, `${PRACTICE_USER.password}-invalid`);
      await expect(page.locator("[style*='block']")).toContainText(
        "Incorrect"
      );
    });

    test("accepts valid credentials", async ({ page }) => {
      await submitStudentLogin(page, PRACTICE_USER.password);

      const productLinks = page.locator(".card a");
      await expect(productLinks.first()).toBeVisible();
      expect(await productLinks.count()).toBeGreaterThan(0);
    });

    test("supports role, terms, and dropdown controls", async ({ page }) => {
      const role = page.locator(".customradio").nth(1);
      const terms = page.locator("#terms");
      const userType = page.locator("select.form-control");

      await userType.selectOption("consult");
      await expect(userType).toHaveValue("consult");

      await role.click();
      await page.locator("#okayBtn").click();
      await expect(role).toBeChecked();

      await terms.check();
      await expect(terms).toBeChecked();
      await expect(
        page.locator("[href*=documents-request]")
      ).toHaveAttribute("class", "blinkingText");
    });

    test("can use information from a child window", async ({
      page,
      context,
    }) => {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.locator("[href*=documents-request]").click(),
      ]);

      try {
        const helpText = await newPage.locator(".red").innerText();
        const emailAddress = helpText.match(/[\w.-]+@[\w.-]+/i)?.[0];
        expect(emailAddress, "The child window should show an email").toBeTruthy();

        const username = emailAddress!.split("@")[1];
        await page.locator("#username").fill(username);
        await expect(page.locator("#username")).toHaveValue(username);
      } finally {
        await newPage.close();
      }
    });
  }
);
