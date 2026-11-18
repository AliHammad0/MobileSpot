
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiX,
  FiShoppingCart
} from 'react-icons/fi'

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '../redux/slices/cartSlice'

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  )

  const [deletingItem, setDeletingItem] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const checkoutTimer = useRef(null)
  const checkoutStarted = useRef(false)

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  )

  const shipping = cartItems.length > 0 ? 250 : 0
  const total = subtotal + shipping

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString('en-PK')}`

  // Remove Product Animation
  const handleRemoveProduct = (productId) => {
    if (deletingItem || isCheckingOut) return

    setDeletingItem(productId)

    setTimeout(() => {
      dispatch(removeFromCart(productId))
      setDeletingItem(null)
    }, 350)
  }

  // Navigate To Checkout
  const finishCheckout = () => {
    if (!checkoutStarted.current) return

    if (checkoutTimer.current) {
      clearTimeout(checkoutTimer.current)
      checkoutTimer.current = null
    }

    checkoutStarted.current = false

    onClose?.()
    navigate('/checkout')
  }

  // Start Delivery Animation
  const handleCheckout = () => {
    if (!cartItems.length || checkoutStarted.current) return

    checkoutStarted.current = true
    setIsCheckingOut(true)

    // Safety fallback if animation event does not fire
    checkoutTimer.current = setTimeout(() => {
      finishCheckout()
    }, 4500)
  }

  // Close Cart With Escape Key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isCheckingOut) {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose, isCheckingOut])

  // Prevent Background Scrolling
  useEffect(() => {
    if (isOpen || isCheckingOut) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isCheckingOut])

  // Cleanup Timer
  useEffect(() => {
    return () => {
      if (checkoutTimer.current) {
        clearTimeout(checkoutTimer.current)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes riderRide {
          0% {
            transform: translateX(-120%);
          }

          28% {
            transform: translateX(32vw);
          }

          48% {
            transform: translateX(32vw);
          }

          100% {
            transform: translateX(calc(100vw + 120%));
          }
        }

        @keyframes parcelPickup {
          0% {
            opacity: 0;
            transform: translate(0, 35px) scale(0.7);
          }

          20% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }

          38% {
            opacity: 1;
            transform: translate(-15vw, -55px) scale(0.8);
          }

          50% {
            opacity: 0;
            transform: translate(-15vw, -55px) scale(0.5);
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes deliveryMessage {
          0%, 15% {
            opacity: 0;
            transform: translateY(12px);
          }

          25%, 75% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .rider-animation {
          animation: riderRide 3.6s cubic-bezier(.45,0,.55,1) forwards;
          will-change: transform;
        }

        .parcel-animation {
          animation: parcelPickup 3.6s ease-in-out forwards;
          will-change: transform, opacity;
        }

        .delivery-message {
          animation: deliveryMessage 3.6s ease-in-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .rider-animation,
          .parcel-animation,
          .delivery-message {
            animation-duration: 1.5s;
          }
        }
      `}</style>

      {/* Checkout Delivery Animation */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-white">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f4] via-white to-[#eeece6]" />

          {/* Message */}
          <div className="delivery-message relative z-10 mb-10 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Order is on the Way!
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Our delivery rider is picking up your order.
            </p>
          </div>

          {/* Delivery Scene */}
          <div className="absolute bottom-[12%] h-[230px] w-full">

            {/* Road */}
            <div className="absolute bottom-5 left-0 h-[3px] w-full bg-gray-300">
              <div className="absolute inset-0 border-t-2 border-dashed border-gray-400" />
            </div>

            {/* Parcel */}
            <div className="parcel-animation absolute bottom-10 left-[52%] z-20 text-5xl">
              📦
            </div>

            {/* Delivery Rider */}
            <div
              className="rider-animation absolute bottom-7 left-0 z-10 flex items-end"
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) {
                  finishCheckout()
                }
              }}
            >
              <img
                src="/delivery-rider.png"
                alt="Delivery rider carrying your order"
                className="h-[190px] w-[280px] object-contain sm:h-[230px] sm:w-[340px]"
              />
            </div>
          </div>

          {/* Bottom Message */}
          <div className="absolute bottom-8 text-center">
            <p className="text-xs font-semibold tracking-[3px] text-gray-500">
              THE SHOE SPOT
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div
        onClick={() => !isCheckingOut && onClose?.()}
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen && !isCheckingOut
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen && !isCheckingOut
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Shopping Cart
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {cartCount} items in your cart
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isCheckingOut}
            className="rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
            aria-label="Close cart"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* Cart Products */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="mb-4 flex w-full items-center justify-center">
                <img
                  src="/delivery-rider.png"
                  alt="The Shoe Spot delivery rider"
                  className="h-52 w-full object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                Your Cart is Empty
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                You haven't added any products to your cart yet.
                Explore our collection and find your perfect pair.
              </p>

              <button
                onClick={onClose}
                className="mt-6 flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <FiShoppingCart size={17} />
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex gap-4 border-b border-gray-100 pb-5 transition-all duration-300 ease-in-out ${
                    deletingItem === item._id
                      ? 'translate-x-12 scale-95 opacity-0'
                      : 'translate-x-0 scale-100 opacity-100'
                  }`}
                >

                  {/* Product Image */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f7f6f3]">

                    <img
                      src={
                        item.image ||
                        item.imageUrl ||
                        item.images?.[0] ||
                        'https://placehold.co/300x300?text=Product'
                      }
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">

                    <div className="flex justify-between gap-2">

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.brand || ''}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveProduct(item._id)}
                        disabled={deletingItem !== null || isCheckingOut}
                        className="h-fit rounded-md p-1 text-gray-400 transition duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                        aria-label="Remove product"
                        title="Remove product"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">

                      {/* Quantity Controls */}
                      <div className="flex items-center overflow-hidden rounded-md border border-gray-200">

                        <button
                          onClick={() => dispatch(decreaseQuantity(item._id))}
                          disabled={item.quantity <= 1 || isCheckingOut}
                          className="flex h-8 w-8 items-center justify-center transition hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>

                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(increaseQuantity(item._id))}
                          disabled={isCheckingOut}
                          className="flex h-8 w-8 items-center justify-center transition hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      {/* Product Total */}
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(
                          Number(item.price || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={() => dispatch(clearCart())}
                disabled={isCheckingOut}
                className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700"
              >
                <FiTrash2 size={15} />
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-5 py-5">

            <div className="mb-4 space-y-3">

              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(shipping)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="flex w-full items-center justify-center rounded-lg bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Shipping charges included in total
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
