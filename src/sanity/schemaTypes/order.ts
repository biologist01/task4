import { Rule } from '@sanity/types';
export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'address', title: 'Address', type: 'string' },
    { name: 'city', title: 'City', type: 'string' },
    { name: 'postalCode', title: 'Postal Code', type: 'string' },
    { name: 'country', title: 'Country', type: 'string' },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'creditCard' },
          { title: 'Cash on Delivery', value: 'cash' },
        ],
      },
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Cash on Delivery', value: 'cash on delivery' },
        ],
      },
    },
    { name: 'amount', title: 'Amount', type: 'number' },
    { name: 'createdAt', title: 'Created At', type: 'datetime' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      initialValue: 'pending',
    },
    // Updated cartItems field: each item is an object with a product reference and quantity.
    {
      name: 'cartItems',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule:Rule) =>
                Rule.required().min(1).error('Quantity must be at least 1'),
            },
          ],
        },
      ],
    },
  ],
};