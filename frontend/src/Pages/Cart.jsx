
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiShoppingBag,
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

  // Animated Product Delete
  const handleRemoveProduct = (productId) => {
    if (deletingItem) return

    setDeletingItem(productId)

    setTimeout(() => {
      dispatch(removeFromCart(productId))
      setDeletingItem(null)
    }, 350)
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      />

      {/* Cart Drawer - Right Side */}
      <div
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen
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
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0ede7]">
                <FiShoppingBag
                  size={35}
                  className="text-gray-700"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                Your Cart is Empty
              </h3>

              <p className="mt-2 max-w-xs text-sm text-gray-500">
                You haven't added any products to your cart yet.
              </p>

              <button
                onClick={onClose}
                className="mt-6 flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <FiShoppingCart />
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex gap-4 border-b border-gray-100 pb-5 transition-all duration-350 ease-in-out ${
                    deletingItem === item._id
                      ? 'translate-x-12 scale-95 opacity-0'
                      : 'translate-x-0 scale-100 opacity-100'
                  }`}
                >

                  {/* Image */}
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

                  {/* Details */}
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
                        onClick={() =>
                          handleRemoveProduct(item._id)
                        }
                        disabled={deletingItem !== null}
                        className="h-fit rounded-md p-1 text-gray-400 transition duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                        aria-label="Remove product"
                        title="Remove product"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">

                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
                        <button
                          onClick={() =>
                            dispatch(decreaseQuantity(item._id))
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                        >
                          <FiMinus size={12} />
                        </button>

                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            dispatch(increaseQuantity(item._id))
                          }
                          className="flex h-8 w-8 items-center justify-center hover:bg-gray-100"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(
                          Number(item.price || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

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

            <Link
              to="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-lg bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>

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
