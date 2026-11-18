
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSmartphone,
  FiPackage,
  FiUser,
  FiGrid,
  FiMessageCircle,
  FiGift,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import { useSelector } from 'react-redux'
import Cart from './Cart'
import { searchProducts } from '../services/productApi'

const brands = [
  { name: 'Apple', icon: '🍎' },
  { name: 'Samsung', icon: '📱' },
  { name: 'Vivo', icon: '📱' },
  { name: 'Oppo', icon: '📱' },
  { name: 'Infinix', icon: '📱' },
  { name: 'Tecno', icon: '📱' },
  { name: 'Xiaomi', icon: '📱' },
  { name: 'Realme', icon: '📱' },
  { name: 'OnePlus', icon: '📱' },
  { name: 'Google Pixel', icon: '📱' },
  { name: 'Nothing', icon: '📱' }
]

const Header = () => {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const [showSearchAnimation, setShowSearchAnimation] = useState(false)
  const [searchStatus, setSearchStatus] = useState('searching')

  const navigate = useNavigate()
  const searchRequest = useRef(0)

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  )

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    user = null
  }

  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token && user)
  const isAdmin = isLoggedIn && user.isAdmin === true

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  )

  // Live search animation and API check
  useEffect(() => {
    const query = search.trim()

    if (!query) {
      setShowSearchAnimation(false)
      setSearchStatus('searching')
      return
    }

    setShowSearchAnimation(true)
    setSearchStatus('searching')

    const currentRequest = ++searchRequest.current

    const timer = setTimeout(async () => {
      try {
        const response = await searchProducts(query)

        if (currentRequest !== searchRequest.current) return

        const products =
          response?.products ||
          response?.data?.products ||
          []

        setSearchStatus(
          products.length > 0 ? 'found' : 'notFound'
        )
      } catch (error) {
        if (currentRequest !== searchRequest.current) return

        console.error('Search error:', error)
        setSearchStatus('error')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handleSearch = (e) => {
    e.preventDefault()

    const query = search.trim()

    if (!query) return

    setShowSearchAnimation(false)
    setMenuOpen(false)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const openCart = () => {
    setCartOpen(true)
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        @keyframes salesmanMove {
          0%, 100% { transform: translateX(0); }
          35% { transform: translateX(-12px); }
          65% { transform: translateX(-5px); }
        }

        @keyframes salesmanArm {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(35deg); }
        }

        @keyframes phoneSearch {
          0%, 100% { transform: translateY(0); opacity: .65; }
          50% { transform: translateY(-7px); opacity: 1; }
        }

        @keyframes foundAnimation {
          0% { transform: translateY(12px) scale(.7); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes messageAnimation {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .salesman-move {
          animation: salesmanMove 2s ease-in-out infinite;
        }

        .salesman-arm {
          transform-origin: top center;
          animation: salesmanArm 1s ease-in-out infinite;
        }

        .phone-search {
          animation: phoneSearch 1s ease-in-out infinite;
        }

        .found-animation {
          animation: foundAnimation .4s ease-out both;
        }

        .message-animation {
          animation: messageAnimation .3s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .salesman-move,
          .salesman-arm,
          .phone-search,
          .found-animation,
          .message-animation {
            animation: none !important;
          }
        }
      `}</style>

      <header className="relative z-40 w-full bg-white font-[Arial,sans-serif] shadow-sm">

        {/* Top Header */}
        <div className="border-b border-gray-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

            <Link to="/" className="flex shrink-0 items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                <FiSmartphone size={23} />
              </div>

              <span className="text-xl font-extrabold tracking-tight text-black">
                Mobile<span className="text-amber-600">Spot</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden max-w-xl flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 md:flex"
            >
              <FiSearch className="shrink-0 text-gray-500" size={20} />

              <input
                type="text"
                placeholder="Search mobile phones, brands..."
                value={search}
                onChange={handleSearchChange}
                className="h-12 w-full bg-transparent px-3 text-sm outline-none"
              />

              <button
                type="submit"
                className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Search
              </button>
            </form>

            {/* Header Actions */}
            <div className="flex items-center gap-5">

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600 sm:flex"
                >
                  <FiUser size={21} />
                  <span>Login</span>
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  to="/orders"
                  className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600 sm:flex"
                >
                  <FiPackage size={21} />
                  <span>My Orders</span>
                </Link>
              )}

              {isLoggedIn && !isAdmin && (
                <Link
                  to="/lucky-spin"
                  className="hidden items-center gap-2 text-sm font-bold text-amber-600 transition hover:text-black sm:flex"
                >
                  <FiGift size={20} />
                  <span>Lucky Spin</span>
                </Link>
              )}

              {isLoggedIn && !isAdmin && (
                <Link
                  to="/chat"
                  className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600 sm:flex"
                >
                  <FiMessageCircle size={20} />
                  <span>Support</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/chats"
                  className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600 sm:flex"
                >
                  <FiMessageCircle size={20} />
                  <span>Chat Inbox</span>
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  to="/profile"
                  className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600 sm:flex"
                >
                  <FiUser size={21} />
                  <span>Profile</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-2 text-sm font-semibold text-amber-700 transition hover:text-black sm:flex"
                >
                  <FiGrid size={20} />
                  <span>Dashboard</span>
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-amber-600"
              >
                <FiShoppingCart size={22} />
                <span className="hidden sm:inline">Cart</span>

                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black md:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 py-3 md:hidden">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3"
          >
            <FiSearch className="shrink-0 text-gray-500" size={19} />

            <input
              type="text"
              placeholder="Search mobile phones..."
              value={search}
              onChange={handleSearchChange}
              className="h-11 w-full bg-transparent px-3 text-sm outline-none"
            />

            <button
              type="submit"
              className="text-xs font-bold text-black"
            >
              Search
            </button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="hidden border-t border-gray-100 md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 overflow-x-auto px-4">

            <Link
              to="/"
              className="shrink-0 border-b-2 border-black py-4 text-sm font-bold text-black"
            >
              Home
            </Link>

            <Link
              to="/mobiles"
              className="shrink-0 py-4 text-sm font-semibold text-gray-600 transition hover:text-amber-600"
            >
              All Mobiles
            </Link>

            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="shrink-0 py-4 text-sm font-semibold text-gray-600 transition hover:text-amber-600"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">

              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-bold text-black hover:bg-gray-50"
              >
                Home
              </Link>

              <Link
                to="/mobiles"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                All Mobiles
              </Link>

              {brands.map((brand) => (
                <Link
                  key={brand.name}
                  to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={closeMenu}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {brand.name}
                </Link>
              ))}

              <div className="my-2 border-t border-gray-100" />

              {isLoggedIn && !isAdmin && (
                <Link
                  to="/lucky-spin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-amber-600 hover:bg-amber-50"
                >
                  <FiGift size={19} />
                  Lucky Spin
                </Link>
              )}

              <button
                onClick={openCart}
                className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <FiShoppingCart size={19} />
                  Cart
                </span>

                <span className="rounded-full bg-amber-500 px-2 py-1 text-xs text-white">
                  {cartCount}
                </span>
              </button>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FiUser size={19} />
                  Login / Register
                </Link>
              )}

              {isLoggedIn && (
                <>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <FiPackage size={19} />
                    My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <FiUser size={19} />
                    Profile
                  </Link>
                </>
              )}

              {isLoggedIn && !isAdmin && (
                <Link
                  to="/chat"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FiMessageCircle size={19} />
                  Support Chat
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/chats"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FiMessageCircle size={19} />
                  Chat Inbox
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-amber-700 hover:bg-gray-50"
                >
                  <FiGrid size={19} />
                  Admin Dashboard
                </Link>
              )}

            </div>
          </div>
        )}
      </header>

      {/* Live Search Animation Panel */}
      {showSearchAnimation && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[90] w-[min(340px,calc(100%-40px))]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <p className="text-sm font-extrabold text-black">
                  Mobile<span className="text-amber-600">Spot</span>
                </p>
                <p className="text-[10px] text-gray-400">
                  Live shelf search
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                LIVE SEARCH
              </span>
            </div>

            <div className="bg-[#f7f6f2] p-4">

              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Customer is searching for
              </p>

              <p className="mb-4 truncate text-base font-extrabold text-black">
                {search}
              </p>

              {/* Shelf scene */}
              <div className="relative h-36 overflow-hidden rounded-xl bg-[#e9e2d5]">

                <div className="absolute left-3 right-3 top-5 h-1.5 rounded-full bg-[#b9ad9b]" />
                <div className="absolute left-3 right-3 top-[76px] h-1.5 rounded-full bg-[#b9ad9b]" />
                <div className="absolute bottom-4 left-3 right-3 h-1.5 rounded-full bg-[#b9ad9b]" />

                {/* Top shelf phones */}
                <div className="absolute left-5 top-7 flex items-end gap-3">
                  {[0, 1, 2, 3, 4].map((phone) => (
                    <div
                      key={phone}
                      className={`h-10 w-5 rounded-md border-2 border-gray-500 bg-gray-800 ${
                        searchStatus === 'found' && phone === 2
                          ? 'found-animation border-amber-500 bg-amber-500'
                          : 'phone-search'
                      }`}
                      style={{ animationDelay: `${phone * 0.15}s` }}
                    >
                      <div className="mx-auto mt-1 h-1 w-2 rounded-full bg-gray-400" />
                    </div>
                  ))}
                </div>

                {/* Bottom shelf phones */}
                <div className="absolute bottom-6 left-5 flex items-end gap-3">
                  {[0, 1, 2, 3, 4, 5].map((phone) => (
                    <div
                      key={phone}
                      className="h-9 w-5 rounded-md border-2 border-gray-500 bg-gray-700"
                    >
                      <div className="mx-auto mt-1 h-1 w-2 rounded-full bg-gray-400" />
                    </div>
                  ))}
                </div>

                {/* Salesman */}
                <div className="salesman-move absolute bottom-4 right-5 z-10 flex flex-col items-center">

                  <div className="relative mb-1 h-7 w-7 rounded-full border border-[#c28b61] bg-[#d9a47d]">
                    <div className="absolute left-1.5 top-2 h-1 w-1 rounded-full bg-black" />
                    <div className="absolute right-1.5 top-2 h-1 w-1 rounded-full bg-black" />
                    <div className="absolute bottom-1 left-2 h-1 w-3 rounded-full border-b border-black" />
                    <div className="absolute -top-1 left-0 h-2 w-7 rounded-t-full bg-[#29231f]" />
                  </div>

                  <div className="relative h-11 w-9 rounded-t-lg bg-[#1f2937]">
                    <div className="absolute left-3 top-0 h-5 w-3 rounded-b bg-white" />
                    <div className="salesman-arm absolute -left-2 top-1 h-7 w-2.5 rounded-full bg-[#d9a47d]" />
                    <div className="absolute -right-2 top-1 h-7 w-2.5 rounded-full bg-[#d9a47d]" />
                  </div>

                  <div className="flex gap-1.5">
                    <div className="h-4 w-2.5 rounded-b bg-black" />
                    <div className="h-4 w-2.5 rounded-b bg-black" />
                  </div>
                </div>
              </div>

              {/* Result status */}
              <div className="message-animation mt-4 min-h-[48px]">

                {searchStatus === 'searching' && (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    <p className="text-xs font-bold text-gray-700">
                      Salesman shelf par phone dhoond raha hai...
                    </p>
                  </div>
                )}

                {searchStatus === 'found' && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <FiCheck size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-green-700">
                        Boss, mil gaya!
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Matching phone found in our collection.
                      </p>
                    </div>
                  </div>
                )}

                {searchStatus === 'notFound' && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <FiX size={17} />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-red-600">
                        Boss, yeh phone hamare paas nahi hai.
                      </p>
                      <p className="text-[11px] text-gray-500">
                        No matching phone found.
                      </p>
                    </div>
                  </div>
                )}

                {searchStatus === 'error' && (
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <FiAlertCircle size={17} />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-gray-800">
                        Boss, abhi check nahi ho saka.
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Please check the search results.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  )
}

export default Header
