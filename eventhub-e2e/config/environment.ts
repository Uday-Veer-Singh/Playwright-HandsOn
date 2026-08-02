import { existsSync } from "node:fs";
import { resolve } from "node:path";

const localEnvironmentFile = resolve(__dirname, "../.env");

// Node.js loads the local file only when it exists. CI can inject the same
// variables directly, so no credentials need to be stored in source control.
if (existsSync(localEnvironmentFile)) {
  process.loadEnvFile(localEnvironmentFile);
}

export const BASE_URL =
  process.env.EVENTHUB_BASE_URL ??
  "https://eventhub.rahulshettyacademy.com";

export interface EventHubCredentials {
  email: string;
  password: string;
}

export function getEventHubCredentials(): EventHubCredentials {
  const email = process.env.EVENTHUB_EMAIL?.trim();
  const password = process.env.EVENTHUB_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing EventHub credentials. Copy eventhub-e2e/.env.example to " +
        "eventhub-e2e/.env and provide EVENTHUB_EMAIL and EVENTHUB_PASSWORD."
    );
  }

  return { email, password };
}
