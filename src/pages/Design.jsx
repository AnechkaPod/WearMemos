import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Heart, User, FolderOpen, ShoppingCart } from 'lucide-react';
import ArtworkUploader from '@/components/design/ArtworkUploader';
import apiService from '@/api/apiService';
import { isAuthenticated } from '@/api/config';

export default function Design() {
  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedArtworks, setUploadedArtworks] = useState([]);
  const [patternSettings] = useState({
    layout: 'grid',
    rotation: 0,
    spacing: 'normal',
    scale: 100,
    backgroundColor: '#FFFFFF',
    mirrorH: false,
    mirrorV: false,
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Load uploaded artworks from session storage
    const stored = sessionStorage.getItem('uploadedArtworks');
    if (stored) {
      setUploadedArtworks(JSON.parse(stored));
      sessionStorage.removeItem('uploadedArtworks');
    }
  }, []);

  const generatePattern = async () => {
    console.log('generatePattern');
    if (uploadedArtworks.length === 0) return;

    setGenerating(true);

    try {
      const files = uploadedArtworks.map(a => a.file);
      console.log('files to generate pattern....', files);  
      const data = await apiService.patterns.generate(files, patternSettings);
      console.log('pattern generate data', data);

      // Flatten all mockups from all pattern results into a single array
      const allMockups = data.flatMap(item => item.mockups);

      // Store mockups in sessionStorage and navigate to shop page
      sessionStorage.setItem('generatedMockups', JSON.stringify(allMockups));
      navigate('/shop');
    } catch (err) {
      console.error('Pattern generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleLoginRedirect = () => {
    // Save artworks before redirecting
    sessionStorage.setItem('uploadedArtworks', JSON.stringify(uploadedArtworks));
    navigate('/signin?redirect=/design');
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
                <Link to="/my-designs" className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors">
                  <FolderOpen className="w-4 h-4" />
                  My Designs
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-navy-900 transition-colors">
                  Orders
                </Link>
              </>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="p-2 text-gray-600 hover:text-navy-900 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            <Link to="/cart" className="p-2 text-gray-600 hover:text-navy-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Create Your Design</h1>
            <p className="text-gray-500">Upload your artwork and we will create unique products for you</p>
          </div>

          {generating && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                <p className="text-navy-900 font-medium">Generating your designs...</p>
              </div>
            </div>
          )}

          <ArtworkUploader
            artworks={uploadedArtworks}
            onArtworksChange={setUploadedArtworks}
            onGenerate={generatePattern}
          />
        </motion.div>
      </div>
    </div>
  );
}
