export interface EventData {
  title: string;
  description: string;
  city: string;
  venue: string;
  dateTime: string;
  price: number;
  totalSeats: number;
}

export interface BookingCustomer {
  fullName: string;
  email: string;
  phone: string;
}
