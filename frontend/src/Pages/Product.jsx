
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

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showShowroom, setShowShowroom] = useState(false)
  const [showroomPhase, setShowroomPhase] = useState('instruction')

  const navigationTimer = useRef(null)
  const phaseTimers = useRef([])
  const navigationStarted = useRef(false)

  // Image aur title par direct details page open hoga.
  const openProduct = (productId) => {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  // Animation sirf View Details button se start hogi.
  const handleViewDetails = (product) => {
    if (
      !product?._id ||
      !product.inStock ||
      showShowroom ||
      navigationStarted.current
    ) return

    navigationStarted.current = true

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current)
    }

    phaseTimers.current.forEach(clearTimeout)
    phaseTimers.current = []

    setSelectedProduct(product)
    setShowroomPhase('instruction')
    setShowShowroom(true)

    phaseTimers.current.push(
      setTimeout(() => setShowroomPhase('picking'), 2600)
    )

    phaseTimers.current.push(
      setTimeout(() => setShowroomPhase('showing'), 5000)
    )

    navigationTimer.current = setTimeout(() => {
      navigate(`/product/${product._id}`)
    }, 7800)
  }

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current)
      }

      phaseTimers.current.forEach(clearTimeout)
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

  // Showroom mein database ke actual phone products use honge.
  // Selected phone hamesha first box hoga.
  const shelfProducts = useMemo(() => {
    if (!selectedProduct) return []

    const availableProducts = [
      selectedProduct,
      ...products.filter(
        (item) =>
          item._id !== selectedProduct._id &&
          item.inStock
      )
    ]

    if (!availableProducts.length) return []

    // Kam products hon tab bhi shelves par multiple sealed boxes.
    return Array.from(
      { length: Math.min(12, Math.max(8, availableProducts.length)) },
      (_, index) => availableProducts[index % availableProducts.length]
    )
  }, [products, selectedProduct])

  const brands = useMemo(() => {
    return [...new Set(
      products.map((product) => product.brand).filter(Boolean)
    )].sort()
  }, [products])

  // Filter and Sort
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
  }

  return (
    <section className="min-h-screen bg-[#f7f6f2] px-4 py-8 font-[Arial,sans-serif] sm:px-6 lg:px-10">

      <style>{`
        @keyframes sceneFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ownerEnter {
          from { opacity: 0; transform: translateX(-70px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes salesmanEnter {
          from { opacity: 0; transform: translateX(70px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes boxAppear {
          from { opacity: 0; transform: translateY(15px) scale(.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes boxPick {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          35% { transform: translate(25px, -35px) scale(1.08); opacity: 1; }
          75% { transform: translate(95px, 90px) scale(.78); opacity: 1; }
          100% { transform: translate(120px, 100px) scale(.72); opacity: 0; }
        }

        @keyframes salesmanReach {
          0%, 15% { transform: rotate(0deg); }
          45%, 75% { transform: rotate(-65deg); }
          100% { transform: rotate(-30deg); }
        }

        @keyframes packageShow {
          from { opacity: 0; transform: translateY(30px) scale(.65) rotate(-8deg); }
          to { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
        }

        @keyframes ownerPoint {
          0%, 30% { transform: rotate(-10deg); }
          60%, 100% { transform: rotate(-55deg); }
        }

        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px) scale(.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .showroom-screen {
          animation: sceneFade .4s ease both;
        }

        .owner-character {
          animation: ownerEnter .8s ease both;
        }

        .salesman-character {
          animation: salesmanEnter .8s ease both;
        }

        .owner-pointing-arm {
          transform-origin: 8px 8px;
          animation: ownerPoint 1.5s ease-in-out .6s both;
        }

        .salesman-reaching-arm {
          transform-origin: 8px 8px;
        }

        .phase-picking .salesman-reaching-arm,
        .phase-showing .salesman-reaching-arm {
          animation: salesmanReach 2s ease-in-out both;
        }

        .phone-box {
          position: relative;
          min-width: 0;
          height: 118px;
          padding: 7px;
          border-radius: 5px;
          border: 1px solid #c8b99f;
          background: linear-gradient(145deg, #fffefa, #e9e2d5);
          box-shadow:
            2px 3px 5px rgba(0,0,0,.13),
            inset 0 0 0 3px rgba(255,255,255,.6);
          animation: boxAppear .55s ease both;
        }

        .phone-box::before {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(150,125,85,.25);
          border-radius: 3px;
          pointer-events: none;
        }

        .phone-box-side {
          position: absolute;
          top: 3px;
          right: -5px;
          width: 5px;
          height: calc(100% - 6px);
          background: linear-gradient(90deg, #b5a17e, #887454);
          transform: skewY(-4deg);
          border-radius: 0 2px 2px 0;
        }

        .phone-box-top {
          position: absolute;
          top: -4px;
          left: 3px;
          right: 2px;
          height: 5px;
          background: #d8c9ae;
          transform: skewX(-25deg);
        }

        .phone-box-image {
          width: 100%;
          height: 67px;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .selected-box {
          z-index: 20;
          border: 2px solid #b58a4f;
          box-shadow: 0 0 0 3px rgba(181,138,79,.2), 3px 5px 12px rgba(0,0,0,.18);
        }

        .phase-picking .selected-box {
          animation: boxPick 2.4s cubic-bezier(.45,0,.2,1) forwards !important;
        }

        .picked-package {
          opacity: 0;
        }

        .phase-showing .picked-package {
          animation: packageShow .7s ease-out .1s forwards;
        }

        .showroom-bubble {
          animation: bubbleIn .4s ease both;
        }

        .shop-person {
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
          z-index: 5;
        }

        .person-hair {
          position: absolute;
          top: 6px;
          left: 37px;
          width: 53px;
          height: 23px;
          border-radius: 25px 25px 5px 5px;
          background: #252323;
          z-index: 6;
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

        .owner-suit {
          background: linear-gradient(110deg, #171717, #37322c 50%, #171717);
          border: 1px solid #554b3d;
        }

        .owner-shirt {
          position: absolute;
          top: 61px;
          left: 51px;
          width: 27px;
          height: 68px;
          background: #f8f5ed;
          clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
          z-index: 3;
        }

        .owner-lapel {
          position: absolute;
          top: 61px;
          left: 43px;
          width: 23px;
          height: 48px;
          background: #26231f;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          z-index: 4;
        }

        .owner-lapel.right {
          left: 69px;
          transform: scaleX(-1);
        }

        .owner-tie {
          position: absolute;
          top: 65px;
          left: 61px;
          width: 10px;
          height: 43px;
          background: linear-gradient(#c7a36c, #8b6d42);
          clip-path: polygon(0 0, 100% 0, 85% 78%, 50% 100%, 15% 78%);
          z-index: 5;
        }

        .owner-pocket-square {
          position: absolute;
          top: 75px;
          left: 88px;
          width: 12px;
          height: 7px;
          background: #eee5d5;
          transform: skew(-15deg);
          z-index: 5;
        }

        .salesman-shirt {
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
          z-index: 7;
        }

        .picked-package {
          position: absolute;
          top: 75px;
          left: 100px;
          z-index: 10;
          width: 43px;
          height: 77px;
          padding: 3px;
          border: 2px solid #b39b76;
          border-radius: 4px;
          background: linear-gradient(145deg, #fffefa, #e7dfd1);
          box-shadow: 2px 4px 8px rgba(0,0,0,.2);
        }

        .picked-package img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        /* Mobile: complete showroom fits inside one screen */
        @media (max-width: 640px) {
          .showroom-screen {
            height: 100vh;
            height: 100dvh;
            min-height: 0;
            overflow: hidden !important;
            padding: 7px !important;
            align-items: stretch;
          }

          .showroom-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
            min-height: 0;
            margin: 0;
            gap: 5px;
          }

          .showroom-header {
            flex: 0 0 auto;
            margin: 0 !important;
            padding-top: 2px;
          }

          .showroom-header .brand-label {
            font-size: 8px;
            letter-spacing: 3px;
          }

          .showroom-header h2 {
            margin-top: 2px;
            font-size: 16px;
            line-height: 20px;
          }

          .showroom-header .header-description {
            display: none;
          }

          .showroom-dialogue {
            flex: 0 0 47px;
            min-height: 47px !important;
            margin: 0 !important;
          }

          .showroom-dialogue > div {
            width: 100%;
            padding: 6px 9px;
            border-radius: 10px;
          }

          .showroom-dialogue p:first-child {
            font-size: 10px;
            line-height: 13px;
          }

          .showroom-dialogue p:nth-child(2) {
            margin-top: 2px;
            font-size: 9px;
            line-height: 12px;
          }

          .showroom-store {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            min-height: 0;
            overflow: hidden;
            border-radius: 15px;
          }

          .showroom-back-wall {
            flex: 0 0 auto;
            padding: 8px 7px 9px !important;
            border-bottom-width: 5px !important;
          }

          .showroom-rack-heading {
            margin-bottom: 7px !important;
            gap: 6px;
          }

          .showroom-rack-heading h3 {
            font-size: 9px;
            letter-spacing: 1.5px;
            white-space: nowrap;
          }

          .showroom-rack {
            padding: 7px !important;
            border-width: 5px !important;
          }

          .showroom-rack-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 7px 6px !important;
          }

          .showroom-rack-grid > div {
            min-width: 0;
            padding: 5px 2px 5px !important;
            border-bottom-width: 3px !important;
          }

          .phone-box {
            height: 76px;
            padding: 4px;
            border-radius: 4px;
          }

          .phone-box::before {
            inset: 3px;
          }

          .phone-box-image {
            height: 39px;
          }

          .phone-box-top {
            top: -3px;
            height: 4px;
          }

          .phone-box-side {
            right: -4px;
            width: 4px;
          }

          .phone-box .box-brand {
            margin-bottom: 1px;
            font-size: 6px;
            line-height: 8px;
          }

          .phone-box .box-model {
            margin-top: 1px;
            font-size: 6px;
            line-height: 8px;
          }

          .phone-box .sealed-label {
            display: none;
          }

          .selected-box {
            border-width: 2px;
            box-shadow: 0 0 0 2px rgba(181,138,79,.25);
          }

          .selected-box .selected-label {
            top: -10px;
            padding: 2px 4px;
            font-size: 5px;
            letter-spacing: 0;
          }

          .rack-cabinet {
            height: 17px !important;
            margin-top: 1px !important;
            border-top-width: 2px !important;
          }

          .rack-cabinet span {
            font-size: 6px;
            letter-spacing: 2px;
          }

          .showroom-floor {
            flex: 1 1 auto;
            min-height: 0 !important;
            padding: 4px 2px 0 !important;
            align-items: flex-end;
          }

          .staff-member {
            flex: 0 0 54px;
            min-width: 54px;
            overflow: visible;
          }

          .shop-person {
            width: 66px;
            height: 118px;
            transform: scale(.52);
            transform-origin: bottom center;
            margin: 0 -30px;
          }

          .staff-name {
            margin-top: -1px !important;
            padding: 3px 6px !important;
            font-size: 7px !important;
            letter-spacing: 1px !important;
            white-space: nowrap;
          }

          .staff-role {
            margin-top: 2px !important;
            font-size: 6px !important;
            line-height: 8px;
            white-space: nowrap;
          }

          .showroom-counter {
            min-width: 0;
            flex: 1 1 auto;
            margin: 0 3px 5px !important;
          }

          .counter-display {
            height: 65px !important;
            border-width: 2px !important;
            border-radius: 8px 8px 0 0 !important;
          }

          .counter-display .picked-package {
            top: 7px;
            left: 50%;
            width: 34px;
            height: 52px;
            transform: translateX(-50%);
          }

          .counter-display .counter-ready {
            position: absolute;
            right: 3px;
            bottom: 3px;
            left: 3px;
            padding: 2px;
            border-radius: 4px;
            background: rgba(255,255,255,.9);
            font-size: 6px;
            line-height: 8px;
          }

          .counter-top {
            height: 7px !important;
            border-top-width: 1px !important;
          }

          .counter-base {
            height: 22px !important;
            border-left-width: 2px !important;
            border-right-width: 2px !important;
          }

          .counter-caption {
            margin-top: 3px !important;
            font-size: 5px !important;
            letter-spacing: 1px !important;
            white-space: nowrap;
          }

          .showroom-product-info {
            flex: 0 0 auto;
            margin: 0 !important;
            gap: 8px !important;
            padding: 7px !important;
            border-radius: 10px !important;
          }

          .showroom-product-image {
            width: 39px !important;
            height: 42px !important;
            padding: 3px !important;
          }

          .showroom-product-info .product-status {
            font-size: 7px;
            line-height: 9px;
          }

          .showroom-product-info h3 {
            margin-top: 2px;
            font-size: 10px;
            line-height: 13px;
          }

          .showroom-product-info .product-price {
            margin-top: 1px;
            font-size: 10px;
            line-height: 12px;
          }

          .showroom-product-info .processing-label {
            padding: 4px 5px;
            font-size: 6px;
          }

          .showroom-footer {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .showroom-header h2 {
            font-size: 14px;
          }

          .showroom-dialogue {
            flex-basis: 43px;
            min-height: 43px !important;
          }

          .phone-box {
            height: 68px;
          }

          .phone-box-image {
            height: 34px;
          }

          .staff-member {
            flex-basis: 47px;
            min-width: 47px;
          }

          .shop-person {
            transform: scale(.46);
          }

          .counter-display {
            height: 56px !important;
          }

          .counter-display .picked-package {
            height: 44px;
            width: 29px;
          }
        }

        @keyframes boxPickMobile {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          35% { transform: translate(8px,-18px) scale(1.05); opacity: 1; }
          75%,100% { transform: translate(20px,45px) scale(.7); opacity: 0; }
        }

        @media (max-width: 640px) {
          .phase-picking .selected-box {
            animation: boxPickMobile 2.4s cubic-bezier(.45,0,.2,1) forwards !important;
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

      {/* PREMIUM MOBILE SHOWROOM */}
      {showShowroom && selectedProduct && (
        <div className={`showroom-screen phase-${showroomPhase} fixed inset-0 z-[500] flex items-center justify-center overflow-hidden bg-[#e8e3d9] px-3 py-5`}>

          <div className="absolute inset-0 bg-gradient-to-b from-[#e5dfd3] via-[#f8f6f1] to-[#d8cbb7]" />

          <div className="showroom-content relative z-10 my-auto w-full max-w-6xl">

            {/* Shop Header */}
            <div className="showroom-header mb-5 text-center">
              <p className="brand-label text-[10px] font-bold tracking-[5px] text-[#96764b]">
                MOBILESPOT
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#211e19] sm:text-3xl">
                Premium Smartphone Store
              </h2>

              <p className="header-description mt-2 text-xs text-gray-500">
                Personal assistance from our showroom team
              </p>
            </div>

            {/* Dialogue */}
            <div className="showroom-dialogue mb-4 flex min-h-[68px] items-center justify-center">
              {showroomPhase === 'instruction' && (
                <div className="showroom-bubble rounded-2xl border border-[#e2d7c5] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Salesman, please bring this sealed box.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedProduct.name}
                  </p>
                </div>
              )}

              {showroomPhase === 'picking' && (
                <div className="showroom-bubble rounded-2xl border border-[#e2d7c5] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Certainly, Sir. I'm getting the requested model.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Salesman is taking the selected box from the rack.
                  </p>
                </div>
              )}

              {showroomPhase === 'showing' && (
                <div className="showroom-bubble rounded-2xl border border-[#e2d7c5] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Here is your requested smartphone.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    The selected sealed box is ready for the customer.
                  </p>
                </div>
              )}
            </div>

            {/* Store Interior */}
            <div className="showroom-store relative overflow-hidden rounded-3xl border border-white/80 bg-[#f4efe5] shadow-2xl">

              {/* Back wall */}
              <div className="showroom-back-wall relative border-b-[8px] border-[#9b7950] bg-gradient-to-b from-[#ddd0b9] to-[#eee5d5] px-3 pb-5 pt-5 sm:px-6">

                <div className="showroom-rack-heading mb-4 flex items-center justify-center gap-3">
                  <span className="h-px flex-1 bg-[#b49a73]" />
                  <h3 className="text-xs font-bold tracking-[3px] text-[#59452e] sm:text-sm">
                    SMARTPHONE COLLECTION
                  </h3>
                  <span className="h-px flex-1 bg-[#b49a73]" />
                </div>

                {/* Retail display rack */}
                <div className="showroom-rack relative rounded-lg border-[9px] border-[#765638] bg-[#a8875d] p-2 shadow-[inset_0_0_18px_rgba(0,0,0,.3)] sm:p-4">

                  <div className="absolute left-2 right-2 top-0 h-1 bg-[#fff1c9] shadow-[0_0_12px_4px_rgba(255,228,165,.8)]" />

                  <div className="showroom-rack-grid grid grid-cols-4 gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-4">

                    {shelfProducts.map((phone, index) => {
                      const isSelected = index === 0

                      return (
                        <div
                          key={`${phone._id}-${index}`}
                          className={`relative flex items-end justify-center border-b-[5px] border-[#d3bc96] bg-gradient-to-b from-[#d4c0a0] to-[#b99b70] px-1 pb-2 pt-3 ${
                            isSelected ? 'z-20' : ''
                          }`}
                        >
                          <div
                            className={`phone-box w-full max-w-[105px] ${
                              isSelected ? 'selected-box' : ''
                            }`}
                            style={{ animationDelay: `${index * 70}ms` }}
                          >
                            <div className="phone-box-top" />
                            <div className="phone-box-side" />

                            <div className="relative z-[1] flex h-full flex-col items-center justify-center">

                              <p className="box-brand mb-1 max-w-full truncate text-[7px] font-black uppercase tracking-wider text-[#756044] sm:text-[9px]">
                                {phone.brand || 'SMARTPHONE'}
                              </p>

                              {phone.image ? (
                                <img
                                  src={phone.image}
                                  alt={phone.name}
                                  className="phone-box-image"
                                />
                              ) : (
                                <FiSmartphone className="my-2 text-3xl text-[#8d7859]" />
                              )}

                              <p className="box-model mt-1 line-clamp-1 w-full text-center text-[7px] font-bold text-[#3b3023] sm:text-[9px]">
                                {phone.name}
                              </p>

                              <span className="sealed-label mt-1 rounded-sm bg-[#e6dcc9] px-1.5 py-0.5 text-[6px] font-bold tracking-wider text-[#796343] sm:text-[7px]">
                                SEALED PACK
                              </span>
                            </div>

                            {isSelected && (
                              <span className="selected-label absolute -top-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#8b673d] px-2 py-1 text-[7px] font-bold tracking-wider text-white sm:text-[8px]">
                                CUSTOMER'S CHOICE
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}

                  </div>

                  <div className="rack-cabinet mt-1 flex h-7 items-center justify-center border-t-4 border-[#d6bd94] bg-gradient-to-b from-[#9a744b] to-[#64472e]">
                    <span className="text-[8px] font-bold tracking-[4px] text-[#f0dfbd]">
                      MOBILESPOT SHOWCASE
                    </span>
                  </div>
                </div>
              </div>

              {/* Foreground counter and staff */}
              <div className="showroom-floor relative flex min-h-[235px] items-end justify-between overflow-hidden bg-gradient-to-b from-[#e8dfd0] to-[#cbb99e] px-1 pt-4 sm:min-h-[260px] sm:px-6">

                {/* Owner */}
                <div className="owner-character staff-member relative z-20 flex shrink-0 flex-col items-center">
                  <div className="shop-person">
                    <div className="person-head" />
                    <div className="person-hair" />

                    <div className="absolute left-[49px] top-[32px] z-10 flex gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    </div>

                    <div className="person-body owner-suit" />
                    <div className="owner-shirt" />
                    <div className="owner-lapel" />
                    <div className="owner-lapel right" />
                    <div className="owner-tie" />
                    <div className="owner-pocket-square" />

                    <div className="owner-pointing-arm person-arm" />

                    <div className="person-leg left" />
                    <div className="person-leg right" />
                  </div>

                  <span className="staff-name mt-[-5px] rounded-full bg-[#171717] px-4 py-1.5 text-[9px] font-bold tracking-widest text-white">
                    OWNER
                  </span>
                  <span className="staff-role mt-1 text-[8px] font-semibold text-[#665640]">
                    STORE MANAGER
                  </span>
                </div>

                {/* Display counter */}
                <div className="showroom-counter relative mx-1 mb-4 flex min-w-0 flex-1 flex-col items-center sm:mx-5">

                  <div className="counter-display relative flex h-[95px] w-full max-w-[330px] items-center justify-center rounded-t-xl border-x-4 border-t-4 border-white/80 bg-white/30 shadow-inner">

                    {selectedProduct.image && (
                      <div className="picked-package">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                        />
                      </div>
                    )}

                    {showroomPhase === 'showing' && (
                      <div className="counter-ready showroom-bubble text-center">
                        <p className="text-[9px] font-bold tracking-widest text-[#80613a]">
                          READY FOR CUSTOMER
                        </p>
                        <p className="mt-1 max-w-[130px] text-[10px] font-bold text-gray-800">
                          {selectedProduct.name}
                        </p>
                      </div>
                    )}

                    {showroomPhase !== 'showing' && (
                      <p className="text-[9px] font-bold tracking-[2px] text-[#8b7657]">
                        PRESENTATION COUNTER
                      </p>
                    )}
                  </div>

                  <div className="counter-top h-3 w-full max-w-[355px] rounded-sm border-t border-white/70 bg-gradient-to-b from-[#f7f2e9] to-[#a88d68] shadow-lg" />

                  <div className="counter-base h-12 w-[90%] max-w-[320px] border-x-4 border-[#a78962] bg-gradient-to-b from-[#9a7953] to-[#60462e] shadow-md" />

                  <span className="counter-caption mt-2 text-[7px] font-bold tracking-[3px] text-[#6e593d]">
                    CUSTOMER SERVICE COUNTER
                  </span>
                </div>

                {/* Salesman */}
                <div className="salesman-character staff-member relative z-20 flex shrink-0 flex-col items-center">
                  <div className="shop-person">
                    <div className="person-head" />
                    <div className="person-hair" />

                    <div className="absolute left-[49px] top-[32px] z-10 flex gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    </div>

                    <div className="person-body salesman-shirt" />

                    <div className="absolute left-[53px] top-[60px] z-[4] h-5 w-5 rotate-45 border-b-2 border-white" />

                    <div className="salesman-reaching-arm person-arm" />

                    <div className="person-leg left" />
                    <div className="person-leg right" />
                  </div>

                  <span className="staff-name mt-[-5px] rounded-full bg-[#365b4c] px-4 py-1.5 text-[9px] font-bold tracking-widest text-white">
                    SALESMAN
                  </span>
                  <span className="staff-role mt-1 text-[8px] font-semibold text-[#665640]">
                    CUSTOMER SERVICE
                  </span>
                </div>
              </div>
            </div>

            {/* Selected product info */}
            <div className="showroom-product-info mx-auto mt-4 flex max-w-lg items-center gap-4 rounded-2xl border border-[#e2d7c5] bg-white/95 p-3 shadow-lg sm:p-4">

              <div className="showroom-product-image flex h-16 w-14 shrink-0 items-center justify-center rounded-md border border-[#d9c9ad] bg-[#f4efe5] p-1">
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
                <p className="product-status text-[9px] font-bold tracking-widest text-gray-400">
                  {showroomPhase === 'instruction'
                    ? 'CUSTOMER REQUEST'
                    : showroomPhase === 'picking'
                      ? 'RETRIEVING SEALED BOX'
                      : 'READY FOR PRESENTATION'}
                </p>

                <h3 className="mt-1 truncate text-sm font-bold text-gray-900">
                  {selectedProduct.name}
                </h3>

                <p className="product-price mt-1 text-sm font-bold text-[#8c7048]">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>

              <span className="processing-label shrink-0 rounded-full bg-[#f1e9dc] px-2 py-1 text-[8px] font-bold text-[#82633c]">
                {showroomPhase === 'showing' ? 'READY' : 'PROCESSING'}
              </span>
            </div>

            <p className="showroom-footer mt-4 text-center text-[9px] font-bold tracking-[4px] text-[#806d50]">
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

        {/* Search */}
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

        {/* Filters */}
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

          {/* Active Filter Tags */}
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

                    {/* Product Image: direct navigation */}
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

                      {/* Title: direct navigation, no showroom animation */}
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

                      {/* Only this button starts showroom animation */}
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
