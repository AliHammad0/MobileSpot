
import React, { useEffect, useMemo, useState } from 'react'
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

const API_URL = 'http://localhost:8080/api/v1/products'

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

  const openProduct = (productId) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

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

  // Get Available Brands
  const brands = useMemo(() => {
    return [...new Set(
      products.map((product) => product.brand).filter(Boolean)
    )].sort()
  }, [products])

  // Filter and Sort Products
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
    <section className="min-h-screen bg-[#f7f6f2] px-4 sm:px-6 lg:px-10 py-8 font-[Arial,sans-serif]">
      <div className="max-w-7xl mx-auto">

        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[3px] text-gray-500 font-semibold mb-2">
              Explore Collection
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Discover Mobiles<span className="text-gray-400">.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-2">
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
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone name or brand..."
            className="w-full bg-white border border-[#e9e7e1] rounded-2xl py-4 pl-14 pr-12 text-sm text-gray-800 outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition"
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
        <div className="bg-white border border-[#e9e7e1] rounded-2xl p-4 sm:p-5 mb-7 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#f4f3ef] flex items-center justify-center">
                <FiSliders size={17} />
              </div>

              <div>
                <h2 className="font-bold text-sm text-gray-900">
                  Refine Your Search
                </h2>
                <p className="text-[11px] text-gray-400">
                  Find exactly what you need
                </p>
              </div>

              {activeFilters > 0 && (
                <span className="ml-1 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {activeFilters} Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1.5 transition"
            >
              <FiRefreshCw size={13} />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                BRAND
              </label>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-[#e9e7e1] rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                <option value="">All Brands</option>

                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                PRICE RANGE
              </label>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-[#e9e7e1] rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black cursor-pointer"
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
              <label className="block text-xs font-bold text-gray-600 mb-2">
                SORT PRODUCTS
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-[#e9e7e1] rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                <option value="popularity">Most Popular</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                AVAILABILITY
              </label>

              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl border text-sm font-semibold transition ${
                  inStockOnly
                    ? 'bg-black border-black text-white'
                    : 'bg-[#f8f7f4] border-[#e9e7e1] text-gray-700 hover:border-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FiPackage size={16} />
                  In Stock Only
                </span>

                <span className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  inStockOnly
                    ? 'bg-white border-white text-black'
                    : 'border-gray-300'
                }`}>
                  {inStockOnly && <FiCheck size={13} />}
                </span>
              </button>
            </div>
          </div>

          {/* Express Delivery */}
          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setExpressOnly(!expressOnly)}
              className={`flex items-center gap-3 text-sm font-semibold transition ${
                expressOnly ? 'text-black' : 'text-gray-500'
              }`}
            >
              <span className={`w-10 h-6 rounded-full p-1 transition ${
                expressOnly ? 'bg-black' : 'bg-gray-200'
              }`}>
                <span className={`block w-4 h-4 rounded-full bg-white transition ${
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

          {/* Active Filter Tags */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {selectedBrand && (
                <button
                  type="button"
                  onClick={() => setSelectedBrand('')}
                  className="flex items-center gap-2 bg-[#f2f1ed] text-gray-700 rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  {selectedBrand}
                  <FiX />
                </button>
              )}

              {selectedPrice && (
                <button
                  type="button"
                  onClick={() => setSelectedPrice('')}
                  className="flex items-center gap-2 bg-[#f2f1ed] text-gray-700 rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  {selectedPrice}
                  <FiX />
                </button>
              )}

              {inStockOnly && (
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="flex items-center gap-2 bg-[#f2f1ed] text-gray-700 rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  In Stock
                  <FiX />
                </button>
              )}

              {expressOnly && (
                <button
                  type="button"
                  onClick={() => setExpressOnly(false)}
                  className="flex items-center gap-2 bg-[#f2f1ed] text-gray-700 rounded-full px-3 py-1.5 text-xs font-semibold"
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
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm font-semibold text-gray-600">
              Loading mobile phones...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-red-600 font-semibold mb-4">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="bg-black text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Products Heading */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[#171717]">
                  All Smartphones
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Explore our latest collection
                </p>
              </div>

              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
                {filteredProducts.length} Results
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">

                {filteredProducts.map((product) => (
                  <article
                    key={product._id}
                    className="bg-white rounded-2xl border border-[#ebe9e4] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Product Image */}
                    <button
                      type="button"
                      onClick={() => openProduct(product._id)}
                      aria-label={`View ${product.name}`}
                      className="relative bg-[#f5f4f0] h-44 sm:h-52 w-full flex items-center justify-center p-5 overflow-hidden shrink-0"
                    >
                      {product.discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}

                      {product.expressDelivery && (
                        <span className="absolute top-3 right-3 z-10 bg-white text-gray-800 text-[9px] font-bold px-2 py-1.5 rounded-full flex items-center gap-1">
                          <FiTruck size={11} />
                          EXPRESS
                        </span>
                      )}

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
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
                        <FiSmartphone className="text-5xl mb-2" />
                        <span className="text-xs">
                          Image unavailable
                        </span>
                      </div>
                    </button>

                    {/* Product Details */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                        {product.brand}
                      </p>

                      <button
                        type="button"
                        onClick={() => openProduct(product._id)}
                        className="text-left w-full font-bold text-sm sm:text-base text-gray-900 line-clamp-2 h-10 hover:text-gray-500 transition"
                      >
                        {product.name}
                      </button>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        <FiStar className="text-amber-500 fill-amber-500 text-xs" />

                        <span className="text-xs font-bold text-gray-800">
                          {product.rating || 0}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          ({product.reviews} Reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-3">
                        <p className="text-base sm:text-lg font-bold text-[#171717]">
                          {formatPrice(product.price)}
                        </p>

                        {product.oldPrice > 0 && (
                          <p className="text-xs text-gray-400 line-through mt-1">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
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
                        onClick={() => openProduct(product._id)}
                        className="w-full mt-auto pt-4 bg-[#171717] text-white py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#333] transition"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#f5f4f0] flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="text-2xl text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No Phones Found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  We couldn't find any phones matching your selection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
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
