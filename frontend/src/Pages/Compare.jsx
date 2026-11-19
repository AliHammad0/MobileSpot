
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus,
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiSmartphone,
  FiCpu,
  FiCamera,
  FiHardDrive,
  FiWifi,
  FiMonitor,
  FiCheckCircle,
  FiActivity
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'
const STORAGE_KEY = 'mobile-compare'

// Get actual database image
const getMobileImage = (mobile) => {
  if (!mobile) return ''

  if (Array.isArray(mobile.images) && mobile.images.length > 0) {
    return mobile.images[0]
  }

  return mobile.image || mobile.imageUrl || mobile.thumbnail || ''
}

// Get nested specification
const getSpec = (mobile, key) => {
  return mobile?.specifications?.[key] || 'Not available'
}

// Animated feature card
const FeatureCard = ({ icon: Icon, title, value, className = '', delay = '' }) => (
  <div
    className={`feature-test-card absolute z-30 flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
      <Icon size={16} />
    </div>

    <div className="min-w-0">
      <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <p className="max-w-[100px] truncate text-xs font-bold text-gray-900">
        {value || 'Checking...'}
      </p>
    </div>
  </div>
)

// Person holding actual mobile image
const MobileTester = ({
  mobile,
  side,
  personName,
  color,
  delay
}) => {
  const image = getMobileImage(mobile)

  return (
    <div className={`tester tester-${side} absolute bottom-0 ${side === 'left' ? 'left-[5%]' : 'right-[5%]'}`}>
      {/* Person head */}
      <div
        className={`tester-head absolute z-20 h-14 w-14 rounded-full border-[3px] border-gray-800 bg-amber-200 ${side === 'left' ? 'left-9' : 'right-9'}`}
        style={{ animationDelay: delay }}
      >
        <div className="absolute left-3 top-6 h-1.5 w-1.5 rounded-full bg-gray-900" />
        <div className="absolute right-3 top-6 h-1.5 w-1.5 rounded-full bg-gray-900" />
        <div className="absolute bottom-2 left-1/2 h-2 w-3 -translate-x-1/2 rounded-b-full border-b-2 border-gray-800" />
        <div className="absolute -top-1 left-0 h-5 w-full rounded-t-full bg-gray-900" />
      </div>

      {/* Person body */}
      <div
        className="absolute bottom-0 h-28 w-32 rounded-t-[48px] border-[3px] border-gray-800"
        style={{
          backgroundColor: color,
          left: side === 'left' ? '0' : 'auto',
          right: side === 'right' ? '0' : 'auto'
        }}
      />

      {/* Arm holding phone */}
      <div
        className={`tester-arm absolute top-[76px] z-20 h-5 w-20 rounded-full border-[3px] border-gray-800 bg-amber-200 ${side === 'left' ? 'left-[75px] origin-left' : 'right-[75px] origin-right'}`}
        style={{ animationDelay: delay }}
      />

      {/* Actual product image in hand */}
      <div
        className={`tester-phone absolute top-[48px] z-30 flex h-[105px] w-[65px] items-center justify-center overflow-hidden rounded-xl border-[4px] border-gray-800 bg-white p-1 shadow-xl ${side === 'left' ? 'left-[118px]' : 'right-[118px]'}`}
        style={{ animationDelay: delay }}
      >
        {image ? (
          <img
            src={image}
            alt={mobile?.name || 'Mobile phone'}
            className="h-full w-full rounded-lg object-contain"
          />
        ) : (
          <FiSmartphone className="text-3xl text-gray-400" />
        )}
      </div>

      {/* Person label */}
      <div
        className={`absolute -top-7 z-30 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-bold text-gray-700 shadow ${side === 'left' ? 'left-5' : 'right-5'}`}
      >
        {personName}
      </div>
    </div>
  )
}

// Main animation section
const CompareAnimation = ({ firstMobile, secondMobile }) => {
  const firstName = firstMobile?.name || firstMobile?.model || 'Mobile 1'
  const secondName = secondMobile?.name || secondMobile?.model || 'Mobile 2'

  return (
    <div className="relative mx-auto w-full max-w-2xl">

      <div className="relative h-[330px] overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-100 via-white to-gray-200 sm:h-[370px]">

        {/* Background circles */}
        <div className="absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full border border-gray-300/60" />
        <div className="absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full border border-gray-300/60" />

        {/* Center testing panel */}
        <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 text-gray-900">
            <FiActivity size={17} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Live Feature Testing
            </span>
          </div>
          <p className="mt-1 text-[10px] text-gray-500">
            Comparing performance
          </p>
        </div>

        {/* Floating testing cards */}
        <FeatureCard
          icon={FiCpu}
          title="RAM"
          value={getSpec(firstMobile, 'ram')}
          className="left-2 top-[105px] sm:left-5"
          delay="0s"
        />

        <FeatureCard
          icon={FiHardDrive}
          title="Storage"
          value={getSpec(firstMobile, 'storage')}
          className="left-2 top-[190px] sm:left-5"
          delay="0.4s"
        />

        <FeatureCard
          icon={FiCamera}
          title="Camera Test"
          value={getSpec(secondMobile, 'rearCamera')}
          className="right-2 top-[105px] sm:right-5"
          delay="0.7s"
        />

        <FeatureCard
          icon={FiWifi}
          title="Network"
          value={getSpec(secondMobile, 'network')}
          className="right-2 top-[190px] sm:right-5"
          delay="1s"
        />

        {/* People */}
        <MobileTester
          mobile={firstMobile}
          side="left"
          personName="Hardware Expert"
          color="#334155"
          delay="0s"
        />

        <MobileTester
          mobile={secondMobile}
          side="right"
          personName="Camera & Network Expert"
          color="#047857"
          delay="0.5s"
        />

        {/* Bottom status */}
        <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-600" size={14} />
            <span className="text-[10px] font-bold text-gray-700 sm:text-xs">
              {firstName} vs {secondName}
            </span>
          </div>
        </div>
      </div>

      {/* Extra testing information */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <FiMonitor className="mx-auto mb-1 text-gray-700" />
          <p className="text-[10px] font-bold text-gray-700">Display Test</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <FiCpu className="mx-auto mb-1 text-gray-700" />
          <p className="text-[10px] font-bold text-gray-700">Performance</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <FiWifi className="mx-auto mb-1 text-gray-700" />
          <p className="text-[10px] font-bold text-gray-700">5G Network</p>
        </div>
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
    { label: 'Network / 5G', key: 'network', nested: true },
    { label: 'Available Colors', key: 'colors' },
    { label: 'Stock', key: 'stock' },
    { label: 'Rating', key: 'rating' },
    { label: 'Express Delivery', key: 'expressDelivery' },
    { label: 'Description', key: 'description' }
  ]

  // Get specification value
  const getSpecificationValue = (mobile, row) => {
    const value = row.nested
      ? mobile.specifications?.[row.key]
      : mobile[row.key]

    if (row.key === 'expressDelivery') {
      return value ? 'Available' : 'Not Available'
    }

    if (row.key === 'rating' && value !== undefined) {
      return `${value} / 5`
    }

    if (row.key === 'price' || row.key === 'oldPrice') {
      return value
        ? `${row.prefix}${formatValue(value)}`
        : 'Not available'
    }

    if (row.suffix && value !== undefined && value !== '') {
      return `${formatValue(value)}${row.suffix}`
    }

    return formatValue(value)
  }

  // Select two actual database mobiles for animation
  const animationFirstMobile = compareMobiles[0] || allMobiles[0]

  const animationSecondMobile =
    compareMobiles[1] ||
    allMobiles.find(
      (mobile) =>
        String(mobile._id) !== String(animationFirstMobile?._id)
    ) ||
    animationFirstMobile

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-[Arial] sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 grid items-center gap-8 lg:grid-cols-2">

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
              Explore mobile features, test specifications and compare
              performance, camera, RAM, storage and network side by side.
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
                  Live
                </p>
                <p className="text-xs text-gray-500">
                  Feature Exploration
                </p>
              </div>
            </div>
          </div>

          {!loading && (
            <CompareAnimation
              firstMobile={animationFirstMobile}
              secondMobile={animationSecondMobile}
            />
          )}

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
              Select mobiles to compare up to 3 devices.
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
              Select mobiles from the dropdown or open any mobile and
              use the Compare button to get started.
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
                    {getMobileImage(mobile) ? (
                      <img
                        src={getMobileImage(mobile)}
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
        .tester-head {
          animation: testerHead 2.8s ease-in-out infinite;
        }

        .tester-arm {
          animation: testerArm 2.4s ease-in-out infinite;
        }

        .tester-phone {
          animation: testerPhone 2.4s ease-in-out infinite;
        }

        .feature-test-card {
          animation: featureFloat 3s ease-in-out infinite;
        }

        .tester-left {
          animation: testerBody 3s ease-in-out infinite;
        }

        .tester-right {
          animation: testerBody 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes testerHead {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(-3deg);
          }
        }

        @keyframes testerArm {
          0%, 100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .tester-right .tester-arm {
          animation-name: testerArmRight;
        }

        @keyframes testerArmRight {
          0%, 100% {
            transform: rotate(8deg);
          }
          50% {
            transform: rotate(-5deg);
          }
        }

        @keyframes testerPhone {
          0%, 100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-6px) rotate(3deg);
          }
        }

        .tester-right .tester-phone {
          animation-name: testerPhoneRight;
        }

        @keyframes testerPhoneRight {
          0%, 100% {
            transform: translateY(0) rotate(3deg);
          }
          50% {
            transform: translateY(-6px) rotate(-3deg);
          }
        }

        @keyframes featureFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes testerBody {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tester-head,
          .tester-arm,
          .tester-phone,
          .feature-test-card,
          .tester-left,
          .tester-right {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Compare
