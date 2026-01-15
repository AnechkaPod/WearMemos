import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Shirt,
  Square,
  Circle,
  Check,
  ArrowRight,
  Loader2,
  RotateCcw,
  Heart,
  LogIn
} from 'lucide-react';
import apiService from '@/api/apiService';
import { isAuthenticated } from '@/api/config';

const products = [
  { id: 'tshirt', name: 'T-Shirtt', icon: Shirt, price: 29.99 },
  { id: 'hoodie', name: 'Hoodie', icon: Shirt, price: 49.99 },
  { id: 'totebag', name: 'Tote Bag', icon: ShoppingBag, price: 24.99 },
  { id: 'pillow', name: 'Pillow', icon: Square, price: 34.99 },
  { id: 'coaster', name: 'Coaster Set', icon: Circle, price: 19.99 }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#1a1a2e' },
  { id: 'navy', name: 'Navy', hex: '#1e3a5f' },
  { id: 'cream', name: 'Cream', hex: '#faf8f5' }
];

export default function Mockup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('designId');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [patternSettings] = useState({
    layout: 'grid',
    rotation: 0,
    spacing: 'normal',
    scale: 100
  });
  
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const mockupUrl = sessionStorage.getItem('mockupUrl') || null;

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [currentMockup, setCurrentMockup] = useState(mockupUrl);

  const regenerateMockup = async () => {
    setGenerating(true);

    try {
      const data = await apiService.mockups.generate(
        designId,
        selectedProduct.id,
        { ...patternSettings, color: selectedColor.id }
      );
      setCurrentMockup(data.mockupUrl);
    } catch (err) {
      console.error('Mockup error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const proceedToCheckout = () => {
    const orderData = {
      designId,
      product: selectedProduct,
      size: selectedSize,
      color: selectedColor,
      quantity,
      mockupUrl: currentMockup
    };
    sessionStorage.setItem('checkoutData', JSON.stringify(orderData));
    
    // If not logged in, prompt to login
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    navigate('/checkout');
  };

  const handleLoginRedirect = () => {
    navigate('/sign-in?redirect=/mockup' + (designId ? `?designId=${designId}` : ''));
  };

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
              <>
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </>
            )}
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
                Sign in or create an account to complete your purchase.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/Register?redirect=/mockup"
                  className="block w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-navy-900 hover:text-navy-900 transition-all"
                >
                  Create Account
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Product Preview</h1>
          <p className="text-gray-500 mb-8">Customize your product and see the final result</p>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Mockup Preview */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-white shadow-xl shadow-gray-200/50 overflow-hidden p-8">
                {generating ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Generating preview...</p>
                    </div>
                  </div>
                ) : currentMockup ? (
                  <img
                    src={currentMockup}
                    alt="Product mockup"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center">
                    <selectedProduct.icon className="w-32 h-32 text-rose-300" />
                  </div>
                )}
              </div>
              
              <button
                onClick={regenerateMockup}
                className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Options Panel */}
            <div className="space-y-8">
              {/* Product Selection */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Select Product</h3>
                <div className="grid grid-cols-3 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedProduct.id === product.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <product.icon className={`w-8 h-8 mx-auto mb-2 ${
                        selectedProduct.id === product.id ? 'text-rose-500' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-navy-900">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {['tshirt', 'hoodie'].includes(selectedProduct.id) && (
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border-2 font-medium transition-all ${
                          selectedSize === size
                            ? 'border-rose-500 bg-rose-500 text-white'
                            : 'border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Select Color</h3>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedColor.id === color.id
                          ? 'border-rose-500 scale-110'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor.id === color.id && (
                        <Check className={`w-5 h-5 ${
                          color.id === 'white' || color.id === 'cream' 
                            ? 'text-navy-900' 
                            : 'text-white'
                        }`} />
                      )}
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
                    className="w-12 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xl"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-semibold text-navy-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500">Total</span>
                  <span className="text-2xl font-bold text-navy-900">
                    ${(selectedProduct.price * quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}