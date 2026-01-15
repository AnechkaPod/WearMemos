import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import apiService from '@/api/apiService';
import { setAuthData } from '@/api/config';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/design';
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiService.auth.login(formData.email, formData.password);

      setAuthData(data.token, data.user);
      
      // Check if there's an unsaved design to restore
      const unsavedDesign = sessionStorage.getItem('unsavedDesign');
      if (unsavedDesign && redirectTo.includes('/design')) {
        // Upload local files after login
        const design = JSON.parse(unsavedDesign);
        if (design.artworks?.some(a => a.isLocal)) {
          // Re-upload local files
          for (const artwork of design.artworks) {
            if (artwork.isLocal && artwork.file) {
              try {
                const uploadedData = await apiService.artworks.upload(artwork.file);
                artwork.id = uploadedData.id;
                artwork.url = uploadedData.url;
                artwork.isLocal = false;
                delete artwork.file;
              } catch (err) {
                console.error('Re-upload error:', err);
              }
            }
          }
          sessionStorage.setItem('unsavedDesign', JSON.stringify(design));
        }
      }
      
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span className="text-2xl font-bold text-navy-900">Wear Memories</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue designing</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link to={`/Register?redirect=${encodeURIComponent(redirectTo)}`} className="text-rose-600 hover:text-rose-700 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Back to designing */}
        <div className="mt-6 text-center">
          <Link to="/design" className="text-gray-500 hover:text-navy-900 transition-colors">
            ← Continue designing without account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}