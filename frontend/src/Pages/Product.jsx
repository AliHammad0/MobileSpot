
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiSearch,
  FiStar,
  FiSmartphone,
  FiCheck,
  FiTruck,
  FiPackage,
  FiSliders,
  FiX,
  FiRefreshCw
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'

const priceRanges = [
  { label: 'Below Rs 15,000', min: 0, max: 14999 },
  { label: 'Rs 15,000 - Rs 25,000', min: 15000, max: 25000 },
  { label: 'Rs 25,000 - Rs 40,000', min: 25001, max: 40000 },
  { label: 'Rs 40,000 - Rs 60,000', min: 40001, max: 60000 },
  { label: 'Rs 60,000 - Rs 80,000', min: 60001, max: 80000 },
  { label: 'Rs 80,000 - Rs 100,000', min: 80001, max: 100000 },
  { label: 'Rs 100,000 - Rs 150,000', min: 100001, max: 150000 },
  { label: 'Above Rs 150,000', min: 150001, max: Infinity }
]

const formatPrice = (price = 0) =>
  `Rs ${Number(price).toLocaleString('en-PK')}`

const Product = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [expressOnly, setExpressOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const [showFilters, setShowFilters] = useState(false)

  // Showroom Animation
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showShowroom, setShowShowroom] = useState(false)

  const navigationTimer = useRef(null)
  const navigationStarted = useRef(false)

  // Open Product Details
  const openProduct = (productId) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  // Boss Calls Salesman
  const handleViewDetails = (product) => {
    if (!product?._id || navigationStarted.current) return

    navigationStarted.current = true

    setSelectedProduct(product)
    setShowShowroom(true)

    // Open selected product after animation
    navigationTimer.current = setTimeout(() => {
      window.location.assign(`/product/${product._id}`)
    }, 9200)
  }

  // Cleanup Timer
  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current)
      }
    }
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }

      setProducts(
        (data.products || []).map((product) => ({
          ...product,
          image: product.images?.[0] || '',
          reviews: product.numReviews || 0,
          inStock: Number(product.stock) > 0,
          expressDelivery: product.expressDelivery === true
        }))
      )
    } catch (error) {
      setError(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Available Brands
  const brands = useMemo(() => {
    return [...new Set(
      products.map((product) => product.brand).filter(Boolean)
    )].sort()
  }, [products])

  // Filter And Sort
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const searchText = `${product.brand || ''} ${product.name || ''}`

      const matchesSearch = searchText
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesBrand =
        !selectedBrand || product.brand === selectedBrand

      const matchesExpress =
        !expressOnly || product.expressDelivery

      const matchesStock =
        !inStockOnly || product.inStock

      const selectedRange = priceRanges.find(
        (range) => range.label === selectedPrice
      )

      const matchesPrice =
        !selectedRange ||
        (
          Number(product.price) >= selectedRange.min &&
          Number(product.price) <= selectedRange.max
        )

      return (
        matchesSearch &&
        matchesBrand &&
        matchesExpress &&
        matchesStock &&
        matchesPrice
      )
    })

    if (sortBy === 'low-high') {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    } else {
      result.sort((a, b) => b.reviews - a.reviews)
    }

    return result
  }, [
    products,
    search,
    sortBy,
    selectedBrand,
    selectedPrice,
    expressOnly,
    inStockOnly
  ])

  // Active Filters
  const activeFilters =
    (selectedBrand ? 1 : 0) +
    (selectedPrice ? 1 : 0) +
    (expressOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  // Clear Filters
  const clearFilters = () => {
    setSearch('')
    setSortBy('popularity')
    setSelectedBrand('')
    setSelectedPrice('')
    setExpressOnly(false)
    setInStockOnly(false)
    setShowFilters(false)
  }

  return (
    <section className="min-h-screen bg-[#f7f6f2] px-4 py-8 font-[Arial,sans-serif] sm:px-6 lg:px-10">

      <style>{`

        /* SHOWROOM ANIMATION */

        @keyframes showroomFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bossEnter {
          0% {
            opacity: 0;
            transform: translateX(-150px);
          }
          25%, 100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes salesmanEnter {
          0%, 20% {
            opacity: 0;
            transform: translateX(150px);
          }
          45%, 100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bossPoint {
          0%, 40% {
            transform: rotate(-15deg);
          }
          55%, 100% {
            transform: rotate(-65deg);
          }
        }

        @keyframes salesmanGesture {
          0%, 55% {
            transform: rotate(0deg);
          }
          70%, 90% {
            transform: rotate(-45deg);
          }
          100% {
            transform: rotate(-20deg);
          }
        }

        @keyframes phoneReveal {
          0%, 35% {
            opacity: 0;
            transform: translateY(30px) scale(.65);
          }
          60%, 100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes speechBubble {
          0%, 20% {
            opacity: 0;
            transform: scale(.7) translateY(10px);
          }
          35%, 85% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes showroomText {
          0%, 55% {
            opacity: 0;
            transform: translateY(10px);
          }
          70%, 90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
          }
        }

        .showroom-screen {
          animation: showroomFade .35s ease forwards;
        }

        .showroom-boss {
          animation: bossEnter 1.5s ease-out forwards;
        }

        .showroom-salesman {
          animation: salesmanEnter 1.5s ease-out forwards;
        }

        .boss-arm {
          transform-origin: 8px 8px;
          animation: bossPoint 2s ease-in-out 1.1s forwards;
        }

        .salesman-arm {
          transform-origin: 8px 8px;
          animation: salesmanGesture 1.4s ease-in-out 2.2s forwards;
        }

        .showroom-phone {
          animation: phoneReveal 1.5s ease-out .8s both;
        }

        .boss-speech {
          animation: speechBubble 3.5s ease-in-out forwards;
        }

        .salesman-speech {
          animation: showroomText 3.5s ease-in-out forwards;
        }

        .showroom-person {
          position: relative;
          width: 115px;
          height: 215px;
        }

        .person-head {
          position: absolute;
          top: 12px;
          left: 37px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #c98c64;
          border: 2px solid #9f6747;
          z-index: 3;
        }

        .person-hair {
          position: absolute;
          top: 7px;
          left: 35px;
          width: 51px;
          height: 20px;
          border-radius: 25px 25px 5px 5px;
          background: #292929;
          z-index: 4;
        }

        .person-body {
          position: absolute;
          top: 60px;
          left: 23px;
          width: 76px;
          height: 85px;
          border-radius: 18px 18px 8px 8px;
          background: #222;
          z-index: 2;
        }

        .person-leg {
          position: absolute;
          top: 137px;
          width: 24px;
          height: 70px;
          border-radius: 10px;
          background: #292929;
        }

        .person-leg.left {
          left: 34px;
        }

        .person-leg.right {
          left: 65px;
        }

        .person-arm {
          position: absolute;
          top: 70px;
          left: 83px;
          width: 66px;
          height: 15px;
          border-radius: 20px;
          background: #c98c64;
          z-index: 5;
        }

        .boss-body {
          background: #252525;
        }

        .salesman-body {
          background: #647b70;
        }

        @media (max-width: 640px) {
          .showroom-person {
            transform: scale(.75);
            transform-origin: bottom center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showroom-screen,
          .showroom-boss,
          .showroom-salesman,
          .boss-arm,
          .salesman-arm,
          .showroom-phone,
          .boss-speech,
          .salesman-speech {
            animation-duration: .1s;
            animation-delay: 0s;
          }
        }

      `}</style>

      {/* ================================= */}
      {/* SHOWROOM ANIMATION */}
      {/* ================================= */}

      {showShowroom && selectedProduct && (
        <div className="showroom-screen fixed inset-0 z-[500] flex items-center justify-center overflow-hidden bg-[#f3f0e9] px-3">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#eeeae0] via-[#faf9f6] to-[#e6e1d6]" />

          {/* Showroom Content */}
          <div className="relative z-10 w-full max-w-5xl">

            {/* Header */}
            <div className="mb-5 text-center">

              <p className="text-[10px] font-bold tracking-[5px] text-gray-500">
                MOBILESPOT SHOWROOM
              </p>

              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome to Our Showroom
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Our team is preparing your selected smartphone.
              </p>

            </div>

            {/* Speech Bubble */}
            <div className="relative mx-auto mb-5 flex min-h-[65px] max-w-md items-center justify-center">

              <div className="boss-speech absolute rounded-2xl border border-gray-200 bg-white px-5 py-3 text-center shadow-lg">

                <p className="text-sm font-bold text-gray-900">
                  Salesman! Please show this phone to our customer.
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Boss is giving instructions.
                </p>

              </div>

              <div className="salesman-speech absolute rounded-2xl border border-gray-200 bg-white px-5 py-3 text-center shadow-lg">

                <p className="text-sm font-bold text-gray-900">
                  Certainly, Sir!
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Let me show the details.
                </p>

              </div>

            </div>

            {/* Main Showroom Scene */}
            <div className="relative mx-auto flex min-h-[310px] max-w-3xl items-end justify-center gap-2 overflow-hidden rounded-3xl border border-white bg-white/70 px-2 shadow-xl sm:gap-8 sm:px-8">

              {/* Boss */}
              <div className="showroom-boss relative z-20 flex flex-col items-center">

                <div className="showroom-person">

                  <div className="person-head" />
                  <div className="person-hair" />

                  {/* Eyes */}
                  <div className="absolute left-[47px] top-[32px] z-10 flex gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  </div>

                  {/* Body */}
                  <div className="person-body boss-body" />

                  {/* Tie */}
                  <div className="absolute left-[55px] top-[65px] z-10 h-[38px] w-[13px] bg-[#b18a55]" />

                  {/* Pointing Arm */}
                  <div className="boss-arm person-arm" />

                  {/* Legs */}
                  <div className="person-leg left" />
                  <div className="person-leg right" />

                </div>

                <p className="mt-[-3px] rounded-full bg-black px-4 py-1.5 text-[10px] font-bold text-white">
                  BOSS
                </p>

              </div>

              {/* Phone Shelf */}
              <div className="relative z-10 flex h-[270px] min-w-0 flex-1 flex-col items-center justify-center">

                <div className="showroom-phone relative flex h-[175px] w-full max-w-[190px] flex-col items-center justify-center rounded-t-2xl border-x-8 border-t-8 border-[#c4b69e] bg-[#e8e0d2] px-3 shadow-lg">

                  {/* Database Product Image */}
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-[125px] w-full object-contain"
                    />
                  ) : (
                    <FiSmartphone className="text-6xl text-gray-500" />
                  )}

                  <p className="mt-1 line-clamp-1 text-center text-[10px] font-bold text-gray-800">
                    {selectedProduct.name}
                  </p>

                </div>

                {/* Shelf */}
                <div className="h-4 w-full max-w-[225px] rounded-sm bg-[#ad9576] shadow-md" />

                {/* Shelf Stand */}
                <div className="h-9 w-[80%] max-w-[190px] bg-[#d6c7ae]" />

                <div className="mt-2 text-center">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500">
                    SELECTED SMARTPHONE
                  </p>
                </div>

              </div>

              {/* Salesman */}
              <div className="showroom-salesman relative z-20 flex flex-col items-center">

                <div className="showroom-person">

                  <div className="person-head" />
                  <div className="person-hair" />

                  {/* Eyes */}
                  <div className="absolute left-[47px] top-[32px] z-10 flex gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  </div>

                  {/* Body */}
                  <div className="person-body salesman-body" />

                  {/* Shirt Collar */}
                  <div className="absolute left-[51px] top-[60px] z-10 h-5 w-5 rotate-45 border-b-2 border-white" />

                  {/* Gesture Arm */}
                  <div className="salesman-arm person-arm" />

                  {/* Legs */}
                  <div className="person-leg left" />
                  <div className="person-leg right" />

                </div>

                <p className="mt-[-3px] rounded-full bg-[#647b70] px-4 py-1.5 text-[10px] font-bold text-white">
                  SALESMAN
                </p>

              </div>

            </div>

            {/* Selected Product Information */}
            <div className="salesman-speech mx-auto mt-5 max-w-md rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">

              <p className="text-xs font-semibold text-gray-400">
                SALESMAN IS SHOWING
              </p>

              <h3 className="mt-1 text-base font-bold text-gray-900">
                {selectedProduct.name}
              </h3>

              <p className="mt-1 text-sm font-bold text-gray-700">
                {formatPrice(selectedProduct.price)}
              </p>

            </div>

            {/* Footer */}
            <p className="mt-5 text-center text-[10px] font-bold tracking-[4px] text-gray-500">
              MOBILESPOT
            </p>

          </div>

        </div>
      )}

      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gray-500">
              Explore Collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
              Discover Mobiles<span className="text-gray-400">.</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Find the perfect smartphone for your needs.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <span className="font-bold text-black">
              {filteredProducts.length}
            </span>{' '}
            Products Available
          </div>

        </div>

        {/* Search Bar */}
        <div className="relative mb-5">

          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone name or brand..."
            className="w-full rounded-2xl border border-[#e9e7e1] bg-white py-4 pl-14 pr-12 text-sm text-gray-800 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <FiX size={19} />
            </button>
          )}

        </div>

        {/* Filter Panel */}
        <div className="mb-7 rounded-2xl border border-[#e9e7e1] bg-white p-4 shadow-sm sm:p-5">

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f3ef]">
                <FiSliders size={17} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Refine Your Search
                </h2>

                <p className="text-[11px] text-gray-400">
                  Find exactly what you need
                </p>
              </div>

              {activeFilters > 0 && (
                <span className="ml-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                  {activeFilters} Active
                </span>
              )}

            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-black"
            >
              <FiRefreshCw size={13} />
              Reset All
            </button>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-600">
                BRAND
              </label>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-[#e9e7e1] bg-[#f8f7f4] px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black"
              >
                <option value="">All Brands</option>

                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}

              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-600">
                PRICE RANGE
              </label>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-[#e9e7e1] bg-[#f8f7f4] px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black"
              >
                <option value="">All Prices</option>

                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}

              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-600">
                SORT PRODUCTS
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-[#e9e7e1] bg-[#f8f7f4] px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black"
              >
                <option value="popularity">Most Popular</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-600">
                AVAILABILITY
              </label>

              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  inStockOnly
                    ? 'border-black bg-black text-white'
                    : 'border-[#e9e7e1] bg-[#f8f7f4] text-gray-700 hover:border-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FiPackage size={16} />
                  In Stock Only
                </span>

                <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                  inStockOnly
                    ? 'border-white bg-white text-black'
                    : 'border-gray-300'
                }`}>
                  {inStockOnly && <FiCheck size={13} />}
                </span>

              </button>
            </div>

          </div>

          {/* Express Delivery */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

            <button
              type="button"
              onClick={() => setExpressOnly(!expressOnly)}
              className={`flex items-center gap-3 text-sm font-semibold transition ${
                expressOnly ? 'text-black' : 'text-gray-500'
              }`}
            >
              <span className={`h-6 w-10 rounded-full p-1 transition ${
                expressOnly ? 'bg-black' : 'bg-gray-200'
              }`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition ${
                  expressOnly ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </span>

              <FiTruck size={17} />
              Express Delivery Available
            </button>

            <span className="text-[11px] text-gray-400">
              Showing {filteredProducts.length} matching products
            </span>

          </div>

          {/* Active Tags */}
          {activeFilters > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">

              {selectedBrand && (
                <button
                  type="button"
                  onClick={() => setSelectedBrand('')}
                  className="flex items-center gap-2 rounded-full bg-[#f2f1ed] px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  {selectedBrand}
                  <FiX />
                </button>
              )}

              {selectedPrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPrice('')}
                  className="flex items-center gap-2 rounded-full bg-[#f2f1ed] px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  {selectedPrice}
                  <FiX />
                </button>
              )}

              {inStockOnly && (
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="flex items-center gap-2 rounded-full bg-[#f2f1ed] px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  In Stock
                  <FiX />
                </button>
              )}

              {expressOnly && (
                <button
                  type="button"
                  onClick={() => setExpressOnly(false)}
                  className="flex items-center gap-2 rounded-full bg-[#f2f1ed] px-3 py-1.5 text-xs font-semibold text-gray-700"
                >
                  Express Delivery
                  <FiX />
                </button>
              )}

            </div>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-black" />

            <p className="text-sm font-semibold text-gray-600">
              Loading mobile phones...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">

            <p className="mb-4 font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

          </div>
        )}

        {!loading && !error && (
          <>

            {/* Products Heading */}
            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-[#171717]">
                  All Smartphones
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Explore our latest collection
                </p>
              </div>

              <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500">
                {filteredProducts.length} Results
              </span>

            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">

                {filteredProducts.map((product) => (

                  <article
                    key={product._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#ebe9e4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* Product Image */}
                    <button
                      type="button"
                      onClick={() => openProduct(product._id)}
                      aria-label={`View ${product.name}`}
                      className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden bg-[#f5f4f0] p-5 sm:h-52"
                    >

                      {product.discount > 0 && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-black px-2.5 py-1.5 text-[10px] font-bold text-white">
                          {product.discount}% OFF
                        </span>
                      )}

                      {product.expressDelivery && (
                        <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-1.5 text-[9px] font-bold text-gray-800">
                          <FiTruck size={11} />
                          EXPRESS
                        </span>
                      )}

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'

                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`flex-col items-center text-gray-400 ${
                          product.image ? 'hidden' : 'flex'
                        }`}
                      >
                        <FiSmartphone className="mb-2 text-5xl" />

                        <span className="text-xs">
                          Image unavailable
                        </span>
                      </div>

                    </button>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col p-3 sm:p-4">

                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {product.brand}
                      </p>

                      <button
                        type="button"
                        onClick={() => openProduct(product._id)}
                        className="line-clamp-2 h-10 w-full text-left text-sm font-bold text-gray-900 transition hover:text-gray-500 sm:text-base"
                      >
                        {product.name}
                      </button>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-1">

                        <FiStar className="fill-amber-500 text-xs text-amber-500" />

                        <span className="text-xs font-bold text-gray-800">
                          {product.rating || 0}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          ({product.reviews} Reviews)
                        </span>

                      </div>

                      {/* Price */}
                      <div className="mt-3">

                        <p className="text-base font-bold text-[#171717] sm:text-lg">
                          {formatPrice(product.price)}
                        </p>

                        {product.oldPrice > 0 && (
                          <p className="mt-1 text-xs text-gray-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}

                      </div>

                      {/* Stock */}
                      <div className="mt-3 flex items-center gap-1.5">

                        <span className={`h-1.5 w-1.5 rounded-full ${
                          product.inStock ? 'bg-green-500' : 'bg-red-500'
                        }`} />

                        <span className={`text-[10px] font-semibold ${
                          product.inStock ? 'text-green-700' : 'text-red-600'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>

                      </div>

                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => handleViewDetails(product)}
                        disabled={!product.inStock || showShowroom}
                        className="mt-auto w-full rounded-xl bg-[#171717] py-3 pt-3 text-xs font-bold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                      >
                        View Details
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              /* Empty State */
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f4f0]">
                  <FiSearch className="text-2xl text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No Phones Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  We couldn't find any phones matching your selection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear All Filters
                </button>

              </div>

            )}

          </>
        )}

      </div>
    </section>
  )
}

export default Product
