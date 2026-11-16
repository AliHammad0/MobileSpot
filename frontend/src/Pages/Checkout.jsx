
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'
import { createOrder } from '../services/orderApi'
import { validateCoupon } from '../services/couponApi'

import {
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiPackage,
  FiShield,
  FiTruck,
  FiTag,
  FiX,
  FiLock
} from 'react-icons/fi'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItems = useSelector(state => state.cart.cartItems)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    area: '',
    address: '',
    paymentMethod: 'COD'
  })

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity || 1),
    0
  )

  const shipping = 250

  const discount = appliedCoupon
    ? Number(appliedCoupon.discount)
    : 0

  const total = Math.max(0, subtotal + shipping - discount)

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setError('')
  }

  // Apply Coupon
  const handleApplyCoupon = async () => {
    setCouponError('')

    const code = couponCode.trim().toUpperCase()

    if (!code) {
      setCouponError('Please enter a coupon code.')
      return
    }

    if (subtotal <= 0) {
      setCouponError('Your cart is empty.')
      return
    }

    try {
      setCouponLoading(true)

      const data = await validateCoupon(code, subtotal)

      setAppliedCoupon({
        code: data.coupon.code,
        discount: Number(data.discount)
      })

      setCouponCode(data.coupon.code)
      setCouponError('')
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err.message || 'Coupon could not be applied.')
    } finally {
      setCouponLoading(false)
    }
  }

  // Remove Coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  // 3D Tilt Animation
  const handleTilt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setTilt({
      x: (0.5 - y) * 12,
      y: (x - 0.5) * 12
    })
  }

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')

    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please login before placing your order.')
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!formData.phone.match(/^03[0-9]{9}$/)) {
      setError('Please enter a valid Pakistani mobile number.')
      return
    }

    const animationStart = Date.now()

    try {
      setLoading(true)

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: Number(item.quantity || 1),
          image:
            item.image ||
            item.imageUrl ||
            item.images?.[0] ||
            '',
          price: Number(item.price)
        })),

        shippingAddress: {
          fullName: formData.name.trim(),
          phone: formData.phone.trim(),
          address: `${formData.address.trim()}, ${formData.area.trim()}, ${formData.province}`,
          city: formData.city.trim(),
          postalCode: '',
          country: 'Pakistan'
        },

        paymentMethod: formData.paymentMethod,

        itemsPrice: subtotal,
        shippingPrice: shipping,

        couponCode: appliedCoupon?.code || '',
        discountAmount: discount,

        email: formData.email.trim().toLowerCase()
      }

      // Create Order
      await createOrder(orderData)

      // Wait until animation completes 6 seconds
      const elapsed = Date.now() - animationStart
      const remainingTime = Math.max(0, 6000 - elapsed)

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // Clear Cart
      dispatch(clearCart())

      // Redirect to Orders Page
      navigate('/orders', { replace: true })

    } catch (err) {
      setError(err.message || 'Order could not be placed.')
      setLoading(false)
    }
  }

  // Empty Cart
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 font-[Arial]">
        <FiPackage className="mb-4 text-5xl text-gray-300" />

        <h2 className="text-2xl font-bold text-gray-900">
          Your Cart is Empty
        </h2>

        <p className="mt-2 text-gray-500">
          Add products to your cart before checkout.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg bg-black px-8 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f7f7] px-4 py-8 font-[Arial] sm:py-12">

      {/* Airplane Loading Animation */}
      {loading && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f7f7f5]/95 px-5 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Order processing animation"
        >
          <div className="relative flex w-full max-w-xl flex-col items-center text-center">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="flight-cloud absolute left-0 top-[24%] text-5xl text-[#d8d2c7]/70">
                ☁
              </div>

              <div className="flight-cloud flight-cloud-delay absolute left-0 top-[66%] text-6xl text-[#d8d2c7]/60">
                ☁
              </div>

              <div
                className="flight-cloud absolute left-0 top-[48%] text-3xl text-[#d8d2c7]/50"
                style={{ animationDuration: '6.5s' }}
              >
                ☁
              </div>
            </div>

            <div className="relative mb-8 flex h-36 w-full items-center justify-center">
              <div className="flight-trail absolute left-[12%] right-[12%] top-1/2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#b9a17a] to-transparent" />

              <div className="airplane-fly relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#e4dac8] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.10)]">
                <span className="text-4xl text-[#8b7655]" aria-hidden="true">
                  ✈
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#b9a17a]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#b9a17a] [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#b9a17a] [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes packageFloat {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes ringRotate {
          from { transform: rotateX(65deg) rotateZ(0deg); }
          to { transform: rotateX(65deg) rotateZ(360deg); }
        }

        @keyframes ringRotateReverse {
          from { transform: rotateX(65deg) rotateZ(360deg); }
          to { transform: rotateX(65deg) rotateZ(0deg); }
        }

        @keyframes softPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }

        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .package-float {
          animation: packageFloat 4s ease-in-out infinite;
        }

        .ring-one {
          animation: ringRotate 12s linear infinite;
        }

        .ring-two {
          animation: ringRotateReverse 15s linear infinite;
        }

        .package-glow {
          animation: softPulse 3s ease-in-out infinite;
        }

        .checkout-shine {
          background-size: 200% auto;
          animation: shine 5s linear infinite;
        }

        @keyframes airplaneFly {
          0% {
            transform: translate(-18vw, 18px) rotate(-8deg) scale(0.75);
            opacity: 0;
          }
          12% { opacity: 1; }
          50% {
            transform: translate(0, -22px) rotate(0deg) scale(1.15);
            opacity: 1;
          }
          88% { opacity: 1; }
          100% {
            transform: translate(18vw, -55px) rotate(8deg) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes cloudDrift {
          from { transform: translateX(35vw); opacity: 0; }
          20% { opacity: 0.65; }
          to { transform: translateX(-35vw); opacity: 0; }
        }

        @keyframes trailDraw {
          0% { transform: scaleX(0); opacity: 0; }
          25% { transform: scaleX(1); opacity: 0.7; }
          85% { transform: scaleX(1); opacity: 0.35; }
          100% { transform: scaleX(0.2); opacity: 0; }
        }

        .airplane-fly {
          animation: airplaneFly 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .flight-cloud {
          animation: cloudDrift 5s linear infinite;
        }

        .flight-cloud-delay {
          animation-delay: 1.8s;
        }

        .flight-trail {
          transform-origin: right center;
          animation: trailDraw 2.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .package-float,
          .ring-one,
          .ring-two,
          .package-glow,
          .checkout-shine,
          .airplane-fly,
          .flight-cloud,
          .flight-trail {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-gray-400">
              The Shopping Experience
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Complete your information to place your order.
            </p>
          </div>

          {/* 3D Delivery Animation */}
          <div
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            className="relative hidden h-40 w-48 items-center justify-center sm:flex"
            style={{ perspective: '700px' }}
          >
            <div className="package-glow absolute h-28 w-28 rounded-full bg-[#d8c8a8] blur-2xl" />

            <div
              className="ring-one absolute h-32 w-32 rounded-full border border-[#c8b58e]/70"
              style={{ transformStyle: 'preserve-3d' }}
            />

            <div
              className="ring-two absolute h-40 w-40 rounded-full border border-dashed border-gray-300"
              style={{ transformStyle: 'preserve-3d' }}
            />

            <div
              className="package-float relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white bg-gradient-to-br from-[#e8ddc8] via-[#d5c4a5] to-[#b9a17a] shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-transform duration-300"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-[#b49a70]/50" />
              <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-[#b49a70]/40" />

              <FiPackage
                className="relative z-10 text-4xl text-[#594a35] drop-shadow-md"
                style={{ transform: 'translateZ(15px)' }}
              />
            </div>

            <div className="absolute bottom-2 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/10 blur-md" />
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              {/* Contact Information */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <FiUser className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Contact Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Enter your contact details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name *
                    </label>

                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number *
                    </label>

                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03XXXXXXXXX"
                        required
                        pattern="03[0-9]{9}"
                        title="Enter a valid Pakistani mobile number"
                        className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address *
                    </label>

                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        required
                        className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <FiMapPin className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Province *
                    </label>

                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
                    >
                      <option value="">Select Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      City *
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      required
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Area / Town *
                    </label>

                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Enter your area or town"
                      required
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Complete Address *
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, nearby landmark..."
                      rows="3"
                      required
                      className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <FiShield className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-gray-500">
                      Select your preferred payment method
                    </p>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-black bg-gray-50 p-4">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>

                  <FiTruck className="text-xl text-gray-600" />
                </label>
              </section>
            </div>

            {/* Order Summary */}
            <aside className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-6">

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#e8ddc8]/40 blur-3xl" />

              <div className="relative">

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                  <FiPackage className="text-xl text-gray-400" />
                </div>

                {/* Products */}
                <div className="max-h-80 space-y-4 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-2">
                        <img
                          src={
                            item.image ||
                            item.imageUrl ||
                            item.images?.[0] ||
                            'https://placehold.co/100x100?text=Product'
                          }
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity || 1}
                        </p>

                        <p className="mt-2 font-bold text-gray-900">
                          Rs. {(Number(item.price) * Number(item.quantity || 1)).toLocaleString('en-PK')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mt-6 rounded-lg border border-gray-200 bg-[#faf9f6] p-4">

                  <div className="mb-3 flex items-center gap-2">
                    <FiTag className="text-lg text-gray-700" />
                    <h3 className="font-bold text-gray-900">
                      Apply Coupon
                    </h3>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">

                      <div>
                        <p className="text-sm font-bold text-green-700">
                          {appliedCoupon.code}
                        </p>
                        <p className="mt-1 text-xs text-green-600">
                          Coupon applied successfully
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="flex items-center gap-1 rounded-md bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <FiX />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setCouponError('')
                          }}
                          placeholder="Enter coupon code"
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm uppercase outline-none transition focus:border-black"
                        />

                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="shrink-0 rounded-lg bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {couponLoading ? 'Wait...' : 'Apply'}
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-2 text-xs text-red-600">
                          {couponError}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Price Details */}
                <div className="mt-6 space-y-4 border-b border-gray-200 pb-5">

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping Charges</span>
                    <span>Rs. {shipping.toLocaleString('en-PK')}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm font-semibold text-green-600">
                      <span>Coupon Discount</span>
                      <span>
                        - Rs. {discount.toLocaleString('en-PK')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Final Total */}
                <div className="flex justify-between py-5">
                  <span className="text-lg font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    Rs. {total.toLocaleString('en-PK')}
                  </span>
                </div>

                {error && (
                  <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="checkout-shine w-full rounded-lg bg-gradient-to-r from-black via-gray-800 to-black py-4 font-bold text-white transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Processing Order...' : 'Place Order'}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                  <FiLock className="text-green-600" />
                  Your information is kept secure.
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <FiTruck />
                  <span>
                    Carefully packed and delivered to your doorstep
                  </span>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
