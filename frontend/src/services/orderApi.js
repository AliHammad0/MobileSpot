
const API_URL = 'http://localhost:8080/api/v1/order'

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Create Order
export const createOrder = async (orderData) => {
  return apiRequest(API_URL, {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

// Get My Orders
export const getMyOrders = async () => {
  return apiRequest(`${API_URL}/my-orders`)
}

// Get Single Order
export const getOrderById = async (id) => {
  return apiRequest(`${API_URL}/${id}`)
}

// Get All Orders (Admin)
export const getAllOrders = async () => {
  return apiRequest(API_URL)
}

// Update Order Status (Admin)
export const updateOrderStatus = async (id, orderStatus) => {
  return apiRequest(`${API_URL}/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ orderStatus })
  })
}

// Cancel My Order
export const cancelMyOrder = async (id) => {
  return apiRequest(`${API_URL}/${id}/cancel`, {
    method: 'PUT'
  })
}

// Delete Cancelled Order
export const deleteMyOrder = async (id) => {
  return apiRequest(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
}
