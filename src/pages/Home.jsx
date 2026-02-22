import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Package, LogOut, FolderOpen, ShoppingCart } from 'lucide-react';
import logo from '@/assets/icons/ThreadLogo2.png';
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
      title: "Upload Your Art",
      description: "Drop in your photos or illustrations and let us turn them into a stunning repeating pattern.",
      bg: 'bg-doodle-orange',
      shadow: 'shadow-doodle-orange/30',
      light: 'bg-doodle-orange/10',
      step: '01',
    },
    {
      icon: Palette,
      title: "Design & Customise",
      description: "Adjust colors, layouts and density until your pattern looks exactly how you imagined it.",
      bg: 'bg-doodle-coral',
      shadow: 'shadow-doodle-coral/30',
      light: 'bg-doodle-coral/10',
      step: '02',
    },
    {
      icon: Package,
      title: "Wear It Proudly",
      description: "We print on premium apparel and ship straight to your door. Quality you can feel.",
      bg: 'bg-doodle-blue',
      shadow: 'shadow-doodle-blue/30',
      light: 'bg-doodle-blue/10',
      step: '03',
    },
  ];

  const heroColors = [
    'bg-doodle-orange', 'bg-doodle-coral', 'bg-doodle-blue',
    'bg-doodle-coral', 'bg-doodle-blue', 'bg-doodle-orange',
    'bg-doodle-blue', 'bg-doodle-orange', 'bg-doodle-coral',
  ];

  return (
    <div className="min-h-screen bg-cream-50 font-sans">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Thread Doodle" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <>
                <Link to="/mydesigns" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-doodle-dark transition-colors">
                  <FolderOpen className="w-4 h-4" />
                  My Designs
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-doodle-coral transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <Link
                  to="/design"
                  className="px-5 py-2.5 bg-doodle-orange text-white text-sm font-bold rounded-full hover:bg-doodle-orange-dark transition-all hover:shadow-lg hover:shadow-doodle-orange/30"
                >
                  New Design
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-sm font-semibold text-gray-600 hover:text-doodle-dark transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/design"
                  className="px-5 py-2.5 bg-doodle-orange text-white text-sm font-bold rounded-full hover:bg-doodle-orange-dark transition-all hover:shadow-lg hover:shadow-doodle-orange/30"
                >
                  Start Designing
                </Link>
              </>
            )}
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-doodle-dark transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-doodle-coral text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-doodle-orange/15 text-doodle-orange rounded-full text-sm font-bold mb-6 border border-doodle-orange/30">
                <Sparkles className="w-4 h-4" />
                Custom Printed Apparel
              </span>

              <h1 className="text-5xl lg:text-6xl font-black text-doodle-dark leading-tight mb-6 tracking-tight">
                Your Art.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-doodle-coral to-doodle-orange">
                  Your Style.
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg font-medium">
                Upload your photos, generate a unique pattern, and wear it on
                high-quality apparel. Designed by you, made for you.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/design"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-doodle-orange text-white font-bold rounded-2xl hover:bg-doodle-orange-dark transition-all hover:shadow-xl hover:shadow-doodle-orange/30 text-base"
                >
                  Start Designing Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {isLoggedIn ? (
                  <Link
                    to="/mydesigns"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-doodle-dark hover:text-doodle-dark transition-all text-base"
                  >
                    My Designs
                  </Link>
                ) : (
                  <Link
                    to="/signin"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-doodle-dark hover:text-doodle-dark transition-all text-base"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-doodle-orange/20 via-cream-50 to-doodle-blue/20 p-8 border-2 border-white shadow-2xl shadow-doodle-orange/10">
                <div className="w-full h-full rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-6 transform rotate-6">
                    {heroColors.map((color, i) => (
                      <div
                        key={i}
                        className={`w-20 h-20 rounded-2xl ${color} opacity-80 animate-pulse`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative blobs */}
              <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-doodle-orange rounded-full blur-3xl opacity-25 pointer-events-none" />
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-doodle-blue rounded-full blur-3xl opacity-25 pointer-events-none" />
              <div className="absolute top-1/2 -right-4 w-16 h-16 bg-doodle-coral rounded-full blur-2xl opacity-30 pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white border-t-2 border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-doodle-dark mb-3 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              From photo to finished garment in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="group relative p-8 rounded-3xl bg-cream-50 hover:bg-white hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-100"
              >
                {/* Step number */}
                <span className="absolute top-6 right-6 text-5xl font-black text-gray-100 group-hover:text-gray-150 select-none">
                  {feature.step}
                </span>

                <div className={`w-14 h-14 rounded-2xl ${feature.bg} shadow-lg ${feature.shadow} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-doodle-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #E8546A 0%, #F5A523 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-white/80 font-medium mb-10 max-w-xl mx-auto text-lg">
                Turn your photos into wearable art today. No design experience needed.
              </p>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-doodle-dark font-black rounded-2xl hover:bg-cream-50 transition-all hover:shadow-2xl text-base"
              >
                Start Designing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t-2 border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Thread Doodle" className="h-8 w-auto" />
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-gray-500 hover:text-doodle-dark text-sm font-semibold transition-colors">
              Contact Us
            </Link>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Thread Doodle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
