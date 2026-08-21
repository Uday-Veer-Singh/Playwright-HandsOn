/** @format */

// Describe the exact shape required by the login API.
export interface LoginPayload {
  userEmail: string; // The API expects the user's email as a string.
  userPassword: string; // The API expects the user's password as a string.
}

// Type-check the reusable login test data against LoginPayload.
export const loginPayload: LoginPayload = {
  userEmail: "udaythakur.shely@gmail.com",
  userPassword: "Usually@12",
};
