const API_URL = 'http://localhost:8080/api/v1/coupon'

// Validate Coupon
export const validateCoupon = async (code, subtotal) => {
  const response = await fetch(`${API_URL}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code.trim().toUpperCase(),
      subtotal: Number(subtotal)
    })
  })

  const data = await response.json()

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Coupon validation failed')
  }

  return data
}