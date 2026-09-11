/** @format */

import type { APIRequestContext, APIResponse } from "@playwright/test";
import { EVENT_HUB_API, type EmailCredentials } from "../../config/test-config";

interface LoginResponse {
  token?: string;
}

interface EventResponse {
  data: Array<{
    id: number;
  }>;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  category:
    | "Conference"
    | "Concert"
    | "Sports"
    | "Workshop"
    | "Festival";
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
  imageUrl?: string;
}

export interface CreatedEvent {
  id: number;
  title: string;
}

interface CreateEventResponse {
  data?: {
    id?: number;
    title?: string;
  };
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

    await this.ensureOk(response, `Login ${user.email}`);

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
      headers: this.authorizationHeaders(token),
    });

    await this.ensureOk(response, "Fetch events");
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
      headers: this.authorizationHeaders(token),
      data: payload,
    });

    await this.ensureOk(response, "Create booking");

    const body = (await response.json()) as BookingResponse;
    const bookingId = body.data?.id;

    if (typeof bookingId !== "number") {
      throw new Error(
        `No booking ID found in the booking response: ` + JSON.stringify(body)
      );
    }
    return bookingId;
  }

  async createEvent(
    token: string,
    payload: CreateEventPayload
  ): Promise<CreatedEvent> {
    const response = await this.request.post(EVENT_HUB_API.events, {
      headers: this.authorizationHeaders(token),
      data: payload,
    });

    await this.ensureOk(response, "Create event");

    const body = (await response.json()) as CreateEventResponse;
    const eventId = body.data?.id;
    const eventTitle = body.data?.title;

    if (typeof eventId !== "number" || typeof eventTitle !== "string") {
      throw new Error(
        `Create-event response did not contain data.id and data.title: ` +
          JSON.stringify(body)
      );
    }

    return { id: eventId, title: eventTitle };
  }

  async deleteEvent(token: string, eventId: number): Promise<void> {
    const response = await this.request.delete(
      `${EVENT_HUB_API.events}/${eventId}`,
      {
        headers: this.authorizationHeaders(token),
      }
    );

    await this.ensureOk(response, `Delete event ${eventId}`);
  }

  private authorizationHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private async ensureOk(
    response: APIResponse,
    operation: string
  ): Promise<void> {
    if (!response.ok()) {
      throw new Error(
        `${operation} failed with HTTP ${response.status()}: ` +
          (await response.text())
      );
    }
  }
}
