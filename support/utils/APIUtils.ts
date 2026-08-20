/** @format */
import { request, expect, test } from "@playwright/test";
import { loginPayload } from "../../tests/WebAPI.spec";
import { apiContext } from "../";

export class APIUtils {
  constructor(apiContext) {}
  async getToken() {
    //Login API Call to get the token
    const loginResponse = await apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: loginPayload,
      }
    );

    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseBody = await loginResponse.json();
    const loginToken = loginResponseBody.token;
    console.log(loginToken);
    return loginToken;
  }
}
