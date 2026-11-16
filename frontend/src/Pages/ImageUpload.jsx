
import React, { useState } from 'react'

const ImageUpload = ({ token, onUpload }) => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError('')
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image first')
      return
    }

    try {
      setLoading(true)
      setError('')

      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch(
        'http://localhost:8080/api/v1/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed')
      }

      onUpload?.(data.image.url)
      setImage(null)
      setPreview('')
      alert('Image uploaded successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md font-[Arial]">
      <label className="mb-2 block text-sm font-semibold">
        Product Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full rounded-lg border border-gray-300 p-3 text-sm"
      />

      {preview && (
        <img
          src={preview}
          alt="Product preview"
          className="mt-4 h-40 w-40 rounded-lg border object-contain"
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!image || loading}
        className="mt-4 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  )
}

export default ImageUpload
