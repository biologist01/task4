import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-6">About AM-Store</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Discover our story, mission, and what drives us to deliver the best shopping experience.
        </p>
        <Link
          href="/shop"
          className="bg-white text-blue-600 py-3 px-6 rounded-lg shadow-xl hover:bg-blue-50 transition transform hover:scale-105"
        >
          Start Shopping
        </Link>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Our Story</h2>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            AM-Store was founded with the vision of making high-quality, stylish clothing accessible to everyone. 
            We aim to provide a seamless shopping experience and ensure customer satisfaction at every step. 
            Our story began with a simple idea, and today, we have grown into a trusted clothing brand.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Our mission is to deliver the highest quality clothing at affordable prices. We believe in empowering 
            our customers to express their unique style through curated collections that are both trendy and timeless.
            Our focus on quality craftsmanship and customer service sets us apart in the competitive world of fashion retail.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="container mx-auto py-16 px-6 bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Value 1 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Satisfaction</h3>
            <p className="text-gray-600">
              We prioritize our customers, providing exceptional service and ensuring their satisfaction with every purchase.
            </p>
          </div>

          {/* Value 2 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quality Assurance</h3>
            <p className="text-gray-600">
              We guarantee the highest quality in all our products, from materials to craftsmanship, so you can shop with confidence.
            </p>
          </div>

          {/* Value 3 */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sustainability</h3>
            <p className="text-gray-600">
              We are committed to sustainability and work towards reducing our environmental impact through responsible sourcing and production.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white text-center py-12 my-5">
        <h3 className="text-3xl font-bold mb-4">Join Us on Our Journey</h3>
        <p className="text-xl mb-6">
          Become a part of the AM-Store family and enjoy exclusive offers, early access to new collections, and more.
        </p>
        <Link
          href="/signup"
          className="bg-white text-blue-600 py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
        >
          Sign Up Now
        </Link>
      </section>


    </div>
  );
};

export default AboutPage;