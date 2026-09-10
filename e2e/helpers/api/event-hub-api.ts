/** @format */

import type { APIRequestContext } from "@playwright/test";
import { EVENT_HUB_API, type EmailCredentials } from "../../config/test-config";

interface LoginResponse {
  token?: string;
}

interface EventResponse {
  data: Array<{
    id: number;
  }>;
}

export interface CreateBookingPayload {
  eventId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
}

interface BookingResponse {
  data?: {
    id?: number;
  };
}

export class EventHubApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(user: EmailCredentials): Promise<string> {
    const response = await this.request.post(EVENT_HUB_API.login, {
      data: user,
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed with HTTP ${response.status()}: ` +
          (await response.text())
      );
    }

    const body = (await response.json()) as LoginResponse;

    if (!body.token) {
      throw new Error(
        `Login response did not contain a token: ` + JSON.stringify(body)
      );
    }

    return body.token;
  }
  async getFirstEventID(token: string): Promise<number> {
    const response = await this.request.get(EVENT_HUB_API.events, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to fetch events with HTTP ${response.status()}: ` +
          (await response.text())
      );
    }
    const body = (await response.json()) as EventResponse;
    const eventId = body.data[0]?.id;

    if (typeof eventId !== "number") {
      throw new Error(
        `No event ID found in the event response: ` + JSON.stringify(body)
      );
    }
    return eventId;
  }

  async createBooking(
    token: string,
    payload: CreateBookingPayload
  ): Promise<number> {
    const response = await this.request.post(EVENT_HUB_API.bookings, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (!response.ok()) {
      throw new Error(
        `Failed to create booking with HTTP ${response.status()}: ` +
          (await response.text())
      );
    }

    const body = (await response.json()) as BookingResponse;
    const bookingId = body.data?.id;

    if (typeof bookingId !== "number") {
      throw new Error(
        `No booking ID found in the booking response: ` + JSON.stringify(body)
      );
    }
    return bookingId;
  }
}
