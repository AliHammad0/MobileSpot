
import React from 'react'
import { FiStar, FiShoppingCart, FiZap } from 'react-icons/fi'

const deals = [
  {
    id: 201,
    brand: 'ZTE',
    name: 'ZTE Nubia Neo 5 Max',
    price: 99999,
    rating: 4.8,
    reviews: 32,
    discount: 15,
    fast: true,
    image:
      'https://images.priceoye.pk/zte-nubia-neo-5-max-pakistan-priceoye-kjhof-500x500.webp',
  },
  {
    id: 202,
    brand: 'Xiaomi',
    name: 'Xiaomi Redmi Note 13 Pro',
    price: 87999,
    rating: 4.9,
    reviews: 448,
    discount: 12,
    fast: true,
    image:
      'https://images.priceoye.pk/xiaomi-redmi-note-13-pro-pakistan-priceoye-8zikv-500x500.webp',
  },
  {
    id: 203,
    brand: 'Tecno',
    name: 'Tecno Spark 50 Pro',
    price: 70495,
    rating: 5,
    reviews: 1,
    discount: 6,
    fast: true,
    image:
      'https://images.priceoye.pk/tecno-spark-50-pro-pakistan-priceoye-0h4ue-500x500.webp',
  },
  {
    id: 204,
    brand: 'Xiaomi',
    name: 'Xiaomi Redmi Note 15 Pro',
    price: 91499,
    rating: 4.8,
    reviews: 44,
    discount: 9,
    fast: true,
    image:
      'https://images.priceoye.pk/xiaomi-redmi-note-15-pro-pakistan-priceoye-0xfug-500x500.webp',
  },
  {
    id: 205,
    brand: 'ZTE',
    name: 'ZTE Nubia V60 Design (8GB-256GB)',
    price: 38499,
    rating: 4.8,
    reviews: 81,
    discount: 8,
    fast: true,
    image:
      'https://images.priceoye.pk/zte-nubia-v60-design-8gb-25gb-pakistan-priceoye-duzlf-500x500.webp',
  },
]

const CraziestDeals = ({ onAddToCart }) => {
  return (
    <main className="min-h-screen bg-white px-4 py-10 font-[Arial] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f5f1e9] px-3 py-1.5 text-xs font-semibold text-black">
            <FiZap size={14} />
            LIMITED TIME DEALS
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-black sm:text-4xl">
            Craziest Deals of the Year
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Explore amazing deals on your favourite smartphones.
          </p>
        </div>

        {/* Deals Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">
            Hot Mobile Deals
          </h2>

          <span className="text-sm text-gray-500">
            {deals.length} Mobiles
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {deals.map((product) => (
            <article
              key={product.id}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative flex h-40 shrink-0 items-center justify-center bg-[#f8f8f8] p-4 sm:h-52">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                />

                {product.discount && (
                  <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-[10px] font-bold text-white">
                    {product.discount}% OFF
                  </span>
                )}

                {product.fast && (
                  <span className="absolute right-2 top-2 rounded bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                    Fast Delivery
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {product.brand} Smartphone
                </p>

                <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="mb-2 flex h-5 shrink-0 items-center gap-1 text-xs">
                  <FiStar
                    size={13}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="font-semibold text-gray-700">
                    {product.rating}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviews} Reviews)
                  </span>
                </div>

                {/* Price */}
                <p className="mb-3 text-lg font-bold text-black">
                  Rs. {product.price.toLocaleString('en-PK')}
                </p>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => onAddToCart?.(product)}
                  className="mt-auto flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 sm:px-3 sm:text-sm"
                >
                  <FiShoppingCart size={15} />
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  )
}

export default CraziestDeals
