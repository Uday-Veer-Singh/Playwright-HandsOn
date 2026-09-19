/** @format */

import { Locator, Page } from "@playwright/test";

export interface LoginPageElements {
  page: Page;
  usernameInput: Locator;
  passwordInput: Locator;
  loginBtn: Locator;
}

export class LoginPagePOM implements LoginPageElements {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#userEmail");
    this.passwordInput = page.locator("#userPassword");
    this.loginBtn = page.locator("[value='Login']");
  }

  async goToLoginPage(): Promise<void> {
    await this.page.goto("https://rahulshettyacademy.com/client", {
      waitUntil: "domcontentloaded",
    });
  }

  async validLogin(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}
