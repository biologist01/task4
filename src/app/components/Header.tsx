"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">E-Shop</Link>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mx-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="absolute right-4 top-2 text-gray-500 hover:text-blue-600 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.8-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/products" className="nav-link">
            Products
          </Link>
          <Link href="/about" className="nav-link">
            About Us
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-500 hover:text-blue-600 transition duration-300"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="space-y-4 px-4 py-6">
            <li>
              <Link href="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
