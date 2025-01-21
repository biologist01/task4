import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-t-md py-6">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: About */}
          <div>
            <h4 className="text-xl font-bold text-blue-600 mb-4">About E-Shop</h4>
            <p className="text-gray-600">
              E-Shop is your trusted online store for high-quality products at
              unbeatable prices. Shop with confidence and enjoy a seamless
              shopping experience.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-blue-600 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xl font-bold text-blue-600 mb-4">Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive
              deals.
            </p>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 border-t border-gray-300 pt-4 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
