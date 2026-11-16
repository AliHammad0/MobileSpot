
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
    }
  }

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?'
    )

    if (!confirmDelete) return

    try {
      await deleteMyOrder(orderId)

      setOrders((prev) =>
        prev.filter((order) => order._id !== orderId)
      )
    } catch (err) {
      alert(err.message || 'Unable to delete order')
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
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center overflow-hidden">
        <div className="text-6xl animate-bounce">✈️</div>

        <h2 className="mt-5 text-xl font-bold tracking-widest text-gray-800">
          PREPARING YOUR ORDERS
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Getting everything ready for you...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-10 md:px-8">

      <style>{`
        .flying-plane {
          position: absolute;
          top: 22px;
          left: -70px;
          font-size: 32px;
          animation: planeFlight 13s linear infinite;
          z-index: 2;
        }

        @keyframes planeFlight {
          0% { left: -70px; transform: translateY(10px) rotate(-5deg); }
          45% { transform: translateY(-22px) rotate(2deg); }
          100% { left: 110%; transform: translateY(-5px) rotate(-5deg); }
        }

        .flight-path {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          border-top: 2px dashed #d6c7a4;
          opacity: .6;
        }

        .cloud {
          position: absolute;
          font-size: 30px;
          opacity: .55;
          animation: cloudMove 22s linear infinite;
        }

        .cloud-one { top: 8px; left: 20%; }
        .cloud-two { top: 45px; left: 65%; animation-delay: -10s; }

        @keyframes cloudMove {
          0% { transform: translateX(-20px); }
          50% { transform: translateX(35px); }
          100% { transform: translateX(-20px); }
        }

        .order-card {
          animation: orderAppear .65s ease both;
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 45px rgba(0,0,0,.09);
        }

        @keyframes orderAppear {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .status-float {
          animation: statusFloat 3s ease-in-out infinite;
        }

        @keyframes statusFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* VIP MONEY ORBIT */

        .vip-order {
          position: relative;
          overflow: hidden;
          border: 1.5px solid #d6ad50 !important;
          background: linear-gradient(135deg, #fffdf4, #fff9e7, #fff);
          box-shadow: 0 8px 35px rgba(190, 145, 45, .13);
        }

        .vip-order:hover {
          box-shadow: 0 15px 50px rgba(190, 145, 45, .25);
        }

        .vip-top-line {
          height: 4px;
          background: linear-gradient(
            90deg,
            #9b6b16,
            #ffe7a0,
            #bd8b27,
            #fff0b8,
            #9b6b16
          );
          background-size: 200% 100%;
          animation: goldLine 3s linear infinite;
        }

        @keyframes goldLine {
          from { background-position: 0 0; }
          to { background-position: 200% 0; }
        }

        .vip-shine {
          position: absolute;
          top: 0;
          left: -120%;
          width: 65%;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            transparent,
            rgba(255, 220, 130, .16),
            transparent
          );
          animation: vipShine 5s ease-in-out infinite;
        }

        @keyframes vipShine {
          0%, 55% { left: -120%; }
          100% { left: 150%; }
        }

        .money-stage {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 230px;
          min-height: 105px;
          isolation: isolate;
        }

        .money-ring {
          position: absolute;
          width: 190px;
          height: 75px;
          border: 2px solid rgba(194, 145, 39, .55);
          border-radius: 50%;
          transform: rotate(-12deg);
          animation: ringOrbit 5s linear infinite;
          z-index: -1;
        }

        .money-ring-two {
          position: absolute;
          width: 210px;
          height: 88px;
          border: 1px dashed rgba(194, 145, 39, .4);
          border-radius: 50%;
          transform: rotate(18deg);
          animation: ringOrbit 8s linear infinite reverse;
          z-index: -1;
        }

        @keyframes ringOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .orbit-coin {
          position: absolute;
          font-size: 22px;
          filter: drop-shadow(0 3px 3px rgba(120, 80, 10, .2));
          animation: coinOrbit 4s ease-in-out infinite;
        }

        .coin-one { top: 0; left: 12px; }
        .coin-two { bottom: 2px; right: 15px; animation-delay: -1.3s; }
        .coin-three { top: 5px; right: 18px; animation-delay: -2.5s; }

        @keyframes coinOrbit {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-13px) rotate(25deg) scale(1.15); }
        }

        .vip-price {
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
          background: linear-gradient(
            100deg,
            #80550b,
            #d7a83f,
            #8d6417,
            #f2d47e,
            #80550b
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: priceGold 4s linear infinite;
          filter: drop-shadow(0 2px 5px rgba(170, 125, 25, .16));
          position: relative;
          z-index: 1;
        }

        @keyframes priceGold {
          to { background-position: 250% center; }
        }

        .vip-sparkle {
          position: absolute;
          color: #c39127;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-one { top: 5px; left: 5px; }
        .sparkle-two { bottom: 8px; right: 5px; animation-delay: .7s; }
        .sparkle-three { top: 0; right: 35px; animation-delay: 1.2s; }

        @keyframes sparkle {
          0%, 100% { opacity: .25; transform: scale(.7) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(90deg); }
        }

        .vip-label {
          background: linear-gradient(110deg, #8a621a, #e6c36c, #946918);
          color: white;
          box-shadow: 0 4px 14px rgba(150, 105, 25, .22);
        }

        .vip-crown {
          display: inline-block;
          animation: crownFloat 2.2s ease-in-out infinite;
        }

        @keyframes crownFloat {
          0%, 100% { transform: translateY(0) rotate(-7deg); }
          50% { transform: translateY(-5px) rotate(7deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* AIRPLANE ANIMATION */}
      <div className="relative h-20 max-w-7xl mx-auto mb-5 overflow-hidden rounded-2xl">
        <div className="flight-path"></div>
        <span className="cloud cloud-one">☁️</span>
        <span className="cloud cloud-two">☁️</span>
        <span className="flying-plane">✈️</span>
      </div>

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
          className="flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FiRefreshCw />
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
        ].map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              style={{ animationDelay: `${index * 100}ms` }}
              className="order-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
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
            <div className="text-5xl mb-4">📦</div>

            <h2 className="text-xl font-bold text-gray-800">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-2">
              Your orders will appear here after your purchase.
            </p>
          </div>
        ) : (
          orders.map((order, index) => {
            const status = order.orderStatus || 'Pending'
            const Icon = StatusIcon[status] || FiPackage
            const isVIP = Number(order.totalPrice || 0) >= VIP_LIMIT

            return (
              <div
                key={order._id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`order-card rounded-2xl border bg-white ${
                  isVIP ? 'vip-order' : 'border-gray-100 shadow-sm'
                }`}
              >
                {isVIP && <div className="vip-top-line"></div>}
                {isVIP && <div className="vip-shine"></div>}

                <div className="relative z-10 p-5 md:p-7">

                  {/* ORDER HEADER */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h2>

                        {isVIP && (
                          <span className="vip-label px-3 py-1 rounded-full text-[10px] tracking-wider font-bold flex items-center gap-1">
                            <span className="vip-crown">👑</span>
                            VIP ORDER
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          'en-PK',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }
                        )}
                      </p>
                    </div>

                    <div className={`status-float inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                      statusStyles[status] || 'bg-gray-100 text-gray-700'
                    }`}>
                      <Icon size={16} />
                      {status}
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="space-y-4">
                    {(order.orderItems || []).map((item, itemIndex) => (
                      <div
                        key={item._id || itemIndex}
                        className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0"
                      >
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
                    ))}
                  </div>

                  {/* ORDER FOOTER */}
                  <div className={`mt-5 pt-5 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-5 ${
                    isVIP ? 'border-[#ead9aa]' : 'border-gray-100'
                  }`}>
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
                          <div className="flex items-center gap-2 text-[#9a7427] text-xs font-bold tracking-widest mb-1">
                            <FiStar />
                            PREMIUM PURCHASE
                            <FiStar />
                          </div>

                          <div className="money-stage">
                            <div className="money-ring"></div>
                            <div className="money-ring-two"></div>

                            <span className="orbit-coin coin-one">🪙</span>
                            <span className="orbit-coin coin-two">💰</span>
                            <span className="orbit-coin coin-three">🪙</span>

                            <span className="vip-sparkle sparkle-one">✦</span>
                            <span className="vip-sparkle sparkle-two">✧</span>
                            <span className="vip-sparkle sparkle-three">✦</span>

                            <span className="vip-price">
                              {formatPrice(order.totalPrice)}
                            </span>
                          </div>

                          <p className="text-[10px] tracking-[3px] font-bold text-[#a48645]">
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
                        className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
                      >
                        Cancel Order
                      </button>
                    )}

                    {status === 'Cancelled' && (
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <FiTrash2 />
                        Delete Order
                      </button>
                    )}

                    {/* LUCKY SPIN */}
                    {status === 'Delivered' && (
                      <Link
                        to="/lucky-spin"
                        className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-[#9b6b16] via-[#d6ad50] to-[#9b6b16] bg-[length:200%_100%] text-white text-sm font-bold flex items-center gap-2 shadow-md hover:bg-right transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FiGift
                          size={18}
                          className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                        />
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
