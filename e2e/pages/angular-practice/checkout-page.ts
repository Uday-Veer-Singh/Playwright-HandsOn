/** @format */

import { expect, type Locator, type Page } from "@playwright/test";
import type { DeliveryData } from "../../data/angular-practice/purchase-data";

export class AngularPracticeCheckoutPage {
  readonly successMessage: Locator;

  private readonly deliveryPrompt: Locator;
  private readonly countryInput: Locator;
  private readonly countrySuggestions: Locator;
  private readonly termsCheckbox: Locator;
  private readonly purchaseButton: Locator;

  constructor(private readonly page: Page) {
    this.deliveryPrompt = page.getByText(
      "Please choose your delivery location",
      { exact: false }
    );
    this.countryInput = page.locator("#country");
    this.countrySuggestions = page.locator(".suggestions");
    this.termsCheckbox = page.getByLabel(/I agree with the term/i);
    this.purchaseButton = page.getByRole("button", { name: "Purchase" });
    this.successMessage = page.getByText(/Success! Thank you!/i);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.deliveryPrompt).toBeVisible();
    await expect(this.countryInput).toBeVisible();
    await expect(this.purchaseButton).toBeVisible();
  }

  async selectCountry(delivery: DeliveryData): Promise<void> {
    // This app loads suggestions from keyup events, so enter characters
    // sequentially instead of setting the complete value in one operation.
    await this.countryInput.pressSequentially(delivery.countrySearchTerm, {
      delay: 100,
    });

    // These anchors have no href, so the application exposes them as text,
    // not as elements with the accessible link role.
    const countryOption = this.countrySuggestions.getByText(delivery.country, {
      exact: true,
    });
    await expect(countryOption).toBeVisible({ timeout: 10_000 });
    await countryOption.click();

    await expect(this.countryInput).toHaveValue(delivery.country);
  }

  async acceptTerms(): Promise<void> {
    // The real checkbox is transparent beneath a styled label. Keyboard
    // interaction avoids pointer interception while exercising the control.
    await this.termsCheckbox.focus();
    await this.termsCheckbox.press("Space");
    await expect(this.termsCheckbox).toBeChecked();
  }

  async purchase(): Promise<void> {
    await expect(this.purchaseButton).toBeEnabled();
    await this.purchaseButton.click();
  }
}
