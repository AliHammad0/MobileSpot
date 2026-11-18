
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPackage,
  FiCheckCircle,
  FiStar,
  FiAlertCircle,
  FiPlus,
  FiRefreshCw,
  FiSmartphone,
  FiEdit3,
  FiSave,
  FiMonitor,
  FiTruck,
  FiX
} from 'react-icons/fi'

import {
  getProducts,
  updateProduct
} from '../services/productApi'

const formatPrice = (price = 0) =>
  `Rs ${Number(price || 0).toLocaleString('en-PK')}`

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProducts()
      const fetchedProducts = data.products || []

      setProducts(fetchedProducts)

      setEditingProduct((current) => {
        if (current) {
          const updated = fetchedProducts.find(
            (product) => product._id === current._id
          )

          return updated || fetchedProducts[0] || null
        }

        return fetchedProducts[0] || null
      })
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
      description: 'Products in store'
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: FiCheckCircle,
      description: 'Currently active'
    },
    {
      title: 'Featured Products',
      value: featuredProducts,
      icon: FiStar,
      description: 'Featured in store'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: FiAlertCircle,
      description: 'Need restocking'
    }
  ]

  const handleProductSelect = (productId) => {
    const product = products.find(
      (item) => item._id === productId
    )

    if (!product) return

    setEditingProduct({
      ...product,
      images: [...(product.images || [])]
    })

    setSaveMessage('')
    setSaveError('')
  }

  const handleFieldChange = (field, value) => {
    setEditingProduct((current) => {
      if (!current) return current

      return {
        ...current,
        [field]: value
      }
    })

    setSaveMessage('')
    setSaveError('')
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()

    if (!editingProduct?._id) return

    if (!editingProduct.name?.trim()) {
      setSaveError('Product name is required.')
      return
    }

    if (!editingProduct.brand?.trim()) {
      setSaveError('Brand is required.')
      return
    }

    try {
      setSaving(true)
      setSaveMessage('')
      setSaveError('')

      const payload = {
        name: editingProduct.name.trim(),
        brand: editingProduct.brand.trim(),
        model: editingProduct.model || '',
        category: editingProduct.category || '',
        description: editingProduct.description || '',
        price: Number(editingProduct.price || 0),
        oldPrice: Number(editingProduct.oldPrice || 0),
        discount: Number(editingProduct.discount || 0),
        stock: Number(editingProduct.stock || 0),
        images: editingProduct.images || [],
        isActive: Boolean(editingProduct.isActive),
        isFeatured: Boolean(editingProduct.isFeatured),
        expressDelivery: Boolean(editingProduct.expressDelivery)
      }

      await updateProduct(editingProduct._id, payload)

      const updatedProduct = {
        ...editingProduct,
        ...payload
      }

      setProducts((current) =>
        current.map((product) =>
          product._id === editingProduct._id
            ? updatedProduct
            : product
        )
      )

      setEditingProduct(updatedProduct)
      setSaveMessage('Product updated successfully.')
    } catch (err) {
      setSaveError(err.message || 'Failed to update product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-7 font-[Arial,sans-serif]">

      <style>{`
        @keyframes sellerEnter {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes laptopOpen {
          0% {
            opacity: 0;
            transform: perspective(700px) rotateX(35deg) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: perspective(700px) rotateX(0deg) translateY(0);
          }
        }

        @keyframes screenGlow {
          0%, 100% {
            box-shadow: 0 0 12px rgba(202, 170, 113, .12);
          }
          50% {
            box-shadow: 0 0 24px rgba(202, 170, 113, .35);
          }
        }

        @keyframes typingCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .seller-animation {
          animation: sellerEnter .8s ease both;
        }

        .laptop-animation {
          animation: laptopOpen .9s ease .2s both;
        }

        .laptop-screen {
          animation: screenGlow 3s ease-in-out infinite;
        }

        .typing-cursor {
          animation: typingCursor 1s steps(2) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .seller-animation,
          .laptop-animation,
          .laptop-screen {
            animation: none !important;
          }
        }
      `}</style>

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your MobileSpot store.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link
            to="/admin/products/add"
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <FiPlus />
            Add Product
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-white p-5">
          <p className="text-sm font-semibold text-red-600">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f3ef]">
                  <Icon className="text-xl text-gray-800" />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Store
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="rounded-2xl bg-[#171717] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Total Available Stock
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {loading ? '...' : totalStock.toLocaleString('en-PK')}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Combined quantity of all products
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <FiPackage className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <p className="text-sm text-gray-500">
            Quick Action
          </p>

          <h2 className="mt-3 text-xl font-bold text-gray-900">
            Add a New Mobile
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add a new smartphone to your store inventory.
          </p>

          <Link
            to="/admin/products/add"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <FiPlus />
            Create Product
          </Link>
        </div>
      </div>

      {/* Edit Product Studio */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2eee6]">
              <FiEdit3 className="text-xl text-[#80633e]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Edit Product Studio
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Edit your product and watch the live laptop preview.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading products for editing...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <FiPackage className="mx-auto mb-3 text-4xl text-gray-300" />

            <p className="font-semibold text-gray-800">
              No products available
            </p>

            <Link
              to="/admin/products/add"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              <FiPlus />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr]">

            {/* Salesman and Laptop */}
            <div className="relative flex min-h-[350px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#292a28] via-[#34342f] to-[#171817] p-5 text-white sm:p-7">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#b99b6c]/10 blur-3xl" />

              <div className="relative z-10">
                <p className="text-[10px] font-bold tracking-[4px] text-[#c5aa7e]">
                  MOBILESPOT WORKSTATION
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Product Editing Desk
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Your changes appear live on the laptop screen.
                </p>
              </div>

              <div className="seller-animation relative z-10 mt-7 flex items-end justify-center gap-3 sm:gap-6">

                {/* Salesman */}
                <div className="flex shrink-0 flex-col items-center">
                  <div className="relative h-[150px] w-[94px]">

                    {/* Hair */}
                    <div className="absolute left-[27px] top-0 z-20 h-5 w-10 rounded-t-full bg-[#211d1a]" />

                    {/* Head */}
                    <div className="absolute left-[29px] top-2 z-10 h-12 w-9 rounded-[45%] border border-[#a66d4c] bg-[#c98b65]" />

                    {/* Face details */}
                    <div className="absolute left-[37px] top-[23px] z-20 flex gap-3">
                      <span className="h-1 w-1 rounded-full bg-[#27211d]" />
                      <span className="h-1 w-1 rounded-full bg-[#27211d]" />
                    </div>

                    {/* Shirt */}
                    <div className="absolute left-[13px] top-[53px] z-10 h-[68px] w-[70px] rounded-t-[18px] border border-[#52675b] bg-gradient-to-br from-[#3e6655] to-[#203c30]" />

                    {/* Shirt collar */}
                    <div className="absolute left-[39px] top-[54px] z-20 h-5 w-5 rotate-45 border-b-2 border-white/80" />

                    {/* Arms */}
                    <div className="absolute left-[5px] top-[70px] z-20 h-3 w-12 rotate-[25deg] rounded-full bg-[#c98b65]" />
                    <div className="absolute right-[-1px] top-[73px] z-20 h-3 w-12 -rotate-[18deg] rounded-full bg-[#c98b65]" />

                    {/* Laptop resting in front */}
                    <div className="absolute bottom-0 left-[9px] z-30 h-8 w-[76px] rounded-t-md border border-gray-500 bg-gradient-to-b from-gray-300 to-gray-500">
                      <div className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-gray-700" />
                    </div>
                  </div>

                  <span className="mt-1 rounded-full bg-[#3e6655] px-3 py-1 text-[9px] font-bold tracking-widest">
                    SALESMAN
                  </span>
                </div>

                {/* Laptop */}
                <div className="laptop-animation min-w-0 flex-1 pb-2">

                  <div className="laptop-screen relative overflow-hidden rounded-t-xl border-[5px] border-[#777a78] bg-[#111714] p-2 shadow-2xl sm:p-3">

                    <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      </div>

                      <span className="text-[7px] font-bold tracking-widest text-gray-400 sm:text-[9px]">
                        MOBILESPOT ADMIN
                      </span>

                      <FiMonitor className="text-xs text-gray-400" />
                    </div>

                    <div className="grid grid-cols-[1fr_55px] gap-2 sm:grid-cols-[1fr_75px]">

                      <div className="min-w-0 space-y-2">
                        <p className="text-[8px] font-bold text-[#d9bc8d] sm:text-[10px]">
                          LIVE PRODUCT EDITOR
                        </p>

                        <div className="rounded bg-white/10 p-2">
                          <p className="text-[7px] text-gray-400 sm:text-[8px]">
                            PRODUCT NAME
                          </p>

                          <p className="mt-1 truncate text-[9px] font-semibold text-white sm:text-xs">
                            {editingProduct?.name || 'Product name'}
                            <span className="typing-cursor ml-0.5 text-[#d9bc8d]">|</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded bg-white/10 p-2">
                            <p className="text-[7px] text-gray-400 sm:text-[8px]">
                              BRAND
                            </p>
                            <p className="mt-1 truncate text-[9px] font-semibold sm:text-[10px]">
                              {editingProduct?.brand || 'Brand'}
                            </p>
                          </div>

                          <div className="rounded bg-white/10 p-2">
                            <p className="text-[7px] text-gray-400 sm:text-[8px]">
                              PRICE
                            </p>
                            <p className="mt-1 truncate text-[9px] font-semibold text-[#d9bc8d] sm:text-[10px]">
                              {formatPrice(editingProduct?.price)}
                            </p>
                          </div>
                        </div>

                        <div className="rounded bg-white/10 p-2">
                          <p className="text-[7px] text-gray-400 sm:text-[8px]">
                            DESCRIPTION
                          </p>
                          <p className="mt-1 line-clamp-2 text-[8px] text-gray-200 sm:text-[9px]">
                            {editingProduct?.description || 'Product description will appear here.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center rounded bg-white/10 p-1.5">
                        <div className="flex h-[65px] w-full items-center justify-center rounded bg-[#f1eee7] p-1 sm:h-[82px]">
                          {editingProduct?.images?.[0] ? (
                            <img
                              src={editingProduct.images[0]}
                              alt={editingProduct.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <FiSmartphone className="text-2xl text-gray-400" />
                          )}
                        </div>

                        <span className="mt-2 text-[7px] font-bold text-gray-300">
                          PRODUCT IMAGE
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                      <span className="text-[7px] text-gray-400 sm:text-[8px]">
                        {editingProduct?.isActive ? 'ACTIVE PRODUCT' : 'INACTIVE PRODUCT'}
                      </span>

                      <span className="rounded bg-[#365b46] px-2 py-1 text-[7px] font-bold text-white">
                        LIVE PREVIEW
                      </span>
                    </div>
                  </div>

                  {/* Laptop Base */}
                  <div className="relative mx-auto h-3 w-[112%] -translate-x-[5%] rounded-b-lg border-t border-gray-400 bg-gradient-to-b from-[#d4d5d2] to-[#737773] shadow-xl">
                    <div className="mx-auto h-1 w-12 rounded-b-md bg-gray-500" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs font-semibold text-white">
                    {editingProduct?.name || 'Select a product'}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Changes update on the laptop instantly.
                  </p>
                </div>

                <span className="rounded-full border border-[#c5aa7e]/30 bg-[#c5aa7e]/10 px-3 py-1.5 text-[9px] font-bold text-[#d9bc8d]">
                  LIVE SYNC
                </span>
              </div>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={handleSaveProduct}
              className="min-w-0 p-5 sm:p-7"
            >

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Product Information
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Select and update your product details.
                  </p>
                </div>

                <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#f4f1e9] px-3 py-1.5 text-[10px] font-bold text-[#80633e]">
                  <FiEdit3 />
                  EDIT MODE
                </span>
              </div>

              <label className="mb-2 block text-xs font-bold text-gray-600">
                SELECT PRODUCT
              </label>

              <select
                value={editingProduct?._id || ''}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="mb-5 w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-black"
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} — {product.brand}
                  </option>
                ))}
              </select>

              {editingProduct && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        PRODUCT NAME
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        BRAND
                      </label>
                      <input
                        type="text"
                        value={editingProduct.brand || ''}
                        onChange={(e) => handleFieldChange('brand', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        MODEL
                      </label>
                      <input
                        type="text"
                        value={editingProduct.model || ''}
                        onChange={(e) => handleFieldChange('model', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        CATEGORY
                      </label>
                      <input
                        type="text"
                        value={editingProduct.category || ''}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        PRICE (RS)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.price ?? ''}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        OLD PRICE (RS)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.oldPrice ?? ''}
                        onChange={(e) => handleFieldChange('oldPrice', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        DISCOUNT (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.discount ?? ''}
                        onChange={(e) => handleFieldChange('discount', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-600">
                        STOCK QUANTITY
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.stock ?? ''}
                        onChange={(e) => handleFieldChange('stock', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-bold text-gray-600">
                      PRODUCT IMAGE URL
                    </label>
                    <input
                      type="text"
                      value={editingProduct.images?.[0] || ''}
                      onChange={(e) =>
                        handleFieldChange('images', [
                          e.target.value,
                          ...(editingProduct.images || []).slice(1)
                        ])
                      }
                      placeholder="Paste product image URL"
                      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-bold text-gray-600">
                      DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className="w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
                      placeholder="Write product description..."
                    />
                  </div>

                  {/* Product Settings */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {[
                      { key: 'isActive', label: 'Active Product' },
                      { key: 'isFeatured', label: 'Featured Product' },
                      { key: 'expressDelivery', label: 'Express Delivery' }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-gray-200 bg-[#faf9f6] px-3 py-3"
                      >
                        <span className="text-xs font-semibold text-gray-700">
                          {item.label}
                        </span>

                        <input
                          type="checkbox"
                          checked={Boolean(editingProduct[item.key])}
                          onChange={(e) =>
                            handleFieldChange(item.key, e.target.checked)
                          }
                          className="h-4 w-4 accent-black"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Save Status */}
                  {saveMessage && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
                      <FiCheckCircle />
                      {saveMessage}
                    </div>
                  )}

                  {saveError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                      <FiAlertCircle />
                      {saveError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <FiRefreshCw className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProductSelect(editingProduct._id)}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiX />
                      Discard
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </section>

      {/* Recent Products */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Products
            </h2>

            <p className="mt-1 text-xs text-gray-500">
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
          <div className="p-10 text-center text-sm text-gray-500">
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
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5f4f1]">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-contain"
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
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
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
            <FiPackage className="mx-auto mb-3 text-4xl text-gray-300" />

            <p className="font-semibold text-gray-800">
              No products found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first product to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
