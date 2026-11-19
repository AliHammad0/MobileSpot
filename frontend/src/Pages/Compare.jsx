
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
  FiActivity,
  FiBattery,
  FiLayers,
  FiRefreshCw
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'
const STORAGE_KEY = 'mobile-compare'

const getMobileImage = (mobile) => {
  if (!mobile) return ''

  if (Array.isArray(mobile.images) && mobile.images.length) {
    return mobile.images[0]
  }

  return mobile.image || mobile.imageUrl || mobile.thumbnail || ''
}

const getSpec = (mobile, key) => {
  return mobile?.specifications?.[key] || 'Not available'
}

const getMobileName = (mobile) => {
  return mobile?.name || mobile?.model || 'Mobile Phone'
}

// Tests are based on the product specifications saved in the database.
const getTests = (mobile) => [
  {
    id: 'display',
    title: 'Display Inspection',
    shortTitle: 'Display',
    description: 'Checking the screen and display specifications',
    icon: FiMonitor,
    value: getSpec(mobile, 'display'),
    detail: 'Screen specifications',
    color: 'blue'
  },
  {
    id: 'processor',
    title: 'Processor Inspection',
    shortTitle: 'Processor',
    description: 'Reviewing processor information',
    icon: FiCpu,
    value: getSpec(mobile, 'processor'),
    detail: 'Processor specifications',
    color: 'violet'
  },
  {
    id: 'ram',
    title: 'RAM Inspection',
    shortTitle: 'RAM',
    description: 'Checking available RAM specifications',
    icon: FiActivity,
    value: getSpec(mobile, 'ram'),
    detail: 'RAM specifications',
    color: 'indigo'
  },
  {
    id: 'storage',
    title: 'Storage Inspection',
    shortTitle: 'Storage',
    description: 'Reviewing internal storage capacity',
    icon: FiHardDrive,
    value: getSpec(mobile, 'storage'),
    detail: 'Storage specifications',
    color: 'amber'
  },
  {
    id: 'camera',
    title: 'Camera Inspection',
    shortTitle: 'Camera',
    description: 'Reviewing front and rear camera details',
    icon: FiCamera,
    value: `Rear: ${getSpec(mobile, 'rearCamera')} | Front: ${getSpec(mobile, 'frontCamera')}`,
    detail: 'Camera specifications',
    color: 'pink'
  },
  {
    id: 'network',
    title: 'Network Inspection',
    shortTitle: 'Network',
    description: 'Checking the supported network information',
    icon: FiWifi,
    value: getSpec(mobile, 'network'),
    detail: 'Network specifications',
    color: 'emerald'
  },
  {
    id: 'battery',
    title: 'Battery Inspection',
    shortTitle: 'Battery',
    description: 'Reviewing battery specifications',
    icon: FiBattery,
    value: getSpec(mobile, 'battery'),
    detail: 'Battery specifications',
    color: 'green'
  },
  {
    id: 'software',
    title: 'Software Inspection',
    shortTitle: 'Operating System',
    description: 'Reviewing the operating system and version',
    icon: FiLayers,
    value: getSpec(mobile, 'operatingSystem'),
    detail: 'Operating system specifications',
    color: 'cyan'
  }
]

// Animated person holding the real product image.
const MobileTester = ({ mobile, side = 'left' }) => {
  const image = getMobileImage(mobile)
  const isLeft = side === 'left'

  return (
    <div className={`tester-character tester-${side}`}>
      <div className="tester-name">
        <span className="tester-online-dot" />
        Mobile Expert
      </div>

      {/* Head */}
      <div className="person-head">
        <div className="person-hair" />
        <div className="person-eye person-eye-left" />
        <div className="person-eye person-eye-right" />
        <div className="person-nose" />
        <div className="person-mouth" />
      </div>

      {/* Neck */}
      <div className="person-neck" />

      {/* Body / clothing */}
      <div className="person-body">
        <div className="person-shirt-detail" />
        <div className="person-shirt-button button-one" />
        <div className="person-shirt-button button-two" />
      </div>

      {/* Back arm */}
      <div className={`person-arm person-arm-back ${isLeft ? 'arm-left' : 'arm-right'}`} />

      {/* Hand holding the phone */}
      <div className={`person-hand ${isLeft ? 'hand-left' : 'hand-right'}`} />

      {/* Actual mobile image from database */}
      <div className={`held-mobile ${isLeft ? 'held-mobile-left' : 'held-mobile-right'}`}>
        <div className="held-mobile-camera">
          <span />
          <span />
          <span />
        </div>

        {image ? (
          <img
            src={image}
            alt={mobile?.name || mobile?.model || 'Product mobile'}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="held-mobile-placeholder">
            <FiSmartphone size={30} />
          </div>
        )}

        <div className="held-mobile-glare" />
      </div>

      {/* Front arm */}
      <div className={`person-arm person-arm-front ${isLeft ? 'arm-left' : 'arm-right'}`} />

      {/* Second hand */}
      <div className={`person-hand person-hand-support ${isLeft ? 'hand-left' : 'hand-right'}`} />

      {/* Inspection indicator */}
      <div className="inspection-focus">
        <FiActivity size={13} />
        Inspecting device
      </div>
    </div>
  )
}

// Buyer-facing live testing panel and animated inspection scene.
const CompareAnimation = ({ firstMobile, secondMobile }) => {
  const [activeTest, setActiveTest] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activePerson, setActivePerson] = useState(0)

  const tests = getTests(activePerson === 0 ? firstMobile : secondMobile)
  const currentTest = tests[activeTest] || tests[0]
  const TestIcon = currentTest?.icon || FiActivity

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) return 0
        return previous + 5
      })
    }, 140)

    return () => clearInterval(progressTimer)
  }, [activeTest, activePerson])

  useEffect(() => {
    const testTimer = setInterval(() => {
      setProgress(0)

      setActiveTest((previous) => {
        if (previous >= tests.length - 1) {
          setActivePerson((person) => person === 0 ? 1 : 0)
          return 0
        }

        return previous + 1
      })
    }, 3000)

    return () => clearInterval(testTimer)
  }, [tests.length])

  const selectedMobile = activePerson === 0 ? firstMobile : secondMobile

  return (
    <div className="w-full">
      <div className="testing-stage">
        <div className="stage-topbar">
          <div>
            <span className="stage-live-dot" />
            <span>DEVICE INSPECTION ROOM</span>
          </div>
          <span className="stage-live-label">LIVE DEMO</span>
        </div>

        {/* Animated testing room */}
        <div className="inspection-room">
          <div className="room-light room-light-one" />
          <div className="room-light room-light-two" />

          <div className="room-background-circle" />
          <div className="room-floor" />

          {/* Left tester */}
          <MobileTester
            mobile={firstMobile}
            side="left"
          />

          {/* Right tester */}
          <MobileTester
            mobile={secondMobile}
            side="right"
          />

          {/* Buyer-visible inspection screen */}
          <div className="buyer-test-panel">
            <div className="buyer-panel-header">
              <div className="buyer-panel-heading">
                <span className="buyer-panel-icon">
                  <TestIcon size={16} />
                </span>

                <div>
                  <p>BUYER VIEW</p>
                  <h3>Phone Testing</h3>
                </div>
              </div>

              <span className="panel-live-status">
                <span />
                LIVE
              </span>
            </div>

            <div className="buyer-device-name">
              <span>Currently inspecting</span>
              <strong>
                {selectedMobile?.name || selectedMobile?.model || 'Mobile Phone'}
              </strong>
            </div>

            <div className="current-test-box">
              <div className="current-test-icon">
                <TestIcon size={22} />
              </div>

              <div className="current-test-info">
                <span>NOW CHECKING</span>
                <h4>{currentTest?.title}</h4>
                <p>{currentTest?.description}</p>
              </div>
            </div>

            <div className="test-result-box">
              <div className="test-result-top">
                <span>Product specification</span>
                <FiCheckCircle size={15} />
              </div>

              <strong>{currentTest?.value || 'Not available'}</strong>

              <div className="test-progress-track">
                <div
                  className="test-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="test-progress-bottom">
                <span>Inspection progress</span>
                <strong>{progress}%</strong>
              </div>
            </div>

            <div className="test-steps">
              {tests.map((test, index) => {
                const StepIcon = test.icon

                return (
                  <div
                    key={test.id}
                    className={`test-step ${
                      index === activeTest ? 'test-step-active' : ''
                    } ${index < activeTest ? 'test-step-done' : ''}`}
                  >
                    <StepIcon size={13} />
                    <span>{test.shortTitle}</span>
                    {index < activeTest && <FiCheckCircle size={11} />}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="room-bottom-label">
            <span className="room-bottom-dot" />
            {activePerson === 0 ? 'Expert 01' : 'Expert 02'} is inspecting the device
          </div>
        </div>

        {/* Product names */}
        <div className="stage-products">
          <div className="stage-product">
            <span className="stage-product-number">01</span>
            <div>
              <p>DEVICE ONE</p>
              <strong>{firstMobile?.name || firstMobile?.model || 'Select a mobile'}</strong>
            </div>
          </div>

          <div className="stage-vs">VS</div>

          <div className="stage-product stage-product-right">
            <span className="stage-product-number">02</span>
            <div>
              <p>DEVICE TWO</p>
              <strong>{secondMobile?.name || secondMobile?.model || 'Select another mobile'}</strong>
            </div>
          </div>
        </div>
      </div>

      <p className="testing-disclaimer">
        Animated product walkthrough using specifications saved in the product database.
        This is not a physical hardware benchmark.
      </p>
    </div>
  )
}

const Compare = () => {
  const [compareMobiles, setCompareMobiles] = useState([])
  const [allMobiles, setAllMobiles] = useState([])
  const [selectedMobile, setSelectedMobile] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load saved comparison.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      setCompareMobiles(Array.isArray(saved) ? saved.slice(0, 3) : [])
    } catch {
      setCompareMobiles([])
    }
  }, [])

  // Save comparison.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareMobiles))
  }, [compareMobiles])

  // Fetch products from database.
  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to load mobiles.')
        }

        setAllMobiles(Array.isArray(data.products) ? data.products : [])
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchMobiles()
  }, [])

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

  const handleRemove = (mobileId) => {
    setCompareMobiles((previous) =>
      previous.filter((mobile) => String(mobile._id) !== String(mobileId))
    )
    setError('')
  }

  const handleClear = () => {
    setCompareMobiles([])
    setSelectedMobile('')
    setError('')
  }

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

  // Use actual selected database products for the animation.
  const animationFirstMobile = compareMobiles[0] || allMobiles[0]

  const animationSecondMobile =
    compareMobiles[1] ||
    allMobiles.find(
      (mobile) =>
        String(mobile._id) !== String(animationFirstMobile?._id)
    ) ||
    null

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
              <span className="block text-gray-400">Choose Better.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              Watch our animated mobile experts inspect device specifications
              and compare features before you make your buying decision.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-xl font-bold text-black">
                  {compareMobiles.length}/3
                </p>
                <p className="text-xs text-gray-500">Mobiles Added</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-xl font-bold text-black">Live</p>
                <p className="text-xs text-gray-500">Feature Walkthrough</p>
              </div>
            </div>
          </div>

          {!loading && animationFirstMobile && (
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
                onChange={(event) => {
                  setSelectedMobile(event.target.value)
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
              Select mobiles from the dropdown or open any mobile and use
              the Compare button to get started.
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

      {/* Animation styles */}
      <style>{`
        .testing-stage {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 15px 45px rgba(15, 23, 42, 0.07);
        }

        .stage-topbar {
          height: 44px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111827;
          color: white;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .stage-topbar > div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stage-live-dot,
        .panel-live-status span,
        .tester-online-dot,
        .room-bottom-dot {
          width: 7px;
          height: 7px;
          display: inline-block;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, .13);
        }

        .stage-live-label {
          color: #86efac;
        }

        .inspection-room {
          height: 355px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(145deg, rgba(255,255,255,.92), rgba(226,232,240,.8)),
            #f1f5f9;
        }

        .room-light {
          position: absolute;
          top: -100px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          filter: blur(45px);
          opacity: .35;
        }

        .room-light-one {
          left: -80px;
          background: #bfdbfe;
        }

        .room-light-two {
          right: -80px;
          background: #a7f3d0;
        }

        .room-background-circle {
          position: absolute;
          width: 260px;
          height: 260px;
          left: 50%;
          top: 40px;
          transform: translateX(-50%);
          border: 1px solid rgba(148, 163, 184, .3);
          border-radius: 50%;
        }

        .room-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 75px;
          background: linear-gradient(to bottom, #e2e8f0, #cbd5e1);
          border-top: 1px solid #cbd5e1;
        }

        .room-floor:after {
          content: '';
          position: absolute;
          top: 10px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: rgba(100, 116, 139, .18);
        }

        /* Human character */
        .tester-character {
          position: absolute;
          bottom: 33px;
          width: 180px;
          height: 250px;
          z-index: 5;
          animation: personBodyMove 3s ease-in-out infinite;
        }

        .tester-left {
          left: -2px;
        }

        .tester-right {
          right: -2px;
          animation-delay: .6s;
        }

        .tester-name {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          background: white;
          color: #334155;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 3px 12px rgba(15,23,42,.08);
        }

        .person-head {
          position: absolute;
          top: 35px;
          left: 65px;
          z-index: 8;
          width: 48px;
          height: 57px;
          border: 2px solid #334155;
          border-radius: 45% 45% 48% 48%;
          background: #d9a17e;
          animation: headInspect 3s ease-in-out infinite;
        }

        .tester-right .person-head {
          animation-delay: .5s;
        }

        .person-hair {
          position: absolute;
          left: -2px;
          top: -5px;
          width: 49px;
          height: 23px;
          border-radius: 50% 50% 25% 25%;
          background: #1e293b;
        }

        .person-eye {
          position: absolute;
          top: 29px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #1f2937;
        }

        .person-eye-left {
          left: 12px;
        }

        .person-eye-right {
          right: 12px;
        }

        .person-nose {
          position: absolute;
          top: 32px;
          left: 22px;
          width: 5px;
          height: 7px;
          border-right: 1px solid #9a6049;
          transform: rotate(15deg);
        }

        .person-mouth {
          position: absolute;
          left: 18px;
          bottom: 9px;
          width: 12px;
          height: 5px;
          border-bottom: 1.5px solid #713f35;
          border-radius: 50%;
        }

        .person-neck {
          position: absolute;
          top: 83px;
          left: 81px;
          z-index: 5;
          width: 17px;
          height: 22px;
          background: #c98d6e;
        }

        .person-body {
          position: absolute;
          top: 99px;
          left: 36px;
          z-index: 4;
          width: 105px;
          height: 148px;
          overflow: hidden;
          border: 2px solid #334155;
          border-radius: 42px 42px 10px 10px;
          background: #334155;
        }

        .tester-right .person-body {
          background: #047857;
          border-color: #064e3b;
        }

        .person-shirt-detail {
          position: absolute;
          left: 45px;
          top: 0;
          width: 2px;
          height: 75px;
          background: rgba(255,255,255,.22);
        }

        .person-shirt-button {
          position: absolute;
          left: 43px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e2e8f0;
        }

        .button-one {
          top: 35px;
        }

        .button-two {
          top: 53px;
        }

        .person-arm {
          position: absolute;
          z-index: 10;
          width: 75px;
          height: 18px;
          top: 137px;
          border: 2px solid #334155;
          border-radius: 20px;
          background: #d9a17e;
        }

        .person-arm-back {
          width: 77px;
          top: 126px;
          z-index: 3;
        }

        .tester-left .arm-left {
          left: 100px;
          transform-origin: 10px center;
          transform: rotate(-28deg);
        }

        .tester-right .arm-right {
          right: 100px;
          transform-origin: 65px center;
          transform: rotate(28deg);
        }

        .person-arm-front {
          animation: holdingArm 2.5s ease-in-out infinite;
        }

        .tester-left .person-arm-front {
          left: 96px;
          transform-origin: 5px center;
        }

        .tester-right .person-arm-front {
          right: 96px;
          transform-origin: 70px center;
          animation-name: holdingArmRight;
        }

        .person-hand {
          position: absolute;
          z-index: 12;
          top: 130px;
          width: 22px;
          height: 22px;
          border: 2px solid #9a6049;
          border-radius: 45%;
          background: #d9a17e;
        }

        .hand-left {
          left: 143px;
        }

        .hand-right {
          right: 143px;
        }

        .person-hand-support {
          top: 173px;
          z-index: 15;
        }

        /* Actual product image inside the person's hands */
        .held-mobile {
          position: absolute;
          top: 105px;
          left: 112px;
          z-index: 14;
          width: 49px;
          height: 91px;
          padding: 3px;
          overflow: hidden;
          border: 3px solid #111827;
          border-radius: 10px;
          background: white;
          box-shadow: 0 8px 18px rgba(15,23,42,.3);
          animation: phoneInspect 2.5s ease-in-out infinite;
        }

        .held-mobile-right {
          left: auto;
          right: 112px;
          animation-name: phoneInspectRight;
        }

        .held-mobile img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 5px;
        }

        .held-mobile-camera {
          position: absolute;
          z-index: 3;
          top: 4px;
          left: 5px;
          display: flex;
          gap: 2px;
        }

        .held-mobile-camera span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #111827;
        }

        .held-mobile-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.4) 48%, transparent 60%);
          transform: translateX(-100%);
          animation: phoneGlare 3.5s ease-in-out infinite;
        }

        .held-mobile-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .inspection-focus {
          position: absolute;
          left: 50%;
          bottom: 4px;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #475569;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* Buyer-facing test panel */
        .buyer-test-panel {
          position: absolute;
          z-index: 18;
          top: 18px;
          left: 50%;
          width: 215px;
          padding: 12px;
          transform: translateX(-50%);
          border: 1px solid rgba(226,232,240,.95);
          border-radius: 13px;
          background: rgba(255,255,255,.97);
          box-shadow: 0 12px 35px rgba(15,23,42,.13);
          backdrop-filter: blur(8px);
        }

        .buyer-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding-bottom: 9px;
          border-bottom: 1px solid #e5e7eb;
        }

        .buyer-panel-heading {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .buyer-panel-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #111827;
          color: white;
        }

        .buyer-panel-heading p {
          color: #9ca3af;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .buyer-panel-heading h3 {
          margin-top: 2px;
          color: #111827;
          font-size: 12px;
          font-weight: 900;
        }

        .panel-live-status {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #16a34a;
          font-size: 8px;
          font-weight: 900;
        }

        .panel-live-status span {
          width: 6px;
          height: 6px;
        }

        .buyer-device-name {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 9px 0;
        }

        .buyer-device-name span,
        .test-result-top span {
          color: #9ca3af;
          font-size: 8px;
          font-weight: 700;
        }

        .buyer-device-name strong {
          overflow: hidden;
          color: #111827;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .current-test-box {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px;
          border-radius: 9px;
          background: #f1f5f9;
        }

        .current-test-icon {
          width: 34px;
          height: 34px;
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #111827;
          color: white;
        }

        .current-test-info {
          min-width: 0;
        }

        .current-test-info > span {
          color: #64748b;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .current-test-info h4 {
          margin-top: 2px;
          color: #111827;
          font-size: 10px;
          font-weight: 900;
        }

        .current-test-info p {
          margin-top: 2px;
          color: #64748b;
          font-size: 8px;
          line-height: 1.4;
        }

        .test-result-box {
          margin-top: 8px;
          padding: 9px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
        }

        .test-result-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #16a34a;
        }

        .test-result-box > strong {
          display: block;
          max-height: 32px;
          margin-top: 6px;
          overflow: hidden;
          color: #111827;
          font-size: 10px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .test-progress-track {
          height: 5px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 20px;
          background: #e5e7eb;
        }

        .test-progress-fill {
          height: 100%;
          border-radius: 20px;
          background: #16a34a;
          transition: width .15s linear;
        }

        .test-progress-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          color: #9ca3af;
          font-size: 7px;
        }

        .test-progress-bottom strong {
          color: #111827;
        }

        .test-steps {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }

        .test-step {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 4px 5px;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 700;
          transition: .25s ease;
        }

        .test-step-active {
          border-color: #111827;
          background: #111827;
          color: white;
        }

        .test-step-done {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #16a34a;
        }

        .room-bottom-label {
          position: absolute;
          z-index: 20;
          bottom: 8px;
          left: 50%;
          display: flex;
          align-items: center;
          gap: 7px;
          transform: translateX(-50%);
          color: #475569;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .room-bottom-dot {
          width: 6px;
          height: 6px;
        }

        .stage-products {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .stage-product {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 7px;
        }

        .stage-product-right {
          justify-content: flex-end;
          text-align: right;
        }

        .stage-product-number {
          display: flex;
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #111827;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .stage-product p {
          color: #9ca3af;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .7px;
        }

        .stage-product strong {
          display: block;
          max-width: 125px;
          margin-top: 3px;
          overflow: hidden;
          color: #111827;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .stage-vs {
          color: #9ca3af;
          font-size: 10px;
          font-weight: 900;
        }

        .testing-disclaimer {
          margin-top: 8px;
          color: #9ca3af;
          font-size: 9px;
          line-height: 1.5;
          text-align: center;
        }

        @keyframes personBodyMove {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes headInspect {
          0%, 100% {
            transform: rotate(0deg);
          }
          35% {
            transform: rotate(7deg);
          }
          65% {
            transform: rotate(-5deg);
          }
        }

        @keyframes holdingArm {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes holdingArmRight {
          0%, 100% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }

        @keyframes phoneInspect {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          35% {
            transform: translateY(-5px) rotate(4deg);
          }
          70% {
            transform: translateY(2px) rotate(-2deg);
          }
        }

        @keyframes phoneInspectRight {
          0%, 100% {
            transform: translateY(0) rotate(5deg);
          }
          35% {
            transform: translateY(-5px) rotate(-4deg);
          }
          70% {
            transform: translateY(2px) rotate(2deg);
          }
        }

        @keyframes phoneGlare {
          0%, 25% {
            transform: translateX(-100%);
          }
          65%, 100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 520px) {
          .inspection-room {
            height: 390px;
          }

          .tester-character {
            transform: scale(.78);
            transform-origin: bottom left;
          }

          .tester-left {
            left: -12px;
          }

          .tester-right {
            right: -12px;
            transform-origin: bottom right;
          }

          .buyer-test-panel {
            top: 17px;
            width: 205px;
          }

          .room-bottom-label {
            bottom: 8px;
            font-size: 7px;
          }

          .stage-product strong {
            max-width: 90px;
          }
        }

        @media (max-width: 370px) {
          .tester-character {
            transform: scale(.65);
          }

          .tester-left {
            left: -22px;
          }

          .tester-right {
            right: -22px;
          }

          .buyer-test-panel {
            width: 190px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tester-character,
          .person-head,
          .person-arm-front,
          .held-mobile,
          .held-mobile-glare {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Compare
