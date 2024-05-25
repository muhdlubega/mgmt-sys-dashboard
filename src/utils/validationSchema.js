import * as Yup from "yup";

const geoSchema = Yup.object().shape({
  lat: Yup.number()
    .nullable()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: Yup.number()
    .nullable()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

const addressSchema = Yup.object().shape({
  street: Yup.string().nullable().max(50, "Must be less than 50 characters"),
  suite: Yup.string().nullable().max(50, "Must be less than 50 characters"),
  city: Yup.string().nullable().max(50, "Must be less than 50 characters"),
  zipcode: Yup.string()
    .nullable()
    .matches(/^\d{5}(-\d{4})?$/, "Must be a valid zip code")
    .max(50, "Must be less than 50 characters"),
  geo: geoSchema,
});

const companySchema = Yup.object().shape({
  name: Yup.string().nullable().max(50, "Must be less than 50 characters"),
  catchPhrase: Yup.string()
    .nullable()
    .max(50, "Must be less than 50 characters"),
  bs: Yup.string().nullable().max(50, "Must be less than 50 characters"),
});

const userSettingsSchema = Yup.object().shape({
  displayName: Yup.string()
    .nullable()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters long"),
  username: Yup.string()
    .nullable()
    .min(2, "Username must be at least 2 characters long")
    .max(50, "Username must be less than 50 characters long")
    .matches(
      /^[a-zA-Z0-9_.-]*$/,
      "Username can only contain letters, numbers, underscores, hyphens, and periods"
    ),
  address: addressSchema,
  phone: Yup.string()
    .nullable()
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits")
    .max(50, "Must be less than 50 characters"),
  website: Yup.string()
    .url("Must be a valid URL")
    .nullable()
    .max(50, "Must be less than 50 characters"),
  company: companySchema,
});

export const recentTransactionsSchema = Yup.object().shape({
  description: Yup.string()
    .max(50, "Description must be 50 characters or less")
    .required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
});

export const pendingOrdersSchema = Yup.object().shape({
  description: Yup.string()
    .max(50, "Description must be 50 characters or less")
    .required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
});

export const inventorySchema = Yup.object().shape({
  description: Yup.string()
    .max(50, "Description must be 50 characters or less")
    .required("Description is required"),
  quantity: Yup.number()
    .positive("Quantity must be positive")
    .required("Quantity is required"),
});

export const todoSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

export default userSettingsSchema;
