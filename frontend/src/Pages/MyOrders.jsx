
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiTrash2,
  FiStar,
  FiGift
} from 'react-icons/fi'

import {
  getMyOrders,
  cancelMyOrder,
  deleteMyOrder
} from '../services/orderApi'

const VIP_LIMIT = 100000

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://mobilespot-backend.vercel.app/api/v1'
).replace(/\/$/, '')

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
}

const StatusIcon = {
  Pending: FiClock,
  Processing: FiPackage,
  Shipped: FiTruck,
  Delivered: FiCheckCircle,
  Cancelled: FiXCircle
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const [openReviews, setOpenReviews] = useState({})
  const [reviewForms, setReviewForms] = useState({})
  const [reviewLoading, setReviewLoading] = useState({})
  const [reviewMessages, setReviewMessages] = useState({})

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getMyOrders()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message || 'Unable to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order?'
    )

    if (!confirmCancel) return

    try {
      setActionLoading(orderId)
      await cancelMyOrder(orderId)

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: 'Cancelled' }
            : order
        )
      )
    } catch (err) {
      alert(err.message || 'Unable to cancel order')
    } finally {
      setActionLoading('')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?'
    )

    if (!confirmDelete) return

    try {
      setActionLoading(orderId)
      await deleteMyOrder(orderId)

      setOrders((prev) =>
        prev.filter((order) => order._id !== orderId)
      )
    } catch (err) {
      alert(err.message || 'Unable to delete order')
    } finally {
      setActionLoading('')
    }
  }

  const getProductId = (item) => {
    if (typeof item.product === 'object') {
      return item.product?._id
    }

    return item.product
  }

  const toggleReview = (productId) => {
    setOpenReviews((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }))

    setReviewMessages((prev) => ({
      ...prev,
      [productId]: ''
    }))
  }

  const handleReviewChange = (productId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [productId]: {
        rating: prev[productId]?.rating || 5,
        comment: prev[productId]?.comment || '',
        [field]: value
      }
    }))
  }

  const handleSubmitReview = async (productId) => {
    const form = reviewForms[productId] || {
      rating: 5,
      comment: ''
    }

    if (!form.comment.trim() || form.comment.trim().length < 3) {
      setReviewMessages((prev) => ({
        ...prev,
        [productId]: 'Please write at least 3 characters.'
      }))
      return
    }

    if (form.comment.trim().length > 1000) {
      setReviewMessages((prev) => ({
        ...prev,
        [productId]: 'Review cannot exceed 1000 characters.'
      }))
      return
    }

    try {
      setReviewLoading((prev) => ({
        ...prev,
        [productId]: true
      }))

      setReviewMessages((prev) => ({
        ...prev,
        [productId]: ''
      }))

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Please login first.')
      }

      const response = await fetch(
        `${API_URL}/reviews/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: form.rating,
            comment: form.comment.trim()
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || 'Unable to submit review.'
        )
      }

      setReviewMessages((prev) => ({
        ...prev,
        [productId]: 'Your review was submitted successfully.'
      }))

      setReviewForms((prev) => ({
        ...prev,
        [productId]: {
          rating: 5,
          comment: ''
        }
      }))

      setOpenReviews((prev) => ({
        ...prev,
        [productId]: false
      }))
    } catch (err) {
      setReviewMessages((prev) => ({
        ...prev,
        [productId]: err.message || 'Unable to submit review.'
      }))
    } finally {
      setReviewLoading((prev) => ({
        ...prev,
        [productId]: false
      }))
    }
  }

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

  const totalOrders = orders.length

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'Delivered'
  ).length

  const pendingOrders = orders.filter(
    (order) =>
      ['Pending', 'Processing'].includes(order.orderStatus)
  ).length

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === 'Cancelled'
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-[Arial]">
        <p className="text-gray-600 font-medium">
          Loading your orders...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-10 md:px-8 font-[Arial]">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[4px] text-[#a58b57] font-semibold mb-2">
            YOUR PURCHASES
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage all your orders in one place.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl disabled:opacity-50"
        >
          <FiRefreshCw size={17} />
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
        {[
          { title: 'Total Orders', value: totalOrders, icon: FiPackage },
          { title: 'Delivered', value: deliveredOrders, icon: FiCheckCircle },
          { title: 'In Progress', value: pendingOrders, icon: FiTruck },
          { title: 'Cancelled', value: cancelledOrders, icon: FiXCircle }
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#f5f1e8] flex items-center justify-center">
                  <Icon size={22} className="text-[#9a7a3d]" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ORDERS */}
      <div className="max-w-7xl mx-auto space-y-7">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-[#f5f1e8] flex items-center justify-center mx-auto mb-4">
              <FiPackage size={30} className="text-[#9a7a3d]" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-2">
              Your orders will appear here after your purchase.
            </p>

            <Link
              to="/mobiles"
              className="inline-block mt-5 px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const status = order.orderStatus || 'Pending'
            const Icon = StatusIcon[status] || FiPackage
            const isVIP = Number(order.totalPrice || 0) >= VIP_LIMIT
            const isProcessing = actionLoading === order._id

            return (
              <div
                key={order._id}
                className={`rounded-2xl border bg-white overflow-hidden ${
                  isVIP
                    ? 'border-[#d6ad50] shadow-[0_8px_30px_rgba(190,145,45,0.10)]'
                    : 'border-gray-100 shadow-sm'
                }`}
              >
                {isVIP && (
                  <div className="h-1 bg-[#d6ad50]" />
                )}

                <div className="p-5 md:p-7">

                  {/* ORDER HEADER */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h2>

                        {isVIP && (
                          <span className="bg-[#f5edda] text-[#916b20] px-3 py-1 rounded-full text-[10px] tracking-wider font-bold flex items-center gap-1">
                            👑 VIP ORDER
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              'en-PK',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }
                            )
                          : 'Date unavailable'}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                        statusStyles[status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      {status}
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="space-y-4">
                    {(order.orderItems || []).map((item, itemIndex) => {
                      const productId = getProductId(item)
                      const isReviewOpen = openReviews[productId]
                      const isReviewLoading = reviewLoading[productId]
                      const reviewMessage = reviewMessages[productId]
                      const reviewForm = reviewForms[productId] || {
                        rating: 5,
                        comment: ''
                      }

                      return (
                        <div
                          key={item._id || itemIndex}
                          className="border-b border-gray-100 pb-4 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                item.image ||
                                item.product?.images?.[0] ||
                                'https://placehold.co/100x100?text=Product'
                              }
                              alt={item.name || 'Product'}
                              className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                            />

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {item.name || item.product?.name || 'Product'}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <p className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          {/* PRODUCT REVIEW */}
                          {status === 'Delivered' && productId && (
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => toggleReview(productId)}
                                className="px-4 py-2 rounded-lg bg-[#f5f1e8] text-[#80632f] text-sm font-semibold"
                              >
                                <span className="flex items-center gap-2">
                                  <FiStar />
                                  {isReviewOpen ? 'Close Review' : 'Write / Update Review'}
                                </span>
                              </button>

                              {isReviewOpen && (
                                <div className="mt-4 bg-[#faf9f6] border border-gray-200 rounded-xl p-4">
                                  <h4 className="font-bold text-gray-900 mb-3">
                                    Rate this product
                                  </h4>

                                  <div className="flex items-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                          handleReviewChange(
                                            productId,
                                            'rating',
                                            star
                                          )
                                        }
                                        className="p-1"
                                        aria-label={`Rate ${star} stars`}
                                      >
                                        <FiStar
                                          size={25}
                                          className={
                                            star <= reviewForm.rating
                                              ? 'text-[#d6ad50] fill-[#d6ad50]'
                                              : 'text-gray-300'
                                          }
                                        />
                                      </button>
                                    ))}
                                  </div>

                                  <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) =>
                                      handleReviewChange(
                                        productId,
                                        'comment',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Write your product review..."
                                    maxLength={1000}
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-black resize-none text-sm"
                                  />

                                  <div className="text-right text-xs text-gray-400 mt-1">
                                    {reviewForm.comment.length}/1000
                                  </div>

                                  {reviewMessage && (
                                    <p className={`text-sm mt-3 ${
                                      reviewMessage.includes('successfully')
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}>
                                      {reviewMessage}
                                    </p>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleSubmitReview(productId)}
                                    disabled={isReviewLoading}
                                    className="mt-4 px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                                  >
                                    {isReviewLoading
                                      ? 'Submitting...'
                                      : 'Submit Review'}
                                  </button>
                                </div>
                              )}

                              {!isReviewOpen && reviewMessage && (
                                <p className="text-sm text-green-600 mt-2">
                                  {reviewMessage}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* ORDER FOOTER */}
                  <div
                    className={`mt-5 pt-5 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-5 ${
                      isVIP ? 'border-[#ead9aa]' : 'border-gray-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-semibold text-gray-800">
                        {order.paymentMethod || 'Cash on Delivery'}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                      {isVIP ? (
                        <>
                          <div className="flex items-center gap-2 text-[#9a7427] text-xs font-bold tracking-widest mb-2">
                            <FiStar />
                            PREMIUM PURCHASE
                            <FiStar />
                          </div>

                          <p className="text-2xl md:text-3xl font-black text-[#a77b25]">
                            {formatPrice(order.totalPrice)}
                          </p>

                          <p className="text-[10px] tracking-[3px] font-bold text-[#a48645] mt-2">
                            EXCLUSIVE VIP ORDER
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">
                            Total Amount
                          </p>

                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 mt-6">

                    {['Pending', 'Processing'].includes(status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold disabled:opacity-50"
                      >
                        {isProcessing ? 'Please wait...' : 'Cancel Order'}
                      </button>
                    )}

                    {status === 'Cancelled' && (
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        <FiTrash2 />
                        {isProcessing ? 'Please wait...' : 'Delete Order'}
                      </button>
                    )}

                    {status === 'Delivered' && (
                      <Link
                        to="/lucky-spin"
                        className="px-6 py-3 rounded-xl bg-[#b58a35] text-white text-sm font-bold flex items-center gap-2"
                      >
                        <FiGift size={18} />
                        <span>Spin Now</span>
                      </Link>
                    )}

                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders
