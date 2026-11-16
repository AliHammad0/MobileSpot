
import React, { useEffect, useState } from 'react'

import {
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiTruck
} from 'react-icons/fi'

import {
  getAllOrders,
  updateOrderStatus
} from '../services/orderApi'

const statuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
]

const journeyStatuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered'
]

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [updatingId, setUpdatingId] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAllOrders()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      setError('')

      await updateOrderStatus(orderId, newStatus)

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to update order status')
    } finally {
      setUpdatingId('')
    }
  }

  const filteredOrders = orders.filter(order => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      order._id?.toLowerCase().includes(searchValue) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchValue) ||
      order.shippingAddress?.phone?.includes(searchValue)

    const matchesStatus =
      filterStatus === 'All' || order.orderStatus === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatPrice = price =>
    `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

  const totalRevenue = orders
    .filter(order => order.orderStatus !== 'Cancelled')
    .reduce((total, order) => total + Number(order.totalPrice || 0), 0)

  // Live Order Journey
  const OrderJourney = ({ status }) => {
    const currentStep = journeyStatuses.indexOf(status)

    if (status === 'Cancelled') {
      return (
        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Order Cancelled
          </div>
          <p className="mt-1 text-xs text-red-500">
            This order will not proceed further.
          </p>
        </div>
      )
    }

    return (
      <div className="mt-3 w-52 rounded-lg border border-gray-100 bg-gray-50 p-3">
        <p className="mb-3 text-xs font-bold text-gray-700">
          Live Order Journey
        </p>

        <div className="relative">
          <div className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-[2px] bg-gray-200" />

          <div
            className="absolute left-[11px] top-3 w-[2px] bg-green-500 transition-all duration-700"
            style={{
              height: `${Math.max(0, currentStep) / 3 * 100}%`
            }}
          />

          <div className="relative space-y-4">
            {journeyStatuses.map((step, index) => {
              const completed = index < currentStep
              const active = index === currentStep

              return (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      completed
                        ? 'border-green-500 bg-green-500 text-white'
                        : active
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {completed ? (
                      <FiCheckCircle size={13} />
                    ) : active ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>

                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={`text-xs ${
                        active
                          ? 'font-bold text-black'
                          : completed
                          ? 'font-semibold text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>

                    {active && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-black">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-2">
          <p className="text-[10px] text-gray-500">
            {status === 'Delivered'
              ? 'Your order journey is complete!'
              : `Order is currently ${status}.`}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-[Arial]">
        <FiRefreshCw className="animate-spin text-3xl text-gray-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-[Arial] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Manage Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View and manage all customer orders.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Orders</p>
              <FiShoppingBag className="text-xl text-gray-500" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {orders.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <FiClock className="text-xl text-yellow-600" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {orders.filter(o => o.orderStatus === 'Pending').length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Delivered Orders</p>
              <FiCheckCircle className="text-xl text-green-600" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {orders.filter(o => o.orderStatus === 'Delivered').length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Order Value</p>
              <FiDollarSign className="text-xl text-gray-500" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-900">
              {formatPrice(totalRevenue)}
            </h2>
          </div>

        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">

          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order ID, customer or phone..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black sm:w-52"
          >
            <option value="All">All Orders</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

        </div>

        {/* Orders */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          <div className="border-b border-gray-200 p-5">
            <h2 className="font-bold text-gray-900">
              All Orders ({filteredOrders.length})
            </h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <FiPackage className="mx-auto text-5xl text-gray-300" />
              <h3 className="mt-4 font-bold text-gray-900">
                No Orders Found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No orders match your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Products</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(order => (

                    <tr key={order._id} className="text-sm">

                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-900">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {order._id}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-900">
                          {order.shippingAddress?.fullName || 'N/A'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.shippingAddress?.phone || 'N/A'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.shippingAddress?.city || ''}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          {order.orderItems?.map((item, index) => (
                            <div key={item._id || index}>
                              <p className="font-medium text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-PK')}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 font-bold text-gray-900">
                        {formatPrice(order.totalPrice)}
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-medium text-gray-800">
                          {order.paymentMethod}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.paymentStatus}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-2">

                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                            {order.orderStatus}
                          </span>

                          <select
                            value={order.orderStatus}
                            disabled={
                              updatingId === order._id ||
                              order.orderStatus === 'Cancelled'
                            }
                            onChange={e =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="block w-36 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {updatingId === order._id && (
                            <p className="text-xs text-gray-500">
                              Updating...
                            </p>
                          )}

                          {/* Live Order Journey */}
                          <OrderJourney status={order.orderStatus} />

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default AdminOrders
