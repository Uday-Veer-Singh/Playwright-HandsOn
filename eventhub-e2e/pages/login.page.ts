import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly browseEventsLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder("you@email.com");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.locator("#login-btn");
    this.browseEventsLink = page.getByRole("link", {
      name: /^Browse Events/,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
