import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import logo from '@/assets/icons/ThreadLogo2.png';
import { isAuthenticated, clearAuthData } from '@/api/config';
import useCartStore from '@/stores/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    cartItems,
    removeFromCart,
    updateQuantity: updateCartQuantity
  } = useCartStore();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity(index, newQuantity);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!isLoggedIn) {
      navigate('/signin?redirect=/checkout');
      return;
    }

    navigate('/checkout');
  };

  const handleLoginRedirect = () => {
    navigate('/signin?redirect=/cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Wear Memories" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  clearAuthData();
                  setIsLoggedIn(false);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="p-2 text-gray-600 hover:text-navy-900 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            <Link to="/cart" className="p-2 text-navy-900">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Your Cart</h1>
          <p className="text-gray-500 mb-8">
            {cartItems.length > 0
              ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`
              : 'Review your items before checkout'
            }
          </p>

          {cartItems.length === 0 ? (
            // Empty cart state
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-navy-900 mb-2">
                You have nothing in your cart
              </h2>
              <p className="text-gray-500 mb-6">
                Start designing to add products to your cart
              </p>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            // Cart with items
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-4 flex gap-4"
                  >
                    <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.mockupUrl}
                        alt={item.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-navy-900">
                        {item.name || 'Custom Design Product'}
                      </h3>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-lg font-semibold text-rose-500 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Order Summary</h3>

                  <div className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-gray-400 italic text-sm">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between text-lg font-semibold text-navy-900 mb-6">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                     className="mt-6 w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"

                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
