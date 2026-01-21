import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShopViewer({ mockups, onSelectMockup }) {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!mockups || mockups.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <p className="text-gray-500">No mockups available. Generate patterns first.</p>
      </div>
    );
  }

  // Get all images for the selected design (main mockup + extra mockups)
  const getDesignImages = (design) => {
    const images = [design.mockupUrl];
    if (design.extraMockups && design.extraMockups.length > 0) {
      images.push(...design.extraMockups);
    }
    return images;
  };

  const openDesignViewer = (item, index) => {
    setSelectedDesign({ ...item, designIndex: index });
    setCurrentImageIndex(0);
  };

  const closeDesignViewer = () => {
    setSelectedDesign(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedDesign) return;
    const images = getDesignImages(selectedDesign);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!selectedDesign) return;
    const images = getDesignImages(selectedDesign);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSelectFromViewer = () => {
    if (selectedDesign) {
      onSelectMockup(selectedDesign);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Shop Mockups</h2>
        <p className="text-gray-500">Browse all generated mockups and select your favorite</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockups.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
            onClick={() => openDesignViewer(item, index)}
          >
            <div className="aspect-square bg-gradient-to-br from-cream-50 to-white p-4 relative">
              <img
                src={item.mockupUrl}
                alt={`Mockup ${index + 1}`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              {item.extraMockups && item.extraMockups.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  +{item.extraMockups.length} more
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-900">
                    Design {index + 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Click to view all images</p>
                </div>
                <button
                  className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMockup(item);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Showing {mockups.length} mockup{mockups.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Design Viewer Modal */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeDesignViewer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-navy-900">
                  Design {selectedDesign.designIndex + 1}
                </h3>
                <button
                  onClick={closeDesignViewer}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Image Carousel */}
              <div className="relative aspect-square bg-gradient-to-br from-cream-50 to-white">
                <img
                  src={getDesignImages(selectedDesign)[currentImageIndex]}
                  alt={`Design image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain p-8"
                />

                {/* Navigation Arrows */}
                {getDesignImages(selectedDesign).length > 1 && (
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

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {getDesignImages(selectedDesign).length}
                </div>
              </div>

              {/* Thumbnails */}
              {getDesignImages(selectedDesign).length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {getDesignImages(selectedDesign).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-rose-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Footer with Select Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleSelectFromViewer}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Select This Design
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
