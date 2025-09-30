// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../Redux/slices/ordersSlice';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder, orderLoading, orderError } = useSelector(state => state.orders);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{orderError}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
          >
            Go to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        {currentOrder && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-pink-600 text-white px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Order #{currentOrder.orderNumber}</h2>
                  <p className="text-pink-100 text-sm">Placed on {formatDate(currentOrder.createdAt)}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="inline-block bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {currentOrder.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {currentOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-3 border-b border-gray-200 last:border-b-0">
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.color?.colorName} • {item.size?.toUpperCase()} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ₹{item.priceAtPurchase?.toLocaleString()} × {item.quantity} = ₹{item.itemTotal?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{currentOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  {currentOrder.totalDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{currentOrder.totalDiscountAmount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {currentOrder.shippingCharge === 0 ? 'FREE' : `₹${currentOrder.shippingCharge?.toLocaleString()}`}
                    </span>
                  </div>
                  {currentOrder.taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{currentOrder.taxAmount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-lg font-semibold">Total Paid</span>
                    <span className="text-lg font-bold text-pink-600">
                      ₹{currentOrder.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{currentOrder.shippingAddress?.name}</p>
                  <p className="text-sm text-gray-600">{currentOrder.shippingAddress?.addressLine1}</p>
                  {currentOrder.shippingAddress?.addressLine2 && (
                    <p className="text-sm text-gray-600">{currentOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.pinCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Phone: {currentOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Payment Successful</p>
                    <p className="text-sm text-green-700">
                      Your payment of ₹{currentOrder.total?.toLocaleString()} via {currentOrder.paymentMethod?.toUpperCase()} has been processed successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Redirecting to your orders in <span className="font-bold text-pink-600">{countdown}</span> seconds...
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>We'll notify you when your order is shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Track your order anytime from your profile</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;