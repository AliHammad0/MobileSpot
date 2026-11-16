
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch,
  FiSmartphone,
  FiArrowUpRight,
  FiRefreshCw,
  FiSliders,
  FiX,
} from 'react-icons/fi'

const API_URL = 'http://localhost:8080/api/v1'

// Product Card Animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

// Brand Announcer Character
const BrandAnnouncer = ({ brand }) => {
  const [showAnnouncer, setShowAnnouncer] = useState(true)

  useEffect(() => {
    setShowAnnouncer(true)

    const timer = setTimeout(() => {
      setShowAnnouncer(false)
    }, 6500)

    return () => clearTimeout(timer)
  }, [brand])

  const brandName = decodeURIComponent(brand || 'Mobile').replace(
    /[-_]/g,
    ' '
  )

  const formattedBrand = brandName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <AnimatePresence mode="wait">
      {showAnnouncer && (
        <motion.section
          key={brand}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{
            opacity: 0,
            height: 0,
            transition: { duration: 0.65 },
          }}
          className="mb-10 overflow-hidden"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#e9e4db] bg-gradient-to-r from-[#f0ede6] via-white to-[#f4f0e9] px-5 py-7 sm:px-10 sm:py-9">

            {/* Background Decoration */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.2, 0.12],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#b99b72] blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">

              {/* Salesman Character */}
              <motion.div
                initial={{ x: -180, opacity: 0, rotate: -8 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 65,
                  damping: 13,
                  duration: 1,
                }}
                className="relative shrink-0"
              >
                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 1.15,
                    duration: 0.45,
                    type: 'spring',
                  }}
                  className="absolute -right-24 -top-3 z-20 w-36 rounded-xl border border-gray-100 bg-white px-3 py-2 text-center shadow-lg sm:-right-28 sm:w-44"
                >
                  <p className="text-[10px] font-bold leading-relaxed text-gray-800 sm:text-xs">
                    Hey! Welcome to
                    <span className="block capitalize text-[#9b7c54]">
                      {formattedBrand} Collection!
                    </span>
                  </p>

                  <span className="absolute -bottom-1 left-5 h-3 w-3 rotate-45 border-b border-r border-gray-100 bg-white" />
                </motion.div>

                {/* Character Body */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative h-40 w-32 sm:h-48 sm:w-40"
                >
                  <svg
                    viewBox="0 0 160 190"
                    className="h-full w-full overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Legs */}
                    <path
                      d="M58 139 L54 174 L43 179 L75 179 L81 143"
                      fill="#252525"
                    />
                    <path
                      d="M91 141 L98 174 L90 180 L123 180 L116 139"
                      fill="#252525"
                    />

                    {/* Shoes */}
                    <path
                      d="M43 174 Q30 177 29 185 L76 185 Q78 178 66 174 Z"
                      fill="#171717"
                    />
                    <path
                      d="M90 175 Q85 181 89 185 L130 185 Q129 177 113 174 Z"
                      fill="#171717"
                    />

                    {/* Body / Shirt */}
                    <path
                      d="M55 74 Q80 63 105 76 L121 143 Q82 157 43 143 Z"
                      fill="#9b7c54"
                    />

                    {/* Shirt Details */}
                    <path
                      d="M76 75 L82 103 L91 75"
                      fill="none"
                      stroke="#e8d5b8"
                      strokeWidth="3"
                    />

                    {/* Neck */}
                    <rect
                      x="70"
                      y="58"
                      width="22"
                      height="24"
                      rx="8"
                      fill="#d99e77"
                    />

                    {/* Head */}
                    <ellipse
                      cx="81"
                      cy="43"
                      rx="30"
                      ry="34"
                      fill="#e8b28e"
                    />

                    {/* Hair */}
                    <path
                      d="M51 42 Q46 9 78 8 Q113 4 113 39 L105 28 Q85 17 65 29 L56 48 Z"
                      fill="#24201e"
                    />

                    {/* Eyes */}
                    <ellipse cx="70" cy="44" rx="2.5" ry="3.5" fill="#29201b" />
                    <ellipse cx="92" cy="44" rx="2.5" ry="3.5" fill="#29201b" />

                    {/* Smile */}
                    <path
                      d="M72 57 Q81 66 91 56"
                      fill="none"
                      stroke="#854b3b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Left Arm */}
                    <path
                      d="M52 82 Q33 91 30 112 L42 118 L62 97"
                      fill="#9b7c54"
                      stroke="#9b7c54"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />

                    {/* Right Arm Holding Banner */}
                    <path
                      d="M104 85 Q121 85 126 65 L139 58"
                      fill="none"
                      stroke="#9b7c54"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />

                    {/* Hand */}
                    <circle cx="140" cy="57" r="7" fill="#e8b28e" />

                    {/* Collar */}
                    <path
                      d="M69 74 L81 87 L94 74"
                      fill="none"
                      stroke="#f6e8d5"
                      strokeWidth="4"
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Brand Banner */}
              <div className="relative w-full max-w-lg flex-1">

                {/* Banner Pole */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                  className="absolute -left-1 top-0 hidden h-full w-1.5 origin-top rounded-full bg-[#8b704d] sm:block"
                />

                {/* Banner */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                    x: -35,
                  }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.85,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: 'left center' }}
                  className="relative overflow-hidden rounded-2xl border border-[#e8dfd1] bg-white px-5 py-5 text-center shadow-xl sm:px-8 sm:py-7"
                >
                  {/* Banner Shine */}
                  <motion.div
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{
                      duration: 2.5,
                      delay: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                    className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#b99b72]/15 to-transparent"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="relative text-[10px] font-bold uppercase tracking-[0.35em] text-[#9b7c54] sm:text-xs"
                  >
                    Now Introducing
                  </motion.p>

                  <motion.h2
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1.5,
                      type: 'spring',
                      stiffness: 110,
                    }}
                    className="relative mt-2 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-5xl"
                  >
                    {formattedBrand}
                  </motion.h2>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                    className="mx-auto mt-3 h-1 rounded-full bg-[#b99b72]"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 }}
                    className="relative mt-3 text-xs text-gray-500 sm:text-sm"
                  >
                    Discover the latest smartphones
                  </motion.p>
                </motion.div>

                {/* Bottom Caption */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-xs"
                >
                  Your favourite brand, all in one place
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

const BrandProducts = () => {
  const { brand } = useParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/products?brand=${encodeURIComponent(brand)}`,
          { signal: controller.signal }
        )

        const data = await response.json()

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Products load nahi ho sake'
          )
        }

        const allProducts = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data?.products)
              ? data.data.products
              : Array.isArray(data.data)
                ? data.data
                : []

        const filteredProducts = allProducts.filter(
          (product) =>
            product.brand?.trim().toLowerCase() ===
            decodeURIComponent(brand).trim().toLowerCase()
        )

        setProducts(filteredProducts)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    if (brand) {
      fetchProducts()
    }

    return () => controller.abort()
  }, [brand])

  // Search and Sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    )

    if (sort === 'low') {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      )
    }

    if (sort === 'high') {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      )
    }

    return result
  }, [products, search, sort])

  const getImage = (product) => {
    const image =
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image?.url ||
      product.image ||
      product.thumbnail

    return typeof image === 'string' ? image : ''
  }

  // Loading Skeleton
  const Skeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="h-56 animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] px-4 py-10 font-[Arial] sm:px-6 md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Animated Brand Introduction */}
        <BrandAnnouncer brand={brand} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-sm text-gray-500">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            {' / '}
            Brands
            {' / '}
            <span className="font-semibold capitalize text-black">
              {brand}
            </span>
          </p>

          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                Explore Our Collection
              </p>

              <h1 className="text-3xl font-extrabold capitalize tracking-tight text-black sm:text-5xl">
                {brand} <span className="text-gray-400">Mobiles</span>
              </h1>

              <p className="mt-3 text-sm text-gray-500 sm:text-base">
                Discover the latest {brand} smartphones at amazing prices.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs text-gray-400">
                Available Products
              </p>
              <p className="text-2xl font-bold text-black">
                {loading ? '...' : products.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${brand} mobiles...`}
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-10 text-sm outline-none transition focus:border-black"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="relative">
            <FiSliders
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-8 text-sm font-semibold outline-none focus:border-black sm:w-56"
            >
              <option value="default">Default Sorting</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : error ? (

          /* Error */
          <div className="py-20 text-center">
            <p className="mb-4 text-red-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"
            >
              <FiRefreshCw />
              Try Again
            </button>
          </div>

        ) : filteredProducts.length === 0 ? (

          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-gray-100 bg-white py-20 text-center"
          >
            <FiSmartphone
              size={55}
              className="mx-auto mb-4 text-gray-300"
            />

            <h2 className="text-xl font-bold text-gray-800">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? 'Try another mobile name.'
                : `Abhi ${brand} ke products available nahi hain.`}
            </p>

            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"
              >
                Clear Search
              </button>
            )}
          </motion.div>

        ) : (

          /* Product Grid */
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">
                Showing {filteredProducts.length} Products
              </p>

              <p className="text-xs text-gray-400">
                Premium Collection
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => {
                  const image = getImage(product)
                  const price = Number(product.price || 0)
                  const oldPrice = Number(product.oldPrice || 0)

                  const discount =
                    Number(product.discount || 0) ||
                    (oldPrice > price
                      ? Math.round(
                          ((oldPrice - price) / oldPrice) * 100
                        )
                      : 0)

                  return (
                    <motion.div
                      key={product._id}
                      variants={cardVariants}
                      layout
                      whileHover={{
                        y: -7,
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                    >
                      <Link to={`/product/${product._id}`}>

                        {/* Image */}
                        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#f7f7f5] p-4 sm:h-56 sm:p-6">

                          {discount > 0 && (
                            <span className="absolute left-3 top-3 z-10 rounded-md bg-black px-2 py-1 text-[10px] font-bold text-white">
                              {discount}% OFF
                            </span>
                          )}

                          {image ? (
                            <motion.img
                              src={image}
                              alt={product.name}
                              loading="lazy"
                              animate={{
                                y: [0, -4, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: index * 0.15,
                              }}
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <FiSmartphone
                              size={65}
                              className="text-gray-300"
                            />
                          )}

                          <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            className="absolute bottom-3 right-3 hidden h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-lg sm:flex"
                          >
                            <FiArrowUpRight size={18} />
                          </motion.div>
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-4">

                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {product.brand}
                          </p>

                          <h2 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold text-gray-900 transition-colors group-hover:text-gray-500 sm:text-base">
                            {product.name}
                          </h2>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <p className="text-base font-extrabold text-black sm:text-lg">
                              Rs. {price.toLocaleString('en-PK')}
                            </p>

                            {oldPrice > price && (
                              <span className="text-xs text-gray-400 line-through">
                                Rs. {oldPrice.toLocaleString('en-PK')}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 border-t border-gray-100 pt-3">
                            <span className="flex items-center justify-center gap-2 rounded-lg bg-black py-3 text-xs font-bold text-white transition group-hover:bg-gray-800 sm:text-sm">
                              View Details
                              <FiArrowUpRight size={15} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}

      </div>
    </div>
  )
}

export default BrandProducts
