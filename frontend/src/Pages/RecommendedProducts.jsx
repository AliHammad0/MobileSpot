
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  FiStar,
  FiShoppingCart,
  FiCheck
} from 'react-icons/fi'

import { addToCart } from '../redux/slices/cartSlice'

const API_URL = 'http://localhost:8080/api/v1/products/recommended'

const RecommendedProducts = ({ onAddToCart }) => {
  const dispatch = useDispatch()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addedProducts, setAddedProducts] = useState([])

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Failed to load recommended products')
        }

        setProducts(data.products || [])
      } catch (error) {
        setError(error.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [])

  const getImage = (product) => {
    if (Array.isArray(product.images)) {
      return product.images[0]?.url || product.images[0] || ''
    }

    if (typeof product.images === 'string') {
      return product.images
    }

    return product.image || product.imageUrl || ''
  }

  const getDiscount = (product) => {
    if (product.discount) return product.discount

    if (product.discountPrice && product.price) {
      return Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    }

    return 0
  }

  const getPrice = (product) => {
    return product.discountPrice || product.price || 0
  }

  // ADD TO CART
  const handleAddToCart = (product) => {
    const productId = product._id || product.id

    const cartProduct = {
      ...product,
      _id: productId,
      name: product.name,
      brand: product.brand || 'Mobile',
      price: Number(getPrice(product)),
      image: getImage(product),
      quantity: 1
    }

    if (onAddToCart) {
      onAddToCart(cartProduct)
    } else {
      dispatch(addToCart(cartProduct))
    }

    setAddedProducts((prev) =>
      prev.includes(productId)
        ? prev
        : [...prev, productId]
    )
  }

  return (
    <section className="w-full bg-white px-4 py-10 font-[Arial] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[2px] text-gray-400">
              Handpicked For You
            </p>

            <h2 className="text-2xl font-bold text-black sm:text-3xl">
              Recommended Mobiles
            </h2>
          </div>

          <Link
            to="/mobiles"
            className="text-sm font-semibold text-gray-600 underline underline-offset-4 hover:text-black"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-100"
              >
                <div className="h-44 bg-gray-100 sm:h-52" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-5 w-1/2 rounded bg-gray-100" />
                  <div className="h-10 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-black underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl bg-gray-50 py-12 text-center">
            <p className="text-sm text-gray-500">
              No recommended mobiles available right now.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            {products.map((product) => {
              const discount = getDiscount(product)
              const image = getImage(product)
              const price = getPrice(product)
              const productId = product._id || product.id
              const isAdded = addedProducts.includes(productId)

              return (
                <div
                  key={productId}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                >

                  {/* Product Image */}
                  <Link
                    to={`/products/${productId}`}
                    className="relative flex h-44 shrink-0 items-center justify-center bg-[#f8f8f8] p-4 sm:h-52"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-sm text-gray-400">
                        No Image Available
                      </div>
                    )}

                    {discount > 0 && (
                      <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-[10px] font-bold text-white">
                        {discount}% OFF
                      </span>
                    )}

                    {product.fast && (
                      <span className="absolute right-2 top-2 rounded bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Fast
                      </span>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4">

                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {product.brand || 'Mobile'}
                    </p>

                    <Link to={`/product/${productId}`}>
                      <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="mb-2 flex h-5 shrink-0 items-center gap-1 text-xs">
                      {product.rating != null && (
                        <>
                          <FiStar
                            size={13}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="font-semibold text-gray-700">
                            {product.rating}
                          </span>

                          {product.reviews != null && (
                            <span className="text-gray-400">
                              ({product.reviews} Reviews)
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Price */}
                    <p className="mb-3 text-lg font-bold text-black">
                      Rs. {Number(price).toLocaleString('en-PK')}
                    </p>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`mt-auto flex w-full shrink-0 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-3 sm:text-sm ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <FiCheck size={16} />
                          Added
                        </>
                      ) : (
                        <>
                          <FiShoppingCart size={15} />
                          Add to Cart
                        </>
                      )}
                    </button>

                  </div>
                </div>
              )
            })}

          </div>
        )}

      </div>
    </section>
  )
}

export default RecommendedProducts
