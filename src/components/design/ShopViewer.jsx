import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ShopViewer({ mockups, onSelectMockup }) {
  if (!mockups || mockups.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <p className="text-gray-500">No mockups available. Generate patterns first.</p>
      </div>
    );
  }

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
            onClick={() => onSelectMockup(item)}
          >
            <div className="aspect-square bg-gradient-to-br from-cream-50 to-white p-4">
              <img
                src={item.mockupUrl}
                alt={`Mockup ${index + 1}`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-900">
                    Design {index + 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Click to buy</p>
                </div>
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <ShoppingCart className="w-4 h-4" />
                </div>
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
    </div>
  );
}
