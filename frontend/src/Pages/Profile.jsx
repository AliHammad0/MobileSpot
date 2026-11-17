
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiHeart,
  FiEdit2,
  FiLogOut,
  FiCamera
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [imageError, setImageError] = useState(false)

  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState('')
  const [ordersError, setOrdersError] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setOrdersLoading(true)

        const profileResponse = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const profileData = await profileResponse.json()

        if (!profileResponse.ok || !profileData.ok) {
          if (
            profileResponse.status === 401 ||
            profileResponse.status === 403
          ) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
            return
          }

          throw new Error(profileData.message || 'Unable to load profile')
        }

        const userData = profileData.user

        setUser(userData)
        setImageError(false)

        localStorage.setItem('user', JSON.stringify(userData))

        try {
          const ordersResponse = await fetch(
            `${API_URL}/order/my-orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const ordersData = await ordersResponse.json()

          if (!ordersResponse.ok || !ordersData.ok) {
            throw new Error(
              ordersData.message || 'Unable to load orders'
            )
          }

          setOrders(
            Array.isArray(ordersData.orders)
              ? ordersData.orders
              : Array.isArray(ordersData.data)
                ? ordersData.data
                : []
          )
        } catch (orderError) {
          setOrdersError(orderError.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
        setOrdersLoading(false)
      }
    }

    fetchProfileData()
  }, [navigate])

  const profileImage =
    user?.profileImage ||
    user?.avatar ||
    user?.image ||
    ''

  // Upload and save profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setUploading(true)
      setUploadError('')

      // Upload image
      const formData = new FormData()
      formData.append('image', file)

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Image upload failed')
      }

      const imageUrl =
        uploadData.image?.url ||
        uploadData.url ||
        uploadData.image

      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('Image URL was not returned by server.')
      }

      // Save image URL in user profile
      const updateResponse = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          profileImage: imageUrl
        })
      })

      const updateData = await updateResponse.json()

      if (!updateResponse.ok || !updateData.ok) {
        throw new Error(
          updateData.message || 'Unable to save profile image'
        )
      }

      const updatedUser = {
        ...user,
        ...(updateData.user || {}),
        profileImage: imageUrl
      }

      setUser(updatedUser)
      setImageError(false)

      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString('en-PK')}`
  }

  const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getProductNames = (order) => {
    if (!Array.isArray(order.orderItems) || !order.orderItems.length) {
      return 'Mobile order'
    }

    return order.orderItems.map(
      item => item.name || item.product?.name || 'Product'
    ).join(', ')
  }

  const getStatus = (order) => {
    return order.orderStatus || order.status || 'Processing'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6] font-[Arial]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6] px-4 font-[Arial]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <p className="text-red-500 mb-5">{error}</p>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Login Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] py-10 px-4 sm:px-6 font-[Arial]">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Home / My Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your personal information and orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <div className="flex flex-col items-center text-center">

              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-[#f0eee8] flex items-center justify-center overflow-hidden border-4 border-[#eee8df]">
                  {profileImage && !imageError ? (
                    <img
                      src={profileImage}
                      alt={user?.name || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <FiUser size={45} className="text-[#9b7c54]" />
                  )}
                </div>

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition shadow-md"
                  title="Change profile picture"
                >
                  {uploading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCamera size={17} />
                  )}
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>

              <p className="text-xs text-gray-400 mb-3">
                {uploading ? 'Uploading image...' : 'Click camera to change photo'}
              </p>

              {uploadError && (
                <p className="text-xs text-red-500 mb-3">
                  {uploadError}
                </p>
              )}

              <h2 className="text-xl font-bold text-black">
                {user?.name || 'User'}
              </h2>

              <p className="text-sm text-gray-500 mt-1 break-all">
                {user?.email || 'No email available'}
              </p>

              {user?.isAdmin && (
                <span className="mt-3 bg-black text-white text-xs px-4 py-1.5 rounded-full">
                  Admin
                </span>
              )}
            </div>

            <div className="border-t border-gray-100 my-6" />

            <div className="space-y-3">
              <Link
                to="/edit-profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                <FiEdit2 size={18} />
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                <FiPackage size={18} />
                <span className="text-sm font-medium">My Orders</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                <FiHeart size={18} />
                <span className="text-sm font-medium">My Wishlist</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-500 transition"
              >
                <FiLogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Profile Information and Orders */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  Personal Information
                </h2>

                <Link
                  to="/edit-profile"
                  className="text-sm font-semibold text-black hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <FiUser className="text-gray-500 mt-1" size={19} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {user?.name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="text-gray-500 mt-1" size={19} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email Address</p>
                    <p className="font-medium text-gray-800 break-all">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-gray-500 mt-1" size={19} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-800">
                      {user?.phone || user?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-500 mt-1" size={19} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Address</p>
                    <p className="font-medium text-gray-800">
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-500 mt-1" size={19} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">City</p>
                    <p className="font-medium text-gray-800">
                      {user?.city || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Recent Orders
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your latest purchases
                  </p>
                </div>

                <Link
                  to="/orders"
                  className="text-sm font-semibold text-black hover:underline"
                >
                  View All
                </Link>
              </div>

              {ordersLoading ? (
                <div className="py-10 text-center">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Loading your orders...
                  </p>
                </div>
              ) : ordersError ? (
                <div className="py-8 text-center">
                  <p className="text-red-500 text-sm">{ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FiPackage size={28} className="text-gray-400" />
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No Orders Yet
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Your placed orders will appear here.
                  </p>

                  <Link
                    to="/mobiles"
                    className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => {
                    const status = getStatus(order)

                    return (
                      <div
                        key={order._id}
                        className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-lg bg-[#f0eee8] flex items-center justify-center shrink-0">
                              <FiPackage size={21} className="text-black" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-black break-all">
                                Order #{order._id?.slice(-8).toUpperCase()}
                              </p>

                              <p className="text-sm text-gray-500 mt-1 break-words">
                                {getProductNames(order)}
                              </p>

                              <p className="text-xs text-gray-400 mt-2">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="font-bold text-black">
                              {formatPrice(order.totalPrice)}
                            </p>

                            <span
                              className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                                status.toLowerCase() === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : status.toLowerCase() === 'cancelled'
                                    ? 'bg-red-100 text-red-600'
                                    : status.toLowerCase() === 'shipped'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
