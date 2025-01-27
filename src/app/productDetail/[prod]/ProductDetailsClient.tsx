"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};
type Product1 = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

const ProductDetailsClient = ({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product1[];
}) => {
  // Add to Cart function
  const addToCart = (id: string) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      if (!existingCart.includes(id)) {
        existingCart.push(id);
        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        
      } else {
        alert("Item already in the cart.");
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className="text-center flex justify-center items-center bg-gradient-to-r from-[#8b8bfc] to-[#EAE8FF]  mb-12 h-32 sm:h-[286px]">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Product Details</h1>
      </header>

      {/* Product Details Section */}
      <div className="flex flex-col md:flex-row w-[90%] max-w-[1200px] my-16 gap-6 md:gap-10 mx-auto shadow-lg rounded-lg overflow-hidden bg-white p-6">
        {/* Product Image */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="w-full max-w-[400px] h-auto rounded-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col w-full md:w-1/2 gap-6 justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">{product.name}</h1>
          <p className="text-[#555555] text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-[#151875]">
            Price: ${product.price}
          </p>
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-lg rounded-lg hover:bg-blue700 transition duration-300"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* You May Like Section */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#151875] mb-8">
          You May Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.slice(0,8).map((relatedProduct) => (
            <div
              key={relatedProduct._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <div className="relative h-64">
                <Image
                  src={relatedProduct.imageUrl}
                  alt={relatedProduct.name}
                  layout="fill"
                  objectFit="cover"
                  className="hover:opacity-90 transition"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#151875] mb-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-[#555555] text-sm mb-4">
                  {relatedProduct.description.slice(0, 50)}...
                </p>
                <p className="text-[#151875] font-semibold mb-4">
                  ${relatedProduct.price}
                </p>
                <Link href={`/productDetail/${relatedProduct._id}`}>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  
                >
                  Show Product
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsClient;