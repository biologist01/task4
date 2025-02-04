"use client";

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
  mobileNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

const SignUpPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false);

  // State for saved user data (if any)
  const [savedUser, setSavedUser] = useState<UserData | null>(null);

  const router = useRouter();

  // On mount, check if user data exists in local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setSavedUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle signup form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setShowLoginButton(false);

    const { name, email, password, mobileNumber, street, city, state, country, postalCode } =
      formData;

    try {
      // Check if user already exists
      const existingUser = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email }
      );

      if (existingUser) {
        setMessage("Email is already registered. Please log in.");
        setShowLoginButton(true);
        setIsLoading(false);
        return;
      }

      // Simulate password hashing (use server-side hashing in production)
      const hashedPassword = btoa(password);

      // Create the user document
      const newUser = {
        _type: "user",
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        address: {
          street,
          city,
          state,
          country,
          postalCode,
        },
        isVerified: false,
        role: "user",
      };

      await client.create(newUser);
      setMessage("User signed up successfully!");

      // Prepare non-sensitive data for storage
      const userData: UserData = {
        name,
        email,
        mobileNumber,
        address: { street, city, state, country, postalCode },
      };

      // Save to local storage
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to home page after signup
      router.push("/");
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If a user is already stored, show their details instead of the signup form
  if (savedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">You&rsquo;re Signed Up!</h2>
          <p className="mb-2"><strong>Name:</strong> {savedUser.name}</p>
          <p className="mb-2"><strong>Email:</strong> {savedUser.email}</p>
          <p className="mb-2"><strong>Mobile Number:</strong> {savedUser.mobileNumber}</p>
          <div className="mb-2">
            <strong>Address:</strong>
            <p>{savedUser.address.street}</p>
            <p>
              {savedUser.address.city}, {savedUser.address.state}
            </p>
            <p>
              {savedUser.address.country} - {savedUser.address.postalCode}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render the signup form along with the "Already have an account? Login" text.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {(Object.keys(formData) as Array<keyof typeof formData>).map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={
                field === "mobileNumber"
                  ? "Mobile Number"
                  : field === "postalCode"
                  ? "Postal Code"
                  : field[0].toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")
              }
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded"
              required
            />
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
        {showLoginButton && (
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-green-600 text-white py-3 rounded mt-4 hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;