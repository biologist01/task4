import React from 'react';
import { client } from '@/sanity/lib/client';

interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  stockLevel: number;
  discountPercentage: number;
  isFeaturedProduct: boolean;
  imageUrl: string;
}

const LandingPage = async () => {
  // Fetch data from Sanity
  const products: Product[] = await client.fetch(`
    *[_type=="product" && isFeaturedProduct == true]{ 
      _id, 
      description,
      stockLevel,
      discountPercentage,
      isFeaturedProduct,
      name, 
      price,
      "imageUrl": image.asset->url
    }
  `);

  return (
    <main className="bg-gray-50 py-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Featured Products</h1>
        <p className="text-gray-600 text-lg">
          Explore our exclusive collection of featured items curated just for you!
        </p>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-60 object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
                  <p className="text-sm text-gray-600 mb-2 truncate">{product.description}</p>

                  {/* Price and Discount */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-bold text-blue-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Stock Level */}
                  <p
                    className={`text-sm font-medium ${
                      product.stockLevel > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stockLevel > 0 ? `In Stock (${product.stockLevel})` : 'Out of Stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured products available at the moment.</p>
        )}
      </section>
    </main>
  );
};

export default LandingPage;
