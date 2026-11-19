
import React, { useEffect, useRef, useState } from 'react'
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

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  )

  const [deletingItem, setDeletingItem] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const checkoutTimer = useRef(null)
  const removeTimer = useRef(null)
  const checkoutStarted = useRef(false)

  // PRICE CALCULATION

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
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

  // PRODUCT IMAGE

  const getProductImage = (item) =>
    item.image ||
    item.imageUrl ||
    item.images?.[0] ||
    'https://placehold.co/300x300?text=Product'

  // REMOVE PRODUCT WITH PICKUP ANIMATION

  const handleRemoveProduct = (productId) => {
    if (deletingItem || isCheckingOut) return

    setDeletingItem(productId)

    removeTimer.current = setTimeout(() => {
      dispatch(removeFromCart(productId))
      setDeletingItem(null)
      removeTimer.current = null
    }, 1450)
  }

  // CHECKOUT

  const handleCheckout = () => {
    if (!cartItems.length || checkoutStarted.current || deletingItem) return

    checkoutStarted.current = true
    setIsCheckingOut(true)

    checkoutTimer.current = setTimeout(() => {
      window.location.assign('/checkout')
    }, 3000)
  }

  // ESCAPE KEY

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isCheckingOut && !deletingItem) {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose, isCheckingOut, deletingItem])

  // BACKGROUND SCROLL

  useEffect(() => {
    document.body.style.overflow =
      isOpen || isCheckingOut ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isCheckingOut])

  // TIMER CLEANUP

  useEffect(() => {
    return () => {
      if (checkoutTimer.current) {
        clearTimeout(checkoutTimer.current)
      }

      if (removeTimer.current) {
        clearTimeout(removeTimer.current)
      }
    }
  }, [])

  return (
    <>
      <style>{`

        /* SHOPPING SCENE */

        @keyframes personFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes trolleyMove {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        @keyframes wheelSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes productAppear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .shopping-scene {
          animation: productAppear .6s ease both;
        }

        .shopping-person {
          animation: personFloat 2.5s ease-in-out infinite;
        }

        .shopping-trolley {
          animation: trolleyMove 2.5s ease-in-out infinite;
        }

        .shopping-wheel {
          animation: wheelSpin 3s linear infinite;
        }

        .shopping-product {
          animation: productAppear .5s ease both;
        }

        /* SECOND PERSON ARRIVES AND TAKES PHONE */

        @keyframes helperTrip {
          0% {
            transform: translateX(0);
            opacity: 0;
          }

          12% {
            opacity: 1;
          }

          35% {
            transform: translateX(-105px);
            opacity: 1;
          }

          48% {
            transform: translateX(-105px) translateY(-5px);
            opacity: 1;
          }

          65% {
            transform: translateX(-105px) translateY(-5px);
            opacity: 1;
          }

          100% {
            transform: translateX(110px) translateY(0);
            opacity: 0;
          }
        }

        @keyframes phonePickup {
          0%, 25% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }

          50% {
            opacity: 1;
            transform: translate(45px, -42px) scale(.65) rotate(12deg);
          }

          100% {
            opacity: 0;
            transform: translate(115px, -65px) scale(.3) rotate(20deg);
          }
        }

        .helper-moving {
          animation: helperTrip 1.4s cubic-bezier(.45, 0, .55, 1) forwards;
        }

        .phone-picking {
          animation: phonePickup 1.15s ease-in-out forwards;
        }

        .trolley-item-removing {
          animation: phonePickup 1.15s ease-in-out forwards;
        }

        /* CHECKOUT RIDER */

        @keyframes riderRide {
          0% {
            transform: translateX(-320px);
          }
          35%, 55% {
            transform: translateX(30vw);
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
          65% {
            opacity: 1;
            transform: translate(-15vw, -55px) scale(.7);
          }
          100% {
            opacity: 0;
            transform: translate(-15vw, -55px) scale(.5);
          }
        }

        @keyframes wheelRotate {
          to {
            transform: rotate(1080deg);
          }
        }

        @keyframes roadMove {
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
          animation: riderRide 3s cubic-bezier(.45, 0, .55, 1) forwards;
        }

        .pickup-parcel {
          animation: parcelPickup .8s ease-in-out 1.1s forwards;
        }

        .rider-wheel {
          animation: wheelRotate 3s linear forwards;
        }

        .delivery-message {
          animation: messageAppear 3s ease-in-out forwards;
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
          animation: roadMove .5s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .shopping-scene,
          .shopping-person,
          .shopping-trolley,
          .shopping-wheel,
          .shopping-product,
          .helper-moving,
          .phone-picking {
            animation: none !important;
          }
        }

      `}</style>

      {/* CHECKOUT ANIMATION */}

      {isCheckingOut && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#f7f6f3]">

          <div className="absolute inset-0 bg-gradient-to-b from-[#f7f6f3] via-white to-[#eae8e2]" />

          <div className="delivery-message relative z-20 px-5 text-center">

            <div className="mb-3 text-4xl">📦</div>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Order is on the Way!
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Our rider is collecting your package.
            </p>

          </div>

          <div className="absolute bottom-[13%] h-[270px] w-full">

            <div className="pickup-parcel absolute bottom-[105px] left-[53%] z-10 text-5xl">
              📦
            </div>

            <div className="rider-moving absolute bottom-[20px] left-0 z-20 h-[220px] w-[270px]">

              <div className="rider-wheel absolute bottom-0 left-[17px] h-[67px] w-[67px] rounded-full border-[9px] border-gray-900 bg-gray-300">
                <div className="absolute inset-[8px] rounded-full border-[3px] border-gray-600 bg-gray-200" />
              </div>

              <div className="rider-wheel absolute bottom-0 right-[15px] h-[67px] w-[67px] rounded-full border-[9px] border-gray-900 bg-gray-300">
                <div className="absolute inset-[8px] rounded-full border-[3px] border-gray-600 bg-gray-200" />
              </div>

              <div className="absolute bottom-[40px] left-[55px] h-[15px] w-[150px] rotate-[-8deg] rounded-full bg-black" />

              <div className="absolute bottom-[53px] left-[92px] h-[35px] w-[85px] -rotate-12 rounded-2xl bg-[#d4a373]" />

              <div className="absolute bottom-[112px] left-[76px] h-[9px] w-[65px] -rotate-6 rounded-full bg-gray-900" />

              <div className="absolute bottom-[100px] right-[33px] h-[40px] w-[8px] rotate-[25deg] rounded-full bg-gray-800" />

              <div className="absolute bottom-[72px] right-[4px] h-[20px] w-[22px] rounded-full border-2 border-gray-700 bg-yellow-300" />

              <div className="absolute bottom-[110px] left-[12px] h-[7px] w-[52px] rounded-full bg-gray-800" />

              <div className="absolute bottom-[52px] left-[100px] h-[62px] w-[20px] rotate-[35deg] rounded-full bg-gray-900" />

              <div className="absolute bottom-[44px] left-[115px] h-[13px] w-[30px] rounded-full bg-black" />

              <div className="absolute bottom-[110px] left-[92px] h-[65px] w-[43px] -rotate-[20deg] rounded-t-2xl rounded-b-lg border border-gray-800 bg-[#d4a373]" />

              <div className="absolute bottom-[118px] left-[125px] h-[12px] w-[50px] rotate-[20deg] rounded-full bg-[#d4a373]" />

              <div className="absolute bottom-[125px] right-[45px] h-[13px] w-[13px] rounded-full bg-[#b77950]" />

              <div className="absolute bottom-[166px] left-[112px] h-[16px] w-[18px] rounded-md bg-[#b77950]" />

              <div className="absolute bottom-[172px] left-[104px] h-[33px] w-[38px] rounded-[45%] bg-[#d4a373]" />

              <div className="absolute bottom-[193px] left-[99px] h-[27px] w-[46px] rounded-t-full rounded-b-lg border-b-[5px] border-black bg-[#d4a373]" />

              <div className="absolute bottom-[189px] left-[131px] h-[8px] w-[21px] rounded-full bg-gray-900" />

              <div className="absolute bottom-[132px] left-[72px] h-[35px] w-[27px] rounded-lg border-2 border-gray-700 bg-[#d4a373]" />

            </div>

            <div className="moving-road absolute bottom-[12px] left-0 h-[3px] w-full" />

            <div className="absolute bottom-0 left-0 h-[12px] w-full bg-gray-200/50" />

          </div>

          <div className="absolute bottom-7 text-center">
            <p className="text-xs font-bold tracking-[4px] text-gray-700">
              MOBILE SPOT
            </p>
            <p className="mt-2 text-[10px] text-gray-400">
              PREMIUM COLLECTION
            </p>
          </div>

        </div>
      )}

      {/* OVERLAY */}

      <div
        onClick={() => !isCheckingOut && !deletingItem && onClose?.()}
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen && !isCheckingOut
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      />

      {/* CART DRAWER */}

      <div
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen && !isCheckingOut
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >

        {/* HEADER */}

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
            disabled={!!deletingItem}
            className="rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 disabled:opacity-40"
            aria-label="Close cart"
          >
            <FiX size={21} />
          </button>

        </div>

        {/* PRODUCTS */}

        <div className="flex-1 overflow-y-auto px-5 py-5">

          {cartItems.length === 0 ? (

            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="mb-4 text-7xl">🛍️</div>

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

              {/* ANIMATED SHOPPING SCENE */}

              <div className="shopping-scene relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-[#faf9f6] via-white to-[#efede7] px-3 pt-4 pb-3">

                <div className="text-center">

                  <p className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">
                    Your Shopping Journey
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-gray-900">
                    Your Picks, Ready to Go!
                  </h3>

                </div>

                {/* FIRST PERSON AND TROLLEY */}

                <div className="relative mx-auto mt-2 flex h-[190px] max-w-[320px] items-end justify-center">

                  {/* FIRST PERSON */}

                  <div className="shopping-person relative z-20 h-[175px] w-[105px] shrink-0">

                    <div className="absolute top-[9px] left-[35px] z-20 h-[34px] w-[34px] rounded-full border border-[#a96e49] bg-[#d9a17a]">

                      <div className="absolute top-[13px] left-[7px] h-[3px] w-[3px] rounded-full bg-gray-900" />

                      <div className="absolute top-[13px] right-[7px] h-[3px] w-[3px] rounded-full bg-gray-900" />

                      <div className="absolute bottom-[6px] left-[12px] h-[4px] w-[10px] rounded-b-full border-b border-gray-800" />

                    </div>

                    <div className="absolute top-[4px] left-[32px] z-30 h-[15px] w-[40px] rounded-t-full bg-[#29231f]" />

                    <div className="absolute top-[43px] left-[24px] h-[70px] w-[55px] rounded-t-2xl rounded-b-lg border border-gray-800 bg-[#252525]" />

                    <div className="absolute top-[52px] left-[14px] h-[48px] w-[13px] -rotate-[25deg] rounded-full bg-[#d9a17a]" />

                    <div className="absolute top-[53px] right-[4px] h-[53px] w-[13px] rotate-[28deg] rounded-full bg-[#d9a17a]" />

                    <div className="absolute top-[88px] right-[-1px] z-30 h-[13px] w-[13px] rounded-full bg-[#d9a17a]" />

                    <div className="absolute bottom-0 left-[28px] h-[65px] w-[21px] -rotate-[5deg] rounded-b-lg bg-[#303030]" />

                    <div className="absolute bottom-0 left-[54px] h-[65px] w-[21px] rotate-[5deg] rounded-b-lg bg-[#303030]" />

                    <div className="absolute bottom-[-1px] left-[18px] h-[11px] w-[34px] rounded-full bg-black" />

                    <div className="absolute bottom-[-1px] left-[51px] h-[11px] w-[34px] rounded-full bg-black" />

                  </div>

                  {/* TROLLEY */}

                  <div className="shopping-trolley relative z-10 -ml-2 h-[150px] w-[190px] shrink-0">

                    {/* HANDLE */}

                    <div className="absolute top-[10px] left-[3px] h-[7px] w-[46px] -rotate-[18deg] rounded-full bg-gray-800" />

                    <div className="absolute top-[13px] left-[39px] h-[13px] w-[5px] rotate-[-10deg] rounded-full bg-gray-700" />

                    {/* BASKET */}

                    <div className="absolute top-[27px] left-[37px] h-[75px] w-[145px] overflow-hidden rounded-b-2xl border-[4px] border-gray-700 bg-white/80 shadow-md">

                      <div className="pointer-events-none absolute inset-0 z-20 opacity-30">

                        <div className="absolute top-0 bottom-0 left-[25%] w-[2px] bg-gray-500" />

                        <div className="absolute top-0 bottom-0 left-[50%] w-[2px] bg-gray-500" />

                        <div className="absolute top-0 bottom-0 left-[75%] w-[2px] bg-gray-500" />

                        <div className="absolute top-[30%] left-0 right-0 h-[2px] bg-gray-500" />

                        <div className="absolute top-[65%] left-0 right-0 h-[2px] bg-gray-500" />

                      </div>

                      {/* REAL CART PRODUCT IMAGES */}

                      <div className="absolute inset-x-1 bottom-[8px] z-10 flex h-[62px] items-end justify-center gap-1">

                        {cartItems.slice(0, 4).map((item, index) => (

                          <div
                            key={item._id}
                            className={`shopping-product relative flex h-[58px] w-[43px] items-center justify-center rounded-md bg-white p-1 shadow-sm ${
                              deletingItem === item._id
                                ? 'trolley-item-removing'
                                : ''
                            }`}
                            style={{
                              animationDelay:
                                deletingItem === item._id
                                  ? '0s'
                                  : `${index * 0.12}s`
                            }}
                          >

                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              className="h-full w-full object-contain"
                            />

                          </div>

                        ))}

                      </div>

                    </div>

                    {/* FRONT FRAME */}

                    <div className="absolute top-[98px] left-[49px] h-[5px] w-[137px] rounded-full bg-gray-700" />

                    <div className="absolute top-[97px] left-[47px] h-[43px] w-[5px] rotate-[12deg] bg-gray-600" />

                    <div className="absolute top-[97px] right-[7px] h-[43px] w-[5px] -rotate-[12deg] bg-gray-600" />

                    {/* WHEELS */}

                    <div className="shopping-wheel absolute bottom-0 left-[38px] h-[20px] w-[20px] rounded-full border-[5px] border-gray-800 bg-gray-300" />

                    <div className="shopping-wheel absolute bottom-0 right-[1px] h-[20px] w-[20px] rounded-full border-[5px] border-gray-800 bg-gray-300" />

                  </div>

                  {/* SECOND PERSON - PICKUP HELPER */}

                  {deletingItem && (

                    <div className="helper-moving absolute right-[-75px] bottom-[5px] z-40 h-[115px] w-[75px]">

                      {/* HEAD */}

                      <div className="absolute top-0 left-[21px] h-[27px] w-[27px] rounded-full border border-[#a96e49] bg-[#d9a17a]">

                        <div className="absolute top-[3px] left-[-2px] h-[10px] w-[30px] rounded-t-full bg-[#29231f]" />

                        <div className="absolute top-[13px] left-[6px] h-[2px] w-[2px] rounded-full bg-black" />

                        <div className="absolute top-[13px] right-[6px] h-[2px] w-[2px] rounded-full bg-black" />

                      </div>

                      {/* BODY */}

                      <div className="absolute top-[27px] left-[12px] h-[43px] w-[42px] rounded-xl border border-gray-700 bg-[#d4a373]" />

                      {/* LEFT ARM */}

                      <div className="absolute top-[35px] left-[5px] h-[34px] w-[9px] rotate-[35deg] rounded-full bg-[#d9a17a]" />

                      {/* PICKING ARM */}

                      <div className="absolute top-[39px] right-[5px] h-[36px] w-[9px] -rotate-[55deg] rounded-full bg-[#d9a17a]" />

                      {/* HAND */}

                      <div className="absolute top-[67px] right-[5px] h-[10px] w-[10px] rounded-full bg-[#b77950]" />

                      {/* LEGS */}

                      <div className="absolute bottom-0 left-[17px] h-[43px] w-[12px] rounded-b-lg bg-[#292929]" />

                      <div className="absolute bottom-0 right-[15px] h-[43px] w-[12px] rounded-b-lg bg-[#292929]" />

                      {/* SHOES */}

                      <div className="absolute bottom-0 left-[9px] h-[8px] w-[23px] rounded-full bg-black" />

                      <div className="absolute bottom-0 right-[8px] h-[8px] w-[23px] rounded-full bg-black" />

                      {/* SELECTED PHONE IN HAND */}

                      <div className="phone-picking absolute top-[57px] right-[0px] z-50 flex h-[35px] w-[25px] items-center justify-center rounded-md border border-gray-500 bg-white p-[2px] shadow-lg">

                        <img
                          src={
                            getProductImage(
                              cartItems.find(
                                (item) => item._id === deletingItem
                              ) || {}
                            )
                          }
                          alt="Selected product"
                          className="h-full w-full object-contain"
                        />

                      </div>

                    </div>

                  )}

                </div>

                <div className="mt-2 flex items-center justify-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <p className="text-[10px] font-medium text-gray-500">
                    {deletingItem
                      ? 'Our helper is collecting your product...'
                      : `${cartCount} products selected for you`}
                  </p>

                </div>

              </div>

              {/* PRODUCT LIST */}

              <div className="space-y-5">

                {cartItems.map((item) => (

                  <div
                    key={item._id}
                    className={`flex gap-4 border-b border-gray-100 pb-5 transition-all duration-300 ${
                      deletingItem === item._id
                        ? 'scale-95 opacity-60'
                        : 'scale-100 opacity-100'
                    }`}
                  >

                    {/* IMAGE */}

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f7f6f3]">

                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />

                    </div>

                    {/* DETAILS */}

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
                          className="h-fit rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Remove product"
                        >
                          <FiTrash2 size={17} />
                        </button>

                      </div>

                      <div className="flex items-center justify-between gap-2">

                        {/* QUANTITY */}

                        <div className="flex items-center overflow-hidden rounded-md border border-gray-200">

                          <button
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            disabled={
                              item.quantity <= 1 ||
                              isCheckingOut ||
                              !!deletingItem
                            }
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
                            disabled={isCheckingOut || !!deletingItem}
                            className="flex h-8 w-8 items-center justify-center transition hover:bg-gray-100 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={12} />
                          </button>

                        </div>

                        {/* PRICE */}

                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(
                            Number(item.price || 0) * item.quantity
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* CLEAR CART */}

              <button
                onClick={() => dispatch(clearCart())}
                disabled={isCheckingOut || !!deletingItem}
                className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:opacity-40"
              >
                <FiTrash2 size={15} />
                Clear Cart
              </button>

            </div>

          )}

        </div>

        {/* FOOTER */}

        {cartItems.length > 0 && (

          <div className="border-t border-gray-200 bg-white px-5 py-5">

            <div className="mb-4 space-y-3">

              <div className="flex justify-between text-sm text-gray-500">

                <span>Subtotal</span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>

              </div>

              <div className="flex justify-between text-sm text-gray-500">

                <span>Shipping</span>

                <span className="font-semibold text-gray-900">
                  {formatPrice(shipping)}
                </span>

              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3">

                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(total)}
                </span>

              </div>

            </div>

            {/* CHECKOUT BUTTON */}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut || !!deletingItem}
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
