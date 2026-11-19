
import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiSmartphone,
  FiMail,
  FiLock,
  FiKey,
  FiShield,
  FiCheck,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1'

const navigation = [
  { name: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
  { name: 'All Products', path: '/admin/products', icon: FiPackage },
  { name: 'Add Product', path: '/add', icon: FiPlusCircle },
  { name: 'All Users', path: '/all', icon: FiUsers },
  { name: 'All Orders', path: '/admin/orders', icon: FiShoppingBag },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings }
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [email, setEmail] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}').email || ''
    } catch {
      return ''
    }
  })

  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const verifyAdmin = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please login first to access the admin panel.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your admin email.')
      return
    }

    setError('')
    setLoading(true)
    setDoorOpen(false)

    try {
      const response = await fetch(
        `${API_URL}/users/verify-admin-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase()
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Admin verification failed.')
      }

      setLoading(false)
      setDoorOpen(true)

      // Door animation complete hone ke baad dashboard reveal hoga
      setTimeout(() => {
        setVerified(true)
      }, 1800)

    } catch (err) {
      setLoading(false)
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  const userName = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}').name || 'Administrator'
    } catch {
      return 'Administrator'
    }
  })()

  if (!verified) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] font-[Arial,sans-serif] flex items-center justify-center p-4 overflow-hidden">
        <style>{`
          @keyframes characterWalk {
            0% { transform: translateX(-100px); }
            65% { transform: translateX(115px); }
            100% { transform: translateX(115px); }
          }

          @keyframes legWalk {
            0%, 100% { transform: rotate(22deg); }
            50% { transform: rotate(-22deg); }
          }

          @keyframes armWalk {
            0%, 100% { transform: rotate(-25deg); }
            50% { transform: rotate(25deg); }
          }

          @keyframes keyUnlock {
            0%, 55% { transform: rotate(0deg); }
            75%, 100% { transform: rotate(65deg); }
          }

          @keyframes doorOpen {
            0% { transform: perspective(900px) rotateY(0deg); }
            100% { transform: perspective(900px) rotateY(-85deg); }
          }

          @keyframes glowPulse {
            0%, 100% { opacity: .35; }
            50% { opacity: 1; }
          }

          @keyframes reveal {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .character-walk {
            animation: characterWalk 1.7s ease-in-out forwards;
          }

          .character-legs {
            transform-origin: top center;
            animation: legWalk .25s infinite;
          }

          .character-arms {
            transform-origin: top center;
            animation: armWalk .25s infinite;
          }

          .unlock-key {
            animation: keyUnlock 1.7s ease-in-out forwards;
            transform-origin: center;
          }

          .door-opening {
            animation: doorOpen 1.3s ease-in-out forwards;
            transform-origin: left center;
          }

          .door-glow {
            animation: glowPulse 1s infinite;
          }

          .reveal-content {
            animation: reveal .7s ease-out forwards;
          }
        `}</style>

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#e8e3d9]">

          {/* Left Animation Section */}
          <div className="bg-[#111111] text-white min-h-[420px] lg:min-h-[570px] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
                  <FiSmartphone className="text-black text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">MobileSpot</h2>
                  <p className="text-[10px] text-gray-400 tracking-[3px] uppercase">
                    Secure Admin
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-14 mb-5">
              <h2 className="text-2xl font-bold">
                {doorOpen ? 'Access Granted' : loading ? 'Verifying Identity' : 'The Admin Entrance'}
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                {doorOpen
                  ? 'Your secure entrance is opening'
                  : loading
                    ? 'Checking your admin credentials'
                    : 'Only authorized administrators can enter'}
              </p>
            </div>

            {/* Door and Character Animation */}
            <div className="relative w-full max-w-[390px] h-[285px] flex items-end justify-center">

              {/* Floor */}
              <div className="absolute bottom-0 w-full h-[7px] bg-[#5b5145] rounded-full" />

              {/* Door Frame */}
              <div className="absolute bottom-[7px] right-[30px] sm:right-[55px] w-[150px] h-[235px] border-[8px] border-[#8b7960] bg-[#29231d] rounded-t-lg">

                {/* Door */}
                <div
                  className={`absolute inset-0 bg-[#a58b6a] border border-[#c2a783] rounded-sm ${
                    doorOpen ? 'door-opening' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 2
                  }}
                >
                  <div className="absolute inset-3 border border-[#d2b998]/60 rounded-sm" />
                  <div className="absolute top-5 left-5 right-5 h-[70px] border border-[#d2b998]/50 rounded-sm" />
                  <div className="absolute bottom-5 left-5 right-5 h-[85px] border border-[#d2b998]/50 rounded-sm" />
                  <div className="absolute right-3 top-1/2 w-3 h-3 rounded-full bg-[#e8c47e] shadow-lg" />
                </div>

                {/* Inside light */}
                <div className={`absolute inset-0 bg-[#e9c98b] ${doorOpen ? 'door-glow' : ''}`} />
              </div>

              {/* Character */}
              <div
                className={`absolute bottom-[5px] left-[10px] sm:left-[35px] w-[100px] h-[175px] ${
                  loading ? 'character-walk' : ''
                }`}
                style={{ zIndex: 5 }}
              >
                {/* Head */}
                <div className="absolute top-0 left-[34px] w-[38px] h-[42px] rounded-[45%] bg-[#c99068] border-2 border-[#a66f4d]">
                  <div className="absolute top-[17px] right-[5px] w-[4px] h-[4px] bg-[#241b17] rounded-full" />
                  <div className="absolute top-[25px] right-[3px] w-[10px] h-[3px] bg-[#71412d] rounded-full" />
                  <div className="absolute top-[-3px] left-[-2px] w-[42px] h-[13px] bg-[#29201a] rounded-t-full" />
                </div>

                {/* Body */}
                <div className="absolute top-[40px] left-[23px] w-[58px] h-[76px] bg-[#d8d0c0] rounded-t-2xl rounded-b-lg border border-white/20">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-black">
                    MS
                  </div>
                </div>

                {/* Arms */}
                <div className="character-arms absolute top-[45px] left-[12px] w-[17px] h-[55px] bg-[#d8d0c0] rounded-full" />
                <div
                  className={`absolute top-[48px] right-[4px] w-[15px] h-[53px] bg-[#c99068] rounded-full ${
                    loading ? 'character-arms' : ''
                  }`}
                />

                {/* Key */}
                {loading && (
                  <div className="absolute top-[83px] right-[-10px] unlock-key text-[#e8c47e]">
                    <FiKey size={27} />
                  </div>
                )}

                {/* Legs */}
                <div className="absolute top-[108px] left-[31px] flex gap-2">
                  <div className="character-legs w-[15px] h-[48px] bg-[#303b4a] rounded-full">
                    <div className="absolute bottom-0 -left-2 w-[23px] h-[9px] bg-[#d8d0c0] rounded-full" />
                  </div>
                  <div className="character-legs w-[15px] h-[48px] bg-[#303b4a] rounded-full">
                    <div className="absolute bottom-0 -right-2 w-[23px] h-[9px] bg-[#d8d0c0] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <FiShield className="text-[#d8d0c0]" />
              <span>Protected Administrator Entrance</span>
            </div>

            {doorOpen && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                <FiCheck />
                Identity verified successfully
              </div>
            )}
          </div>

          {/* Right Verification Section */}
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">

            <div className="w-14 h-14 bg-[#f1eee7] rounded-2xl flex items-center justify-center mb-7">
              <FiLock className="text-2xl text-[#29251e]" />
            </div>

            <p className="text-xs font-bold tracking-[3px] text-[#9b8b73] uppercase mb-3">
              Restricted Area
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#171717] leading-tight">
              Admin Verification
            </h1>

            <p className="text-sm text-gray-500 mt-4 leading-6">
              Enter the email address associated with your administrator account to unlock the MobileSpot dashboard.
            </p>

            <form onSubmit={verifyAdmin} className="mt-9">

              <label className="block text-sm font-bold text-gray-800 mb-3">
                Administrator Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your admin email"
                  disabled={loading || doorOpen}
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-[#faf9f6] text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition disabled:opacity-60"
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs leading-5">
                  <FiAlertCircle className="text-base shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || doorOpen}
                className="mt-6 w-full h-14 bg-[#111111] hover:bg-[#292929] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin text-lg" />
                    Verifying Email...
                  </>
                ) : doorOpen ? (
                  <>
                    <FiCheck className="text-lg" />
                    Door Unlocked
                  </>
                ) : (
                  <>
                    <FiKey className="text-lg" />
                    Verify & Unlock Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-3">
              <FiShield className="text-gray-400 text-lg shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-5">
                Your access is checked against the MobileSpot database. Only active administrator accounts can enter.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-5 text-sm text-gray-500 hover:text-black transition text-center"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[Arial,sans-serif] reveal-content">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#111111] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <FiSmartphone className="text-black text-xl" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                MobileSpot
              </h1>

              <p className="text-[10px] text-gray-400 tracking-[2px] uppercase">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7 overflow-y-auto">
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[2px] px-3 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#d8d0c0] flex items-center justify-center text-black font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-bold">{userName}</p>
              <p className="text-xs text-gray-500">Manage Store</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu size={23} />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Admin Dashboard
              </h2>

              <p className="text-xs text-gray-500 hidden sm:block">
                Welcome to MobileSpot administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                Store Management
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Individual Admin Pages */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  )
}

export default AdminLayout
