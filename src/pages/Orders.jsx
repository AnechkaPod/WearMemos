import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Loader2,
  ShoppingBag,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';
import { isAuthenticated } from '@/api/config';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' }
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin?redirect=/orders');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiService.orders.getAll();
      // Handle both camelCase and PascalCase from C# API
      const normalizedOrders = (Array.isArray(data) ? data : []).map(order => ({
        id: order.id || order.Id,
        status: order.status || order.Status || 'pending',
        totalAmount: order.totalAmount ?? order.TotalAmount ?? 0,
        shippingCost: order.shippingCost ?? order.ShippingCost ?? 0,
        createdAt: order.createdAt || order.CreatedAt,
        fullName: order.fullName || order.FullName,
        address: order.address || order.Address,
        city: order.city || order.City,
        state: order.state || order.State,
        country: order.country || order.Country,
        items: (order.items || order.Items || []).map(item => ({
          id: item.id || item.Id,
          mockupUrl: item.mockupUrl || item.MockupUrl,
          patternUrl: item.patternUrl || item.PatternUrl,
          productName: item.productName || item.ProductName || 'Custom Product',
          price: item.price ?? item.Price ?? 0,
          size: item.size || item.Size,
          quantity: item.quantity ?? item.Quantity ?? 1
        }))
      }));
      setOrders(normalizedOrders);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getTotalItems = (order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const isExpanded = expandedOrders[order.id];
                const totalItems = getTotalItems(order);
                const firstItem = order.items[0];

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-navy-900">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Shipping Address */}
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {order.fullName} • {order.address}, {order.city}, {order.state} {order.country}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      {/* Show first item always */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                          {firstItem?.mockupUrl ? (
                            <img src={firstItem.mockupUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy-900">{firstItem?.productName}</p>
                          <p className="text-sm text-gray-500">
                            Size: {firstItem?.size} • Qty: {firstItem?.quantity}
                          </p>
                          <p className="text-sm font-medium text-rose-500">
                            ${(firstItem?.price * firstItem?.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Show more items if expanded */}
                      {isExpanded && order.items.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 mb-4"
                        >
                          {order.items.slice(1).map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pt-4 border-t border-gray-100">
                              <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                {item.mockupUrl ? (
                                  <img src={item.mockupUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-navy-900">{item.productName}</p>
                                <p className="text-sm text-gray-500">
                                  Size: {item.size} • Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-medium text-rose-500">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* Show more/less button if multiple items */}
                      {order.items.length > 1 && (
                        <button
                          onClick={() => toggleOrderExpanded(order.id)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy-900 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show {order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {totalItems} item{totalItems !== 1 ? 's' : ''} •
                        Shipping: ${order.shippingCost.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-navy-900">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <Link
                          to={`/orderdetails?id=${order.id}`}
                          className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
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
