
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiSave,
  FiArrowLeft,
} from 'react-icons/fi'

const API_URL = 'http://localhost:8080/api/v1/users/me'

const EditProfile = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok || !data.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
            return
          }

          throw new Error(data.message || 'Failed to fetch profile.')
        }

        const user = data.user

        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
        })

      } catch (error) {
        setMessage(error.message || 'Something went wrong.')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      showMessage('Please login first.', 'error')
      return
    }

    try {
      setSaving(true)
      showMessage('', 'info')

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

        throw new Error(data.message || 'Failed to update profile.')
      }

      localStorage.setItem('user', JSON.stringify(data.user))

      setShowSuccess(true)

      setTimeout(() => {
        navigate('/profile', { replace: true })
      }, 2500)

    } catch (error) {
      showMessage(error.message || 'Something went wrong.', 'error')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#9b7c54]'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4] font-[Arial]">
        <p className="text-sm font-semibold text-gray-600">
          Loading profile...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-10 font-[Arial]">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#9b7c54]"
          >
            <FiArrowLeft />
            Back to Profile
          </button>

          <h1 className="text-3xl font-bold text-[#171717]">
            Edit Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your personal information.
          </p>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-10"
        >
          <h2 className="mb-6 text-lg font-bold text-[#171717]">
            Personal Information
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b7c54]" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b7c54]" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Address
              </label>

              <div className="relative">
                <FiMapPin className="absolute left-4 top-4 text-[#9b7c54]" />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  className={`${inputClass} resize-none pl-11`}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                City
              </label>

              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b7c54]" />

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <p
              className={`mt-7 rounded-lg p-3 text-sm ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {message}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate('/profile')}
              disabled={saving}
              className="rounded-lg border border-gray-200 px-7 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || showSuccess}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9b7c54] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave />
              {saving ? 'Please Wait...' : 'Save Changes'}
            </button>

          </div>
        </form>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">

          <style>{`
            @keyframes successPop {
              0% {
                transform: scale(0.3);
                opacity: 0;
              }
              70% {
                transform: scale(1.12);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes checkDraw {
              from {
                stroke-dashoffset: 50;
              }
              to {
                stroke-dashoffset: 0;
              }
            }

            @keyframes successFade {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .success-pop {
              animation: successPop 0.65s cubic-bezier(.16,1,.3,1) both;
            }

            .success-check {
              stroke-dasharray: 50;
              stroke-dashoffset: 50;
              animation: checkDraw 0.5s ease forwards 0.45s;
            }

            .success-content {
              animation: successFade 0.6s ease both 0.2s;
            }

            @media (prefers-reduced-motion: reduce) {
              .success-pop,
              .success-check,
              .success-content {
                animation: none;
              }

              .success-check {
                stroke-dashoffset: 0;
              }
            }
          `}</style>

          <div className="success-pop relative w-full max-w-sm overflow-hidden rounded-3xl bg-white px-7 py-10 text-center shadow-2xl">

            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#eee8df]">
              <div className="absolute inset-2 rounded-full border border-[#c2a47e]/40" />

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#171717] shadow-lg">
                <svg
                  viewBox="0 0 50 50"
                  className="h-12 w-12"
                  fill="none"
                >
                  <path
                    d="M12 25L21 34L39 16"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="success-check"
                  />
                </svg>
              </div>
            </div>

            <div className="success-content relative mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b7c54]">
                Successfully Updated
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#171717]">
                Profile Updated!
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your personal information has been saved successfully.
              </p>

              <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-[#9b7c54]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#9b7c54]" />
                Redirecting to your profile...
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile
