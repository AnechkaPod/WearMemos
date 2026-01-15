import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiService.orders.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
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
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-navy-900 mb-2">My Orders</h1>
          <p className="text-gray-500 mb-8">Track and manage your orders</p>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start designing to create your first order</p>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/orders/${order.id}`}
                      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 group"
                    >
                      <div className="flex items-center gap-6">
                        {/* Product Preview */}
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {order.mockupUrl ? (
                            <img src={order.mockupUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-rose-400" />
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-navy-900">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="w-3 h-3 inline mr-1" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mb-2">
                            {order.productType} • Qty: {order.quantity}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        {/* Price & Arrow */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-navy-900">
                            ${order.totalAmount?.toFixed(2)}
                          </p>
                          <ArrowRight className="w-5 h-5 text-gray-400 ml-auto mt-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}