import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(50).error("Name must be between 3 and 50 characters."),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\S+@\S+\.\S+$/, { name: "email" })
          .error("Please enter a valid email address."),
    }),
    defineField({
      name: "password",
      title: "Password",
      type: "string",
      description: "Encrypted password (handled server-side)",
      hidden: true, // Optional: Avoid displaying this field in the Studio
    }),
    defineField({
      name: "mobileNumber",
      title: "Mobile Number",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{9,13}$/, { name: "mobile number" })
          .error("Mobile number must be exactly 10 digits."),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        {
          name: "street",
          title: "Street",
          type: "string",
          validation: (Rule) => Rule.required().error("Street is required."),
        },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required().error("City is required."),
        },
        {
          name: "state",
          title: "State",
          type: "string",
          validation: (Rule) => Rule.required().error("State is required."),
        },
        {
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required().error("Country is required."),
        },
        {
          name: "postalCode",
          title: "Postal Code",
          type: "string",
          validation: (Rule) =>
            Rule.required()
              .regex(/^\d{5}(-\d{4})?$/, { name: "postal code" })
              .error("Please enter a valid postal code."),
        },
      ],
    }),
    defineField({
      name: "isVerified",
      title: "Verified",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "User", value: "user" },
          { title: "Admin", value: "admin" },
        ],
      },
      initialValue: "user",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
});