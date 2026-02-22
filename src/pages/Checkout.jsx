import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
  Loader2,
  Check,
  ShoppingBag,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import AppLayout from '@/components/layout/AppLayout';
import apiService from '@/api/apiService';
import useCartStore from '@/stores/useCartStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, removeFromCart, updateQuantity } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentError, setPaymentError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [{ isPending }] = usePayPalScriptReducer();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    countryCode: 'US'
  });

  // Use ref to avoid re-creating onApprove callback when shippingInfo changes
  const shippingInfoRef = useRef(shippingInfo);
  shippingInfoRef.current = shippingInfo;

  // Use ref for cartItems to avoid stale closure
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  // Use ref for selected shipping to avoid stale closure in PayPal callbacks
  const selectedShippingRef = useRef(selectedShipping);
  selectedShippingRef.current = selectedShipping;

  // Flag to prevent the empty-cart redirect from firing during order completion
  const orderCompletingRef = useRef(false);

  // Calculate totals from cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Handle both camelCase and PascalCase from C# API
  const shippingCost = selectedShipping ? (selectedShipping.rate ?? selectedShipping.Rate) : null;
  const total = shippingCost !== null ? subtotal + shippingCost : subtotal;

  useEffect(() => {
    if (cartItems.length === 0 && !orderCompletingRef.current) {
      navigate('/design');
    }
  }, [cartItems, navigate]);

  // Fetch shipping countries on mount
useEffect(() => {
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true); // ← Add this!
      
      const data = await apiService.orders.getShippingCountries();
      
      console.log('Raw countries data:', data); // ← Debug log
      
      // Handle both camelCase and PascalCase from C# API
      const normalizedCountries = (Array.isArray(data.countries
) ? data.countries
 : []).map(c => ({
        code: c.code || c.Code,
        name: c.name || c.Name
      }));
      
      console.log('Normalized countries:', normalizedCountries); // ← Debug log
      
      setCountries(normalizedCountries);

      // Set default to US (or first country if US not found)
      if (normalizedCountries.length > 0) {
        const defaultCountry = normalizedCountries.find(c => c.code === 'US') 
                            || normalizedCountries[0];
        
        setShippingInfo(prev => ({
          ...prev,
          country: defaultCountry.name,
          countryCode: defaultCountry.code
        }));
      }
    } catch (err) {
      console.error('Failed to fetch shipping countries:', err);
      
      // Fallback to a few common countries
      const fallbackCountries = [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'GB', name: 'United Kingdom' }
      ];
      
      setCountries(fallbackCountries);
      
      // Set US as default
      setShippingInfo(prev => ({
        ...prev,
        country: 'United States',
        countryCode: 'US'
      }));
    } finally {
      setLoadingCountries(false);
    }
  };
  
  fetchCountries();
}, []); // ← Empty array is correct - only fetch once on mount

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setCalculatingShipping(true);
    setPaymentError(null);

    try {
      // Call API to calculate shipping based on cart items and address
      console.log('Calculating shipping for:', {
        items: cartItems.map(item => ({
          variantIds: item.variantIds,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          countryCode: shippingInfo.countryCode,
        }
      });
      const response = await apiService.orders.calculateShipping({
        items: cartItems.map(item => ({
          variantIds: item.variantIds,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          countryCode: shippingInfo.countryCode,
        }
      });

      console.log('Shipping calculation response:', response);

      // Store shipping options and auto-select the cheapest one
      // Handle both camelCase (options) and PascalCase (Options) from C# API
      const options = response.options || response.Options || [];
      setShippingOptions(options);
      if (options.length > 0) {
        // Use cheapestRate from API or find the cheapest option manually
        const cheapestRate = response.cheapestRate || response.CheapestRate;
        const cheapest = cheapestRate
          ? options.find(opt => (opt.rate || opt.Rate) === cheapestRate) || options[0]
          : options.reduce((min, opt) =>
              (opt.rate || opt.Rate) < (min.rate || min.Rate) ? opt : min, options[0]);
        setSelectedShipping(cheapest);
      }
      setStep(2);
    } catch (err) {
      console.error('Shipping calculation error:', err);
      setPaymentError('Could not calculate shipping. Please check your address and try again.');
    } finally {
      setCalculatingShipping(false);
    }
  };

  // PayPal create order - include all cart items
  const createOrder = (data, actions) => {
    const currentShipping = selectedShippingRef.current;
    const currentShippingCost = currentShipping?.rate ?? currentShipping?.Rate ?? 0;
    const currentTotal = subtotal + currentShippingCost;

    const items = cartItems.map(item => ({
      name: item.name || 'Custom Design Product',
      unit_amount: {
        currency_code: 'USD',
        value: item.price.toFixed(2)
      },
      quantity: item.quantity.toString()
    }));

    return actions.order.create({
      purchase_units: [
        {
          description: `Order with ${cartItems.length} item(s)`,
          amount: {
            currency_code: 'USD',
            value: currentTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2)
              },
              shipping: {
                currency_code: 'USD',
                value: currentShippingCost.toFixed(2)
              }
            }
          },
          items
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  };

  // PayPal on approve (payment successful)
  const onApprove = useCallback(async (data, actions) => {
    setPaymentError(null);

    try {
      const details = await actions.order.capture();
      console.log('Payment completed:', details);

      setLoading(true);

      // Get current cart items from ref
      const currentCartItems = cartItemsRef.current;
      const currentSubtotal = currentCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const currentShipping = selectedShippingRef.current;
      // Handle both camelCase and PascalCase from C# API
      const currentShippingCost = currentShipping?.rate ?? currentShipping?.Rate ?? 0;
      const currentShippingId = currentShipping?.id || currentShipping?.Id;
      const currentShippingName = currentShipping?.name || currentShipping?.Name;

      console.log('Order request body:', JSON.stringify({
        items: currentCartItems.map(item => ({
          variantIds: item.variantIds,
          mockupUrl: item.mockupUrl,
          patternUrl: item.patternUrl,
          productName: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingInfo: shippingInfoRef.current,
        shippingOptionId: currentShippingId,
        shippingOptionName: currentShippingName,
        shippingCost: currentShippingCost,
        totalAmount: currentSubtotal + currentShippingCost,
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
        paymentStatus: details.status
      }, null, 2));

      console.log('Creating order with backend...currentCartItems:', currentCartItems );
      // Send order to backend with all cart items
      const orderResponse = await apiService.orders.create({
        // Array of all items in the order
        items: currentCartItems.map(item => ({
          variantIds: item.variantIds,
          mockupUrl: item.mockupUrl,
          patternUrl: item.patternUrl,
          productName: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),

        // Shipping info
        shippingInfo: shippingInfoRef.current,
        shippingOptionId: currentShippingId,
        shippingOptionName: currentShippingName,
        shippingCost: currentShippingCost,
        totalAmount: currentSubtotal + currentShippingCost,

        // PayPal payment info
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
        paymentStatus: details.status
      });

      console.log('Order created successfully:', orderResponse);

      // Prepare order details for thank you page
      const orderDetails = {
        orderId: orderResponse?.id || orderResponse?.Id || details.id,
        orderNumber: orderResponse?.orderNumber || orderResponse?.OrderNumber,
        items: currentCartItems,
        shippingInfo: shippingInfoRef.current,
        shippingMethod: currentShippingName,
        shippingCost: currentShippingCost,
        subtotal: currentSubtotal,
        total: currentSubtotal + currentShippingCost,
        paypalTransactionId: details.id,
        orderDate: new Date().toISOString()
      };

      // Suppress the empty-cart redirect, then clear and navigate to thank you
      orderCompletingRef.current = true;
      clearCart();
      navigate('/thankyou', { state: { orderDetails } });

      return details;
    } catch (err) {
      console.error('Order creation error:', err);
      setPaymentError('Payment failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, clearCart]);

  // PayPal on error
  const onError = (err) => {
    console.error('PayPal error:', err);
    setPaymentError('Payment failed. Please try again.');
  };

  if (cartItems.length === 0) return null;

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
              { num: 1, label: 'Address' },
              { num: 2, label: 'Shipping' },
              { num: 3, label: 'Payment' }
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
                  <span className="font-medium hidden sm:inline">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />
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
                        value={shippingInfo.countryCode}
                        onChange={(e) => {
                          const selected = countries.find(c => c.code === e.target.value);
                          setShippingInfo({
                            ...shippingInfo,
                            country: selected?.name || e.target.value,
                            countryCode: e.target.value
                          });
                        }}
                        className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      >
                        {loadingCountries ? (
                          <option value="">Loading countries...</option>
                        ) : (
                          countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={calculatingShipping}
                    className="mt-6 w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {calculatingShipping ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Calculating Shipping Options...
                      </>
                    ) : (
                      <>
                        Continue to Shipping
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
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
                      <Truck className="w-5 h-5 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-navy-900">Choose Shipping Method</h2>
                  </div>

                  <div className="space-y-3">
                    {shippingOptions.map((option) => {
                      // Handle both camelCase and PascalCase from C# API
                      const id = option.id || option.Id;
                      const name = option.name || option.Name;
                      const rate = option.rate ?? option.Rate;
                      const minDays = option.minDeliveryDays ?? option.MinDeliveryDays;
                      const maxDays = option.maxDeliveryDays ?? option.MaxDeliveryDays;
                      const selectedId = selectedShipping?.id || selectedShipping?.Id;

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedShipping(option)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedId === id
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-navy-900">{name}</p>
                              <p className="text-sm text-gray-500">
                                {minDays === maxDays
                                  ? `${minDays} business days`
                                  : `${minDays}-${maxDays} business days`
                                }
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-semibold text-navy-900">
                                ${rate.toFixed(2)}
                              </span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedId === id
                                  ? 'border-rose-500 bg-rose-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedId === id && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!selectedShipping}
                     className="mt-6 w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
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
                      onClick={() => setStep(2)}
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

                {/* List all cart items */}
                <div className="space-y-4 pb-4 border-b border-gray-100 max-h-[32rem] overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="border border-gray-100 rounded-2xl p-3 space-y-3">
                      {/* Image + name + delete */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate('/mockup')}
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                          title="Click to change size or details"
                        >
                          {item.mockupUrl ? (
                            <img src={item.mockupUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-rose-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate('/mockup')}
                            className="font-medium text-navy-900 text-sm truncate hover:text-doodle-orange transition-colors text-left w-full"
                            title="Click to change size or details"
                          >
                            {item.name || 'Custom Design Product'}
                          </button>
                          <p className="text-xs text-gray-500 mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-doodle-coral mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">Quantity</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) removeFromCart(index);
                              else updateQuantity(index, item.quantity - 1);
                            }}
                            className="w-7 h-7 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-doodle-coral hover:text-doodle-coral transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-navy-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-doodle-orange hover:text-doodle-orange transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="py-4 space-y-2 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <div>
                      <span>Shipping</span>
                      {selectedShipping && (
                        <p className="text-xs text-gray-400">{selectedShipping.name || selectedShipping.Name}</p>
                      )}
                    </div>
                    <span>
                      {selectedShipping
                        ? `$${(selectedShipping.rate ?? selectedShipping.Rate).toFixed(2)}`
                        : <span className="text-gray-400 italic text-sm">Enter address to calculate</span>
                      }
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between text-lg font-semibold text-navy-900">
                  <span>Total</span>
                  <span>
                    {selectedShipping
                      ? `$${total.toFixed(2)}`
                      : <span className="text-gray-400 italic">--</span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
