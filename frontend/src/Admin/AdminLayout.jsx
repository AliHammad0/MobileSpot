
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const AdminLayout = () => {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}').email || ''
    } catch {
      return ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('idle')
  const [error, setError] = useState('')

  const userName = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}').name || 'Administrator'
    } catch {
      return 'Administrator'
    }
  })()

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
      setError('Please enter your administrator email.')
      return
    }

    setError('')
    setLoading(true)
    setStage('checking')

    try {
      // First verify email from backend database
      const response = await fetch(`${API_URL}/users/verify-admin-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        })
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Admin verification failed.')
      }

      // Animation starts only after successful backend verification
      setStage('walking')
      await wait(1400)

      setStage('unlocking')
      await wait(900)

      setStage('opening')
      await wait(1300)

      setStage('complete')
      await wait(350)

      setVerified(true)

    } catch (err) {
      setStage('denied')
      setError(err.message || 'Unable to verify administrator.')
    } finally {
      setLoading(false)
    }
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] font-[Arial,sans-serif] flex items-center justify-center p-4">
        <style>{`
          @keyframes characterWalk {
            0% { transform: translateX(0); }
            100% { transform: translateX(145px); }
          }

          @keyframes legMove {
            0%, 100% { transform: rotate(25deg); }
            50% { transform: rotate(-25deg); }
          }

          @keyframes armMove {
            0%, 100% { transform: rotate(-25deg); }
            50% { transform: rotate(25deg); }
          }

          @keyframes keyTurn {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(85deg); }
          }

          @keyframes doorSwing {
            0% { transform: perspective(800px) rotateY(0deg); }
            100% { transform: perspective(800px) rotateY(-100deg); }
          }

          @keyframes lightGlow {
            0% { opacity: .2; }
            100% { opacity: 1; }
          }

          @keyframes deniedShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-7px); }
            75% { transform: translateX(7px); }
          }

          @keyframes dashboardReveal {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .character-walking {
            animation: characterWalk 1.4s ease-in-out forwards;
          }

          .character-leg {
            transform-origin: top center;
          }

          .character-walking .character-leg {
            animation: legMove .24s infinite;
          }

          .character-walking .character-arm {
            animation: armMove .24s infinite;
          }

          .character-unlocking .character-arm {
            transform: rotate(-65deg);
            transform-origin: top center;
            transition: transform .4s ease;
          }

          .key-turning {
            animation: keyTurn .8s ease-in-out forwards;
            transform-origin: center;
          }

          .door-opening {
            animation: doorSwing 1.2s ease-in-out forwards;
            transform-origin: left center;
          }

          .inside-light {
            animation: lightGlow 1s ease forwards;
          }

          .denied-animation {
            animation: deniedShake .35s ease;
          }

          .dashboard-reveal {
            animation: dashboardReveal .6s ease-out;
          }
        `}</style>

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#e8e3d9]">

          {/* LEFT: CHARACTER AND DOOR ANIMATION */}
          <section className="bg-[#111111] text-white min-h-[470px] lg:min-h-[590px] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            <div className="absolute top-8 left-8 flex items-center gap-3">
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

            <div className="text-center mt-14 mb-5">
              <h2 className="text-2xl font-bold">
                {stage === 'checking' && 'Checking Credentials'}
                {stage === 'walking' && 'Welcome Administrator'}
                {stage === 'unlocking' && 'Unlocking Entrance'}
                {stage === 'opening' && 'Access Granted'}
                {stage === 'complete' && 'Welcome Inside'}
                {stage === 'denied' && 'Access Denied'}
                {stage === 'idle' && 'The Admin Entrance'}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                {stage === 'checking' && 'Verifying your email with our database'}
                {stage === 'walking' && 'Our staff is approaching the entrance'}
                {stage === 'unlocking' && 'The key is unlocking the door'}
                {stage === 'opening' && 'Opening your secure entrance'}
                {stage === 'complete' && 'Preparing your dashboard'}
                {stage === 'denied' && 'This account cannot enter'}
                {stage === 'idle' && 'Only authorized administrators can enter'}
              </p>
            </div>

            {/* DOOR SCENE */}
            <div className="relative w-full max-w-[390px] h-[285px] flex items-end justify-center">

              {/* Floor */}
              <div className="absolute bottom-0 w-full h-[7px] bg-[#5b5145] rounded-full" />

              {/* Door frame */}
              <div className="absolute bottom-[7px] right-[25px] sm:right-[45px] w-[155px] h-[235px] border-[8px] border-[#8b7960] bg-[#29231d] rounded-t-lg">

                {/* Light behind door */}
                <div
                  className={`absolute inset-0 bg-[#f2d39b] ${
                    stage === 'opening' || stage === 'complete' ? 'inside-light' : ''
                  }`}
                />

                {/* Door panel */}
                <div
                  className={`absolute inset-0 bg-[#a58b6a] border border-[#c2a783] rounded-sm ${
                    stage === 'opening' || stage === 'complete' ? 'door-opening' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 3
                  }}
                >
                  <div className="absolute inset-3 border border-[#d2b998]/60 rounded-sm" />
                  <div className="absolute top-5 left-5 right-5 h-[70px] border border-[#d2b998]/50 rounded-sm" />
                  <div className="absolute bottom-5 left-5 right-5 h-[85px] border border-[#d2b998]/50 rounded-sm" />
                  <div className="absolute right-3 top-1/2 w-3 h-3 rounded-full bg-[#e8c47e] shadow-lg" />
                </div>
              </div>

              {/* CHARACTER */}
              <div
                className={`absolute bottom-[5px] left-[5px] sm:left-[25px] w-[100px] h-[175px] ${
                  stage === 'walking' ? 'character-walking' : ''
                } ${
                  stage === 'unlocking' ? 'character-unlocking' : ''
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
                <div className="character-arm absolute top-[45px] left-[12px] w-[17px] h-[55px] bg-[#d8d0c0] rounded-full" />

                <div className="character-arm absolute top-[48px] right-[4px] w-[15px] h-[53px] bg-[#c99068] rounded-full">
                  {(stage === 'unlocking' || stage === 'opening') && (
                    <div className="absolute top-[35px] right-[-17px] text-[#e8c47e] key-turning">
                      <FiKey size={27} />
                    </div>
                  )}
                </div>

                {/* Legs */}
                <div className="absolute top-[108px] left-[31px] flex gap-2">
                  <div className="character-leg relative w-[15px] h-[48px] bg-[#303b4a] rounded-full">
                    <div className="absolute bottom-0 -left-2 w-[23px] h-[9px] bg-[#d8d0c0] rounded-full" />
                  </div>

                  <div className="character-leg relative w-[15px] h-[48px] bg-[#303b4a] rounded-full">
                    <div className="absolute bottom-0 -right-2 w-[23px] h-[9px] bg-[#d8d0c0] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Animation status */}
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <FiShield className="text-[#d8d0c0]" />
              <span>Protected Administrator Entrance</span>
            </div>

            {stage === 'complete' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                <FiCheck />
                Identity verified successfully
              </div>
            )}

            {stage === 'denied' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                <FiAlertCircle />
                Administrator access rejected
              </div>
            )}
          </section>

          {/* RIGHT: EMAIL VERIFICATION */}
          <section className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">

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
                    if (stage === 'denied') setStage('idle')
                  }}
                  placeholder="Enter your admin email"
                  disabled={loading || stage === 'opening' || stage === 'complete'}
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-[#faf9f6] text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition disabled:opacity-60"
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs leading-5 denied-animation">
                  <FiAlertCircle className="text-base shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full h-14 bg-[#111111] hover:bg-[#292929] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin text-lg" />
                    {stage === 'checking' ? 'Verifying Email...' : 'Unlocking Door...'}
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
                Access is checked against the MobileSpot database. Only active administrator accounts can enter.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-5 text-sm text-gray-500 hover:text-black transition text-center"
            >
              Back to Login
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[Arial,sans-serif] dashboard-reveal">

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
