
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
  FiSmartphone
} from 'react-icons/fi'

const navigation = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: FiGrid,
    end: true
  },
  {
    name: 'All Products',
    path: '/products',
    icon: FiPackage
  },
  {
    name: 'Add Product',
    path: '/add',
    icon: FiPlusCircle
  },
  {
    name: 'All Users',
    path: '/all',
    icon: FiUsers
  },
  {
    name: 'All Orders',
    path: '/admin/orders',
    icon: FiShoppingBag
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: FiSettings
  }
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[Arial,sans-serif]">

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
              A
            </div>

            <div>
              <p className="text-sm font-bold">Administrator</p>
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
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Store Management
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              A
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
