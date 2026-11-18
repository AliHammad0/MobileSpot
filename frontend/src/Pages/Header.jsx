
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
  const [searchAnimation, setSearchAnimation] = useState(false)
  const [searchStatus, setSearchStatus] = useState('searching')
  const [searchedQuery, setSearchedQuery] = useState('')

  const navigate = useNavigate()
  const animationTimer = useRef(null)

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

  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current)
      }
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    const query = search.trim()

    if (!query || searchAnimation) return

    setSearchedQuery(query)
    setSearchAnimation(true)
    setSearchStatus('searching')
    setMenuOpen(false)

    try {
      const response = await searchProducts(query)

      const products =
        response?.products ||
        response?.data?.products ||
        []

      setSearchStatus(products.length > 0 ? 'found' : 'notFound')
    } catch (error) {
      console.error('Search error:', error)
      setSearchStatus('error')
    }

    animationTimer.current = setTimeout(() => {
      setSearchAnimation(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }, 3000)
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
                disabled={searchAnimation}
                className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
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

            <button
              type="submit"
              disabled={searchAnimation}
              className="text-xs font-bold text-black disabled:opacity-50"
            >
              Search
            </button>
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

      {/* Search Animation */}
      {searchAnimation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <style>{`
            @keyframes searchPerson {
              0% { transform: translateX(-75px); }
              35% { transform: translateX(0); }
              65% { transform: translateX(12px); }
              100% { transform: translateX(0); }
            }

            @keyframes searchArm {
              0%, 100% { transform: rotate(-15deg); }
              50% { transform: rotate(35deg); }
            }

            @keyframes shelfPhone {
              0%, 45% { opacity: 0.45; transform: translateY(0); }
              65% { opacity: 1; transform: translateY(-12px); }
              100% { opacity: 1; transform: translateY(-5px); }
            }

            @keyframes searchPulse {
              0%, 100% { opacity: 0.35; }
              50% { opacity: 1; }
            }

            @keyframes foundPhone {
              0% { transform: translateY(20px) scale(0.7); opacity: 0; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }

            @keyframes speechPop {
              0% { transform: scale(0.7); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }

            @keyframes walkDots {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 1; }
            }

            .search-person {
              animation: searchPerson 2.2s ease-in-out infinite;
            }

            .search-arm {
              transform-origin: top center;
              animation: searchArm 1.1s ease-in-out infinite;
            }

            .shelf-phone {
              animation: searchPulse 1s ease-in-out infinite;
            }

            .found-phone {
              animation: foundPhone 0.6s ease-out both;
            }

            .speech-pop {
              animation: speechPop 0.45s ease-out both;
            }

            .walk-dot {
              animation: walkDots 0.8s infinite;
            }

            .walk-dot:nth-child(2) { animation-delay: 0.2s; }
            .walk-dot:nth-child(3) { animation-delay: 0.4s; }

            @media (prefers-reduced-motion: reduce) {
              .search-person, .search-arm, .shelf-phone,
              .found-phone, .speech-pop, .walk-dot {
                animation: none !important;
              }
            }
          `}</style>

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#f7f6f2] shadow-2xl">

            <div className="border-b border-gray-200 bg-white px-5 py-4 text-center">
              <div className="text-lg font-extrabold text-black">
                Mobile<span className="text-amber-600">Spot</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Checking our mobile collection
              </p>
            </div>

            <div className="px-5 pb-6 pt-5">

              <div className="mb-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-gray-400">
                  Customer is looking for
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-black">
                  {searchedQuery}
                </h3>
              </div>

              {/* Shop shelf */}
              <div className="relative mx-auto h-48 max-w-[310px] rounded-xl bg-[#e9e4d9] p-3">

                <div className="absolute left-3 right-3 top-5 h-1.5 rounded-full bg-[#b9ad9b]" />

                <div className="absolute left-3 right-3 top-[87px] h-1.5 rounded-full bg-[#b9ad9b]" />

                <div className="absolute bottom-5 left-3 right-3 h-1.5 rounded-full bg-[#b9ad9b]" />

                {/* Phones on shelf */}
                <div className="absolute left-7 top-7 flex items-end gap-3">
                  {[0, 1, 2, 3].map((phone) => (
                    <div
                      key={phone}
                      className={`h-12 w-6 rounded-md border-2 border-gray-500 bg-gray-800 ${
                        searchStatus === 'found' && phone === 2
                          ? 'found-phone border-amber-500 bg-amber-500'
                          : 'shelf-phone'
                      }`}
                      style={{ animationDelay: `${phone * 0.15}s` }}
                    >
                      <div className="mx-auto mt-1 h-1 w-2 rounded-full bg-gray-400" />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-7 left-7 flex items-end gap-3">
                  {[0, 1, 2, 3, 4].map((phone) => (
                    <div
                      key={phone}
                      className="h-12 w-6 rounded-md border-2 border-gray-500 bg-gray-700"
                    >
                      <div className="mx-auto mt-1 h-1 w-2 rounded-full bg-gray-400" />
                    </div>
                  ))}
                </div>

                {/* Salesman */}
                <div className="search-person absolute -right-1 bottom-5 z-10 flex flex-col items-center">
                  <div className="relative mb-1 h-9 w-9 rounded-full border-2 border-[#c28b61] bg-[#d9a47d]">
                    <div className="absolute left-2 top-3 h-1 w-1 rounded-full bg-black" />
                    <div className="absolute right-2 top-3 h-1 w-1 rounded-full bg-black" />
                    <div className="absolute bottom-1 left-3 h-1 w-3 rounded-full border-b border-black" />
                    <div className="absolute -top-1 left-0 h-3 w-9 rounded-t-full bg-[#29231f]" />
                  </div>

                  <div className="relative h-14 w-12 rounded-t-xl bg-[#1f2937]">
                    <div className="absolute left-4 top-0 h-6 w-4 rounded-b bg-white" />
                    <div className="search-arm absolute -left-2 top-2 h-8 w-3 rounded-full bg-[#d9a47d]" />
                    <div className="absolute -right-2 top-2 h-8 w-3 rounded-full bg-[#d9a47d]" />
                  </div>

                  <div className="flex gap-2">
                    <div className="h-5 w-3 rounded-b bg-black" />
                    <div className="h-5 w-3 rounded-b bg-black" />
                  </div>
                </div>

                {searchStatus === 'searching' && (
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    <span className="walk-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span className="walk-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span className="walk-dot h-1.5 w-1.5 rounded-full bg-amber-600" />
                  </div>
                )}
              </div>

              {/* Status message */}
              <div className="mt-6 min-h-[78px] text-center">

                {searchStatus === 'searching' && (
                  <div className="speech-pop">
                    <p className="text-base font-bold text-black">
                      Salesman is checking the shelves...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Please wait, finding your phone
                    </p>
                  </div>
                )}

                {searchStatus === 'found' && (
                  <div className="speech-pop">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <FiCheck size={22} />
                    </div>
                    <p className="text-base font-extrabold text-green-700">
                      Boss, mil gaya!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Your searched phone is available.
                    </p>
                  </div>
                )}

                {searchStatus === 'notFound' && (
                  <div className="speech-pop">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <FiX size={22} />
                    </div>
                    <p className="text-base font-extrabold text-red-600">
                      Boss, yeh phone hamare paas nahi hai.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Showing matching search results.
                    </p>
                  </div>
                )}

                {searchStatus === 'error' && (
                  <div className="speech-pop">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <FiAlertCircle size={21} />
                    </div>
                    <p className="text-base font-extrabold text-black">
                      Boss, abhi check nahi ho saka.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Opening search results for you.
                    </p>
                  </div>
                )}

              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    searchStatus === 'notFound'
                      ? 'bg-red-500'
                      : searchStatus === 'error'
                        ? 'bg-amber-500'
                        : 'bg-green-600'
                  }`}
                  style={{
                    width: searchStatus === 'searching' ? '45%' : '100%'
                  }}
                />
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
