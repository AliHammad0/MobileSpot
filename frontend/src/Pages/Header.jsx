
import React, { useState } from 'react'
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
  FiGift
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

const Header = () => {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

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

  const handleSearch = (e) => {
    e.preventDefault()

    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setMenuOpen(false)
    }
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

            <form
              onSubmit={handleSearch}
              className="hidden max-w-xl flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 md:flex"
            >
              <FiSearch className="shrink-0 text-gray-500" size={20} />

              <input
                type="text"
                placeholder="Search mobile phones, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full bg-transparent px-3 text-sm outline-none"
              />

              <button
                type="submit"
                className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Search
              </button>
            </form>

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

              {/* Lucky Spin - Customer */}
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
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full bg-transparent px-3 text-sm outline-none"
            />
          </form>
        </div>

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

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">

              <Link to="/" onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-bold text-black hover:bg-gray-50">
                Home
              </Link>

              <Link to="/mobiles" onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
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

              {/* Mobile Lucky Spin */}
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
