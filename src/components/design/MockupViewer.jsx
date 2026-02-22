import React from 'react';
import { motion } from 'framer-motion';
import { Package, Check, Download, Share2 } from 'lucide-react';

export default function MockupViewer({ mockupUrl, onSave }) {
  const handleDownload = () => {
    if (mockupUrl) {
      const link = document.createElement('a');
      link.href = mockupUrl;
      link.download = 'thread-doodle-mockup.png';
      link.click();
    }
  };

  const handleOrder = () => {
    // if (mockupUrl) {
    //   const link = document.createElement('a');
    //   link.href = mockupUrl;
    //   link.download = 'thread-doodle-mockup.png';
    //   link.click();
    // }
  };
  

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Product Preview</h2>
        <p className="text-gray-500">See how your design looks on the product</p>
      </div>

      {/* Mockup Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 mb-8"
      >
        <div className="aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden bg-gray-100">
          {mockupUrl ? (
            <img
              src={mockupUrl}
              alt="Product mockup"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">No mockup generated yet</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {mockupUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4"
        >
             <button
            onClick={handleOrder}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Download className="w-5 h-5" />
           Order Now
          </button>
          {/* <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Preview
          </button> */}
          <button
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
          >
            {/* <Check className="w-5 h-5" /> */}
            Save & Continue
          </button>
        </motion.div>
      )}

      {/* Tips */}
      <div className="mt-12 p-6 bg-cream-50 rounded-2xl">
        <h4 className="font-semibold text-navy-900 mb-3">Tips for best results:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Use high-resolution images for crisp print quality
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Simple, bold designs work best on apparel
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Consider the product color when designing patterns
          </li>
        </ul>
      </div>
    </div>
  );
}