
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

    if (compareMobiles.some(
      (item) => String(item._id) === String(mobile._id)
    )) {
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
      return typeof mobile.images[0] === 'string'
        ? mobile.images[0]
        : mobile.images[0]?.url
    }

    return (
      mobile.image ||
      mobile.imageUrl ||
      mobile.thumbnail ||
      ''
    )
  }

  // Format values
  const formatValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return 'Not available'
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')
    }

    return String(value)
  }

  // Specification rows
  const specificationRows = [
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Price', key: 'price', prefix: 'Rs. ' },
    { label: 'Category', key: 'category' },
    { label: 'Display', key: 'display' },
    { label: 'Screen Size', key: 'screenSize' },
    { label: 'Processor', key: 'processor' },
    { label: 'RAM', key: 'ram' },
    { label: 'Storage', key: 'storage' },
    { label: 'Rear Camera', key: 'rearCamera' },
    { label: 'Front Camera', key: 'frontCamera' },
    { label: 'Battery', key: 'battery' },
    { label: 'Operating System', key: 'operatingSystem' },
    { label: 'Network', key: 'network' },
    { label: 'Color', key: 'color' },
    { label: 'Description', key: 'description' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-[Arial] sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
            >
              <FiArrowLeft />
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-black sm:text-4xl">
              Compare Mobiles
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Compare specifications and find the right mobile for you.
            </p>
          </div>

          {compareMobiles.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600"
            >
              <FiTrash2 />
              Clear All
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Add Mobile */}
        {compareMobiles.length < 3 && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row">

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
              Select mobiles from the dropdown above to start comparing.
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
                  {compareMobiles.map((mobile) => {
                    const value = mobile[row.key]

                    return (
                      <div
                        key={`${mobile._id}-${row.key}`}
                        className="min-w-0 border-r border-gray-100 p-4 last:border-r-0"
                      >
                        <p className="mb-1 text-xs font-semibold text-gray-400 sm:hidden">
                          {row.label}
                        </p>

                        <p className="break-words text-center text-xs text-gray-700 sm:text-sm">
                          {row.prefix && value
                            ? `${row.prefix}${formatValue(value)}`
                            : formatValue(value)}
                        </p>
                      </div>
                    )
                  })}
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
    </div>
  )
}

export default Compare
