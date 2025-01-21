'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const OrderCompletePage = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    // Redirect the user to the homepage or shop page
    router.push('/'); // Modify this path as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 lg:p-12 text-center">
        <h1 className="text-3xl font-bold text-[#1D3178] mb-6">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. Your order has been successfully placed, and we are processing it now.
        </p>
        
        <button
          onClick={handleContinueShopping}
          className="py-3 px-8 text-white bg-blue-600 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;