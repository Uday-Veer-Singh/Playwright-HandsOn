/** @format */

import { test, expect } from "@playwright/test";
import { LoginPagePOM } from "./LoginPagePOM";
import { DashboardPagePOM } from "./DashboardPagePOM";

test(
  "Client app login with page object model",
  { tag: ["@ui", "@login", "@client-app", "@pom"] },
  async ({ page }) => {
    const username = "anshika@gmail.com";
    const password = "Iamking@000";
    const productName = "zara coat 4";

    const loginPage = new LoginPagePOM(page);
    await loginPage.goToLoginPage();
    await loginPage.validLogin(username, password);
    await expect(page).toHaveURL(/dashboard/);

    const dashboardPage = new DashboardPagePOM(page);
    await dashboardPage.searchProdcutAddCart(productName);
    await dashboardPage.navigateToCart();
  }
);
