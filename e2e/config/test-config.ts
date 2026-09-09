/** @format */

export interface EmailCredentials {
  email: string;
  password: string;
}

function envOrDefault(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

const ACADEMY_BASE_URL = "https://rahulshettyacademy.com";
const EVENT_HUB_BASE_URL = "https://eventhub.rahulshettyacademy.com";

export const APP_URLS = {
  clientApp: {
    home: `${ACADEMY_BASE_URL}/client`,
    login: `${ACADEMY_BASE_URL}/client/auth/login`,
  },
  eventHub: {
    home: EVENT_HUB_BASE_URL,
    login: `${EVENT_HUB_BASE_URL}/login`,
    events: `${EVENT_HUB_BASE_URL}/events`,
    bookings: `${EVENT_HUB_BASE_URL}/bookings`,
    adminEvents: `${EVENT_HUB_BASE_URL}/admin/events`,
  },
  practice: {
    home: `${ACADEMY_BASE_URL}/practice`,
    login: `${ACADEMY_BASE_URL}/loginpagePractise/`,
    automation: `${ACADEMY_BASE_URL}/AutomationPractice/`,
  },
  angularPractice: {
    home: `${ACADEMY_BASE_URL}/angularpractice/`,
    shop: `${ACADEMY_BASE_URL}/angularpractice/shop`,
  },
} as const;

export const CLIENT_APP_API = {
  login: `${ACADEMY_BASE_URL}/api/ecom/auth/login`,
  createOrder: `${ACADEMY_BASE_URL}/api/ecom/order/create-order`,
  orderDetails: `${ACADEMY_BASE_URL}/api/ecom/order/get-orders-details`,
  orderDetailsPattern: "**/api/ecom/order/get-orders-details?id=*",
  customerOrdersPattern: "**/api/ecom/order/get-orders-for-customer/*",
} as const;

export const CLIENT_APP_USER: EmailCredentials = {
  email: envOrDefault(
    "CLIENT_APP_EMAIL",
    "udaythakur.shely@gmail.com"
  ),
  password: envOrDefault("CLIENT_APP_PASSWORD", "Usually@12"),
};

export const EVENT_HUB_USER: EmailCredentials = {
  email: envOrDefault("EVENT_HUB_EMAIL", "mango@gmail.com"),
  password: envOrDefault("EVENT_HUB_PASSWORD", "Usually@12"),
};

export const PRACTICE_USER = {
  username: envOrDefault("PRACTICE_USERNAME", "rahulshettyacademy"),
  password: envOrDefault("PRACTICE_PASSWORD", "Learning@830$3mK2"),
} as const;
