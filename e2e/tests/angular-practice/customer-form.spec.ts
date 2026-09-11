/** @format */

import { test, expect } from "@playwright/test";
import {
  CUSTOMER_FORM_SUCCESS_MESSAGE,
  customerFormData,
} from "../../data/angular-practice/customer-form-data";
import { AngularPracticeCustomerFormPage } from "../../pages/angular-practice/customer-form-page";

test(
  "a customer can submit the practice form",
  { tag: ["@ui", "@angular-practice", "@form"] },
  async ({ page }) => {
    const customerFormPage = new AngularPracticeCustomerFormPage(page);

    await test.step("Enter and verify the customer information", async () => {
      await customerFormPage.open();
      await customerFormPage.fill(customerFormData);
      await customerFormPage.expectValues(customerFormData);
    });

    await test.step("Submit the form successfully", async () => {
      await customerFormPage.submit();
      await expect(customerFormPage.successAlert).toContainText(
        CUSTOMER_FORM_SUCCESS_MESSAGE
      );
    });
  }
);
