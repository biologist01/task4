'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';

type Product = {
  _id: string;
  description: string;
  stockLevel: number;
  discountPercentage: number;
  isFeaturedProduct: boolean;
  name: string;
  price: number;
  imageUrl: string;
};

const ProductListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('price-low-to-high');
  const [showFeatured, setShowFeatured] = useState<boolean>(false);
  const [productsPerPage, setProductsPerPage] = useState<number>(12);

  // Fetch products from Sanity when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await client.fetch(`*[_type=="product"]{
        _id,
        description,
        stockLevel,
        discountPercentage,
        isFeaturedProduct,
        name,
        price,
        "imageUrl": image.asset->url
      }`);
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Function to sort products based on selected option
  const sortProducts = () => {
    let sorted = [...products];

    if (showFeatured) {
      sorted = sorted.filter((product) => product.isFeaturedProduct);
    }

    if (sortOption === 'price-low-to-high') {
      sorted = sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-to-low') {
      sorted = sorted.sort((a, b) => b.price - a.price);
    }

    setSortedProducts(sorted);
  };

  // useEffect hook to re-sort products when the sorting option or filters change
  useEffect(() => {
    sortProducts();
  }, [sortOption, showFeatured, products]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-6">Our Products</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Explore our wide range of high-quality products, handpicked just for you.
        </p>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto py-6 px-6 flex flex-wrap justify-between items-center">
        <div className="flex space-x-4 mb-4">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
            className="p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
          <label className="flex items-center space-x-2 text-black">
            <input
              type="checkbox"
              checked={showFeatured}
              onChange={() => setShowFeatured(!showFeatured)}
              className="form-checkbox h-5 w-5 text-blue-600 "
            />
            <span>Featured Products</span>
          </label>
          <select
            onChange={(e) => setProductsPerPage(Number(e.target.value))}
            value={productsPerPage}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value={6}>6 Products</option>
            <option value={12}>12 Products</option>
            <option value={18}>18 Products</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.slice(0, productsPerPage).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <div className="relative h-64">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  className="hover:opacity-90 transition"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  {product.discountPercentage > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        ${product.price}
                      </span>
                      <span className="text-green-600 font-semibold">
                        ${
                          (product.price - (product.price * product.discountPercentage) / 100).toFixed(2)
                        }
                      </span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </p>
                <p className="text-gray-500 mb-6">{product.description}</p>
                <button
                  onClick={() => alert(`Product ${product.name} clicked!`)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-full block text-center hover:bg-blue-700 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination (if necessary) */}
      <section className="flex justify-center py-6">
        <button className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition transform hover:scale-105">
          Load More Products
        </button>
      </section>
    </div>
  );
};

export default ProductListingPage;