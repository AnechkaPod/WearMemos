import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Package, Heart, LogOut, FolderOpen, ShoppingCart } from 'lucide-react';
import { isAuthenticated, clearAuthData } from '@/api/config';
import useCartStore from '@/stores/useCartStore';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems } = useCartStore();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
  };

  const features = [
    {
      icon: Sparkles,
      title: "Upload Your Memories",
      description: "Transform cherished photos into wearable art"
    },
    {
      icon: Palette,
      title: "Design Patterns",
      description: "Create unique repeating patterns from your artwork"
    },
    {
      icon: Package,
      title: "Premium Products",
      description: "Print on high-quality apparel and accessories"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="text-xl font-semibold text-navy-900">Wear Memories</span>
          </div>
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/mydesigns" className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors">
                  <FolderOpen className="w-4 h-4" />
                  My Designs
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <Link
                  to="/design"
                  className="px-5 py-2.5 bg-blue-900 text-white rounded-full hover:bg-navy-800 transition-all hover:shadow-lg"
                >
                  New Design
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-600 hover:text-navy-900 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/design"
                  className="px-5 py-2.5 bg-blue-900 text-white rounded-full hover:bg-navy-800 transition-all hover:shadow-lg"
                >
                  Start Designing
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-6">
                Transform Your Memories
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
                Wear Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
                  Precious Moments
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Turn your favorite photos into stunning patterns and wear them as unique, 
                custom-designed apparel. Every piece tells your story.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/design"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-full hover:bg-navy-800 transition-all hover:shadow-xl hover:shadow-navy-900/20"
                >
                  Start Designing Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {isLoggedIn ? (
                  <Link
                    to="/mydesigns"
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full hover:border-navy-900 hover:text-navy-900 transition-all"
                  >
                    My Designs
                  </Link>
                ) : (
                  <Link 
                    to="/signin"
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full hover:border-navy-900 hover:text-navy-900 transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-rose-100 via-amber-50 to-cream-100 p-8 shadow-2xl shadow-rose-200/50">
                <div className="w-full h-full rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-3 gap-3 p-6 transform rotate-3">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-20 h-20 rounded-xl bg-gradient-to-br from-rose-200 to-amber-200 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-full blur-3xl opacity-40" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-400 rounded-full blur-3xl opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create personalized fashion in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-cream-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-blue-900 p-12 lg:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-amber-500/20" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Start designing your custom wearable memories today. No design experience needed.
              </p>
              <Link 
                to="/design"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 rounded-full font-medium hover:bg-cream-50 transition-all hover:shadow-xl"
              >
                Start Designing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-navy-900">Wear Memories</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-gray-500 hover:text-navy-900 text-sm transition-colors">
              Contact Us
            </Link>
            <p className="text-gray-500 text-sm">
              © 2024 Wear Memories. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}