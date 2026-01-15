import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100', label: 'Delivered' }
};

const orderTimeline = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' }
];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch order');

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error('Fetch order error:', err);
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

  if (!order) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-10 text-center">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Order not found</h2>
          <Link to="/orders" className="text-rose-600 hover:text-rose-700">
            Back to Orders
          </Link>
        </div>
      </AppLayout>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const currentStatusIndex = orderTimeline.findIndex(t => t.status === order.status);

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/orders"
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <span className={`ml-auto px-4 py-2 rounded-full font-medium ${status.bg} ${status.color}`}>
              <StatusIcon className="w-4 h-4 inline mr-2" />
              {status.label}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-6">Order Status</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {orderTimeline.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const stepStatus = statusConfig[step.status];
                      const StepIcon = stepStatus.icon;

                      return (
                        <div key={step.status} className="relative flex items-center gap-4 pl-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            isCompleted ? stepStatus.bg : 'bg-gray-100'
                          }`}>
                            <StepIcon className={`w-4 h-4 ${
                              isCompleted ? stepStatus.color : 'text-gray-400'
                            }`} />
                          </div>
                          <div className={isCurrent ? 'font-medium' : ''}>
                            <p className={`${isCompleted ? 'text-navy-900' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {isCurrent && order.statusUpdatedAt && (
                              <p className="text-sm text-gray-500">
                                {new Date(order.statusUpdatedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Order Items</h3>
                <div className="flex gap-4 p-4 bg-cream-50 rounded-2xl">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex-shrink-0 overflow-hidden">
                    {order.mockupUrl ? (
                      <img src={order.mockupUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-rose-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-navy-900 capitalize">{order.productType}</h4>
                    <p className="text-gray-500 text-sm">
                      Color: {order.color} • {order.size && `Size: ${order.size}`}
                    </p>
                    <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
                    <p className="mt-2 font-semibold text-navy-900">
                      ${(order.totalAmount - 5.99).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h3 className="font-semibold text-navy-900">Shipping Address</h3>
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <p className="font-medium text-navy-900">{order.shippingInfo?.fullName}</p>
                  <p>{order.shippingInfo?.address}</p>
                  <p>
                    {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                  </p>
                  <p>{order.shippingInfo?.country}</p>
                  <p className="pt-2">{order.shippingInfo?.phone}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-rose-500" />
                  <h3 className="font-semibold text-navy-900">Payment Summary</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(order.totalAmount - 5.99).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-semibold text-navy-900">
                    <span>Total</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-cream-50 rounded-2xl p-6 text-center">
                <h4 className="font-semibold text-navy-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-4">Contact our support team</p>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}