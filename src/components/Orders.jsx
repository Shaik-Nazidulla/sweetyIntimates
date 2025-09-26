import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getUserOrders, 
  getOrderById, 
  cancelOrder, 
  returnOrder, 
  clearOrderError,
  clearCurrentOrder,
  searchOrders,
  clearSearchResults
} from '../Redux/slices/ordersSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    orders,
    currentOrder,
    searchResults,
    loading,
    orderLoading,
    searchLoading,
    actionLoading,
    error,
    orderError,
    actionError,
    pagination
  } = useSelector(state => state.orders);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load orders on component mount
  useEffect(() => {
    dispatch(getUserOrders({ page: 1, limit: 10 }));
    return () => {
      dispatch(clearOrderError());
      dispatch(clearCurrentOrder());
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  // Status color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'return_requested':
        return 'bg-orange-100 text-orange-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle order click
  const handleOrderClick = async (orderId) => {
    setSelectedOrderId(orderId);
    await dispatch(getOrderById(orderId));
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      await dispatch(searchOrders({ query: searchQuery.trim(), page: 1, limit: 10 }));
    } else {
      setIsSearching(false);
      dispatch(clearSearchResults());
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    dispatch(clearSearchResults());
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason.trim()) return;
    
    try {
      await dispatch(cancelOrder({ orderId: selectedOrderId, reason: cancelReason }));
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrderId(null);
      // Refresh orders
      dispatch(getUserOrders({ page: 1, limit: 10 }));
    } catch (error) {
      console.error('Cancel order error:', error);
    }
  };

  // Handle return order
  const handleReturnOrder = async () => {
    if (!selectedOrderId || !returnReason.trim()) return;
    
    try {
      await dispatch(returnOrder({ orderId: selectedOrderId, reason: returnReason }));
      setShowReturnModal(false);
      setReturnReason('');
      setSelectedOrderId(null);
      // Refresh orders
      dispatch(getUserOrders({ page: 1, limit: 10 }));
    } catch (error) {
      console.error('Return order error:', error);
    }
  };

  // Get display orders (search results or regular orders)
  const displayOrders = isSearching ? searchResults : orders;

  // Order card component
  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">₹{order.total?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Items</p>
            <p className="text-sm font-medium text-gray-900">{order.items?.length || 0} items</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="text-sm font-medium text-gray-900">{order.paymentMethod?.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <p className="text-sm font-medium text-gray-900">{order.paymentStatus?.toUpperCase()}</p>
          </div>
        </div>

        {/* Order Items Preview */}
        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded p-2 min-w-[200px]">
                  <img 
                    src={item.productImage} 
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">
                      {item.color?.colorName} • {item.size?.toUpperCase()} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded p-2 min-w-[60px]">
                  <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleOrderClick(order._id)}
            className="px-4 py-2 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 transition-colors"
          >
            View Details
          </button>
          
          {order.status === 'pending' && (
            <button
              onClick={() => {
                setSelectedOrderId(order._id);
                setShowCancelModal(true);
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          )}
          
          {order.status === 'delivered' && (
            <button
              onClick={() => {
                setSelectedOrderId(order._id);
                setShowReturnModal(true);
              }}
              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
            >
              Return Order
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by product name, order number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {actionError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {actionError}
        </div>
      )}

      {/* Search Results Info */}
      {isSearching && (
        <div className="mb-4 text-sm text-gray-600">
          {searchResults.length} result(s) found for "{searchQuery}"
        </div>
      )}

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-300 mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {isSearching ? 'No orders found' : 'No orders yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isSearching 
              ? 'Try searching with different keywords'
              : 'Start shopping to see your orders here'
            }
          </p>
          {!isSearching && (
            <button
              onClick={() => navigate('/')}
              className="bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {displayOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details #{currentOrder.orderNumber}
                </h2>
                <button
                  onClick={() => {
                    setSelectedOrderId(null);
                    dispatch(clearCurrentOrder());
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {orderLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
              ) : orderError ? (
                <div className="text-center py-12 text-red-600">
                  Error loading order details: {orderError}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Status & Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}>
                        {currentOrder.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{formatDate(currentOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-pink-600">₹{currentOrder.total?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                    <div className="space-y-4">
                      {currentOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-600">
                              Color: {item.color?.colorName} | Size: {item.size?.toUpperCase()} | Qty: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: ₹{item.priceAtPurchase?.toLocaleString()} | Total: ₹{item.itemTotal?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{currentOrder.shippingAddress?.name}</p>
                        <p className="text-sm text-gray-600">{currentOrder.shippingAddress?.addressLine1}</p>
                        {currentOrder.shippingAddress?.addressLine2 && (
                          <p className="text-sm text-gray-600">{currentOrder.shippingAddress.addressLine2}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.pinCode}
                        </p>
                        <p className="text-sm text-gray-600">{currentOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Billing Address</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{currentOrder.billingAddress?.name}</p>
                        <p className="text-sm text-gray-600">{currentOrder.billingAddress?.addressLine1}</p>
                        {currentOrder.billingAddress?.addressLine2 && (
                          <p className="text-sm text-gray-600">{currentOrder.billingAddress.addressLine2}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {currentOrder.billingAddress?.city}, {currentOrder.billingAddress?.state} {currentOrder.billingAddress?.pinCode}
                        </p>
                        <p className="text-sm text-gray-600">{currentOrder.billingAddress?.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{currentOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      {currentOrder.totalDiscountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{currentOrder.totalDiscountAmount?.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{currentOrder.shippingCharge?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{currentOrder.taxAmount?.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-pink-600">₹{currentOrder.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {currentOrder.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Instructions</h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{currentOrder.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedOrderId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={!cancelReason.trim() || actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Order</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for returning this order. We'll review your request and get back to you.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for return *
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please provide a reason for return..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReturnModal(false);
                    setReturnReason('');
                    setSelectedOrderId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnOrder}
                  disabled={!returnReason.trim() || actionLoading}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Return'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;