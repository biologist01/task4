'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";

interface CartItem {
  _id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  quantity: number;
  stockLevel: number; // Available stock level
}

const truncateDescription = (description: string, wordLimit: number): string => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  return description;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const router = useRouter();

  // Fetch cart items from localStorage and Sanity.
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Expect localStorage to have an array of objects: [{ _id: string, quantity: number }, ...]
        const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        if (storedCart.length === 0) {
          setCartItems([]);
          setShowEmptyModal(true);
          return;
        }
        // Extract the product IDs from storedCart.
        const storedIds = storedCart.map((item: { _id: string; quantity: number }) => item._id);

        // Fetch products from Sanity.
        const products: CartItem[] = await client.fetch(`*[_type == "product"]{
          _id,
          name,
          price,
          "imageUrl": image.asset->url,
          description,
          stockLevel
        }`,
        {},
        { cache: 'no-store' } 
      );

        // Filter products: only include those that are in the storedCart and have stockLevel > 0.
        const filteredItems = products
          .filter((product) => storedIds.includes(product._id) && product.stockLevel > 0)
          .map((product) => {
            const cartItem = storedCart.find((item: { _id: string; quantity: number }) => item._id === product._id);
            return { ...product, quantity: cartItem?.quantity || 1 };
          });

        // Update localStorage: remove any items that are now out of stock.
        const updatedStoredCart = storedCart.filter((item: { _id: string; quantity: number }) => {
          const prod = products.find((p) => p._id === item._id);
          return prod && prod.stockLevel > 0;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedStoredCart));

        // If there are no items left after filtering, show the empty modal.
        if (updatedStoredCart.length === 0) {
          setCartItems([]);
          setShowEmptyModal(true);
        } else {
          setCartItems(filteredItems);
          setShowEmptyModal(false);
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (_id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === _id) {
          const validQuantity =
            newQuantity > item.stockLevel
              ? item.stockLevel
              : newQuantity > 0
              ? newQuantity
              : 1;
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
    // Also update localStorage accordingly.
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const updatedCart = storedCart.map((item: { _id: string; quantity: number }) =>
      item._id === _id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeItem = (_id: string) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedCartItems);

    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const updatedCart = storedCart.filter((item: { _id: string; quantity: number }) => item._id !== _id);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    if (updatedCart.length === 0) {
      setShowEmptyModal(true);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    setShowEmptyModal(true);
  };

  // Handler for proceeding to checkout: store complete cart data in localStorage.
  const handleProceedToCheckout = () => {
    const total = calculateTotal();
    localStorage.setItem("totalAmount", total.toFixed(2));
    localStorage.setItem("checkoutCartItems", JSON.stringify(cartItems));
    router.push("/checkout");
  };

  return (
    <>
      {/* Empty Cart Popup */}
      {showEmptyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-br from-purple-500 to-[#1D3178] p-8 rounded-xl shadow-2xl text-center max-w-md mx-4 transform transition-all hover:scale-105">
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-white mb-6">
              Please add at least one item to your cart.
            </p>
            <a href="/products">
              <button className="mt-4 px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-all transform hover:scale-110">
                Continue Shopping
              </button>
            </a>
          </div>
        </div>
      )}

      <div
        className={`p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 ${
          cartItems.length === 0 ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-[#1D3178]">Your Cart</h2>
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-[#1D3178] text-lg">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {truncateDescription(item.description, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
                    <p className="text-[#1D3178] text-base">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                      className="w-16 px-2 py-1 border rounded-md text-center"
                      min="1"
                      max={item.stockLevel}
                    />
                    <p className="font-bold text-[#1D3178] text-base">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-6"></div>
          )}

          <div className="flex justify-end mt-6">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-300"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Cart Totals Section */}
        {cartItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#1D3178]">Cart Totals</h2>
            <p className="flex justify-between text-[#1D3178] text-base">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-lg text-[#1D3178] mt-4">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </p>
            <button
              onClick={handleProceedToCheckout}
              type="button"
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              Proceed To Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;