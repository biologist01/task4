"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/checkoutPage";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPageWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-400 py-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 lg:p-12">
          <CheckoutForm />
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPageWrapper;