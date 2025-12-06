import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Shirt, ShoppingBag, Square, ArrowRight } from 'lucide-react';

const products = [
  { id: 'tshirt', name: 'T-Shirt', icon: Shirt },
  { id: 'hoodie', name: 'Hoodie', icon: Shirt },
  { id: 'totebag', name: 'Tote Bag', icon: ShoppingBag },
  { id: 'pillow', name: 'Pillow', icon: Square }
];

export default function PatternEditor({ settings, onSettingsChange, onGenerateMockup }) {
  const patternUrl = settings.patternUrl;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Your Pattern</h2>
        <p className="text-gray-500">Preview and customize your generated pattern</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pattern Preview */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-rose-500" />
            Pattern Preview
          </h3>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {patternUrl ? (
              <img
                src={patternUrl}
                alt="Generated pattern"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2 p-6 opacity-30">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-200 to-amber-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Apply to Product</h3>
          <p className="text-gray-500 text-sm mb-6">
            Select a product to preview your pattern
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {products.map((product) => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onGenerateMockup(product.id)}
                disabled={!patternUrl}
                className="p-4 rounded-2xl border-2 border-gray-100 hover:border-rose-200 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <product.icon className="w-10 h-10 text-gray-400 group-hover:text-rose-500 mx-auto mb-2 transition-colors" />
                <p className="text-sm font-medium text-navy-900">{product.name}</p>
              </motion.button>
            ))}
          </div>

          {!patternUrl && (
            <p className="text-center text-sm text-gray-400">
              Generate a pattern first to preview on products
            </p>
          )}
        </div>
      </div>

      {/* Pattern Settings Summary */}
      <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Pattern Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-cream-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Layout</p>
            <p className="font-medium text-navy-900 capitalize">{settings.layout || 'Grid'}</p>
          </div>
          <div className="p-4 bg-cream-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Rotation</p>
            <p className="font-medium text-navy-900">{settings.rotation || 0}°</p>
          </div>
          <div className="p-4 bg-cream-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Spacing</p>
            <p className="font-medium text-navy-900">{settings.spacing || 'Normal'}</p>
          </div>
          <div className="p-4 bg-cream-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Scale</p>
            <p className="font-medium text-navy-900">{settings.scale || 100}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}