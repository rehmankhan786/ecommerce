"use client";

import React, { useContext, useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { backend, myContext } from "..";

// Function to dynamically load Razorpay SDK
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData, setUserData } = useContext(myContext);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [incDecDisabled, setincDecDisabled] = useState(false);

  // Helper function to calculate total price
  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  // Fetch cart items
  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cartResponse = await axios.get(`${backend}/api/product/cart`, {
        withCredentials: true,
      });

      const cart = cartResponse.data;

      if (cart.length) {
        const productIds = cart.map((item) => item._id);
        const productsResponse = await axios.post(
          `${backend}/api/product/`,
          { productIds },
          { withCredentials: true }
        );

        const products = productsResponse.data;

        const combinedCartItems = cart.map((cartItem) => ({
          ...products[cartItem._id],
          id: cartItem._id,
          quantity:
            userData.cart.find((userItem) => userItem._id === cartItem._id)
              ?.productQuantity || 0,
        }));

        setCartItems(combinedCartItems);
        calculateTotal(combinedCartItems);
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity of cart item
  const updateQuantity = async (id, change) => {
    setincDecDisabled(true);
    try {
      const response = await axios.post(
        `${backend}/api/user/updateCart/`,
        { productId: id, quantity: change },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedItems = cartItems
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(0, item.quantity + change) }
              : item
          )
          .filter((item) => item.quantity > 0); // Remove items with quantity 0

        setCartItems(updatedItems);
        setUserData({ ...userData, cart: updatedItems });
        calculateTotal(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setincDecDisabled(false);
    }
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      const response = await axios.post(
        `${backend}/api/cart/remove`,
        { productId: id },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedItems);
        setUserData({ ...userData, cart: updatedItems });
        calculateTotal(updatedItems);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Razorpay checkout handler
  const handleRazorPayScreen = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_Z7nT83QSQWigYM", // Replace with your Razorpay test key
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "DigiEdgeSol",
      description: "Testing page for payment of E-commerce website",
      handler: function (response) {
        console.log("Payment successful:", response);
        // Add logic to verify the payment on the backend
      },
      prefill: {
        name: "Atta-ur-Rehman Khan",
        email: "arkhan434@gmail.com",
      },
      theme: {
        color: "#f4c430",
      },
      notify:true,
      
    };

    const paymentObj = new window.Razorpay(options);
    paymentObj.open();
  };

  // Checkout function
  const checkOut = async () => {
    try {
      await handleRazorPayScreen(total);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-5">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-gray-600">${item.productPrice}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={incDecDisabled || item.quantity <= 0}
                  >
                    <Minus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={incDecDisabled}
                  >
                    <Plus />
                  </button>
                  <button onClick={() => removeItem(item.id)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 border-t flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total: ₹{total.toLocaleString()}
        </div>
        {total > 0 && (
          <button
            onClick={checkOut}
            className="bg-blue-600 text-white text-lg w-[15vw] h-[50px] rounded transition-all hover:bg-blue-700 hover:text-xl"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
