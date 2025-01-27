"use client";

import React, { useState } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignupButton, setShowSignupButton] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setShowSignupButton(false);

    const { email, password } = formData;

    try {
      // Fetch the user with the given email
      const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
        email,
      });

      if (!user) {
        setMessage("Email not found. Please sign up.");
        setShowSignupButton(true);
        setIsLoading(false);
        return;
      }

      // Compare the entered password with the stored password
      const isPasswordValid = atob(user.password) === password; // Replace with bcrypt comparison in production

      if (!isPasswordValid) {
        setMessage("Invalid password. Please try again.");
      } else {
        setMessage("Login successful!");
        // Navigate to another page or perform further actions here
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
        {showSignupButton && (
          <button
            onClick={() => router.push("/signup")} // Update the route to your signup page
            className="w-full bg-green-600 text-white py-3 rounded mt-4 hover:bg-green-700 transition"
          >
            Go to Sign Up
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;