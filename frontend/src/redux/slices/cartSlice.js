
import { createSlice } from '@reduxjs/toolkit'

const getUserCartKey = (user) => {
  if (!user) return 'cart_guest'

  const userId = user._id || user.id || user.email

  return userId ? `cart_${String(userId).toLowerCase()}` : 'cart_guest'
}

const getCartFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const cartKey = getUserCartKey(user)

    const savedCart = localStorage.getItem(cartKey)

    if (savedCart) {
      return JSON.parse(savedCart)
    }

    // Purana cart current logged-in user ke account mein migrate karo
    if (user) {
      const oldCart = localStorage.getItem('cart')

      if (oldCart) {
        const parsedCart = JSON.parse(oldCart)

        localStorage.setItem(cartKey, JSON.stringify(parsedCart))
        localStorage.removeItem('cart')

        return parsedCart
      }
    }

    return []
  } catch {
    return []
  }
}

const saveCartToStorage = (cartItems) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const cartKey = getUserCartKey(user)

    localStorage.setItem(cartKey, JSON.stringify(cartItems))
  } catch (error) {
    console.error('Cart storage error:', error)
  }
}

const initialState = {
  cartItems: getCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    // Login par us account ka cart load karo
    setCartForUser: (state, action) => {
      const user = action.payload
      const cartKey = getUserCartKey(user)

      try {
        const savedCart = localStorage.getItem(cartKey)

        state.cartItems = savedCart ? JSON.parse(savedCart) : []
      } catch {
        state.cartItems = []
      }
    },

    addToCart: (state, action) => {
      const product = action.payload

      const existingItem = state.cartItems.find(
        (item) => item._id === product._id
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
        })
      }

      saveCartToStorage(state.cartItems)
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      )

      saveCartToStorage(state.cartItems)
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      )

      if (item) {
        item.quantity += 1
      }

      saveCartToStorage(state.cartItems)
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      )

      if (item && item.quantity > 1) {
        item.quantity -= 1
      }

      saveCartToStorage(state.cartItems)
    },

    clearCart: (state) => {
      state.cartItems = []
      saveCartToStorage(state.cartItems)
    },
  },
})

export const {
  setCartForUser,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
