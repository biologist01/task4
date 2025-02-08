"use client";
import { client } from '@/sanity/lib/client';
import React, { useEffect, useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  // State to control the modal popup for submission confirmation
  const [showModal, setShowModal] = useState(false);

  // State to track if the user is logged in (based on localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On mount, check if "user" is present in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = { name: '', email: '', message: '' };

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required.';
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  // Updated sendDataToSanity to include current time explicitly.
  const sendDataToSanity = async () => {
    await client.create({
      _type: "message",
      name: formData.name,
      email: formData.email,
      message: formData.message,
      createdAt: new Date().toISOString(), // explicitly sending current time
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if not logged in.
    if (!isLoggedIn) {
      alert('Please log in or sign up to send your application.');
      return;
    }

    if (validateForm()) {
      // Here you can handle the API call or any other submission logic.
      // Instead of an alert, we'll show the modal popup.
      sendDataToSanity();
      setShowModal(true);
      
      // Optionally, you can clear the form after submission:
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-4">
              Application Submitted!
            </h3>
            <p className="mb-6">Your application has been submitted successfully.</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-6">Contact Us</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Have questions or need assistance? We are here to help!
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            Fill out the form below, and our support team will get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-semibold text-gray-800">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold text-gray-800">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="flex flex-col">
            <label htmlFor="message" className="text-lg font-semibold text-gray-800">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here"
              rows={6}
            />
            {formErrors.message && (
              <p className="text-red-500 text-sm">{formErrors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isLoggedIn}
              className={`py-3 px-6 rounded-full shadow-lg transition transform ${
                isLoggedIn
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
            >
              Send Message
            </button>
          </div>
          {!isLoggedIn && (
            <p className="text-center text-red-500 mt-2">
              You must be logged in to submit the application.
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default ContactPage;