/** @format */

export type CustomerGender = "Male" | "Female";
export type EmploymentStatus = "Student" | "Employed";

export interface CustomerFormData {
  name: string;
  email: string;
  password: string;
  lovesIceCream: boolean;
  gender: CustomerGender;
  employmentStatus: EmploymentStatus;
  dateOfBirth: string;
}

export const customerFormData: CustomerFormData = {
  name: "badshah",
  email: "badshah@123",
  password: "Usually@12",
  lovesIceCream: true,
  gender: "Male",
  employmentStatus: "Employed",
  dateOfBirth: "2024-06-10",
};

export const CUSTOMER_FORM_SUCCESS_MESSAGE =
  "The Form has been submitted successfully";
