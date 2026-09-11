/** @format */

export interface PurchaseProductData {
  name: string;
  expectedAvailability: string;
  expectedPrice: string;
  quantity: number;
}

export interface DeliveryData {
  countrySearchTerm: string;
  country: string;
}

export interface PurchaseData {
  product: PurchaseProductData;
  delivery: DeliveryData;
}

export const purchaseData: PurchaseData = {
  product: {
    name: "Blackberry",
    expectedAvailability: "In Stock",
    expectedPrice: "50000",
    quantity: 1,
  },
  delivery: {
    countrySearchTerm: "ind",
    country: "India",
  },
};
