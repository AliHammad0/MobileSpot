
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPackage,
  FiCheckCircle,
  FiStar,
  FiAlertCircle,
  FiPlus,
  FiRefreshCw,
  FiSmartphone
} from 'react-icons/fi'

import { getProducts } from '../services/productApi'

const formatPrice = (price = 0) =>
  `Rs ${Number(price).toLocaleString('en-PK')}`

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProducts()
      setProducts(data.products || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalProducts = products.length

  const activeProducts = products.filter(
    (product) => product.isActive === true
  ).length

  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  ).length

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) <= 0
  ).length

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  )

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5)

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: FiPackage,
      description: 'Products in store',
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: FiCheckCircle,
      description: 'Currently active',
    },
    {
      title: 'Featured Products',
      value: featuredProducts,
      icon: FiStar,
      description: 'Featured in store',
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: FiAlertCircle,
      description: 'Need restocking',
    },
  ]

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor your MobileSpot store.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link
            to="/admin/products/add"
            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            <FiPlus />
            Add Product
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-5">
          <p className="text-red-600 text-sm font-semibold">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-3 text-sm font-bold underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 bg-[#f5f3ef] rounded-xl flex items-center justify-center">
                  <Icon className="text-xl text-gray-800" />
                </div>

                <span className="text-xs text-gray-400 font-medium">
                  Store
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-5">
                {stat.title}
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? '...' : stat.value}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {stat.description}
              </p>
            </div>
          )
        })}

      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-[#171717] text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Total Available Stock
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {loading ? '...' : totalStock.toLocaleString('en-PK')}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Combined quantity of all products
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <FiPackage className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm text-gray-500">
            Quick Action
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-3">
            Add a New Mobile
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Add a new smartphone to your store inventory.
          </p>

          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 mt-5 bg-black text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            <FiPlus />
            Create Product
          </Link>
        </div>

      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Products
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Latest products added to your store
            </p>
          </div>

          <Link
            to="/admin/products"
            className="text-sm font-bold text-gray-700 hover:text-black"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Loading products...
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">

              <thead className="bg-[#faf9f6]">
                <tr className="text-xs text-gray-500">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Brand</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#f5f4f1] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <FiSmartphone className="text-xl text-gray-400" />
                          )}
                        </div>

                        <span className="text-sm font-semibold text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.brand}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.stock || 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          product.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiPackage className="text-4xl text-gray-300 mx-auto mb-3" />

            <p className="font-semibold text-gray-800">
              No products found
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Add your first product to get started.
            </p>
          </div>
        )}

      </div>

    </div>
  )
}

export default Dashboard
