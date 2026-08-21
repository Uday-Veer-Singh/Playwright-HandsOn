/** @format */

// Import this as a type because it is used only for TypeScript checking.
import type { APIRequestContext } from "@playwright/test";
// Import the fixture types instead of importing specific fixture values.
import type { LoginPayload } from "../fixtures/loginPayload";
import type { OrderPayload } from "../fixtures/orderPayload";

// Describe the portion of the successful login response that this helper uses.
interface LoginResponseBody {
  token?: string; // Optional until runtime validation confirms that it exists.
  message?: string; // Useful diagnostic text when the API rejects the request.
}

// Describe the portion of the successful create-order response that we use.
interface OrderResponseBody {
  orders?: string[]; // Successful responses contain the created order IDs.
  message?: string; // Failed responses commonly contain an error message.
}

// Keep reusable API operations separate from browser Page Objects.
export class APIUtils {
  // Parameter properties declare and initialize both private class fields.
  constructor(
    private readonly apiContext: APIRequestContext,
    private readonly loginPayload: LoginPayload
  ) {}

  // Log in through the API and resolve to a token string.
  async getToken(): Promise<string> {
    // Wait until Playwright receives the login HTTP response.
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload }
    );

    // Fail with useful response information instead of using an undefined token.
    if (!loginResponse.ok()) {
      throw new Error(
        `Login API failed with ${loginResponse.status()}: ${await loginResponse.text()}`
      );
    }

    // Tell TypeScript which response fields this endpoint is expected to return.
    const loginResponseBody =
      (await loginResponse.json()) as LoginResponseBody;

    // Narrow token from string | undefined to string before returning it.
    if (!loginResponseBody.token) {
      throw new Error(
        `Login API response did not contain a token: ${JSON.stringify(loginResponseBody)}`
      );
    }

    // The declared Promise<string> now resolves with a validated string.
    return loginResponseBody.token;
  }

  // Create an order and resolve to the first order ID returned by the API.
  async createOrder(
    orderPayload: OrderPayload,
    loginToken: string
  ): Promise<string> {
    // Use the API context stored by the constructor and await the HTTP response.
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload, // Playwright serializes this typed object as JSON.
        headers: {
          Authorization: loginToken, // This is a string, not Promise<string>.
          "content-type": "application/json",
        },
      }
    );

    // Stop immediately if order creation returned a non-2xx response.
    if (!orderResponse.ok()) {
      throw new Error(
        `Create-order API failed with ${orderResponse.status()}: ${await orderResponse.text()}`
      );
    }

    // Parse and type the JSON response after confirming that the request succeeded.
    const orderResponseBody =
      (await orderResponse.json()) as OrderResponseBody;

    // Array access can produce undefined, so validate the result at runtime.
    const orderId = orderResponseBody.orders?.[0];
    if (!orderId) {
      throw new Error(
        `Create-order API response contained no order ID: ${JSON.stringify(orderResponseBody)}`
      );
    }

    // Return a validated string to the calling setup hook.
    return orderId;
  }
}
