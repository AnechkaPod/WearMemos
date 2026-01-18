import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Heart, LogIn, FolderOpen } from 'lucide-react';
import ArtworkUploader from '@/components/design/ArtworkUploader';
import PatternEditor from '@/components/design/PatternEditor';
import MockupViewer from '@/components/design/MockupViewer';
import ShopViewer from '@/components/design/ShopViewer';
import DesignToolbar from '@/components/design/DesignToolbar';
import apiService from '@/api/apiService';
import { isAuthenticated } from '@/api/config';

export default function Design() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('designId');
  
  const [activeTab, setActiveTab] = useState('artwork');
  const [generating, setGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [uploadedArtworks, setUploadedArtworks] = useState([]);
  const [generatedPatterns, setGeneratedPatterns] = useState([]);
  const [patternSettings, setPatternSettings] = useState({
    layout: 'grid',
    rotation: 0,
    spacing: 'normal',
    scale: 100,
    backgroundColor: '#FFFFFF',
    mirrorH: false,
    mirrorV: false,
    patternUrl: null
  });
  const [mockupUrl, setMockup] = useState(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Load uploaded artworks from session storage
    const stored = sessionStorage.getItem('uploadedArtworks');
    if (stored) {
      setUploadedArtworks(JSON.parse(stored));
      sessionStorage.removeItem('uploadedArtworks');
    }

    // Load existing design if editing
    if (designId) {
      const savedDesign = sessionStorage.getItem('currentDesign');
      if (savedDesign) {
        const design = JSON.parse(savedDesign);
        if (design.patternUrl) {
          setPatternSettings(prev => ({ ...prev, patternUrl: design.patternUrl }));
        }
        if (design.mockupUrl) {
          setMockup(design.mockupUrl);
        }
      }
    }

    // Restore unsaved design for guest users
    const unsavedDesign = sessionStorage.getItem('unsavedDesign');
    if (unsavedDesign && !designId) {
      const design = JSON.parse(unsavedDesign);
      setUploadedArtworks(design.artworks || []);
      setPatternSettings(design.patternSettings || patternSettings);
      setMockup(design.mockupUrl || null);
      if (design.activeTab) setActiveTab(design.activeTab);
    }
  }, [designId]);

  async function analyzeArtworksIfNeeded(artworks) {
    for (const artwork of artworks) {
      if (artwork.status === 'TemporaryUploaded') {
        await apiService.artworks.analyze(artwork.id);
      }
    }
  }
  
  const generatePattern = async () => {
    console.log('generatePattern');
    if (uploadedArtworks.length === 0) return;

    setGenerating(true);

    try {
      // await analyzeArtworksIfNeeded(uploadedArtworks);

      const files = uploadedArtworks.map(a => a.file);
      const data = await apiService.patterns.generate(files, patternSettings);
      console.log('pattern generate data', data);

      setGeneratedPatterns(data.patterns);
      setActiveTab('shop');
    } catch (err) {
      console.error('Pattern generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const generateMockup = async (productType) => {
    if (!patternSettings.patternUrl) return;

    setGenerating(true);

    try {
      const data = await apiService.mockups.generate(
        patternSettings.patternUrl,
        productType,
        patternSettings
      );

      console.log('mockup generate data', data);
      setMockup(data.mockups[0]);
      setActiveTab('mockup');
    } catch (err) {
      console.error('Mockup generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const saveDesignToSession = () => {
    sessionStorage.setItem('unsavedDesign', JSON.stringify({
      artworks: uploadedArtworks,
      patternSettings,
      mockupUrl,
      activeTab
    }));
  };

  const saveDesign = async () => {
    // If not logged in, save to session and prompt login
    if (!isAuthenticated()) {
      saveDesignToSession();
      setShowLoginPrompt(true);
      return;
    }

    try {
      const data = await apiService.designs.create(
        uploadedArtworks.map(a => a.id),
        patternSettings,
        mockupUrl
      );

      sessionStorage.removeItem('unsavedDesign');
      sessionStorage.setItem('mockupUrl', mockupUrl || '');
      navigate(`/mockup?designId=${data.id}`);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleLoginRedirect = () => {
    saveDesignToSession();
    navigate('/sign-in?redirect=/design');
  };

  const handleSelectMockup = (mockupUrl, mockUpName, patternUrl) => {
    // Store the selected mockup data in sessionStorage
    const mockupData = {
      mockupUrl,
      mockUpName,
      patternUrl
    };
    sessionStorage.setItem('selectedMockup', JSON.stringify(mockupData));

    // Navigate to the product page
    navigate('/mockup');
  };

  const tabs = [
    { id: 'artwork', label: 'Artwork', step: 1 },
    { id: 'pattern', label: 'Pattern', step: 2 },
    { id: 'shop', label: 'Shop', step: 3 },
    { id: 'mockup', label: 'Preview', step: 4 }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Navigation for Design Page */}
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
              <>
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-navy-800 transition-all text-sm"
                >
                  Create Account
                </Link>
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
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">Save Your Design</h3>
              <p className="text-gray-500 mb-6">
                Sign in or create an account to save your design and order products.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/Register?redirect=/design"
                  onClick={saveDesignToSession}
                  className="block w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-navy-900 hover:text-navy-900 transition-all"
                >
                  Create Account
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="h-[calc(100vh-73px)] flex flex-col">
        {/* Tab Navigation */}
        <div className="flex-shrink-0 px-6 pt-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 px-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'text-navy-900' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                    activeTab === tab.id 
                      ? 'bg-navy-900 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.step}
                  </span>
                  <span className="font-medium">{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-auto bg-cream-50">
            {generating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                  <p className="text-navy-900 font-medium">Generating...</p>
                </div>
              </div>
            )}

            {activeTab === 'artwork' && (
              <ArtworkUploader
                artworks={uploadedArtworks}
                onArtworksChange={setUploadedArtworks}
                onGenerate={generatePattern}
              />
            )}

            {activeTab === 'pattern' && (
              <PatternEditor
                settings={patternSettings}
                onSettingsChange={setPatternSettings}
                onGenerateMockup={generateMockup}
              />
            )}

            {activeTab === 'shop' && (
              <ShopViewer
                patterns={generatedPatterns}
                onSelectMockup={handleSelectMockup}
              />
            )}

            {activeTab === 'mockup' && (
              <MockupViewer
                mockupUrl={mockupUrl}
                onSave={saveDesign}
              />
            )}
          </div>

          {/* Toolbar */}
          {/* <DesignToolbar
            activeTab={activeTab}
            settings={patternSettings}
            onSettingsChange={setPatternSettings}
          /> */}
        </div>
      </div>
    </div>
  );
}