
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus,
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiSmartphone
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'
const STORAGE_KEY = 'mobile-compare'

// Two people comparison animation
const CompareAnimation = () => {
  return (
    <div className="compare-illustration relative mx-auto h-64 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 sm:h-72">

      <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/70" />

      {/* Floating comparison symbols */}
      <div className="compare-float absolute left-[46%] top-5 text-2xl font-bold text-gray-400">
        VS
      </div>

      <div className="compare-sparkle absolute left-[20%] top-12 text-xl text-amber-500">
        ✦
      </div>

      <div className="compare-sparkle compare-sparkle-delay absolute right-[18%] top-20 text-2xl text-gray-500">
        ✦
      </div>

      {/* Left Person */}
      <div className="absolute bottom-0 left-[9%] h-48 w-36">
        {/* Head */}
        <div className="compare-head absolute left-10 top-3 z-20 h-16 w-16 rounded-full border-4 border-gray-800 bg-amber-200">
          <div className="absolute left-4 top-7 h-1.5 w-1.5 rounded-full bg-gray-800" />
          <div className="absolute right-4 top-7 h-1.5 w-1.5 rounded-full bg-gray-800" />
          <div className="absolute bottom-3 left-1/2 h-2 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-gray-800" />
          <div className="absolute -top-1 left-1 h-5 w-12 rounded-t-full bg-gray-800" />
        </div>

        {/* Body */}
        <div className="absolute bottom-0 left-3 h-28 w-32 rounded-t-[55px] border-4 border-gray-800 bg-blue-600" />

        {/* Arm */}
        <div className="compare-left-arm absolute left-[82px] top-[87px] z-30 h-5 w-20 origin-left rotate-[-28deg] rounded-full border-2 border-gray-800 bg-amber-200" />

        {/* Phone */}
        <div className="compare-left-phone absolute left-[110px] top-[56px] z-20 h-16 w-9 rotate-[-10deg] rounded-lg border-[3px] border-gray-800 bg-gray-900 shadow-lg">
          <div className="absolute inset-1 rounded-md bg-gradient-to-br from-blue-300 to-blue-600" />
          <div className="absolute left-1/2 top-1 h-1 w-3 -translate-x-1/2 rounded-full bg-gray-800" />
        </div>
      </div>

      {/* Right Person */}
      <div className="absolute bottom-0 right-[9%] h-48 w-36">
        {/* Head */}
        <div className="compare-head compare-head-delay absolute right-10 top-3 z-20 h-16 w-16 rounded-full border-4 border-gray-800 bg-orange-200">
          <div className="absolute left-4 top-7 h-1.5 w-1.5 rounded-full bg-gray-800" />
          <div className="absolute right-4 top-7 h-1.5 w-1.5 rounded-full bg-gray-800" />
          <div className="absolute bottom-3 left-1/2 h-2 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-gray-800" />
          <div className="absolute -top-1 right-1 h-5 w-12 rounded-t-full bg-gray-800" />
        </div>

        {/* Body */}
        <div className="absolute bottom-0 right-3 h-28 w-32 rounded-t-[55px] border-4 border-gray-800 bg-emerald-600" />

        {/* Arm */}
        <div className="compare-right-arm absolute right-[82px] top-[87px] z-30 h-5 w-20 origin-right rotate-[28deg] rounded-full border-2 border-gray-800 bg-orange-200" />

        {/* Phone */}
        <div className="compare-right-phone absolute right-[110px] top-[56px] z-20 h-16 w-9 rotate-[10deg] rounded-lg border-[3px] border-gray-800 bg-gray-900 shadow-lg">
          <div className="absolute inset-1 rounded-md bg-gradient-to-br from-emerald-300 to-emerald-600" />
          <div className="absolute left-1/2 top-1 h-1 w-3 -translate-x-1/2 rounded-full bg-gray-800" />
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-bold text-gray-700 shadow-sm">
        Find Your Perfect Mobile
      </div>
    </div>
  )
}

const Compare = () => {
  const [compareMobiles, setCompareMobiles] = useState([])
  const [allMobiles, setAllMobiles] = useState([])
  const [selectedMobile, setSelectedMobile] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load saved comparison
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      )

      setCompareMobiles(Array.isArray(saved) ? saved.slice(0, 3) : [])
    } catch {
      setCompareMobiles([])
    }
  }, [])

  // Save comparison
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(compareMobiles)
    )
  }, [compareMobiles])

  // Fetch all mobiles
  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true)

        const response = await fetch(API_URL)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to load mobiles.')
        }

        setAllMobiles(
          Array.isArray(data.products) ? data.products : []
        )
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchMobiles()
  }, [])

  // Add mobile
  const handleAddMobile = () => {
    if (!selectedMobile) return

    const mobile = allMobiles.find(
      (item) => String(item._id) === String(selectedMobile)
    )

    if (!mobile) return

    if (
      compareMobiles.some(
        (item) => String(item._id) === String(mobile._id)
      )
    ) {
      setError('This mobile is already added.')
      return
    }

    if (compareMobiles.length >= 3) {
      setError('You can compare maximum 3 mobiles.')
      return
    }

    setCompareMobiles((previous) => [...previous, mobile])
    setSelectedMobile('')
    setError('')
  }

  // Remove mobile
  const handleRemove = (mobileId) => {
    setCompareMobiles((previous) =>
      previous.filter(
        (mobile) => String(mobile._id) !== String(mobileId)
      )
    )

    setError('')
  }

  // Clear comparison
  const handleClear = () => {
    setCompareMobiles([])
    setSelectedMobile('')
    setError('')
  }

  // Get mobile image
  const getImage = (mobile) => {
    if (Array.isArray(mobile.images) && mobile.images.length > 0) {
      return mobile.images[0]
    }

    return mobile.image || mobile.imageUrl || mobile.thumbnail || ''
  }

  // Format values
  const formatValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return 'Not available'
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : 'Not available'
    }

    if (typeof value === 'object') {
      return Object.values(value).filter(Boolean).join(', ') || 'Not available'
    }

    return String(value)
  }

  // Specification rows
  const specificationRows = [
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Price', key: 'price', prefix: 'Rs. ' },
    { label: 'Old Price', key: 'oldPrice', prefix: 'Rs. ' },
    { label: 'Discount', key: 'discount', suffix: '%' },
    { label: 'Category', key: 'category' },
    { label: 'Display', key: 'display', nested: true },
    { label: 'Processor', key: 'processor', nested: true },
    { label: 'RAM', key: 'ram', nested: true },
    { label: 'Storage', key: 'storage', nested: true },
    { label: 'Rear Camera', key: 'rearCamera', nested: true },
    { label: 'Front Camera', key: 'frontCamera', nested: true },
    { label: 'Battery', key: 'battery', nested: true },
    { label: 'Operating System', key: 'operatingSystem', nested: true },
    { label: 'Network', key: 'network', nested: true },
    { label: 'Available Colors', key: 'colors' },
    { label: 'Stock', key: 'stock' },
    { label: 'Rating', key: 'rating' },
    { label: 'Express Delivery', key: 'expressDelivery' },
    { label: 'Description', key: 'description' }
  ]

  // Get specification value
  const getSpecificationValue = (mobile, row) => {
    let value

    if (row.nested) {
      value = mobile.specifications?.[row.key]
    } else {
      value = mobile[row.key]
    }

    if (row.key === 'expressDelivery') {
      return value ? 'Available' : 'Not Available'
    }

    if (row.key === 'rating' && value !== undefined) {
      return `${value} / 5`
    }

    if (row.key === 'price' || row.key === 'oldPrice') {
      return value ? `${row.prefix}${formatValue(value)}` : 'Not available'
    }

    if (row.suffix && value !== undefined && value !== '') {
      return `${formatValue(value)}${row.suffix}`
    }

    return formatValue(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-[Arial] sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 grid items-center gap-8 lg:grid-cols-2">

          <div>
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
            >
              <FiArrowLeft />
              Back to Home
            </Link>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Smart Shopping Starts Here
            </p>

            <h1 className="text-3xl font-bold leading-tight text-black sm:text-5xl">
              Compare Mobiles.
              <span className="block text-gray-400">
                Choose Better.
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              Compare features, performance, prices and specifications
              side by side to find the perfect smartphone for your needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-xl font-bold text-black">
                  {compareMobiles.length}/3
                </p>
                <p className="text-xs text-gray-500">
                  Mobiles Added
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-xl font-bold text-black">
                  Side by Side
                </p>
                <p className="text-xs text-gray-500">
                  Easy Comparison
                </p>
              </div>
            </div>
          </div>

          <CompareAnimation />

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Add Mobile */}
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="mb-1 text-base font-bold text-black">
              Add Another Mobile
            </h2>
            <p className="text-xs text-gray-500">
              You can compare up to 3 mobiles at a time.
            </p>
          </div>

          {compareMobiles.length < 3 && (
            <>
              <select
                value={selectedMobile}
                onChange={(e) => {
                  setSelectedMobile(e.target.value)
                  setError('')
                }}
                className="min-h-12 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
              >
                <option value="">Select a mobile to compare</option>

                {allMobiles
                  .filter(
                    (mobile) =>
                      !compareMobiles.some(
                        (item) => String(item._id) === String(mobile._id)
                      )
                  )
                  .map((mobile) => (
                    <option key={mobile._id} value={mobile._id}>
                      {mobile.name || mobile.model || 'Unnamed Mobile'}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={handleAddMobile}
                disabled={!selectedMobile || loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiPlus />
                Add Mobile
              </button>
            </>
          )}

          {compareMobiles.length >= 3 && (
            <p className="text-sm font-semibold text-gray-500">
              Maximum 3 mobiles added
            </p>
          )}
        </div>

        {/* Clear All */}
        {compareMobiles.length > 0 && (
          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600"
            >
              <FiTrash2 />
              Clear All
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading mobiles...
          </div>
        )}

        {/* Empty State */}
        {!loading && compareMobiles.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <FiSmartphone className="mx-auto mb-4 text-5xl text-gray-300" />

            <h2 className="text-xl font-bold text-black">
              No Mobiles Added
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Select mobiles from the dropdown above or open any mobile
              and use the Compare button to get started.
            </p>

            <Link
              to="/mobiles"
              className="mt-6 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Explore Mobiles
            </Link>
          </div>
        )}

        {/* Comparison */}
        {!loading && compareMobiles.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            {/* Mobile Cards */}
            <div
              className="grid border-b border-gray-200"
              style={{
                gridTemplateColumns: `repeat(${compareMobiles.length}, minmax(0, 1fr))`
              }}
            >
              {compareMobiles.map((mobile) => (
                <div
                  key={mobile._id}
                  className="relative min-w-0 border-r border-gray-200 p-4 last:border-r-0 sm:p-6"
                >
                  <button
                    type="button"
                    onClick={() => handleRemove(mobile._id)}
                    aria-label="Remove mobile"
                    className="absolute right-3 top-3 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <FiX />
                  </button>

                  <div className="flex h-36 items-center justify-center sm:h-52">
                    {getImage(mobile) ? (
                      <img
                        src={getImage(mobile)}
                        alt={mobile.name || mobile.model}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <FiSmartphone className="text-6xl text-gray-300" />
                    )}
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-center text-sm font-bold text-black sm:text-base">
                    {mobile.name || mobile.model || 'Mobile'}
                  </h3>

                  <p className="mt-2 text-center text-sm font-bold text-gray-700">
                    Rs. {formatValue(mobile.price)}
                  </p>

                  <Link
                    to={`/products/${mobile._id}`}
                    className="mt-4 block rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-bold text-black transition hover:border-black hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div>
              <div className="border-b border-gray-200 bg-gray-100 px-4 py-4">
                <h2 className="font-bold text-black">
                  Specifications Comparison
                </h2>
              </div>

              {specificationRows.map((row) => (
                <div
                  key={row.key}
                  className="grid border-b border-gray-100 last:border-b-0"
                  style={{
                    gridTemplateColumns: `repeat(${compareMobiles.length}, minmax(0, 1fr))`
                  }}
                >
                  {compareMobiles.map((mobile) => (
                    <div
                      key={`${mobile._id}-${row.key}`}
                      className="min-w-0 border-r border-gray-100 p-4 last:border-r-0"
                    >
                      <p className="mb-1 text-xs font-semibold text-gray-400 sm:hidden">
                        {row.label}
                      </p>

                      <p className="break-words text-center text-xs text-gray-700 sm:text-sm">
                        {getSpecificationValue(mobile, row)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/mobiles"
            className="text-sm font-semibold text-gray-600 underline underline-offset-4 transition hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>

      </div>

      {/* Animation CSS */}
      <style>{`
        .compare-head {
          animation: compareHead 2.5s ease-in-out infinite;
        }

        .compare-head-delay {
          animation-delay: 0.5s;
        }

        .compare-left-arm {
          animation: compareLeftArm 2s ease-in-out infinite;
        }

        .compare-right-arm {
          animation: compareRightArm 2s ease-in-out infinite;
        }

        .compare-left-phone {
          animation: compareLeftPhone 2s ease-in-out infinite;
        }

        .compare-right-phone {
          animation: compareRightPhone 2s ease-in-out infinite;
        }

        .compare-float {
          animation: compareFloat 2s ease-in-out infinite;
        }

        .compare-sparkle {
          animation: compareSparkle 2s ease-in-out infinite;
        }

        .compare-sparkle-delay {
          animation-delay: 1s;
        }

        @keyframes compareHead {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes compareLeftArm {
          0%, 100% {
            transform: rotate(-28deg);
          }
          50% {
            transform: rotate(-18deg);
          }
        }

        @keyframes compareRightArm {
          0%, 100% {
            transform: rotate(28deg);
          }
          50% {
            transform: rotate(18deg);
          }
        }

        @keyframes compareLeftPhone {
          0%, 100% {
            transform: rotate(-10deg) translateY(0);
          }
          50% {
            transform: rotate(-16deg) translateY(-5px);
          }
        }

        @keyframes compareRightPhone {
          0%, 100% {
            transform: rotate(10deg) translateY(0);
          }
          50% {
            transform: rotate(16deg) translateY(-5px);
          }
        }

        @keyframes compareFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes compareSparkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(25deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .compare-head,
          .compare-left-arm,
          .compare-right-arm,
          .compare-left-phone,
          .compare-right-phone,
          .compare-float,
          .compare-sparkle {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Compare
