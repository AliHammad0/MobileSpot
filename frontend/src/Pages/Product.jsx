
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

  // Showroom
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showShowroom, setShowShowroom] = useState(false)
  const [showroomPhase, setShowroomPhase] = useState('instruction')

  const navigationTimer = useRef(null)
  const phaseTimer = useRef([])

  const openProduct = (productId) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  // User ke click kiye hue phone ko showroom mein select karna
  const handleViewDetails = (product) => {
    if (!product?._id || !product.inStock || showShowroom) return

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current)
    }

    phaseTimer.current.forEach(clearTimeout)
    phaseTimer.current = []

    setSelectedProduct(product)
    setShowroomPhase('instruction')
    setShowShowroom(true)

    // Boss instruction ke baad salesman phone pick karega
    phaseTimer.current.push(
      setTimeout(() => setShowroomPhase('picking'), 2600)
    )

    phaseTimer.current.push(
      setTimeout(() => setShowroomPhase('showing'), 4900)
    )

    // Animation complete hone ke baad selected product open
    navigationTimer.current = setTimeout(() => {
      navigate(`/product/${product._id}`)
    }, 7600)
  }

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current)
      }

      phaseTimer.current.forEach(clearTimeout)
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

  // Shelf par multiple phones. Selected phone hamesha include hoga.
  const shelfProducts = useMemo(() => {
    if (!selectedProduct) return []

    const otherProducts = products
      .filter((product) => product._id !== selectedProduct._id)
      .slice(0, 7)

    return [...otherProducts, selectedProduct]
  }, [products, selectedProduct])

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

  const activeFilters =
    (selectedBrand ? 1 : 0) +
    (selectedPrice ? 1 : 0) +
    (expressOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0)

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
        @keyframes showroomFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bossEnter {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes salesmanEnter {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bossPoint {
          0%, 35% { transform: rotate(-15deg); }
          55%, 100% { transform: rotate(-62deg); }
        }

        @keyframes salesmanReach {
          0%, 15% { transform: rotate(0deg); }
          45%, 75% { transform: rotate(-75deg); }
          100% { transform: rotate(-35deg); }
        }

        @keyframes selectedPhonePick {
          0%, 15% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          45% {
            transform: translate(35px, -85px) scale(1.12);
            opacity: 1;
          }
          75%, 100% {
            transform: translate(80px, -110px) scale(.65);
            opacity: 0;
          }
        }

        @keyframes heldPhoneAppear {
          0%, 45% {
            opacity: 0;
            transform: translateY(25px) scale(.5) rotate(-15deg);
          }
          70%, 100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }

        @keyframes speechIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shelfPhoneEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes showroomPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(173, 140, 91, 0); }
          50% { box-shadow: 0 0 0 5px rgba(173, 140, 91, .18); }
        }

        .showroom-screen {
          animation: showroomFade .4s ease both;
        }

        .showroom-boss {
          animation: bossEnter .9s cubic-bezier(.2,.8,.2,1) both;
        }

        .showroom-salesman {
          animation: salesmanEnter 1s cubic-bezier(.2,.8,.2,1) both;
        }

        .boss-arm {
          transform-origin: 8px 8px;
          animation: bossPoint 1.5s ease-in-out .8s both;
        }

        .salesman-arm {
          transform-origin: 8px 8px;
        }

        .showroom-screen.phase-picking .salesman-arm,
        .showroom-screen.phase-showing .salesman-arm {
          animation: salesmanReach 2.2s ease-in-out both;
        }

        .showroom-phone-card {
          animation: shelfPhoneEnter .65s ease both;
        }

        .selected-shelf-phone {
          position: relative;
          z-index: 10;
          animation: showroomPulse 1.5s ease-in-out infinite;
        }

        .phase-picking .selected-shelf-phone {
          animation: selectedPhonePick 2.2s cubic-bezier(.45,0,.2,1) both;
        }

        .held-phone {
          opacity: 0;
        }

        .phase-showing .held-phone {
          animation: heldPhoneAppear .8s ease-out both;
        }

        .showroom-bubble {
          animation: speechIn .45s ease both;
        }

        .showroom-person {
          position: relative;
          width: 125px;
          height: 225px;
        }

        .person-head {
          position: absolute;
          top: 12px;
          left: 39px;
          width: 49px;
          height: 49px;
          border-radius: 50%;
          background: #c98c64;
          border: 2px solid #a56f4e;
          z-index: 4;
        }

        .person-hair {
          position: absolute;
          top: 6px;
          left: 37px;
          width: 53px;
          height: 23px;
          border-radius: 25px 25px 5px 5px;
          background: #252323;
          z-index: 5;
        }

        .person-body {
          position: absolute;
          top: 59px;
          left: 23px;
          width: 82px;
          height: 91px;
          border-radius: 17px 17px 9px 9px;
          z-index: 2;
        }

        /* Premium owner clothing */
        .boss-jacket {
          background: linear-gradient(110deg, #171717, #38332e 50%, #171717);
          border: 1px solid #4b443a;
        }

        .boss-shirt {
          position: absolute;
          top: 61px;
          left: 51px;
          width: 27px;
          height: 68px;
          background: #f8f5ed;
          clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
          z-index: 3;
        }

        .boss-lapel {
          position: absolute;
          top: 61px;
          left: 43px;
          width: 23px;
          height: 48px;
          background: #26231f;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          z-index: 4;
        }

        .boss-lapel.right {
          left: 69px;
          transform: scaleX(-1);
        }

        .boss-tie {
          position: absolute;
          top: 65px;
          left: 61px;
          width: 10px;
          height: 43px;
          background: linear-gradient(#b99b69, #8d7048);
          clip-path: polygon(0 0, 100% 0, 85% 78%, 50% 100%, 15% 78%);
          z-index: 5;
        }

        .boss-pocket {
          position: absolute;
          top: 75px;
          left: 88px;
          width: 12px;
          height: 7px;
          background: #eee5d5;
          transform: skew(-15deg);
          z-index: 5;
        }

        .salesman-body {
          background: linear-gradient(120deg, #233c36, #496b5d);
          border: 1px solid #6a8276;
        }

        .person-leg {
          position: absolute;
          top: 143px;
          width: 26px;
          height: 68px;
          border-radius: 10px;
          background: #252525;
          z-index: 1;
        }

        .person-leg.left { left: 34px; }
        .person-leg.right { left: 68px; }

        .person-arm {
          position: absolute;
          top: 73px;
          left: 91px;
          width: 68px;
          height: 15px;
          border-radius: 20px;
          background: #c98c64;
          z-index: 6;
        }

        .boss-arm {
          background: #c98c64;
        }

        .held-phone {
          position: absolute;
          top: 70px;
          left: 100px;
          z-index: 8;
          width: 44px;
          height: 78px;
          padding: 3px;
          border: 3px solid #252525;
          border-radius: 9px;
          background: #111;
          transform-origin: bottom left;
        }

        .held-phone img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: contain;
          background: white;
        }

        .shelf-phone {
          transition: transform .3s ease, border-color .3s ease;
        }

        .shelf-phone:hover {
          transform: translateY(-5px);
        }

        @media (max-width: 640px) {
          .showroom-person {
            transform: scale(.72);
            transform-origin: bottom center;
            margin-left: -12px;
            margin-right: -12px;
          }

          .phase-picking .selected-shelf-phone {
            animation-name: selectedPhonePickMobile;
          }

          .showroom-scene {
            min-height: 390px;
          }
        }

        @keyframes selectedPhonePickMobile {
          0%, 15% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          45% {
            transform: translate(10px, -70px) scale(1.1);
            opacity: 1;
          }
          75%, 100% {
            transform: translate(30px, -90px) scale(.6);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showroom-screen *,
          .showroom-screen *::before,
          .showroom-screen *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* SHOWROOM ANIMATION */}
      {showShowroom && selectedProduct && (
        <div
          className={`showroom-screen phase-${showroomPhase} fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-[#eeeae1] px-3 py-5`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#e9e3d7] via-[#faf9f6] to-[#ded5c6]" />

          <div className="relative z-10 my-auto w-full max-w-6xl">

            {/* Showroom Header */}
            <div className="mb-5 text-center">
              <p className="text-[10px] font-bold tracking-[5px] text-[#947b59]">
                MOBILESPOT PREMIUM STORE
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome to Our Showroom
              </h2>

              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                Our team is preparing your selected smartphone.
              </p>
            </div>

            {/* Conversation */}
            <div className="mb-4 flex min-h-[75px] items-center justify-center">
              {showroomPhase === 'instruction' && (
                <div className="showroom-bubble rounded-2xl border border-[#e6ddce] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Salesman! Bring me this phone.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedProduct.name} — the customer has selected it.
                  </p>
                </div>
              )}

              {showroomPhase === 'picking' && (
                <div className="showroom-bubble rounded-2xl border border-[#e6ddce] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Certainly, Sir! I'm picking the selected phone.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Salesman is taking {selectedProduct.name} from the shelf.
                  </p>
                </div>
              )}

              {showroomPhase === 'showing' && (
                <div className="showroom-bubble rounded-2xl border border-[#e6ddce] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Here it is! Your selected smartphone.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    The salesman is presenting it to the customer.
                  </p>
                </div>
              )}
            </div>

            {/* Main Scene */}
            <div className="showroom-scene relative flex min-h-[355px] items-end justify-between overflow-hidden rounded-3xl border border-white/80 bg-white/65 px-1 pt-6 shadow-xl sm:min-h-[390px] sm:px-5">

              {/* Boss */}
              <div className="showroom-boss relative z-20 flex shrink-0 flex-col items-center">
                <div className="showroom-person">

                  <div className="person-head" />
                  <div className="person-hair" />

                  <div className="absolute left-[49px] top-[32px] z-10 flex gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  </div>

                  <div className="person-body boss-jacket" />
                  <div className="boss-shirt" />
                  <div className="boss-lapel" />
                  <div className="boss-lapel right" />
                  <div className="boss-tie" />
                  <div className="boss-pocket" />

                  <div className="boss-arm person-arm" />

                  <div className="person-leg left" />
                  <div className="person-leg right" />
                </div>

                <span className="mt-[-5px] rounded-full bg-[#171717] px-4 py-1.5 text-[10px] font-bold tracking-widest text-white">
                  OWNER
                </span>
                <span className="mt-1 text-[9px] font-semibold text-gray-500">
                  STORE MANAGER
                </span>
              </div>

              {/* Phone Shelf */}
              <div className="relative z-10 flex min-w-0 flex-1 flex-col items-center justify-end pb-5">

                <div className="mb-3 text-center">
                  <p className="text-[10px] font-bold tracking-[3px] text-[#8e7859]">
                    SMARTPHONE COLLECTION
                  </p>
                  <p className="mt-1 text-[9px] text-gray-500">
                    Select phone is highlighted
                  </p>
                </div>

                {/* Multiple database phones */}
                <div className="grid w-full max-w-[540px] grid-cols-4 gap-2 rounded-t-xl border-x-4 border-t-4 border-[#a99372] bg-[#e7dfd1] p-3 sm:gap-4 sm:p-4">

                  {shelfProducts.map((phone, index) => {
                    const isSelected = phone._id === selectedProduct._id

                    return (
                      <div
                        key={phone._id}
                        className={`showroom-phone-card shelf-phone relative flex min-h-[105px] flex-col items-center justify-center rounded-lg border bg-white p-1.5 shadow-sm sm:min-h-[125px] sm:p-2 ${
                          isSelected
                            ? 'selected-shelf-phone border-[#a17c47] ring-2 ring-[#b99a6b]/40'
                            : 'border-[#e5e0d7]'
                        }`}
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        {isSelected && (
                          <span className="absolute -top-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#9b794a] px-2 py-1 text-[7px] font-bold text-white sm:text-[8px]">
                            SELECTED
                          </span>
                        )}

                        {phone.image ? (
                          <img
                            src={phone.image}
                            alt={phone.name}
                            className="h-[65px] w-full object-contain sm:h-[80px]"
                          />
                        ) : (
                          <FiSmartphone className="text-3xl text-gray-400" />
                        )}

                        <p className="mt-1 line-clamp-1 w-full text-center text-[8px] font-bold text-gray-700 sm:text-[9px]">
                          {phone.name}
                        </p>

                        <p className="text-[8px] text-gray-500">
                          {formatPrice(phone.price)}
                        </p>
                      </div>
                    )
                  })}

                </div>

                {/* Shelf edge */}
                <div className="h-4 w-full max-w-[570px] rounded-sm bg-gradient-to-b from-[#b8a17e] to-[#8f7757] shadow-lg" />

                {/* Shelf base */}
                <div className="h-7 w-[88%] max-w-[510px] rounded-b-lg bg-[#d1c1a7] shadow-md" />

                <p className="mt-2 text-[8px] font-bold tracking-[3px] text-gray-500">
                  MOBILESPOT COLLECTION
                </p>
              </div>

              {/* Salesman */}
              <div className="showroom-salesman relative z-20 flex shrink-0 flex-col items-center">
                <div className="showroom-person">

                  <div className="person-head" />
                  <div className="person-hair" />

                  <div className="absolute left-[49px] top-[32px] z-10 flex gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  </div>

                  <div className="person-body salesman-body" />

                  <div className="absolute left-[53px] top-[60px] z-[4] h-5 w-5 rotate-45 border-b-2 border-white" />

                  <div className="salesman-arm person-arm" />

                  {/* Selected phone in salesman's hand */}
                  {selectedProduct.image && (
                    <div className="held-phone">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                      />
                    </div>
                  )}

                  <div className="person-leg left" />
                  <div className="person-leg right" />
                </div>

                <span className="mt-[-5px] rounded-full bg-[#365b4c] px-4 py-1.5 text-[10px] font-bold tracking-widest text-white">
                  SALESMAN
                </span>
                <span className="mt-1 text-[9px] font-semibold text-gray-500">
                  CUSTOMER SERVICE
                </span>
              </div>
            </div>

            {/* Selected Phone Information */}
            <div className="mx-auto mt-4 flex max-w-lg items-center gap-4 rounded-2xl border border-[#e6ddce] bg-white/90 p-3 shadow-sm sm:p-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f3f0e9] p-2">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FiSmartphone className="text-3xl text-gray-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold tracking-widest text-gray-400">
                  {showroomPhase === 'instruction'
                    ? 'CUSTOMER REQUEST'
                    : showroomPhase === 'picking'
                      ? 'PICKING YOUR PHONE'
                      : 'PHONE READY TO SHOW'}
                </p>

                <h3 className="mt-1 truncate text-sm font-bold text-gray-900">
                  {selectedProduct.name}
                </h3>

                <p className="mt-1 text-sm font-bold text-[#8c7048]">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span className={`inline-block rounded-full px-2 py-1 text-[8px] font-bold ${
                  showroomPhase === 'showing'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[#f3eee5] text-[#94774d]'
                }`}>
                  {showroomPhase === 'showing' ? 'READY' : 'PROCESSING'}
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[9px] font-bold tracking-[4px] text-gray-500">
              MOBILESPOT — PREMIUM SMARTPHONE STORE
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
                        className="mt-auto w-full rounded-xl bg-[#171717] py-3 text-xs font-bold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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
