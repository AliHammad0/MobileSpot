
import React, { useEffect, useState } from 'react'
import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import {
  FiSearch,
  FiStar,
  FiSmartphone,
  FiTruck,
  FiX,
  FiRefreshCw
} from 'react-icons/fi'

import { searchProducts } from '../services/productApi'

const formatPrice = (price = 0) =>
  `Rs ${Number(price).toLocaleString('en-PK')}`

const Search = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const queryFromUrl = searchParams.get('q') || ''

  const [search, setSearch] = useState(queryFromUrl)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  // URL aur input ko sync rakho
  useEffect(() => {
    setSearch(queryFromUrl)
  }, [queryFromUrl])

  // Backend search with debounce
  useEffect(() => {
    const query = search.trim()

    if (!query) {
      setProducts([])
      setError('')
      setLoading(false)
      setSearched(false)

      if (queryFromUrl) {
        setSearchParams({}, { replace: true })
      }

      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        setSearched(true)

        setSearchParams(
          { q: query },
          { replace: true }
        )

        const response = await searchProducts(query)

        setProducts(
          (response.products || []).map((product) => ({
            ...product,
            image: product.images?.[0] || '',
            reviews: product.numReviews || 0,
            inStock: Number(product.stock) > 0,
            expressDelivery: product.expressDelivery === true
          }))
        )
      } catch (err) {
        setProducts([])
        setError(err.message || 'Unable to search products.')
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [search, queryFromUrl, setSearchParams])

  const handleSearchChange = (value) => {
    setSearch(value)
  }

  const clearSearch = () => {
    setSearch('')
    setProducts([])
    setError('')
    setSearched(false)
    setSearchParams({}, { replace: true })
  }

  const openProduct = (productId) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  const retrySearch = async () => {
    const query = search.trim()

    if (!query) return

    try {
      setLoading(true)
      setError('')

      const response = await searchProducts(query)

      setProducts(
        (response.products || []).map((product) => ({
          ...product,
          image: product.images?.[0] || '',
          reviews: product.numReviews || 0,
          inStock: Number(product.stock) > 0,
          expressDelivery: product.expressDelivery === true
        }))
      )

      setSearched(true)
    } catch (err) {
      setError(err.message || 'Unable to search products.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#f7f6f2] px-4 py-8 font-[Arial,sans-serif] sm:px-6 lg:px-10">

      <style>{`
        @keyframes searchPageEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes searchCardEnter {
          from {
            opacity: 0;
            transform: translateY(24px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes searchLoader {
          to {
            transform: rotate(360deg);
          }
        }

        .search-page-enter {
          animation: searchPageEnter .55s ease both;
        }

        .search-product-card {
          opacity: 0;
          animation: searchCardEnter .55s ease forwards;
        }

        .search-loading-spinner {
          animation: searchLoader .8s linear infinite;
        }

        .search-product-card:hover .search-product-image {
          transform: scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .search-page-enter,
          .search-product-card,
          .search-loading-spinner {
            animation: none !important;
            opacity: 1 !important;
          }

          .search-product-image {
            transition: none !important;
          }
        }
      `}</style>

      <div className="search-page-enter mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gray-500">
            MobileSpot Collection
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
            Search Smartphones<span className="text-gray-400">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Find your favourite smartphone by name, brand, model or category.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mb-7">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search Samsung, iPhone, Vivo, Oppo..."
            className="h-14 w-full rounded-2xl border border-[#e9e7e1] bg-white pl-14 pr-14 text-sm text-gray-800 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Search Information */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#171717]">
              {search.trim() ? 'Search Results' : 'Find Your Smartphone'}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {loading
                ? 'Searching our collection...'
                : searched
                  ? `${products.length} matching products found`
                  : 'Enter a phone name or brand to get started'}
            </p>
          </div>

          {products.length > 0 && !loading && (
            <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500">
              {products.length} Results
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
            <div className="search-loading-spinner mx-auto mb-4 h-10 w-10 rounded-full border-[3px] border-gray-200 border-t-black" />

            <p className="text-sm font-semibold text-gray-600">
              Finding your smartphones...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait a moment.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <FiRefreshCw className="text-2xl text-red-500" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Search Failed
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={retrySearch}
              className="mt-5 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Search */}
        {!loading && !error && !search.trim() && (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f5f4f0]">
              <FiSearch className="text-3xl text-gray-400" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              What Are You Looking For?
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Search for your favourite mobile phone. You can search using a phone name, brand, model or category.
            </p>
          </div>
        )}

        {/* Product Results */}
        {!loading && !error && searched && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">

                {products.map((product, index) => (
                  <article
                    key={product._id}
                    style={{
                      animationDelay: `${Math.min(index * 75, 600)}ms`
                    }}
                    className="search-product-card group flex flex-col overflow-hidden rounded-2xl border border-[#ebe9e4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                          className="search-product-image h-full w-full object-contain transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'

                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}

                      <div className={`flex-col items-center text-gray-400 ${
                        product.image ? 'hidden' : 'flex'
                      }`}>
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
                        onClick={() => openProduct(product._id)}
                        className="mt-auto w-full rounded-xl bg-[#171717] py-3 text-xs font-bold text-white transition hover:bg-[#333] sm:text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f4f0]">
                  <FiSearch className="text-2xl text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No Phones Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  No smartphones matched "{search}".
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-5 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  )
}

export default Search
