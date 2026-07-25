/** @format */

import { test, expect } from "@playwright/test";

test("submit the customer form and complete a product purchase", async ({
  page,
}) => {
  const customerName = "badshah";
  const customerEmail = "badshah@123";
  const customerPassword = "Usually@12";
  const dateOfBirth = "2024-06-10";
  const productName = "Blackberry";
  const expectedPrice = "50000";
  const deliveryCountry = "India";

  await test.step("Submit the customer form successfully", async () => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");

    // Use form-scoped locators because the page contains duplicate name fields.
    const nameInput = page.locator('form input[name="name"]');
    const emailInput = page.locator('form input[name="email"]');
    const passwordInput = page.getByPlaceholder("Password");
    const iceCreamCheckbox = page.getByLabel(
      "Check me out if you Love IceCreams!"
    );
    const genderSelect = page.getByLabel("Gender");
    const employmentRadio = page.getByLabel("Employed");
    const dateOfBirthInput = page.locator('form input[name="bday"]');

    await nameInput.fill(customerName);
    await emailInput.fill(customerEmail);
    await passwordInput.fill(customerPassword);
    await iceCreamCheckbox.check();
    await genderSelect.selectOption("Male");
    await employmentRadio.check();
    await dateOfBirthInput.fill(dateOfBirth);

    // Verify the form state before submitting it.
    await expect(nameInput).toHaveValue(customerName);
    await expect(emailInput).toHaveValue(customerEmail);
    await expect(passwordInput).toHaveValue(customerPassword);
    await expect(iceCreamCheckbox).toBeChecked();
    await expect(genderSelect).toHaveValue("Male");
    await expect(employmentRadio).toBeChecked();
    await expect(dateOfBirthInput).toHaveValue(dateOfBirth);

    await page.getByRole("button", { name: "Submit" }).click();

    // Confirm that the application accepted the form submission.
    const successAlert = page.locator(".alert-success");
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText(
      "The Form has been submitted successfully"
    );
  });

  await test.step("Add the selected product to the cart", async () => {
    await page.getByRole("link", { name: "Shop" }).click();
    await expect(page).toHaveURL(/\/angularpractice\/shop/);

    const productCard = page
      .locator("app-card")
      .filter({ hasText: productName });
    const addButton = productCard.getByRole("button");

    await expect(productCard).toBeVisible();
    await expect(productCard).toContainText(productName);
    await expect(productCard).toContainText(expectedPrice);
    await expect(addButton).toBeEnabled();
    await addButton.click();
  });

  await test.step("Open the cart in desktop or responsive layout", async () => {
    // Bootstrap keeps both controls in the DOM: the toggler is visible only
    // on smaller screens, while Checkout is initially visible on desktop.
    const shopNavbar = page.locator("nav.navbar-expand-lg");
    const navbarToggle = shopNavbar.locator(".navbar-toggler");
    const cartLink = shopNavbar.getByText(/Checkout/i);

    if (await navbarToggle.isVisible()) {
      await navbarToggle.click();
    }

    await expect(cartLink).toBeVisible();
    await expect(cartLink).toContainText("1");
    await cartLink.click();
  });

  await test.step("Verify the cart and continue to checkout", async () => {
    const productRow = page.locator("tbody tr").filter({
      hasText: productName,
    });
    const quantityInput = productRow.locator('input[type="number"]');
    const totalRow = page.locator("tbody tr").filter({ hasText: "Total" });

    // Verify product identity, availability, quantity, price, and cart total.
    await expect(productRow).toHaveCount(1);
    await expect(productRow).toContainText(productName);
    await expect(productRow).toContainText("In Stock");
    await expect(productRow).toContainText(expectedPrice);
    await expect(quantityInput).toHaveValue("1");
    await expect(totalRow).toContainText(expectedPrice);

    const checkoutButton = page.getByRole("button", { name: "Checkout" });
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();
  });

  await test.step("Enter delivery details and complete the purchase", async () => {
    const countryInput = page.locator("#country");
    const termsCheckbox = page.locator("#checkbox2");
    const purchaseButton = page.getByRole("button", { name: "Purchase" });

    // Confirm that checkout loaded before interacting with its controls.
    await expect(
      page.getByText("Please choose your delivery location", { exact: false })
    ).toBeVisible();
    await expect(countryInput).toBeVisible();
    await expect(purchaseButton).toBeVisible();

    await countryInput.fill(deliveryCountry);
    await termsCheckbox.check();

    await expect(countryInput).toHaveValue(deliveryCountry);
    await expect(termsCheckbox).toBeChecked();
    await expect(purchaseButton).toBeEnabled();
    await purchaseButton.click();

    // Final E2E assertion: the application confirms the completed purchase.
    await expect(page.getByText(/Success! Thank you!/i)).toBeVisible();
  });
});
