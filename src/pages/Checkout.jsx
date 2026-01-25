import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
  Loader2,
  Check,
  ShoppingBag
} from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';

export default function Checkout() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentError, setPaymentError] = useState(null);
  const [{ isPending }] = usePayPalScriptReducer();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('checkoutData');
    if (stored) {
      setOrderData(JSON.parse(stored));
    } else {
      navigate('/design');
    }
  }, []);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // PayPal create order
  const createOrder = (data, actions) => {
    const subtotal = orderData.price * orderData.quantity;
    const shippingCost = 5.99;
    const total = subtotal + shippingCost;

    return actions.order.create({
      purchase_units: [
        {
          description: orderData.name || 'Custom Design Product',
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2)
              },
              shipping: {
                currency_code: 'USD',
                value: shippingCost.toFixed(2)
              }
            }
          },
          items: [
            {
              name: orderData.name || 'Custom Design Product',
              unit_amount: {
                currency_code: 'USD',
                value: orderData.price.toFixed(2)
              },
              quantity: orderData.quantity.toString()
            }
          ]
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  };

  // PayPal on approve (payment successful)
  // IMPORTANT: Don't call setLoading before capture() - it causes re-render and breaks the popup
  const onApprove = useCallback(async (data, actions) => {
    setPaymentError(null);

    try {
      // Capture the payment - don't set state before this completes!
      const details = await actions.order.capture();
      console.log('Payment completed:', details);
       console.log('orderData:', orderData);
      // NOW we can set loading state (after popup is done)
      setLoading(true);

      // TODO: Uncomment when backend is ready
      const orderResponse = await apiService.orders.create({
        // Product info
        variantIds: orderData.variantIds,
        mockupUrl: orderData.mockupUrl,
        patternUrl: orderData.patternUrl,
        productName: orderData.name,
        price: orderData.price,
        size: orderData.size,
        quantity: orderData.quantity,

        // Shipping
        shippingInfo,
        shippingCost: 5.99,
        totalAmount: orderData.price * orderData.quantity + 5.99,

        // PayPal payment info
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
        paymentStatus: details.status
      });

      // For now, show success and clear checkout data
      sessionStorage.removeItem('checkoutData');

      // Navigate to a success page or orders page
      alert(`Payment successful! Transaction ID: ${details.id}`);
      navigate('/');
    } catch (err) {
      console.error('Order creation error:', err);
      setPaymentError('Payment failed. Please try again.');
      setLoading(false);
    }
  }, [navigate, orderData, shippingInfo]);

  // PayPal on error
  const onError = (err) => {
    console.error('PayPal error:', err);
    setPaymentError('Payment failed. Please try again.');
  };

  if (!orderData) return null;

  const subtotal = orderData.price * orderData.quantity;
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Checkout</h1>
          <p className="text-gray-500 mb-8">Complete your order</p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-10">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' }
            ].map((s, index) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-navy-900' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > s.num
                      ? 'bg-green-500 text-white'
                      : step === s.num
                        ? 'bg-navy-900 text-white'
                        : 'bg-gray-100'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="font-medium">{s.label}</span>
                </div>
                {index < 1 && (
                  <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleShippingSubmit}
                  className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-navy-900">Shipping Information</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-navy-900">Payment</h2>
                  </div>

                  <div className="flex items-center gap-2 mb-6 p-4 bg-green-50 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Your payment is secure and encrypted by PayPal</span>
                  </div>

                  {paymentError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                      {paymentError}
                    </div>
                  )}

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
                      <span className="ml-3 text-navy-900">Processing your order...</span>
                    </div>
                  ) : (
                    <>
                      {isPending ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Choose your payment method. You can pay with PayPal or credit/debit card.
                          </p>

                          <PayPalButtons
                            style={{
                              layout: 'vertical',
                              color: 'blue',
                              shape: 'rect',
                              label: 'pay',
                              height: 50
                            }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            fundingSource={undefined}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                      Back to Shipping
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Order Summary</h3>

                <div className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center overflow-hidden">
                    {orderData.mockupUrl ? (
                      <img src={orderData.mockupUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{orderData.name || 'Custom Design Product'}</p>
                    <p className="text-sm text-gray-500">
                      {orderData.size && `Size ${orderData.size}`}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {orderData.quantity}</p>
                  </div>
                </div>

                <div className="py-4 space-y-2 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between text-lg font-semibold text-navy-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
