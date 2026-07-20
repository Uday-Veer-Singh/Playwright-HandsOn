/** @format */

import { test, expect } from "@playwright/test";

test("test1", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/practice");
  await expect(page.locator("h1")).toHaveText(
    "Master QA Testing Through Practice"
  );
});

test("test with invalid credentials", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await page.locator("#username").fill("rahulshettyacademy");
  await page.locator("#password").fill("Learning@830$3K2");
  await page.locator(".customradio").nth(0).click();
  await page.locator("#terms").click();
  await page.locator("#signInBtn").click();

  console.log(await page.locator("[style*='block']").textContent());

  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
});

test("test with valid credentials", async ({ page }) => {
  const userName = page.locator("#username");
  const password = page.locator("#password");
  const cardDetails = page.locator(".card a");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await userName.fill("rahulshettyacademy");
  await password.fill("Learning@830$3mK2");
  await page.locator(".customradio").nth(0).click();
  await page.locator("#terms").click();
  await page.locator("#signInBtn").click();

  console.log(await page.locator("[style*='none']").textContent());

  console.log(await cardDetails.nth(0).textContent());
  console.log(await cardDetails.first().textContent());

  // when you comment out the above text content statements then the alltexcontents will not show any text content because the page is not fully loaded yet. So we need to wait for the page to load before getting the text content of all the cards.

  console.log(await cardDetails.allTextContents());
});

test("test with client app", async ({ page }) => {
  const userNameField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginBtn = page.locator("#login");

  await page.goto("https://rahulshettyacademy.com/client/auth/login");
  await expect(page.locator(".title").first()).toContainText(
    "Rahul Shetty Academy"
  );

  await userNameField.fill("udaythakur.shely@gmail.com");
  await passwordField.fill("Usually@12");
  await loginBtn.click();

  await expect(page.locator("h3")).toContainText("Automation");

  // await page.waitForLoadState("networkidle");

  const cardDetails = page.locator(".card-body b");
  await cardDetails.first().waitFor();
  expect(cardDetails).not.toBeNull();
  console.log(await cardDetails.allTextContents());
});

test("UI controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userNameField = page.locator("#username");
  const passwordField = page.locator("#password");
  const dropdownList = page.locator("select.form-control");
  const radioButton = page.locator(".customradio").nth(1);
  const okBtn = page.locator("#okayBtn");
  const agTerms = page.locator("#terms");
  const blinkingTxt = page.locator("[href*=documents-request]");

  const consultOption = await dropdownList.selectOption("consult");
  expect(await dropdownList.inputValue()).toBe("consult");

  await radioButton.click();
  await okBtn.click();
  await expect(radioButton).toBeChecked();

  await agTerms.click();
  await expect(agTerms).toBeChecked();

  await expect(blinkingTxt).toHaveAttribute("class", "blinkingText");

  // await page.pause();
});

test("Child window handeling", async ({ page, context }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const docLink = page.locator("[href*=documents-request]");
  const userNameField = page.locator("#username");

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    docLink.click(),
  ]);

  const newPageTxt = await newPage.locator(".red").innerText();

  const emailTxt = newPageTxt.split("@");
  const emailSplitted = emailTxt[1].split(" ")[0];

  await userNameField.fill(emailSplitted);
  const inputText = await userNameField.inputValue();
  console.log(inputText);
  expect(await userNameField.inputValue()).toBe(emailSplitted);

  const checkLink = newPage.locator(".theme-btn").last();

  await checkLink.click();
});
