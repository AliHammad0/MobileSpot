
import React, { useEffect, useState } from 'react'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1'

const initialForm = {
  name: '',
  brand: '',
  model: '',
  category: 'Mobile Phones',
  description: '',
  price: '',
  oldPrice: '',
  discount: '',
  stock: '',
  rating: 0,
  expressDelivery: false,
  isFeatured: false,
  specifications: {
    display: '',
    processor: '',
    ram: '',
    storage: '',
    rearCamera: '',
    frontCamera: '',
    battery: '',
    operatingSystem: '',
    network: ''
  },
  colors: ''
}

const AddProduct = () => {
  const [form, setForm] = useState(initialForm)
  const [selectedImages, setSelectedImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')

  const token = localStorage.getItem('token')

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 5) {
      showMessage('Maximum 5 images allowed.', 'error')
      e.target.value = ''
      return
    }

    const invalidFile = files.find(file => !file.type.startsWith('image/'))

    if (invalidFile) {
      showMessage('Only image files are allowed.', 'error')
      e.target.value = ''
      return
    }

    const largeFile = files.find(file => file.size > 5 * 1024 * 1024)

    if (largeFile) {
      showMessage('Each image must be 5MB or smaller.', 'error')
      e.target.value = ''
      return
    }

    setSelectedImages(files)
    setPreviews(files.map(file => URL.createObjectURL(file)))
    showMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      showMessage('Please login first.', 'error')
      return
    }

    if (selectedImages.length === 0) {
      showMessage('Please select at least one product image.', 'error')
      return
    }

    try {
      setLoading(true)
      showMessage('Uploading images...')

      const uploadedImageUrls = []

      for (const image of selectedImages) {
        const formData = new FormData()
        formData.append('image', image)

        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })

        const uploadData = await uploadResponse.json().catch(() => ({}))

        if (!uploadResponse.ok) {
          if (uploadResponse.status === 401 || uploadResponse.status === 403) {
            throw new Error(
              uploadData.message || 'Admin access denied. Please check your admin account.'
            )
          }

          throw new Error(uploadData.message || 'Image upload failed.')
        }

        const imageUrl = uploadData.image?.url || uploadData.url

        if (!imageUrl) {
          throw new Error('Image URL was not returned by the upload API.')
        }

        uploadedImageUrls.push(imageUrl)
      }

      showMessage('Saving product...')

      const productData = {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice || 0),
        discount: Number(form.discount || 0),
        stock: Number(form.stock || 0),
        rating: Number(form.rating || 0),
        images: uploadedImageUrls,
        colors: form.colors
          .split(',')
          .map(color => color.trim())
          .filter(Boolean)
      }

      const productResponse = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      const productResult = await productResponse.json().catch(() => ({}))

      if (!productResponse.ok) {
        if (productResponse.status === 401 || productResponse.status === 403) {
          throw new Error(
            productResult.message || 'Access denied. Your account is not authorized as admin.'
          )
        }

        throw new Error(productResult.message || 'Product creation failed.')
      }

      setForm(initialForm)
      setSelectedImages([])
      setPreviews([])
      e.target.reset()

      showMessage('Product added successfully!', 'success')
    } catch (error) {
      showMessage(error.message || 'Something went wrong.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black'

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-[Arial]">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-sm md:p-10">

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Add New Mobile
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          Add mobile details and upload product images.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">

          <div className="grid gap-5 md:grid-cols-2">
            <input className={inputClass} name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />

            <input className={inputClass} name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />

            <input className={inputClass} name="model" placeholder="Model" value={form.model} onChange={handleChange} required />

            <select className={inputClass} name="category" value={form.category} onChange={handleChange}>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Accessories">Accessories</option>
            </select>

            <input className={inputClass} name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />

            <input className={inputClass} name="oldPrice" type="number" min="0" placeholder="Old Price" value={form.oldPrice} onChange={handleChange} />

            <input className={inputClass} name="discount" type="number" min="0" max="100" placeholder="Discount (%)" value={form.discount} onChange={handleChange} />

            <input className={inputClass} name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} />
          </div>

          <textarea
            className={inputClass}
            name="description"
            placeholder="Product Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div>
            <h2 className="mb-3 text-lg font-bold">Product Images</h2>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <div className="mt-4 flex flex-wrap gap-4">
              {previews.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Product preview ${index + 1}`}
                  className="h-28 w-28 rounded-lg border object-contain"
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Maximum 5 images, 5MB per image.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold">Specifications</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.keys(form.specifications).map(key => (
                <input
                  key={key}
                  className={inputClass}
                  name={key}
                  placeholder={key.replace(/([A-Z])/g, ' $1')}
                  value={form.specifications[key]}
                  onChange={handleSpecificationChange}
                />
              ))}
            </div>
          </div>

          <input
            className={inputClass}
            name="colors"
            placeholder="Colors (comma separated)"
            value={form.colors}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="expressDelivery"
                checked={form.expressDelivery}
                onChange={handleChange}
              />
              Express Delivery
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>
          </div>

          {message && (
            <p className={`rounded-lg p-3 text-sm ${
              messageType === 'error'
                ? 'bg-red-50 text-red-700'
                : messageType === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-700'
            }`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 'Add Product'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddProduct
