import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Palette,
  Calendar,
  ArrowRight,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';
import { isAuthenticated } from '@/api/config';

export default function MyDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin?redirect=/mydesigns');
      return;
    }
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      // Fetch orders from backend - backend returns only orders for logged-in user
      const orders = await apiService.orders.getAll();

      // Handle both camelCase and PascalCase from C# API
      const normalizedOrders = Array.isArray(orders) ? orders : [];

      // Extract all items from all orders and create design objects
      const allDesigns = [];
      normalizedOrders.forEach(order => {
        const items = order.items || order.Items || [];
        const orderId = order.id || order.Id;
        const orderDate = order.createdAt || order.CreatedAt;
        const orderStatus = order.status || order.Status;

        items.forEach(item => {
          allDesigns.push({
            id: item.id || item.Id,
            orderId: orderId,
            name: item.productName || item.ProductName || 'Custom Design',
            mockupUrl: item.mockupUrl || item.MockupUrl,
            patternUrl: item.patternUrl || item.PatternUrl,
            size: item.size || item.Size,
            price: item.price ?? item.Price,
            quantity: item.quantity ?? item.Quantity,
            createdAt: orderDate,
            status: orderStatus
          });
        });
      });

      // Sort by date (newest first)
      allDesigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setDesigns(allDesigns);
    } catch (err) {
      console.error('Fetch designs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reorderDesign = (design) => {
    // Store the design data and navigate to mockup page for reordering
    sessionStorage.setItem('selectedMockup', JSON.stringify({
      mockupUrl: design.mockupUrl,
      patternUrl: design.patternUrl,
      name: design.name,
      price: design.price,
      variantIds: []
    }));
    navigate('/mockup');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">My Designs</h1>
              <p className="text-gray-500">Your purchased designs</p>
            </div>
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Design
            </Link>
          </div>

          {designs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 mb-2">No designs yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first wearable memory</p>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <motion.div
                  key={`${design.orderId}-${design.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-amber-100 relative overflow-hidden">
                    {design.mockupUrl ? (
                      <img
                        src={design.mockupUrl}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-16 h-16 text-rose-300" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        design.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : design.status === 'shipped'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {design.status?.charAt(0).toUpperCase() + design.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-navy-900 mb-1">{design.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(design.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span>Size: {design.size}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="font-semibold text-navy-900">${design.price?.toFixed(2)}</span>
                      <button
                        onClick={() => reorderDesign(design)}
                        className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Reorder
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
