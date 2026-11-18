
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'

import {
  FiStar,
  FiShoppingCart,
  FiShare2,
  FiShield,
  FiGift,
  FiCheck,
  FiSmartphone,
  FiHeart,
  FiMessageCircle,
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'
const REVIEWS_API_URL = 'https://mobilespot-backend.vercel.app/api/v1/reviews'

const tabs = ['Specifications', 'Installment Plans', 'Reviews', 'FAQs']

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [similarMobiles, setSimilarMobiles] = useState([])

  const [loading, setLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [giftWrap, setGiftWrap] = useState(false)
  const [extraWarranty, setExtraWarranty] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('Specifications')
  const [showCoverage, setShowCoverage] = useState(false)
  const [compare, setCompare] = useState(false)
  const [shared, setShared] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [flyToCart, setFlyToCart] = useState(false)
  const [imageZoomed, setImageZoomed] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState('')
  const [reviewsAverage, setReviewsAverage] = useState(0)
  const [reviewsTotal, setReviewsTotal] = useState(0)

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/${id}`)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Product not found')
        }

        setProduct(data.product)
        setSelectedColor(data.product.colors?.[0] || '')

        setSelectedStorage(
          `${data.product.specifications?.storage || '256GB'} - ${data.product.specifications?.ram || '8GB'} RAM`
        )

        setActiveImage(0)
      } catch (error) {
        setError(error.message || 'Unable to load product')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    } else {
      setError('Product ID is missing')
      setLoading(false)
    }
  }, [id])

  // Fetch Product Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return

      try {
        setReviewsLoading(true)
        setReviewsError('')

        const response = await fetch(`${REVIEWS_API_URL}/${id}`)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to load product reviews.')
        }

        setReviews(data.reviews || [])
        setReviewsAverage(Number(data.averageRating || 0))
        setReviewsTotal(Number(data.totalReviews || 0))
      } catch (error) {
        setReviewsError(error.message || 'Unable to load product reviews.')
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  // Fetch Similar Mobiles
  useEffect(() => {
    const fetchSimilarMobiles = async () => {
      if (!product?.brand || !product?._id) {
        setSimilarMobiles([])
        return
      }

      try {
        setSimilarLoading(true)

        const response = await fetch(API_URL)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to load similar mobiles')
        }

        const allProducts = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.data?.products)
              ? data.data.products
              : Array.isArray(data)
                ? data
                : []

        const currentBrand = String(product.brand).trim().toLowerCase()

        const filteredProducts = allProducts
          .filter((mobile) => {
            const mobileBrand = String(mobile.brand || '')
              .trim()
              .toLowerCase()

            return (
              mobileBrand === currentBrand &&
              String(mobile._id) !== String(product._id)
            )
          })
          .slice(0, 4)

        setSimilarMobiles(filteredProducts)
      } catch (error) {
        console.error('Similar mobiles error:', error)
        setSimilarMobiles([])
      } finally {
        setSimilarLoading(false)
      }
    }

    fetchSimilarMobiles()
  }, [product?._id, product?.brand])

  // Scroll Reveal
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll')

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [loading, product, similarMobiles.length])

  // Product Colors
  const colors = product?.colors?.length
    ? product.colors.map((name, index) => ({
        name,
        color: ['#242424', '#9bbddc', '#a7a7a2', '#df884b'][index % 4],
      }))
    : []

  // Product Storage
  const storage = product
    ? [
        `${product.specifications?.storage || '256GB'} - ${product.specifications?.ram || '8GB'} RAM`,
      ]
    : []

  // Product Images
  const images = product?.images || []

  // Total Price
  const totalPrice =
    Number(product?.price || 0) +
    (giftWrap ? 199 : 0) +
    (extraWarranty ? 1199 : 0)

  // Add To Cart
  const handleAddToCart = () => {
    if (!product) return
    if (Number(product.stock ?? 1) <= 0) return

    dispatch(
      addToCart({
        ...product,
        _id: product._id,
        image: product.images?.[0] || product.image || '',
        basePrice: Number(product.price || 0),
        price: totalPrice,
        selectedColor,
        selectedStorage,
        giftWrap,
        giftWrapPrice: giftWrap ? 199 : 0,
        extraWarranty,
        extraWarrantyPrice: extraWarranty ? 1199 : 0,
        totalPrice,
      })
    )

    setAddedToCart(true)
    setFlyToCart(true)

    window.setTimeout(() => {
      setAddedToCart(false)
      setFlyToCart(false)
    }, 900)
  }

  // Share Product
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      window.setTimeout(() => setShared(false), 2000)
    } catch {
      setShared(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-[Arial]">
        <p className="text-sm font-semibold text-gray-500">
          Loading product...
        </p>
      </div>
    )
  }

  // Error
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 font-[Arial]">
        <p className="font-semibold text-red-600">
          {error || 'Product not found'}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white font-[Arial] text-gray-900">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-500 sm:px-6 lg:px-8 sm:text-sm">
        <Link to="/" className="hover:text-black">
          Home
        </Link>

        <span className="mx-2">›</span>

        <Link to="/mobiles" className="hover:text-black">
          Mobiles
        </Link>

        <span className="mx-2">›</span>

        <Link
          to={`/brand/${product.brand?.toLowerCase()}`}
          className="hover:text-black"
        >
          {product.brand}
        </Link>

        <span className="mx-2">›</span>

        <span className="font-semibold text-black">
          {product.name}
        </span>
      </div>

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:px-8">

        {/* Product Images */}
        <div className="reveal-on-scroll">
          <div className="relative flex h-[350px] items-center justify-center overflow-hidden rounded-2xl bg-[#f8f8f6] sm:h-[480px]">

            {images.length > 0 ? (
              <img
                key={`${activeImage}-${images[activeImage]}`}
                src={images[activeImage] || images[0]}
                alt={product.name}
                onClick={() => setImageZoomed((current) => !current)}
                className={`product-main-image h-full w-full rounded-2xl object-contain p-6 ${imageZoomed ? 'image-zoomed' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setImageZoomed((current) => !current)
                  }
                }}
                aria-label={imageZoomed ? 'Zoom out product image' : 'Zoom in product image'}
              />
            ) : (
              <FiSmartphone size={100} className="text-gray-400" />
            )}

            <span className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
              {images.length ? activeImage + 1 : 0} / {images.length}
            </span>

            {/* Wishlist and Share */}
            <div className="absolute right-4 top-4 flex gap-2">

              <button
                type="button"
                onClick={() => setIsWishlisted((current) => !current)}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-100 ${
                  isWishlisted ? 'text-red-500' : 'text-gray-700'
                }`}
                aria-label="Toggle wishlist"
              >
                <FiHeart
                  size={18}
                  className={isWishlisted ? 'heart-pop fill-red-500' : ''}
                />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"
                aria-label="Share product"
              >
                <FiShare2 size={17} />
              </button>
            </div>

            {/* Flying Product Image */}
            {flyToCart && images[0] && (
              <img
                src={images[0]}
                alt=""
                aria-hidden="true"
                className="cart-fly-image"
              />
            )}

            {shared && (
              <span className="absolute right-16 top-5 text-xs font-semibold text-green-700">
                Link copied
              </span>
            )}
          </div>

          {/* Image Thumbnails */}
          <div className="mt-4 flex justify-center gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setActiveImage(index)
                  setImageZoomed(false)
                }}
                className={`thumbnail-button flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#f8f8f6] ${
                  activeImage === index
                    ? 'border-black'
                    : 'border-gray-100'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="reveal-on-scroll stagger-children">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {product.brand} Mobiles
          </p>

          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            Buy {product.name} Price in Pakistan
          </h1>

          {/* Rating */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={15}
                  className={
                    star <= Math.round(product.rating || 0)
                      ? 'fill-yellow-400'
                      : ''
                  }
                />
              ))}
            </div>

            <span className="font-bold text-black">
              {product.rating || 0}
            </span>

            <span className="text-gray-300">|</span>

            <span className="text-sm text-gray-500">
              {product.numReviews || 0} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-black">
              Rs. {Number(product.price || 0).toLocaleString('en-PK')}
            </span>

            {product.oldPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                Rs. {Number(product.oldPrice).toLocaleString('en-PK')}
              </span>
            )}

            {product.discount > 0 && (
              <span className="rounded bg-[#f5f1e9] px-2 py-1 text-xs font-bold text-black">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-bold text-black">
                Colors
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`rounded-xl border p-3 text-center transition ${
                      selectedColor === color.name
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span
                      className="mx-auto mb-2 block h-8 w-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.color }}
                    />

                    <span className="text-[11px] font-medium text-gray-700">
                      {color.name}
                    </span>

                    {selectedColor === color.name && (
                      <FiCheck className="mx-auto mt-1" size={14} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage */}
          <div className="mt-7">
            <h3 className="mb-3 text-sm font-bold text-black">
              Storage
            </h3>

            <div className="flex flex-wrap gap-3">
              {storage.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedStorage(item)}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    selectedStorage === item
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-700 hover:border-black'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Gift Wrap */}
          <div className="mt-7 rounded-xl border border-gray-200 p-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FiGift size={23} />

                <div>
                  <p className="text-sm font-bold text-black">
                    Add Gift Wrap
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Make it Memorable - Add Gift Wrapping!
                  </p>

                  <p className="mt-1 text-xs font-semibold text-gray-700">
                    Cost: Rs. 199
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
            </label>
          </div>

          {/* Official Warranty */}
          <div className="mt-4 rounded-xl border border-gray-200 p-4">

            <div className="flex items-start gap-3">
              <FiShield size={23} className="shrink-0" />

              <div>
                <p className="text-sm font-bold text-black">
                  1 Year Official {product.brand} Warranty
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Valid at official {product.brand} service centers
                </p>

                <span className="mt-2 inline-block text-xs font-bold text-green-700">
                  FREE · Included
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-100" />

            <label className="flex cursor-pointer items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-black">
                  Add 1 Extra Year of Warranty
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  2nd Year covered by Priceoye.
                </p>

                <p className="mt-2 text-sm font-bold text-black">
                  Rs. 1,199
                </p>

                <button
                  type="button"
                  onClick={() => setShowCoverage(!showCoverage)}
                  className="mt-2 text-xs font-semibold underline underline-offset-4"
                >
                  View Coverage Details
                </button>
              </div>

              <input
                type="checkbox"
                checked={extraWarranty}
                onChange={(e) => setExtraWarranty(e.target.checked)}
                className="mt-1 h-5 w-5 accent-black"
              />
            </label>

            {/* Accordion Animation */}
            <div
              className={`accordion-panel ${
                showCoverage ? 'accordion-open' : ''
              }`}
            >
              <p className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
                Optional additional warranty for the second year.
                Coverage terms should be confirmed with the warranty provider.
              </p>
            </div>
          </div>

          {/* Installment */}
          <div className="mt-4 rounded-xl bg-[#f8f8f6] p-4">
            <p className="text-sm font-bold text-black">
              SheenPay Shariah Installment
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Pay in 4, No Credit Card Needed
            </p>
          </div>

          {/* Total */}
          {(giftWrap || extraWarranty) && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-semibold text-gray-600">
                Total Price
              </span>

              <span className="text-lg font-bold text-black">
                Rs. {totalPrice.toLocaleString('en-PK')}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3">

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={Number(product.stock ?? 1) <= 0}
                className={`flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 ${
                  addedToCart ? 'cart-button-success' : ''
                }`}
              >
                <FiShoppingCart
                  size={18}
                  className={addedToCart ? 'cart-icon-bounce' : ''}
                />

                {Number(product.stock ?? 1) <= 0
                  ? 'Out of Stock'
                  : addedToCart
                    ? 'Added to Cart'
                    : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={() => setCompare(!compare)}
                className={`rounded-lg border px-5 py-4 text-sm font-bold transition ${
                  compare
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-black hover:border-black'
                }`}
              >
                {compare ? 'Added' : 'Compare'}
              </button>
            </div>

            {/* Chat With Support */}
            <Link
              to="/chat"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-4 text-sm font-bold text-black transition hover:border-black hover:bg-[#f8f8f6]"
            >
              <FiMessageCircle size={19} />
              Chat with Support
            </Link>

          </div>

          {addedToCart && (
            <p className="mt-3 text-sm font-semibold text-green-700">
              Product successfully added to your cart.
            </p>
          )}

          {compare && (
            <p className="mt-2 text-xs text-green-700">
              {product.name} selected for comparison.
            </p>
          )}
        </div>
      </section>

      {/* Warranty Challenge */}
      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-black p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-bold tracking-widest text-gray-400">
                ASLI WARRANTY CHALLENGE
              </p>

              <h2 className="text-xl font-bold sm:text-2xl">
                Official Brand Warranty
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Ya Double Paisay Wapis
              </p>

              <p className="mt-3 text-xs text-gray-400">
                Learn how the 2X Warranty Challenge works.
              </p>
            </div>

            <FiShield size={65} className="text-gray-300" />
          </div>
        </div>
      </section>

      {/* Product Benefits */}
      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xl font-bold text-black">
          Why Buy From Us?
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ['Authenticity', '100% Factory Sealed'],
            ['Warranty', 'Official Brand Warranty'],
            ['Trust', '2X Money Back Challenge'],
            ['PTA Approved', 'Original Mobiles'],
            ['Free Delivery', 'Fast Delivery All Over Pakistan'],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-xl border border-gray-100 p-4"
            >
              <FiCheck size={20} className="mb-3 text-green-600" />

              <h3 className="text-sm font-bold text-black">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Mobiles */}
      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black sm:text-2xl">
            Similar {product.brand} Mobiles
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Explore other {product.brand} smartphones you might like.
          </p>
        </div>

        {similarLoading ? (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-gray-500">
              Loading {product.brand} mobiles...
            </p>
          </div>
        ) : similarMobiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similarMobiles.map((mobile) => {
              const mobileImage =
                mobile.images?.[0] || mobile.image || ''

              const mobilePrice = Number(mobile.price || 0)
              const oldPrice = Number(mobile.oldPrice || 0)

              const discount =
                Number(mobile.discount || 0) ||
                (oldPrice > mobilePrice
                  ? Math.round(
                      ((oldPrice - mobilePrice) / oldPrice) * 100
                    )
                  : 0)

              return (
                <Link
                  key={mobile._id}
                  to={`/product/${mobile._id}`}
                  className="group rounded-xl border border-gray-100 p-3 transition hover:-translate-y-1 hover:shadow-md sm:p-4"
                >
                  <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-[#f8f8f6]">
                    {mobileImage ? (
                      <img
                        src={mobileImage}
                        alt={mobile.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <FiSmartphone
                        size={65}
                        className="text-gray-400"
                      />
                    )}
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {mobile.brand}
                  </p>

                  <h3 className="mt-1 min-h-10 text-sm font-bold text-gray-800">
                    {mobile.name}
                  </h3>

                  <p className="mt-2 text-base font-bold text-black">
                    Rs. {mobilePrice.toLocaleString('en-PK')}
                  </p>

                  {discount > 0 && (
                    <span className="mt-2 inline-block rounded bg-[#f5f1e9] px-2 py-1 text-[10px] font-bold text-black">
                      {discount}% OFF
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-[#f8f8f6] px-4 py-10 text-center">
            <FiSmartphone
              size={35}
              className="mx-auto mb-3 text-gray-400"
            />

            <p className="text-sm font-semibold text-gray-700">
              No other {product.brand} mobiles available.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              More products from this brand will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Product Tabs */}
      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex gap-5 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-1 py-4 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pt-7">

          {/* Specifications */}
          {activeTab === 'Specifications' && (
            <div>
              <h2 className="mb-6 text-xl font-bold text-black">
                {product.name} Specifications
              </h2>

              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Display', product.specifications?.display],
                  ['RAM', product.specifications?.ram],
                  ['Battery', product.specifications?.battery],
                  ['Rear Camera', product.specifications?.rearCamera],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-[#f8f8f6] p-4"
                  >
                    <p className="text-xs text-gray-500">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-bold text-black">
                      {value || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {Object.entries(product.specifications || {}).map(
                  ([key, value]) => (
                    <div key={key}>
                      <div className="grid grid-cols-2 gap-3 border-b border-gray-100 py-3 text-sm">
                        <span className="capitalize text-gray-500">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>

                        <span className="font-medium text-gray-800">
                          {value || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Installment Plans */}
          {activeTab === 'Installment Plans' && (
            <div className="rounded-xl bg-[#f8f8f6] p-6">
              <h3 className="font-bold text-black">
                SheenPay Shariah Installment
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Pay in 4 installments without a credit card.
                Check the provider for eligibility and installment details.
              </p>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'Reviews' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[3px] text-[#a58b57]">
                    CUSTOMER FEEDBACK
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-black sm:text-2xl">
                    What Customers Say
                  </h2>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#f8f8f6] px-4 py-3">
                  <span className="text-3xl font-bold text-black">
                    {reviewsAverage.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={star <= Math.round(reviewsAverage) ? 'fill-yellow-400' : ''}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {reviewsTotal} {reviewsTotal === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notebook-to-reviews animation */}
              <div className="review-story relative mx-auto mb-8 flex h-[250px] max-w-2xl items-end justify-center overflow-hidden rounded-2xl bg-[#f8f7f3]">
                <div className="review-story-label absolute left-4 top-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
                  Real experiences, shared by customers
                </div>

                <div className="review-floor absolute bottom-8 left-0 h-px w-full bg-[#dedbd2]" />

                <div className="review-person" aria-hidden="true">
                  <div className="review-person-head" />
                  <div className="review-person-body">
                    <span className="review-person-arm review-person-arm-left" />
                    <span className="review-person-arm review-person-arm-right" />
                  </div>
                  <div className="review-person-leg review-person-leg-left" />
                  <div className="review-person-leg review-person-leg-right" />
                </div>

                <div className="review-notebook" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="review-paper review-paper-one" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="review-paper review-paper-two" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="review-paper review-paper-three" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="review-transformed-card review-transformed-one" aria-hidden="true">
                  <div className="flex items-center gap-1 text-[#c49a45]">
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                  </div>
                  <span />
                  <span />
                </div>
                <div className="review-transformed-card review-transformed-two" aria-hidden="true">
                  <div className="flex items-center gap-1 text-[#c49a45]">
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                    <FiStar size={10} />
                  </div>
                  <span />
                  <span />
                </div>

                <p className="review-story-caption absolute bottom-3 right-4 text-[10px] font-semibold tracking-wide text-gray-400">
                  FROM NOTES TO REVIEWS
                </p>
              </div>

              {reviewsLoading && (
                <p className="py-4 text-center text-sm text-gray-500">
                  Loading customer reviews...
                </p>
              )}

              {reviewsError && (
                <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {reviewsError}
                </p>
              )}

              {!reviewsLoading && reviews.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review, index) => (
                    <article
                      key={review._id}
                      className="review-result-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                      style={{ '--review-index': index }}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2eee5] text-sm font-bold text-[#80632f]">
                            {(review.user?.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">
                              {review.user?.name || 'Customer'}
                            </h3>
                            <p className="mt-1 text-[11px] text-gray-400">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                : 'Date unavailable'}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 text-[#c49a45]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              size={13}
                              className={star <= review.rating ? 'fill-[#c49a45]' : ''}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 px-5 py-7 text-center">
                  <p className="font-semibold text-gray-800">
                    No reviews yet
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Be the first customer to share your experience with this mobile.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FAQs */}
          {activeTab === 'FAQs' && (
            <div className="space-y-3">
              {[
                [
                  `Does ${product.name} have an official warranty?`,
                  `Warranty information should be confirmed with the official ${product.brand} service center.`,
                ],
                [
                  'Is this mobile PTA approved?',
                  'Please confirm PTA approval status before purchasing.',
                ],
                [
                  'What storage options are available?',
                  `${product.specifications?.storage || 'N/A'} storage with ${product.specifications?.ram || 'N/A'} RAM.`,
                ],
                [
                  'Which colors are available?',
                  product.colors?.join(', ') || 'Contact us for available colors.',
                ],
              ].map(([question, answer]) => (
                <details
                  key={question}
                  className="faq-accordion rounded-xl border border-gray-200 p-4"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-black">
                    {question}
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Animation CSS */}
      <style>{`
        .product-main-image {
          animation: productImageEnter 420ms cubic-bezier(.2,.75,.25,1) both;
          transition: transform 450ms cubic-bezier(.2,.75,.25,1);
          transform: scale(1);
          transform-origin: center;
          cursor: zoom-in;
          -webkit-tap-highlight-color: transparent;
        }
        .product-main-image.image-zoomed {
          transform: scale(1.45);
          cursor: zoom-out;
        }
        @media (hover: hover) and (pointer: fine) {
          .product-main-image:not(.image-zoomed):hover { transform: scale(1.09); }
        }
        @keyframes productImageEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .thumbnail-button {
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }
        .thumbnail-button:hover { transform: translateY(-3px); }
        .thumbnail-button:active { transform: scale(.94); }

        .stagger-children > * { opacity: 0; }
        .stagger-children.is-visible > * { animation: staggerFadeUp 480ms ease both; }
        .stagger-children.is-visible > *:nth-child(1) { animation-delay: 40ms; }
        .stagger-children.is-visible > *:nth-child(2) { animation-delay: 90ms; }
        .stagger-children.is-visible > *:nth-child(3) { animation-delay: 140ms; }
        .stagger-children.is-visible > *:nth-child(4) { animation-delay: 190ms; }
        .stagger-children.is-visible > *:nth-child(5) { animation-delay: 240ms; }
        .stagger-children.is-visible > *:nth-child(6) { animation-delay: 290ms; }
        @keyframes staggerFadeUp {
          from { opacity: 0; transform: translateY(13px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 650ms ease, transform 650ms ease;
          will-change: opacity, transform;
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
          will-change: auto;
        }

        .heart-pop { animation: heartPop 360ms cubic-bezier(.2,.8,.3,1.4); }
        @keyframes heartPop {
          0% { transform: scale(.65); }
          65% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }

        .cart-fly-image {
          position: absolute;
          z-index: 20;
          left: 42%;
          top: 36%;
          width: 76px;
          height: 76px;
          object-fit: contain;
          pointer-events: none;
          animation: flyProductToCart 850ms cubic-bezier(.35,.05,.75,.35) forwards;
        }
        @keyframes flyProductToCart {
          0% { opacity: 0; transform: translate(0, 0) scale(.9); }
          12% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; transform: translate(105px, 245px) scale(.12) rotate(18deg); }
        }
        .cart-icon-bounce { animation: cartBounce 420ms ease; }
        .cart-button-success { box-shadow: 0 0 0 3px rgba(22,163,74,.12); }
        @keyframes cartBounce {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(-5px); }
        }

        .accordion-panel {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 300ms ease, opacity 250ms ease, margin 300ms ease;
          margin-top: 0;
        }
        .accordion-panel > p { overflow: hidden; min-height: 0; }
        .accordion-panel.accordion-open {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 12px;
        }
        .faq-accordion summary { cursor: pointer; }
        .faq-accordion[open] > p { animation: faqReveal 260ms ease both; }
        @keyframes faqReveal {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Customer notebook-to-review story animation */
        .review-person {
          position: absolute;
          z-index: 4;
          bottom: 32px;
          left: 12%;
          width: 58px;
          height: 142px;
          opacity: 0;
          animation: review-person-arrive 3.4s ease-in-out forwards;
        }
        .review-person-head {
          position: absolute;
          top: 0;
          left: 18px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #c58f68;
          border: 3px solid #9d6b4d;
        }
        .review-person-body {
          position: absolute;
          top: 25px;
          left: 12px;
          width: 36px;
          height: 62px;
          border-radius: 12px 12px 7px 7px;
          background: #202020;
        }
        .review-person-arm {
          position: absolute;
          top: 8px;
          width: 9px;
          height: 48px;
          border-radius: 10px;
          background: #c58f68;
          transform-origin: top center;
        }
        .review-person-arm-left {
          left: -5px;
          transform: rotate(25deg);
        }
        .review-person-arm-right {
          right: -5px;
          transform: rotate(-30deg);
        }
        .review-person-leg {
          position: absolute;
          top: 82px;
          width: 11px;
          height: 48px;
          border-radius: 8px;
          background: #343434;
          transform-origin: top center;
        }
        .review-person-leg-left { left: 17px; }
        .review-person-leg-right { right: 17px; }
        .review-notebook {
          position: absolute;
          z-index: 5;
          bottom: 37px;
          left: calc(12% + 39px);
          width: 48px;
          height: 35px;
          padding: 7px 6px;
          border: 3px solid #80632f;
          border-radius: 4px;
          background: #d6ad50;
          opacity: 0;
          transform: rotate(-12deg);
          animation: notebook-set-down 3.4s ease-in-out forwards;
        }
        .review-notebook span {
          display: block;
          height: 2px;
          margin-bottom: 4px;
          background: rgba(70, 48, 14, .45);
        }
        .review-paper {
          position: absolute;
          z-index: 3;
          bottom: 55px;
          left: calc(12% + 48px);
          width: 42px;
          height: 54px;
          padding: 10px 6px;
          border: 1px solid #e5e1d7;
          border-radius: 3px;
          background: #fff;
          box-shadow: 0 5px 12px rgba(0,0,0,.08);
          opacity: 0;
        }
        .review-paper i {
          display: block;
          height: 2px;
          margin-bottom: 6px;
          background: #d9d5cc;
        }
        .review-paper-one { animation: paper-fly-one 3.4s ease-out forwards; }
        .review-paper-two { animation: paper-fly-two 3.4s ease-out forwards; }
        .review-paper-three { animation: paper-fly-three 3.4s ease-out forwards; }
        .review-transformed-card {
          position: absolute;
          z-index: 2;
          width: 130px;
          min-height: 76px;
          padding: 10px;
          border: 1px solid #e9e5dc;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 8px 22px rgba(0,0,0,.08);
          opacity: 0;
        }
        .review-transformed-card span {
          display: block;
          height: 4px;
          margin-top: 8px;
          border-radius: 5px;
          background: #e7e4dd;
        }
        .review-transformed-card span:last-child { width: 68%; }
        .review-transformed-one {
          left: 44%;
          top: 65px;
          animation: paper-becomes-review-one 3.4s ease-out forwards;
        }
        .review-transformed-two {
          right: 8%;
          top: 105px;
          animation: paper-becomes-review-two 3.4s ease-out forwards;
        }
        .review-story-caption { opacity: 0; animation: story-caption-show 3.4s ease forwards; }
        .review-result-card {
          animation: review-result-appear 550ms ease both;
          animation-delay: calc(3.35s + (var(--review-index, 0) * 100ms));
        }
        @keyframes review-person-arrive {
          0% { opacity: 0; transform: translateX(-130px); }
          12% { opacity: 1; transform: translateX(0); }
          40% { opacity: 1; transform: translateX(0) translateY(0); }
          55% { transform: translateX(0) translateY(12px) rotate(5deg); }
          68%, 100% { opacity: 0; transform: translateX(-10px) translateY(8px); }
        }
        @keyframes notebook-set-down {
          0%, 38% { opacity: 0; transform: translate(-35px, -20px) rotate(-18deg); }
          48% { opacity: 1; transform: translate(0, -8px) rotate(-12deg); }
          62%, 100% { opacity: 1; transform: translate(0, 0) rotate(0); }
        }
        @keyframes paper-fly-one {
          0%, 60% { opacity: 0; transform: translate(0, 0) rotate(0) scale(.7); }
          72% { opacity: 1; transform: translate(90px, -105px) rotate(18deg) scale(1); }
          100% { opacity: 0; transform: translate(185px, -145px) rotate(28deg) scale(.65); }
        }
        @keyframes paper-fly-two {
          0%, 62% { opacity: 0; transform: translate(0, 0) rotate(0) scale(.7); }
          75% { opacity: 1; transform: translate(155px, -65px) rotate(-12deg) scale(1); }
          100% { opacity: 0; transform: translate(245px, -95px) rotate(-20deg) scale(.65); }
        }
        @keyframes paper-fly-three {
          0%, 64% { opacity: 0; transform: translate(0, 0) rotate(0) scale(.7); }
          77% { opacity: 1; transform: translate(105px, -15px) rotate(12deg) scale(1); }
          100% { opacity: 0; transform: translate(205px, -30px) rotate(18deg) scale(.65); }
        }
        @keyframes paper-becomes-review-one {
          0%, 72% { opacity: 0; transform: translateY(18px) scale(.6) rotate(-8deg); }
          84% { opacity: 1; transform: translateY(0) scale(1.04) rotate(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
        }
        @keyframes paper-becomes-review-two {
          0%, 77% { opacity: 0; transform: translateY(18px) scale(.6) rotate(8deg); }
          89% { opacity: 1; transform: translateY(0) scale(1.04) rotate(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
        }
        @keyframes story-caption-show {
          0%, 75% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes review-result-appear {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .review-person { left: 5%; transform-origin: bottom center; }
          .review-notebook, .review-paper { left: calc(5% + 39px); }
          .review-transformed-one { left: 40%; }
          .review-transformed-two { right: 3%; }
          .review-transformed-card { width: 112px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .review-person,
          .review-notebook,
          .review-paper,
          .review-transformed-card,
          .review-story-caption,
          .review-result-card {
            animation: none !important;
          }
          .review-person { opacity: 1; transform: none; }
          .review-notebook,
          .review-transformed-card { opacity: 1; }
          .review-paper { display: none; }
          .review-story-caption { opacity: 1; }
        }

        @media (max-width: 640px) {
          .cart-fly-image { left: 35%; top: 35%; }
          .product-main-image.image-zoomed { transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
          .reveal-on-scroll { opacity: 1; transform: none; }
          .stagger-children > * { opacity: 1; animation: none !important; }
        }
      `}</style>

    </main>
  )
}

export default ProductDetails
