
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // Price Calculation
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

  // Remove Product
  const handleRemoveProduct = (productId) => {
    if (deletingItem || isCheckingOut) return

    setDeletingItem(productId)

    setTimeout(() => {
      dispatch(removeFromCart(productId))
      setDeletingItem(null)
    }, 350)
  }

  // Navigate After Animation
  const finishCheckout = () => {
    if (!checkoutStarted.current) return

    checkoutStarted.current = false

    if (checkoutTimer.current) {
      clearTimeout(checkoutTimer.current)
      checkoutTimer.current = null
    }

    onClose?.()

    // Open Checkout Page
    navigate('/checkout', { replace: true })
  }

  // Start Delivery Animation
  const handleCheckout = () => {
    if (!cartItems.length || checkoutStarted.current) return

    checkoutStarted.current = true
    setIsCheckingOut(true)

    // Backup navigation if animation event fails
    checkoutTimer.current = setTimeout(() => {
      finishCheckout()
    }, 5000)
  }

  // Escape Key
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
    document.body.style.overflow =
      isOpen || isCheckingOut ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isCheckingOut])

  // Cleanup
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

        /* DELIVERY RIDER ANIMATION */

        @keyframes riderRide {
          0% {
            transform: translateX(-320px);
          }

          32% {
            transform: translateX(32vw);
          }

          48% {
            transform: translateX(32vw);
          }

          100% {
            transform: translateX(calc(100vw + 350px));
          }
        }

        @keyframes parcelPickup {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }

          60% {
            opacity: 1;
            transform: translate(-15vw, -55px) scale(0.7);
          }

          100% {
            opacity: 0;
            transform: translate(-15vw, -55px) scale(0.5);
          }
        }

        @keyframes wheelRotate {
          to {
            transform: rotate(1080deg);
          }
        }

        @keyframes roadMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: -150px 0;
          }
        }

        @keyframes messageAppear {
          0%, 15% {
            opacity: 0;
            transform: translateY(15px);
          }

          30%, 80% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .rider-moving {
          animation: riderRide 3.8s cubic-bezier(.45, 0, .55, 1) forwards;
          will-change: transform;
        }

        .pickup-parcel {
          animation: parcelPickup 0.8s ease-in-out 1.3s forwards;
        }

        .rider-wheel {
          animation: wheelRotate 3.8s linear forwards;
        }

        .delivery-message {
          animation: messageAppear 3.8s ease-in-out forwards;
        }

        .moving-road {
          background-image: repeating-linear-gradient(
            to right,
            transparent 0px,
            transparent 35px,
            #9ca3af 35px,
            #9ca3af 65px
          );
          background-size: 130px 3px;
          animation: roadMove 0.5s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .rider-moving,
          .rider-wheel,
          .pickup-parcel,
          .delivery-message {
            animation-duration: 1.5s;
          }

          .moving-road {
            animation: none;
          }
        }

      `}</style>

      {/* ================================= */}
      {/* DELIVERY ANIMATION SCREEN */}
      {/* ================================= */}

      {isCheckingOut && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#f7f6f3]">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f7f6f3] via-white to-[#eae8e2]" />

          {/* Animated Message */}
          <div className="delivery-message relative z-20 px-5 text-center">

            <div className="mb-3 text-4xl">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Order is on the Way!
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Our rider is collecting your package.
            </p>

          </div>

          {/* Delivery Scene */}
          <div className="absolute bottom-[13%] h-[270px] w-full">

            {/* Parcel On Ground */}
            <div className="pickup-parcel absolute bottom-[105px] left-[53%] z-10 text-5xl">
              📦
            </div>

            {/* Rider And Bike */}
            <div
              className="rider-moving absolute bottom-[20px] left-0 z-20 h-[220px] w-[270px]"
              onAnimationEnd={(e) => {
                if (
                  e.target === e.currentTarget &&
                  e.animationName === 'riderRide'
                ) {
                  finishCheckout()
                }
              }}
            >

              {/* BIKE */}

              {/* Rear Wheel */}
              <div className="rider-wheel absolute bottom-0 left-[17px] h-[67px] w-[67px] rounded-full border-[9px] border-gray-900 bg-gray-300">
                <div className="absolute inset-[8px] rounded-full border-[3px] border-gray-600 bg-gray-200" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900" />
              </div>

              {/* Front Wheel */}
              <div className="rider-wheel absolute bottom-0 right-[15px] h-[67px] w-[67px] rounded-full border-[9px] border-gray-900 bg-gray-300">
                <div className="absolute inset-[8px] rounded-full border-[3px] border-gray-600 bg-gray-200" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900" />
              </div>

              {/* Bike Body */}
              <div className="absolute bottom-[40px] left-[55px] h-[15px] w-[150px] rotate-[-8deg] rounded-full bg-black" />

              <div className="absolute bottom-[53px] left-[92px] h-[35px] w-[85px] -rotate-12 rounded-2xl bg-[#d4a373]" />

              {/* Bike Seat */}
              <div className="absolute bottom-[112px] left-[76px] h-[9px] w-[65px] -rotate-6 rounded-full bg-gray-900" />

              {/* Handle */}
              <div className="absolute bottom-[100px] right-[33px] h-[40px] w-[8px] rotate-[25deg] rounded-full bg-gray-800" />

              {/* Headlight */}
              <div className="absolute bottom-[72px] right-[4px] h-[20px] w-[22px] rounded-full border-2 border-gray-700 bg-yellow-300" />

              {/* Parcel Rack */}
              <div className="absolute bottom-[110px] left-[12px] h-[7px] w-[52px] rounded-full bg-gray-800" />

              {/* RIDER */}

              {/* Rider Leg */}
              <div className="absolute bottom-[52px] left-[100px] h-[62px] w-[20px] rotate-[35deg] rounded-full bg-gray-900" />

              {/* Rider Shoe */}
              <div className="absolute bottom-[44px] left-[115px] h-[13px] w-[30px] rounded-full bg-black" />

              {/* Rider Body */}
              <div className="absolute bottom-[110px] left-[92px] h-[65px] w-[43px] -rotate-[20deg] rounded-t-2xl rounded-b-lg border border-gray-800 bg-[#d4a373]" />

              {/* Rider Arm */}
              <div className="absolute bottom-[118px] left-[125px] h-[12px] w-[50px] rotate-[20deg] rounded-full bg-[#d4a373]" />

              {/* Rider Hand */}
              <div className="absolute bottom-[125px] right-[45px] h-[13px] w-[13px] rounded-full bg-[#b77950]" />

              {/* Rider Neck */}
              <div className="absolute bottom-[166px] left-[112px] h-[16px] w-[18px] rounded-md bg-[#b77950]" />

              {/* Rider Face */}
              <div className="absolute bottom-[172px] left-[104px] h-[33px] w-[38px] rounded-[45%] bg-[#d4a373]" />

              {/* Helmet */}
              <div className="absolute bottom-[193px] left-[99px] h-[27px] w-[46px] rounded-t-full rounded-b-lg border-b-[5px] border-black bg-[#d4a373]" />

              {/* Helmet Visor */}
              <div className="absolute bottom-[189px] left-[131px] h-[8px] w-[21px] rounded-full bg-gray-900" />

              {/* Rider Backpack */}
              <div className="absolute bottom-[132px] left-[72px] h-[35px] w-[27px] rounded-lg border-2 border-gray-700 bg-[#d4a373]" />

            </div>

            {/* Road */}
            <div className="moving-road absolute bottom-[12px] left-0 h-[3px] w-full" />

            {/* Road Shadow */}
            <div className="absolute bottom-0 left-0 h-[12px] w-full bg-gray-200/50" />

          </div>

          {/* Brand */}
          <div className="absolute bottom-7 text-center">
            <p className="text-xs font-bold tracking-[4px] text-gray-700">
              THE SHOE SPOT
            </p>

            <p className="mt-2 text-[10px] text-gray-400">
              PREMIUM FOOTWEAR
            </p>
          </div>

        </div>
      )}

      {/* ================================= */}
      {/* CART OVERLAY */}
      {/* ================================= */}

      <div
        onClick={() => !isCheckingOut && onClose?.()}
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen && !isCheckingOut
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      />

      {/* ================================= */}
      {/* CART DRAWER */}
      {/* ================================= */}

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

              <div className="mb-4 text-7xl">
                🛍️
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
                  className={`flex gap-4 border-b border-gray-100 pb-5 transition-all duration-300 ${
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
                        disabled={deletingItem !== null}
                        className="h-fit rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                        aria-label="Remove product"
                      >
                        <FiTrash2 size={17} />
                      </button>

                    </div>

                    <div className="flex items-center justify-between gap-2">

                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-md border border-gray-200">

                        <button
                          onClick={() => dispatch(decreaseQuantity(item._id))}
                          disabled={item.quantity <= 1}
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

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="flex w-full items-center justify-center rounded-lg bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
