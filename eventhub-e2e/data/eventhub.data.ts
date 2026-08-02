import type { BookingCustomer, EventData } from "../types/eventhub";

export const eventDefaults: Omit<EventData, "title" | "dateTime"> = {
  description: "Automated EventHub booking validation event",
  city: "Toronto",
  venue: "QA Automation Centre",
  price: 100,
  totalSeats: 50,
};

export const bookingCustomer: BookingCustomer = {
  fullName: "Automation Test User",
  email: "booking.user@example.com",
  phone: "+91 98765 43210",
};
