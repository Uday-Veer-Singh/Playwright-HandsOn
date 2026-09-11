/** @format */

import { expect, type Locator, type Page } from "@playwright/test";
import { APP_URLS } from "../../config/test-config";
import type {
  CustomerFormData,
  EmploymentStatus,
} from "../../data/angular-practice/customer-form-data";

export class AngularPracticeCustomerFormPage {
  readonly successAlert: Locator;

  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly iceCreamCheckbox: Locator;
  private readonly genderSelect: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    // The form scope avoids the duplicate name field elsewhere on the page.
    this.nameInput = page.locator('form input[name="name"]');
    this.emailInput = page.locator('form input[name="email"]');
    this.passwordInput = page.getByPlaceholder("Password");
    this.iceCreamCheckbox = page.getByLabel(
      "Check me out if you Love IceCreams!"
    );
    this.genderSelect = page.getByLabel("Gender");
    this.dateOfBirthInput = page.locator('form input[name="bday"]');
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.successAlert = page.locator(".alert-success");
  }

  private employmentRadio(status: EmploymentStatus): Locator {
    return this.page.getByLabel(status, { exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(APP_URLS.angularPractice.home);
    await expect(this.submitButton).toBeVisible();
  }

  async fill(data: CustomerFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.iceCreamCheckbox.setChecked(data.lovesIceCream);
    await this.genderSelect.selectOption(data.gender);
    await this.employmentRadio(data.employmentStatus).check();
    await this.dateOfBirthInput.fill(data.dateOfBirth);
  }

  async expectValues(data: CustomerFormData): Promise<void> {
    await expect(this.nameInput).toHaveValue(data.name);
    await expect(this.emailInput).toHaveValue(data.email);
    await expect(this.passwordInput).toHaveValue(data.password);

    if (data.lovesIceCream) {
      await expect(this.iceCreamCheckbox).toBeChecked();
    } else {
      await expect(this.iceCreamCheckbox).not.toBeChecked();
    }

    await expect(this.genderSelect).toHaveValue(data.gender);
    await expect(this.employmentRadio(data.employmentStatus)).toBeChecked();
    await expect(this.dateOfBirthInput).toHaveValue(data.dateOfBirth);
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }
}
