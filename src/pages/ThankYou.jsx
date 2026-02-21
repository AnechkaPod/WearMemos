import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Palette, MapPin, CreditCard, Truck, Calendar } from 'lucide-react';
import logo from '@/assets/icons/ThreadLogo2.png';

export default function ThankYou() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Wear Memories" className="h-10 w-auto" />
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-navy-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">
            Your custom design is on its way to being created just for you.
          </p>
        </motion.div>

        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Order Number Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 text-center border-2 border-green-100">
              <p className="text-gray-500 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-navy-900">
                #{orderDetails.orderNumber || orderDetails.orderId?.slice(0, 8).toUpperCase() || 'Processing'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {formatDate(orderDetails.orderDate)}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6">
              <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-500" />
                Order Items
              </h2>
              <div className="space-y-4">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    {item.mockupUrl && (
                      <img
                        src={item.mockupUrl}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-navy-900">{item.name || 'Custom Design'}</h3>
                      <p className="text-gray-500 text-sm">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-navy-900 font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6">
              <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p className="font-medium text-navy-900">{orderDetails.shippingInfo?.fullName}</p>
                <p>{orderDetails.shippingInfo?.address}</p>
                <p>
                  {orderDetails.shippingInfo?.city}, {orderDetails.shippingInfo?.state} {orderDetails.shippingInfo?.zipCode}
                </p>
                <p>{orderDetails.shippingInfo?.country}</p>
                <p className="mt-2 text-sm">
                  <span className="text-gray-500">Email:</span> {orderDetails.shippingInfo?.email}
                </p>
                {orderDetails.shippingInfo?.phone && (
                  <p className="text-sm">
                    <span className="text-gray-500">Phone:</span> {orderDetails.shippingInfo?.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6">
              <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-500" />
                Payment Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping ({orderDetails.shippingMethod})
                  </span>
                  <span>${orderDetails.shippingCost?.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-navy-900 text-lg">
                    <span>Total Paid</span>
                    <span>${orderDetails.total?.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                  Transaction ID: {orderDetails.paypalTransactionId}
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-navy-900 mb-3">What Happens Next?</h2>
              <ol className="space-y-2 text-gray-600">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <span>We'll send you an email confirmation shortly</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <span>Your custom design will be printed with care</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <span>You'll receive tracking info once shipped</span>
                </li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <Link
            to="/design"
            className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-all hover:shadow-lg flex items-center justify-center gap-2 text-lg"
          >
            <Palette className="w-5 h-5" />
            Start a New Design
          </Link>

          <div className="flex gap-4">
            <Link
              to="/orders"
              className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-navy-900 hover:text-navy-900 transition-all text-center"
            >
              View All Orders
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-navy-900 hover:text-navy-900 transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
