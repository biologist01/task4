"use client";

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";

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

const LoginPage = () => {
  // Form state for login credentials
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignupButton, setShowSignupButton] = useState(false);

  // State for saved user data (if any)
  const [savedUser, setSavedUser] = useState<UserData | null>(null);

  const router = useRouter();

  // Check if user data is already in local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setSavedUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle login form submission
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

      // Compare the entered password with the stored (hashed) password
      // (In production, use bcrypt or another secure comparison)
      const isPasswordValid = atob(user.password) === password;

      if (!isPasswordValid) {
        setMessage("Invalid password. Please try again.");
      } else {
        setMessage("Login successful!");

        // Prepare non-sensitive user data
        const userData: UserData = {
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          address: user.address,
        };

        // Save user data to local storage (do not store password)
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to the home page after successful login
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user data is already saved, show their details instead of the login form
  if (savedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">You&rsquo;re Logged In!</h2>
          <p className="mb-2"><strong>Name:</strong> {savedUser.name}</p>
          <p className="mb-2"><strong>Email:</strong> {savedUser.email}</p>
          <p className="mb-2"><strong>Mobile Number:</strong> {savedUser.mobileNumber}</p>
          <div className="mb-2">
            <strong>Address:</strong>
            <p>{savedUser.address.street}</p>
            <p>{savedUser.address.city}, {savedUser.address.state}</p>
            <p>{savedUser.address.country} - {savedUser.address.postalCode}</p>
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

  // Otherwise, render the login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
            onClick={() => router.push("/signup")}
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