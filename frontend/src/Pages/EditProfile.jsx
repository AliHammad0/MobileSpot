
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiSave,
  FiArrowLeft,
  FiCamera,
  FiX
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1'

const EditProfile = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const [profileImage, setProfileImage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [showSuccess, setShowSuccess] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          city: user.city || ''
        })

        setProfileImage(
          user.profileImage ||
          user.avatar ||
          user.image ||
          ''
        )

      } catch (error) {
        setMessage(error.message || 'Something went wrong.')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate, token])

  useEffect(() => {
    if (!selectedImage) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedImage)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      showMessage('Please select a valid image.', 'error')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image must be 5MB or smaller.', 'error')
      e.target.value = ''
      return
    }

    setSelectedImage(file)
    showMessage('')
  }

  const removeImage = () => {
    setSelectedImage(null)
    setPreview('')
    setProfileImage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)
      showMessage('')

      let imageUrl = profileImage

      // Upload image first
      if (selectedImage) {
        showMessage('Uploading profile image...')

        const uploadFormData = new FormData()
        uploadFormData.append('image', selectedImage)

        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: uploadFormData
        })

        const uploadData = await uploadResponse.json().catch(() => ({}))

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Image upload failed.')
        }

        imageUrl = uploadData.image?.url || uploadData.url

        if (!imageUrl) {
          throw new Error('Image URL was not returned.')
        }
      }

      showMessage('Saving profile...')

      const updatedData = {
        ...formData,
        profileImage: imageUrl
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
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

      setProfileImage(imageUrl)
      setSelectedImage(null)
      setShowSuccess(true)

      setTimeout(() => {
        navigate('/profile', { replace: true })
      }, 2500)

    } catch (error) {
      showMessage(error.message || 'Something went wrong.', 'error')
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
            Update your personal information and profile picture.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-10"
        >

          {/* Profile Image */}
          <div className="mb-9 flex flex-col items-center border-b border-gray-100 pb-8">

            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#eee8df] bg-[#f8f7f4]">

                {preview || profileImage ? (
                  <img
                    src={preview || profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="text-5xl text-[#9b7c54]" />
                )}

              </div>

              <label
                htmlFor="profileImage"
                className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#171717] text-white shadow-lg transition hover:bg-[#9b7c54]"
              >
                <FiCamera size={18} />
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#171717]">
              Profile Picture
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG or WEBP. Maximum 5MB.
            </p>

            {(preview || profileImage) && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                <FiX />
                Remove Image
              </button>
            )}

          </div>

          {/* Personal Information */}
          <h2 className="mb-6 text-lg font-bold text-[#171717]">
            Personal Information
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">

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
            <p className={`mt-7 rounded-lg p-3 text-sm ${
              messageType === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
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

          <div className="w-full max-w-sm rounded-3xl bg-white px-7 py-10 text-center shadow-2xl">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#171717] text-white">
              <svg viewBox="0 0 50 50" className="h-12 w-12" fill="none">
                <path
                  d="M12 25L21 34L39 16"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-[#9b7c54]">
              Successfully Updated
            </p>

            <h2 className="mt-3 text-2xl font-bold text-[#171717]">
              Profile Updated!
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your personal information has been saved successfully.
            </p>

            <p className="mt-7 text-xs font-semibold text-[#9b7c54]">
              Redirecting to your profile...
            </p>

          </div>
        </div>
      )}

    </div>
  )
}

export default EditProfile
