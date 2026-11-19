
import React, { useEffect, useMemo, useState } from 'react'
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiSmartphone,
  FiTag,
  FiBox
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/products'

const getImage = (product) => {
  const image = product?.images?.[0]

  if (typeof image === 'string') return image
  if (image?.url) return image.url

  return ''
}

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Products load nahi ho sake.')
      }

      const productList = Array.isArray(data)
        ? data
        : data.products || data.data?.products || []

      setProducts(productList)
    } catch (err) {
      setError(err.message || 'Products load karne mein problem hui.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const brands = useMemo(() => {
    return [...new Set(
      products
        .map((product) => product.brand)
        .filter(Boolean)
    )].sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase()

      const matchesSearch = [
        product.name,
        product.brand,
        product.model,
        product.category
      ].filter(Boolean).join(' ').toLowerCase().includes(searchText)

      const matchesBrand =
        selectedBrand === 'all' ||
        product.brand === selectedBrand

      return matchesSearch && matchesBrand
    })
  }, [products, search, selectedBrand])

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString('en-PK')}`
  }

  return (
    <div className="min-h-screen font-[Arial,sans-serif] text-gray-900">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2">
            Store Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold">
            All Products
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Manage and view your MobileSpot products.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh Products
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="text-2xl font-bold mt-2">
                {products.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Stock</p>
              <h2 className="text-2xl font-bold mt-2">
                {products.filter((p) => Number(p.stock) > 0).length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FiBox size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Brands</p>
              <h2 className="text-2xl font-bold mt-2">
                {brands.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FiTag size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, brand or model..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black text-sm"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="md:w-52 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            <option value="all">All Brands</option>

            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <FiRefreshCw className="animate-spin mx-auto mb-4" size={28} />
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-3" size={30} />

          <h3 className="font-bold text-lg">Unable to Load Products</h3>

          <p className="text-sm text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={fetchProducts}
            className="mt-5 px-5 py-3 bg-black text-white rounded-xl text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <strong className="text-black">{filteredProducts.length}</strong> products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <FiSmartphone className="mx-auto text-gray-400 mb-4" size={35} />

              <h3 className="font-bold text-lg">No Products Found</h3>

              <p className="text-sm text-gray-500 mt-2">
                Search ya brand filter change karke try karein.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Product</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Brand</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Price</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Stock</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Category</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const image = getImage(product)

                      return (
                        <tr key={product._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <FiSmartphone size={25} className="text-gray-400" />
                                )}
                              </div>

                              <div>
                                <p className="font-bold text-sm">
                                  {product.name || 'Unnamed Product'}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {product.model || 'Mobile Phone'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-medium">
                            {product.brand || 'N/A'}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold">
                            {formatPrice(product.price)}
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              Number(product.stock) > 0
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-600'
                            }`}>
                              {Number(product.stock) > 0
                                ? `${product.stock} In Stock`
                                : 'Out of Stock'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category || 'N/A'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const image = getImage(product)

                  return (
                    <div key={product._id} className="p-4 flex gap-4">
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FiSmartphone size={28} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">
                          {product.name || 'Unnamed Product'}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {product.brand || 'N/A'} · {product.category || 'N/A'}
                        </p>

                        <p className="font-bold text-sm mt-2">
                          {formatPrice(product.price)}
                        </p>

                        <span className={`inline-block mt-2 text-xs font-semibold ${
                          Number(product.stock) > 0
                            ? 'text-green-700'
                            : 'text-red-600'
                        }`}>
                          {Number(product.stock) > 0
                            ? `${product.stock} In Stock`
                            : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </>
      )}

    </div>
  )
}

export default AllProducts
