
const API_URL = 'http://localhost:8080/api/v1/products'

// Common API Request
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Get All Products
export const getProducts = async () => {
  return apiRequest(API_URL)
}

// Get Single Product
export const getProductById = async (id) => {
  return apiRequest(`${API_URL}/${id}`)
}

// Create Product
export const createProduct = async (productData) => {
  return apiRequest(API_URL, {
    method: 'POST',
    body: JSON.stringify(productData),
  })
}

// Update Product
export const updateProduct = async (id, productData) => {
  return apiRequest(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  })
}

// Delete Product
export const deleteProduct = async (id) => {
  return apiRequest(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}

// Get Recommended Products
export const getRecommendedProducts = async () => {
  return apiRequest(`${API_URL}/recommended`)
}
