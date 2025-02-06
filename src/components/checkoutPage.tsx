"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { client } from "@/sanity/lib/client";

// Simple function to convert dollars to cents.
const convertToSubcurrency = (amount: number): number => Math.round(amount * 100);

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: "creditCard" | "cash";
}

interface OrderData {
  _type: "order";
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: "creditCard" | "cash";
  paymentStatus: "paid" | "cash on delivery";
  amount: number;
  createdAt: string;
  cartItems: number[];
}

const CheckoutForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "creditCard",
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  // Pre-fill user details from localStorage, if available.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setFormData({
            fullName: parsedUser.name || "",
            email: parsedUser.email || "",
            phone: parsedUser.mobileNumber || "",
            address: parsedUser.address?.street || "",
            city: parsedUser.address?.city || "",
            postalCode: parsedUser.address?.postalCode || "",
            country: parsedUser.address?.country || "",
            paymentMethod: "creditCard",
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  // Validate form fields.
  useEffect(() => {
    const valid =
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.country.trim() !== "";
    setIsFormValid(valid);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When Credit Card is selected, fetch PaymentIntent clientSecret.
  useEffect(() => {
    if (formData.paymentMethod === "creditCard") {
      const amount = localStorage.getItem("totalAmount");
      if (amount) {
        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: convertToSubcurrency(Number(amount)) }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret))
          .catch((error) => {
            console.error("Error creating PaymentIntent:", error);
            setErrorMessage("Failed to initiate payment.");
          });
      }
    }
  }, [formData.paymentMethod]);

  // Helper function to submit order data to Sanity.
  const submitOrderToSanity = async (orderData: OrderData): Promise<void> => {
    try {
      await client.create(orderData);
    } catch (error) {
      console.error("Error submitting order to Sanity:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isFormValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // Retrieve the amount from localStorage.
    const amountStored = localStorage.getItem("totalAmount");
    const amountValue = amountStored ? Number(amountStored) : 0;

    // Retrieve cart items from localStorage (assumed to be stored as a JSON array of numbers).
    const cartItemsString = localStorage.getItem("cartItems");
    const cartItems: number[] = cartItemsString ? JSON.parse(cartItemsString) : [];

    if (formData.paymentMethod === "cash") {
      // For Cash on Delivery, build order data with paymentStatus "cash on delivery".
      const orderData: OrderData = {
        _type: "order",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "cash on delivery",
        amount: amountValue,
        createdAt: new Date().toISOString(),
        cartItems: cartItems,
      };

      await submitOrderToSanity(orderData);
      alert("Order Placed Successfully! (Cash on Delivery)");
      router.push("/ordercompleted");
      return;
    }

    if (formData.paymentMethod === "creditCard") {
      setLoading(true);
      if (!stripe || !elements) {
        setErrorMessage("Stripe is not loaded yet.");
        setLoading(false);
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        setErrorMessage("Card details are incomplete.");
        setLoading(false);
        return;
      }

      // Create PaymentMethod using Stripe.
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            country: formData.country,
          },
        },
      });

      if (pmError || !paymentMethod) {
        setErrorMessage(pmError?.message || "Failed to create payment method.");
        setLoading(false);
        return;
      }

      // Build return URL.
      const proto = window.location.protocol;
      const host = window.location.host;
      const returnUrl = `${proto}//${host}/ordercompleted`;

      // Confirm PaymentIntent.
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
        return_url: returnUrl,
      });

      if (confirmError) {
        setErrorMessage(confirmError.message || "Payment confirmation failed.");
        setLoading(false);
        return;
      }

      // After successful payment, build order data with paymentStatus "paid".
      const orderData: OrderData = {
        _type: "order",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "paid",
        amount: amountValue,
        createdAt: new Date().toISOString(),
        cartItems: cartItems,
      };

      await submitOrderToSanity(orderData);
      // Stripe will automatically redirect on success.
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-xl border border-blue-100 transition hover:shadow-2xl"
    >
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Billing Information
      </h1>

      {/* User Details */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your address"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your city"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your postal code"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter your country"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700">
          Payment Method
        </label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
          required
        >
          <option value="creditCard">Credit Card</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>

      {/* Conditional Credit Card Fields */}
      {formData.paymentMethod === "creditCard" && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-700">
            Credit Card Details
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <CardNumberElement
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                },
              }}
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <CardExpiryElement
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                  },
                }}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                CVC/CVV
              </label>
              <CardCvcElement
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition duration-200"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 text-red-500">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className={`mt-6 w-full py-3 text-white rounded-md font-bold transition duration-300 ${
          isFormValid && !loading
            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;