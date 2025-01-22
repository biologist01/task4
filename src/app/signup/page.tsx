// import type { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcryptjs";
// import { client } from "@/sanity/lib/client";
// // import { sanityClient } from "@/sanityClient";
// const sanityClient = client
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { email, password, name, mobileNumber, address } = req.body;

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     // 1. Check if user exists
//     const existingUser = await sanityClient.fetch(`*[_type == "user" && email == $email][0]`, {
//       email,
//     });

//     if (existingUser) {
//       // 2. User exists - validate password
//       const isValidPassword = await bcrypt.compare(password, existingUser.password);

//       if (!isValidPassword) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       return res.status(200).json({ message: "Sign-in successful", user: existingUser });
//     }

//     // 3. User does not exist - create new user
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = {
//       _type: "user",
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       address,
//       isVerified: false,
//       role: "user",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     const result = await sanityClient.create(newUser);

//     return res.status(201).json({ message: "User created successfully", user: result });
//   } catch (error) {
//     console.error("Error handling sign-in/sign-up:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }