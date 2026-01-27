import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  Heart,
  LogIn,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { isAuthenticated } from '@/api/config';
import useCartStore from '@/stores/useCartStore';

// 3 sizes for every product
const sizes = ['S', 'M', 'L'];

export default function Mockup() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load selected mockup data from sessionStorage
  // Data structure: { variantIds: [...], mockupUrl: "...", extraMockups: [...] }
  const selectedMockupData = JSON.parse(sessionStorage.getItem('selectedMockup') || '{}');

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (main mockup + extra mockups)
  const getAllImages = () => {
    const images = [{ title: 'Main', url: selectedMockupData.mockupUrl }];
    if (selectedMockupData.extraMockups && selectedMockupData.extraMockups.length > 0) {
      images.push(...selectedMockupData.extraMockups);
    }
    return images;
  };

  const images = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const { addToCart, setCheckoutData, cartItems } = useCartStore();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBasket = () => {
    const cartItem = {
      variantIds: selectedMockupData.variantIds,
      mockupUrl: selectedMockupData.mockupUrl,
      patternUrl: selectedMockupData.patternUrl,
      name: selectedMockupData.name,
      price: selectedMockupData.price,
      size: selectedSize,
      quantity,
    };

    addToCart(cartItem);
    navigate('/shop');
  };

  const handleBuyNow = () => {
    console.log('selectedMockupData', selectedMockupData);
    const orderData = {
      variantIds: selectedMockupData.variantIds,
      mockupUrl: selectedMockupData.mockupUrl,
      patternUrl: selectedMockupData.patternUrl,
      price: selectedMockupData.price,
      name: selectedMockupData.name,
      size: selectedSize,
      quantity,
    };
    console.log('orderData', orderData);
    setCheckoutData(orderData);

    if (!isLoggedIn) {
      // Show modal instead of redirecting directly
      setShowLoginPrompt(true);
      return;
    }

    navigate('/checkout');
  };

  const handleSignInFromModal = () => {
    navigate('/signin?redirect=/checkout');
  };

  const handleLoginRedirect = () => {
    navigate('/signin?redirect=/mockup');
  };

  const handleBackToShop = () => {
    navigate('/design');
  };

  // If no mockup data, show empty state
  if (!selectedMockupData.mockupUrl) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No product selected</p>
          <button
            onClick={() => navigate('/design')}
            className="px-6 py-3 bg-navy-900 text-white rounded-xl hover:bg-navy-800 transition-all"
          >
            Go to Design
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
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span className="text-xl font-bold text-navy-900">Wear Memories</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/my-designs" className="text-gray-600 hover:text-navy-900 transition-colors">
                  My Designs
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-navy-900 transition-colors">
                  Orders
                </Link>
              </>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
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

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">Ready to Order?</h3>
              <p className="text-gray-500 mb-6">
                Log in to your account or create a new one to complete your purchase.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleSignInFromModal}
                  className="w-full py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
                >
                  Log In
                </button>
                <Link
                  to="/register?redirect=/checkout"
                  className="block w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-navy-900 hover:text-navy-900 transition-all text-center"
                >
                  Create New Account
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToShop}
          className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-3xl bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                <img
                  src={images[currentImageIndex].url}
                  alt={images[currentImageIndex].title}
                  className="w-full h-full object-contain p-8"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-navy-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-navy-900" />
                    </button>
                  </>
                )}

                {/* Image Counter & Title */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                    {images[currentImageIndex].title} ({currentImageIndex + 1}/{images.length})
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-rose-500 ring-2 ring-rose-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-navy-900 mb-2">
                  {selectedMockupData.name || 'Custom Design Product'}
                </h1>
                <p className="text-gray-500">Your unique design printed on high-quality apparel</p>
                {selectedMockupData.price && (
                  <p className="text-2xl font-bold text-navy-900 mt-4">
                    ${(selectedMockupData.price * quantity).toFixed(2)}
                    {quantity > 1 && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (${selectedMockupData.price.toFixed(2)} each)
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-xl border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xl bg-white"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-semibold text-navy-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xl bg-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  Buy Now
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Add to Basket Button */}
                <button
                  onClick={handleAddToBasket}
                  className="w-full py-4 bg-white border-2 border-navy-900 text-navy-900 rounded-xl font-semibold hover:bg-navy-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}