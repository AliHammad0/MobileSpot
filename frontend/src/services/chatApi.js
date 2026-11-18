
import { io } from 'socket.io-client'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://mobilespot-backend.vercel.app/api/v1'

// Separate Enzonic Socket.IO server
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  'https://mobilespot.enzonic.dev'

const getToken = () => localStorage.getItem('token')

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()

  if (!token) {
    throw new Error('Please login first.')
  }

  const response = await fetch(`${API_URL}/chat${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

// Create Support or Order Conversation
export const createConversation = async (chatType, orderId = null) => {
  return apiRequest('/conversation', {
    method: 'POST',
    body: JSON.stringify({
      chatType,
      ...(orderId ? { orderId } : {})
    })
  })
}

// Get Customer or Admin Conversations
export const getConversations = async () => {
  return apiRequest('/conversations')
}

// Get Conversation Messages
export const getMessages = async (conversationId) => {
  return apiRequest(`/messages/${conversationId}`)
}

// Send Message Through REST API
export const sendChatMessage = async (conversationId, message) => {
  return apiRequest(`/messages/${conversationId}`, {
    method: 'POST',
    body: JSON.stringify({ message })
  })
}

// Connect Socket.IO
export const connectChatSocket = () => {
  const token = getToken()

  if (!token) {
    throw new Error('Please login first.')
  }

  const socket = io(SOCKET_URL, {
    auth: {
      token
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })

  return socket
}
