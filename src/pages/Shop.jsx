import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, FolderOpen, ArrowLeft, ShoppingCart } from 'lucide-react';
import logo from '@/assets/icons/ThreadLogo2.png';
import { isAuthenticated } from '@/api/config';
import useCartStore from '@/stores/useCartStore';

export default function Shop() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mockups, setMockups] = useState([]);
  const { cartItems } = useCartStore();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Load mockups from sessionStorage
    const stored = sessionStorage.getItem('generatedMockups');
    if (stored) {
      setMockups(JSON.parse(stored));
    }
  }, []);

  const handleSelectMockup = (mockupData) => {
    sessionStorage.setItem('selectedMockup', JSON.stringify(mockupData));
    navigate('/mockup');
  };

  const handleBackToDesign = () => {
    navigate('/design');
  };

  // If no mockups, show empty state
  if (mockups.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No designs available. Create some first!</p>
          <button
            onClick={() => navigate('/design')}
            className="px-6 py-3 bg-navy-900 text-white rounded-xl hover:bg-navy-800 transition-all"
          >
            Create Design
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Thread Doodle" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/mydesigns" className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors">
                  <FolderOpen className="w-4 h-4" />
                  My Designs
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-navy-900 transition-colors">
                  Orders
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-navy-800 transition-all text-sm"
                >
                  Create Account
                </Link>
              </>
            )}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-navy-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToDesign}
          className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Design
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Your Designs</h1>
            <p className="text-gray-500">Select a design to customize and purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockups.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                onClick={() => handleSelectMockup(item)}
              >
                <div className="aspect-square bg-gradient-to-br from-cream-50 to-white p-4">
                  <img
                    src={item.mockupUrl}
                    alt={`Design ${index + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        {item.name || `Design ${index + 1}`}
                      </p>
                      {item.price && (
                        <p className="text-lg font-bold text-rose-500">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {mockups.length} design{mockups.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
