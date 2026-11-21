
import { io } from 'socket.io-client'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://mobilespot-backend.vercel.app/api/v1'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  'https://mobilespot.enzonic.dev'

// Shared Socket.IO connection
let chatSocket = null
let activeToken = null

const getToken = () => localStorage.getItem('token')

// REST API request
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

  // Reuse existing connection if same user is logged in
  if (chatSocket && activeToken === token) {
    if (!chatSocket.connected && !chatSocket.active) {
      chatSocket.connect()
    }

    return chatSocket
  }

  // Close old connection if token has changed
  if (chatSocket) {
    chatSocket.removeAllListeners()
    chatSocket.disconnect()
    chatSocket = null
  }

  activeToken = token

  chatSocket = io(SOCKET_URL, {
    auth: {
      token
    },

    autoConnect: false,

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,

    timeout: 20000,

    transports: ['websocket', 'polling'],

    upgrade: true,

    forceNew: false
  })

  // Start connection immediately
  chatSocket.connect()

  return chatSocket
}

// Disconnect and clear shared connection on logout
export const disconnectChatSocket = () => {
  if (chatSocket) {
    chatSocket.removeAllListeners()
    chatSocket.disconnect()
    chatSocket = null
    activeToken = null
  }
}
