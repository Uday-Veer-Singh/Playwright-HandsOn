/** @format */

// Describe one order item accepted by the create-order API.
export interface OrderItem {
  country: string; // Country associated with this order item.
  productOrderedId: string; // One valid product ID; multiple IDs need separate items.
}

// Describe the complete request body expected by the create-order API.
export interface OrderPayload {
  orders: OrderItem[]; // The endpoint expects an array named "orders".
}

// Type-check the reusable order test data against OrderPayload.
export const orderPayload: OrderPayload = {
  orders: [
    {
      country: "India",
      productOrderedId: "6960eae1c941646b7a8b3ed3",
    },
  ],
};
