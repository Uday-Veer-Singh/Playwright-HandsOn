/** @format */
import { request, expect, test } from "@playwright/test";
import { loginPayload } from "../../tests/WebAPI.spec";

export class APIUtils {
  constructor(apiCotext) {}
  async getLoginToken() {
    const loginResponse = await request.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: loginPayload,
      }
    );

    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseBody = await loginResponse.json();
    const loginToken = loginResponseBody.token;
    return loginToken;
  }
}
