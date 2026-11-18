
import React, { useEffect, useState } from 'react'
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
  FiCheck
} from 'react-icons/fi'
import { useSelector } from 'react-redux'
import Cart from './Cart'

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

const SearchAnimation = ({ query }) => {
  return (
    <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
      <style>{`
        @keyframes salesmanWalk {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          50% { transform: translateX(-22px); }
          75% { transform: translateX(-8px); }
        }

        @keyframes salesmanLook {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(35deg); }
        }

        @keyframes shelfPhone {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes searchingDots {
          0%, 100% { opacity: .2; }
          50% { opacity: 1; }
        }

        @keyframes searchProgress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .salesman-walk {
          animation: salesmanWalk 2s ease-in-out infinite;
        }

        .salesman-look {
          transform-origin: top center;
          animation: salesmanLook .9s ease-in-out infinite;
        }

        .shelf-phone {
          animation: shelfPhone .8s ease-in-out infinite;
        }

        .search-dot {
          animation: searchingDots .8s infinite;
        }

        .search-dot:nth-child(2) { animation-delay: .2s; }
        .search-dot:nth-child(3) { animation-delay: .4s; }

        .search-progress {
          animation: searchProgress 3s linear forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .salesman-walk,
          .salesman-look,
          .shelf-phone,
          .search-dot,
          .search-progress {
            animation: none !important;
          }
        }
      `}</style>

      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <p className="text-sm font-extrabold text-black">
            Mobile<span className="text-amber-600">Spot</span>
          </p>
          <p className="text-[11px] text-gray-400">
            Searching our mobile collection
          </p>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
          LIVE SEARCH
        </span>
      </div>

      <div className="bg-[#f7f6f2] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Customer wants
        </p>

        <p className="mt-1 truncate text-base font-extrabold text-black">
          {query}
        </p>

        {/* Shop shelf animation */}
        <div className="relative mt-3 h-36 overflow-hidden rounded-xl bg-[#e8e0d2]">

          <div className="absolute left-3 right-3 top-5 h-1.5 rounded-full bg-[#b8aa96]" />
          <div className="absolute left-3 right-3 top-[76px] h-1.5 rounded-full bg-[#b8aa96]" />
          <div className="absolute bottom-4 left-3 right-3 h-1.5 rounded-full bg-[#b8aa96]" />

          {/* Upper shelf phones */}
          <div className="absolute left-5 top-7 flex items-end gap-3">
            {[0, 1, 2, 3, 4].map((phone) => (
              <div
                key={phone}
                className="shelf-phone h-10 w-5 rounded-md border-2 border-gray-500 bg-gray-800"
                style={{ animationDelay: `${phone * 0.12}s` }}
              >
                <div className="mx-auto mt-1 h-1 w-2 rounded-full bg-gray-400" />
              </div>
            ))}
          </div>

          {/* Lower shelf phones */}
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
          <div className="salesman-walk absolute bottom-4 right-5 z-10 flex flex-col items-center">

            <div className="relative mb-1 h-7 w-7 rounded-full border border-[#c28b61] bg-[#d9a47d]">
              <div className="absolute left-1.5 top-2 h-1 w-1 rounded-full bg-black" />
              <div className="absolute right-1.5 top-2 h-1 w-1 rounded-full bg-black" />
              <div className="absolute bottom-1 left-2 h-1 w-3 rounded-full border-b border-black" />
              <div className="absolute -top-1 left-0 h-2 w-7 rounded-t-full bg-[#29231f]" />
            </div>

            <div className="relative h-11 w-9 rounded-t-lg bg-[#1f2937]">
              <div className="absolute left-3 top-0 h-5 w-3 rounded-b bg-white" />
              <div className="salesman-look absolute -left-2 top-1 h-7 w-2.5 rounded-full bg-[#d9a47d]" />
              <div className="absolute -right-2 top-1 h-7 w-2.5 rounded-full bg-[#d9a47d]" />
            </div>

            <div className="flex gap-1.5">
              <div className="h-4 w-2.5 rounded-b bg-black" />
              <div className="h-4 w-2.5 rounded-b bg-black" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          <p className="text-xs font-bold text-gray-700">
            Salesman shelf par phone dhoond raha hai
          </p>

          <div className="ml-auto flex gap-1">
            <span className="search-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
            <span className="search-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
            <span className="search-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className="search-progress h-full rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showSearchAnimation, setShowSearchAnimation] = useState(false)

  const navigate = useNavigate()

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

  // Start 3-second animation after typing
  useEffect(() => {
    const query = search.trim()

    if (!query) {
      setShowSearchAnimation(false)
      return
    }

    setShowSearchAnimation(true)

    const timer = setTimeout(() => {
      setShowSearchAnimation(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [search, navigate])

  const handleSearch = (e) => {
    e.preventDefault()

    // Animation timer will automatically navigate after 3 seconds.
    if (!search.trim()) return
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
      <header className="relative z-40 w-full bg-white font-[Arial,sans-serif] shadow-sm">

        {/* Header top */}
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

            {/* Desktop search with animation directly below */}
            <div className="relative hidden max-w-xl flex-1 md:block">
              <form
                onSubmit={handleSearch}
                className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4"
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

              {showSearchAnimation && search.trim() && (
                <SearchAnimation query={search.trim()} />
              )}
            </div>

            {/* Header actions */}
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

        {/* Mobile search with animation directly below */}
        <div className="px-4 py-3 md:hidden">
          <div className="relative">
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

            {showSearchAnimation && search.trim() && (
              <SearchAnimation query={search.trim()} />
            )}
          </div>
        </div>

        {/* Desktop navigation */}
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

        {/* Mobile menu */}
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

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  )
}

export default Header
