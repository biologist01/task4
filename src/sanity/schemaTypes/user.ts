const user = {
    name: "user",
    type: "document",
    title: "User",
    fields: [
      { name: "name", type: "string", title: "Name" },
      { name: "email", type: "string", title: "Email" },
      { name: "mobileNumber", type: "string", title: "Mobile Number" },
      { name: "password", type: "string", title: "password" },
      {
        name: "address",
        type: "object",
        title: "Address",
        fields: [
          { name: "street", type: "string", title: "Street" },
          { name: "city", type: "string", title: "City" },
          { name: "state", type: "string", title: "State" },
          { name: "country", type: "string", title: "Country" },
          { name: "postalCode", type: "string", title: "Postal Code" },
        ],
      },
      { name: "isVerified", type: "boolean", title: "Is Verified", initialValue: false },
      { name: "role", type: "string", title: "Role", options: { list: ["user", "admin"] } },
    ],
  };
  export default user;
  