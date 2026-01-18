import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ShopViewer({ patterns, onSelectMockup }) {
  if (!patterns || patterns.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <p className="text-gray-500">No mockups available. Generate patterns first.</p>
      </div>
    );
  }

  // Flatten all mockups from all patterns and group by mockUpName
  const mockupsByType = {};

  patterns.forEach((pattern, patternIndex) => {
    pattern.mockUps.forEach((mockup, mockupIndex) => {
      if (!mockupsByType[mockup.mockUpName]) {
        mockupsByType[mockup.mockUpName] = [];
      }
      mockupsByType[mockup.mockUpName].push({
        mockupUrl: mockup.mockUpUrl,
        mockUpName: mockup.mockUpName,
        patternUrl: pattern.url,
        patternIndex,
        mockupIndex
      });
    });
  });

  const totalMockups = Object.values(mockupsByType).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Shop Mockups</h2>
        <p className="text-gray-500">Browse all generated mockups and select your favorite</p>
      </div>

      {Object.entries(mockupsByType).map(([productType, mockups]) => (
        <div key={productType} className="mb-10">
          <h3 className="text-xl font-semibold text-navy-900 mb-4 capitalize">
            {productType}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockups.map((item, index) => (
              <motion.div
                key={`${item.patternIndex}-${item.mockupIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                onClick={() => onSelectMockup(item.mockupUrl, item.mockUpName, item.patternUrl)}
              >
                <div className="aspect-square bg-gradient-to-br from-cream-50 to-white p-4">
                  <img
                    src={item.mockupUrl}
                    alt={`${item.mockUpName} ${index + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        Pattern {item.patternIndex + 1}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Click to select</p>
                    </div>
                    <button
                      className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMockup(item.mockupUrl, item.mockUpName, item.patternUrl);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Showing {totalMockups} mockup{totalMockups !== 1 ? 's' : ''} from {patterns.length} pattern{patterns.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
