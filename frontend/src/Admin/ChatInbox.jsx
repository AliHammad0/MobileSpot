
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FiMessageCircle,
  FiSend,
  FiRefreshCw,
  FiWifi,
  FiWifiOff,
  FiHeadphones
} from 'react-icons/fi'

import {
  getConversations,
  getMessages,
  connectChatSocket
} from '../services/chatApi'

// Customer Support Intro Animation
const ChatIntroAnimation = () => {
  return (
    <div className="chat-intro-overlay">
      <style>{`
        .chat-intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f6f3;
          animation: chatOverlayOut .7s ease 3.8s forwards;
          font-family: Arial, sans-serif;
        }

        .chat-intro-scene {
          width: min(90%, 520px);
          text-align: center;
          animation: chatSceneIn .7s ease both;
        }

        .chat-agent {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 0 auto 24px;
          animation: agentFloat 2s ease-in-out infinite;
        }

        .agent-head {
          position: absolute;
          width: 76px;
          height: 76px;
          top: 22px;
          left: 52px;
          border: 5px solid #171717;
          border-radius: 50%;
          background: #d9a47c;
          z-index: 1;
        }

        .agent-hair {
          position: absolute;
          width: 76px;
          height: 34px;
          top: 17px;
          left: 52px;
          border-radius: 45px 45px 12px 12px;
          background: #171717;
          z-index: 2;
        }

        .agent-body {
          position: absolute;
          width: 126px;
          height: 72px;
          left: 27px;
          bottom: 0;
          border-radius: 65px 65px 15px 15px;
          background: #171717;
        }

        .agent-headset {
          position: absolute;
          width: 91px;
          height: 90px;
          top: 12px;
          left: 44px;
          border: 8px solid #c58b22;
          border-bottom: 0;
          border-radius: 55px 55px 0 0;
          z-index: 3;
        }

        .agent-mic {
          position: absolute;
          width: 32px;
          height: 5px;
          top: 91px;
          left: 106px;
          border-radius: 10px;
          background: #c58b22;
          transform: rotate(15deg);
          z-index: 4;
        }

        .agent-eye {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #171717;
          top: 57px;
          z-index: 4;
        }

        .agent-eye.left { left: 73px; }
        .agent-eye.right { left: 103px; }

        .chat-bubble {
          position: absolute;
          padding: 10px 14px;
          border-radius: 14px;
          background: white;
          border: 1px solid #e5e2dc;
          color: #171717;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 8px 25px #0000000d;
          opacity: 0;
        }

        .bubble-one {
          top: 5px;
          right: -65px;
          animation: bubbleShow .6s ease 1s forwards;
        }

        .bubble-two {
          bottom: 20px;
          left: -75px;
          animation: bubbleShow .6s ease 2s forwards;
        }

        .chat-screen {
          width: min(100%, 360px);
          margin: 0 auto;
          padding: 14px;
          border: 1px solid #e5e2dc;
          border-radius: 18px;
          background: white;
          box-shadow: 0 20px 60px #17171712;
          animation: screenAppear .8s ease 1.4s both;
        }

        .screen-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eeeae4;
        }

        .screen-avatar {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #171717;
          color: #d6a43a;
        }

        .screen-lines {
          flex: 1;
          text-align: left;
        }

        .screen-line {
          height: 7px;
          margin: 5px 0;
          border-radius: 10px;
          background: #e9e7e2;
        }

        .screen-line.short { width: 45%; }
        .screen-line.long { width: 75%; }

        .screen-messages {
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding-top: 13px;
        }

        .screen-message {
          width: 65%;
          height: 25px;
          border-radius: 12px;
          background: #f1f0ed;
          animation: messageAppear .5s ease both;
        }

        .screen-message.admin {
          width: 55%;
          align-self: flex-end;
          background: #171717;
          animation-delay: 2.2s;
        }

        .screen-message.customer {
          animation-delay: 1.8s;
        }

        .screen-message.last {
          width: 75%;
          animation-delay: 2.6s;
        }

        .chat-intro-title {
          margin-top: 23px;
          color: #171717;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -.5px;
          animation: titleAppear .7s ease 1.2s both;
        }

        .chat-intro-subtitle {
          margin-top: 8px;
          color: #77736d;
          font-size: 13px;
          animation: titleAppear .7s ease 1.5s both;
        }

        .chat-intro-loader {
          width: 110px;
          height: 3px;
          margin: 22px auto 0;
          overflow: hidden;
          border-radius: 10px;
          background: #e5e2dc;
        }

        .chat-intro-loader span {
          display: block;
          width: 35%;
          height: 100%;
          border-radius: 10px;
          background: #c58b22;
          animation: loaderMove 2s ease-in-out infinite;
        }

        /* Live Typing Indicator */

        .admin-typing {
          display: flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          padding: 12px 15px;
          border: 1px solid #eeeae4;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          background: white;
          box-shadow: 0 3px 12px #17171708;
        }

        .admin-typing-text {
          color: #77736d;
          font-size: 11px;
          font-weight: 600;
        }

        .admin-typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .admin-typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c58b22;
          animation: adminTypingBounce .6s ease-in-out infinite alternate;
        }

        .admin-typing-dots span:nth-child(2) {
          animation-delay: .2s;
        }

        .admin-typing-dots span:nth-child(3) {
          animation-delay: .4s;
        }

        @keyframes adminTypingBounce {
          from { transform: translateY(2px); opacity: .4; }
          to { transform: translateY(-3px); opacity: 1; }
        }

        @keyframes chatSceneIn {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes agentFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes bubbleShow {
          from { opacity: 0; transform: translateY(12px) scale(.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes screenAppear {
          from { opacity: 0; transform: translateY(18px) scale(.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes messageAppear {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes titleAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes loaderMove {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(320%); }
        }

        @keyframes chatOverlayOut {
          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        @media (max-width: 480px) {
          .chat-agent {
            transform: scale(.85);
            margin-bottom: 5px;
          }

          .chat-intro-title {
            font-size: 20px;
          }

          .bubble-one { right: -35px; }
          .bubble-two { left: -35px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .chat-intro-overlay *,
          .chat-intro-overlay {
            animation-duration: .01ms !important;
            animation-delay: 0ms !important;
          }

          .admin-typing-dots span {
            animation: none;
          }
        }
      `}</style>

      <div className="chat-intro-scene">
        <div className="chat-agent">
          <div className="agent-body" />
          <div className="agent-head" />
          <div className="agent-hair" />
          <div className="agent-eye left" />
          <div className="agent-eye right" />
          <div className="agent-headset" />
          <div className="agent-mic" />

          <div className="chat-bubble bubble-one">
            Hello!
          </div>

          <div className="chat-bubble bubble-two">
            How can I help?
          </div>
        </div>

        <div className="chat-screen">
          <div className="screen-header">
            <div className="screen-avatar">
              <FiHeadphones size={17} />
            </div>

            <div className="screen-lines">
              <div className="screen-line long" />
              <div className="screen-line short" />
            </div>
          </div>

          <div className="screen-messages">
            <div className="screen-message customer" />
            <div className="screen-message admin" />
            <div className="screen-message customer last" />
          </div>
        </div>

        <h2 className="chat-intro-title">
          Customer Support
        </h2>

        <p className="chat-intro-subtitle">
          Your conversations, all in one place.
        </p>

        <div className="chat-intro-loader">
          <span />
        </div>
      </div>
    </div>
  )
}

const ChatInbox = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [customerOnline, setCustomerOnline] = useState(false)
  const [customerTyping, setCustomerTyping] = useState(false)
  const [error, setError] = useState('')
  const [showIntro, setShowIntro] = useState(true)

  const socketRef = useRef(null)
  const selectedRef = useRef(null)
  const joinedRef = useRef(false)
  const bottomRef = useRef(null)
  const typingTimerRef = useRef(null)
  const typingActiveRef = useRef(false)

  // Current logged-in admin
  let currentUser = null

  try {
    currentUser = JSON.parse(
      localStorage.getItem('user') || 'null'
    )
  } catch {
    currentUser = null
  }

  const currentUserId = currentUser?._id || currentUser?.id

  // Show intro animation every time page opens
  useEffect(() => {
    setShowIntro(true)

    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  // Keep selected conversation updated
  useEffect(() => {
    selectedRef.current = selectedConversation
  }, [selectedConversation])

  // Load all conversations
  const loadConversations = useCallback(async () => {
    try {
      setError('')

      const response = await getConversations()
      const list = response.conversations || []

      setConversations(list)

      setSelectedConversation((previous) => {
        if (!previous) return null

        return list.find(
          (item) => item._id === previous._id
        ) || null
      })
    } catch (err) {
      setError(err.message || 'Unable to load conversations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Load messages of selected conversation
  useEffect(() => {
    if (!selectedConversation?._id) {
      setMessages([])
      return
    }

    let active = true

    const loadChatMessages = async () => {
      try {
        setMessagesLoading(true)
        setError('')
        setMessages([])

        const response = await getMessages(selectedConversation._id)

        if (active) {
          setMessages(response.messages || [])
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load messages.')
        }
      } finally {
        if (active) setMessagesLoading(false)
      }
    }

    loadChatMessages()

    return () => {
      active = false
    }
  }, [selectedConversation?._id])

  // Socket connection and real-time events
  useEffect(() => {
    let socket

    try {
      socket = connectChatSocket()
      socketRef.current = socket

      socket.on('connect', () => {
        setConnected(true)

        const activeConversation = selectedRef.current

        if (activeConversation?._id) {
          joinedRef.current = false
          socket.emit('join_conversation', activeConversation._id)
        }
      })

      socket.on('disconnect', () => {
        setConnected(false)
        joinedRef.current = false
        setCustomerOnline(false)
        setCustomerTyping(false)
      })

      socket.on('joined_conversation', (data) => {
        if (
          data?.conversationId === selectedRef.current?._id
        ) {
          joinedRef.current = true
        }
      })

      // Customer online/offline status
      socket.on('participant_status', (data) => {
        if (
          data?.conversationId !== selectedRef.current?._id ||
          data?.role !== 'customer'
        ) {
          return
        }

        setCustomerOnline(Boolean(data.online))
      })

      // Customer started typing
      socket.on('user_typing', (data) => {
        if (
          data?.conversationId !== selectedRef.current?._id
        ) {
          return
        }

        // Ignore our own typing event
        if (
          currentUserId &&
          String(data.userId) === String(currentUserId)
        ) {
          return
        }

        setCustomerTyping(true)
      })

      // Customer stopped typing
      socket.on('user_stop_typing', (data) => {
        if (
          data?.conversationId !== selectedRef.current?._id
        ) {
          return
        }

        if (
          currentUserId &&
          String(data.userId) === String(currentUserId)
        ) {
          return
        }

        setCustomerTyping(false)
      })

      // Receive real-time messages
      socket.on('new_message', (newMessage) => {
        const conversationId =
          typeof newMessage.conversation === 'object'
            ? newMessage.conversation?._id
            : newMessage.conversation

        const activeConversation = selectedRef.current

        if (conversationId === activeConversation?._id) {
          setMessages((previous) => {
            const exists = previous.some(
              (item) => item._id === newMessage._id
            )

            if (exists) return previous

            return [...previous, newMessage]
          })

          setSending(false)
          setCustomerTyping(false)
        }

        // Update conversation preview
        setConversations((previous) =>
          previous.map((item) =>
            item._id === conversationId
              ? {
                  ...item,
                  lastMessage: newMessage.message,
                  lastMessageAt: newMessage.createdAt
                }
              : item
          )
        )
      })

      socket.on('chat_error', (errorMessage) => {
        setError(
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Chat operation failed.'
        )

        setSending(false)
      })

      socket.on('connect_error', (err) => {
        setConnected(false)
        setError(err.message || 'Socket connection failed.')
      })
    } catch (err) {
      setError(err.message || 'Unable to connect to chat.')
    }

    return () => {
      socket?.disconnect()
      socketRef.current = null
      joinedRef.current = false
      setConnected(false)
    }
  }, [currentUserId])

  // Join selected conversation
  useEffect(() => {
    const socket = socketRef.current

    setCustomerTyping(false)
    setCustomerOnline(false)
    joinedRef.current = false

    if (!socket?.connected || !selectedConversation?._id) {
      return
    }

    socket.emit('join_conversation', selectedConversation._id)

    return () => {
      joinedRef.current = false
    }
  }, [selectedConversation?._id, connected])

  // Stop admin typing
  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }

    if (
      typingActiveRef.current &&
      socketRef.current?.connected &&
      selectedRef.current?._id
    ) {
      socketRef.current.emit('stop_typing', {
        conversationId: selectedRef.current._id,
        userId: currentUserId
      })
    }

    typingActiveRef.current = false
  }, [currentUserId])

  // Admin typing event
  const handleTyping = (value) => {
    setMessage(value)

    if (
      !socketRef.current?.connected ||
      !joinedRef.current ||
      selectedConversation?.status !== 'open'
    ) {
      return
    }

    if (value.trim()) {
      if (!typingActiveRef.current) {
        typingActiveRef.current = true

        socketRef.current.emit('typing', {
          conversationId: selectedConversation._id,
          userId: currentUserId
        })
      }

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current)
      }

      typingTimerRef.current = setTimeout(() => {
        stopTyping()
      }, 1200)
    } else {
      stopTyping()
    }
  }

  // Cleanup typing timer
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current)
      }
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages, customerTyping])

  // Select conversation
  const handleSelectConversation = (conversation) => {
    stopTyping()
    setError('')
    setSending(false)
    setMessage('')
    setCustomerTyping(false)
    setCustomerOnline(false)
    setSelectedConversation(conversation)
  }

  // Send admin message
  const handleSendMessage = (e) => {
    e.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || sending) return

    if (!socketRef.current?.connected || !joinedRef.current) {
      setError('Please wait until the chat is connected.')
      return
    }

    if (selectedConversation?.status !== 'open') {
      setError('This conversation is closed.')
      return
    }

    stopTyping()
    setError('')
    setSending(true)

    socketRef.current.emit('send_message', {
      conversationId: selectedConversation._id,
      message: trimmedMessage
    })

    setMessage('')
  }

  // Format time
  const formatTime = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCustomerName = (conversation) => {
    return conversation.customer?.name || 'Customer'
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-3 font-[Arial,sans-serif] sm:p-6">

      {showIntro && <ChatIntroAnimation />}

      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[3px] text-amber-700">
            Admin Dashboard
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Customer Chats
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer conversations and provide support.
          </p>
        </div>

        <button
          type="button"
          onClick={loadConversations}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw
            size={15}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Conversations
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {conversations.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Open Conversations
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {conversations.filter((item) => item.status === 'open').length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Closed Conversations
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-500">
            {conversations.filter((item) => item.status === 'closed').length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Socket Connection
          </p>

          <div className="mt-3 flex items-center gap-2">
            {connected ? (
              <FiWifi size={18} className="text-green-600" />
            ) : (
              <FiWifiOff size={18} className="text-red-500" />
            )}

            <span className={`text-lg font-bold ${
              connected ? 'text-green-600' : 'text-red-500'
            }`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

      </div>

      {/* Chat Layout */}
      <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[340px_minmax(0,1fr)]">

        {/* Conversation Sidebar */}
        <aside className="flex min-h-[350px] flex-col border-b border-gray-200 bg-white lg:border-b-0 lg:border-r">

          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">
                Conversations
              </h2>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {conversations.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Select a customer to open chat
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <FiMessageCircle
                  size={38}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 font-semibold text-gray-700">
                  No conversations yet
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Customer messages will appear here.
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const isSelected =
                  selectedConversation?._id === conversation._id

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() =>
                      handleSelectConversation(conversation)
                    }
                    className={`w-full border-b border-gray-100 p-4 text-left transition ${
                      isSelected
                        ? 'border-l-4 border-l-amber-600 bg-amber-50'
                        : 'border-l-4 border-l-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e7d5] text-sm font-bold text-amber-900">
                          {getCustomerName(conversation)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {getCustomerName(conversation)}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {conversation.customer?.email || 'Customer'}
                          </p>
                        </div>
                      </div>

                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        conversation.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {conversation.status || 'open'}
                      </span>

                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-gray-500">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>

                      <span className="shrink-0 text-[10px] text-gray-400">
                        {conversation.lastMessageAt
                          ? formatTime(conversation.lastMessageAt)
                          : ''}
                      </span>
                    </div>
                  </button>
                )
              })
            )}

          </div>
        </aside>

        {/* Chat Window */}
        <section className="flex min-h-[600px] min-w-0 flex-col bg-[#faf9f7]">

          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1e7d5]">
                <FiMessageCircle size={38} className="text-amber-800" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Welcome to Customer Support
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Select a conversation from the sidebar to view messages and reply to your customer.
              </p>

            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e7d5] font-bold text-amber-900">
                    {getCustomerName(selectedConversation)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-gray-900">
                      {getCustomerName(selectedConversation)}
                    </h2>

                    <p className="truncate text-xs text-gray-500">
                      {selectedConversation.customer?.email || 'Customer'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2">
                    <span className={`h-2 w-2 rounded-full ${
                      customerOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />

                    <span className={`text-xs font-semibold ${
                      customerOnline ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {customerOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <span className={`rounded-full px-3 py-2 text-xs font-bold uppercase ${
                    selectedConversation.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {selectedConversation.status || 'open'}
                  </span>

                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">

                <div className="mb-5 text-center">
                  <span className="rounded-full bg-white px-4 py-2 text-[11px] font-medium text-gray-400 shadow-sm">
                    Conversation started{' '}
                    {formatDate(selectedConversation.createdAt)}
                  </span>
                </div>

                {messagesLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-gray-500">
                      No messages in this conversation yet.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdminMessage =
                      msg.sender?.isAdmin === true ||
                      msg.senderRole === 'admin' ||
                      msg.role === 'admin'

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex ${
                          isAdminMessage
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${
                          isAdminMessage
                            ? 'rounded-br-sm bg-[#262626] text-white'
                            : 'rounded-bl-sm border border-gray-100 bg-white text-gray-800'
                        }`}>
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {msg.message || msg.content}
                          </p>

                          <div className={`mt-2 flex items-center justify-end gap-2 text-[10px] ${
                            isAdminMessage
                              ? 'text-gray-300'
                              : 'text-gray-400'
                          }`}>
                            <span>
                              {formatTime(msg.createdAt)}
                            </span>

                            {isAdminMessage && (
                              <span aria-label="Sent">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}

                {/* Customer Typing Indicator */}
                {customerTyping && (
                  <div className="flex justify-start">
                    <div className="admin-typing">

                      <div className="admin-typing-dots">
                        <span />
                        <span />
                        <span />
                      </div>

                      <span className="admin-typing-text">
                        Customer is typing...
                      </span>

                    </div>
                  </div>
                )}

                <div ref={bottomRef} />

              </div>

              {/* Error Message */}
              {error && (
                <div className="mx-4 mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6">
                  {error}
                </div>
              )}

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4 sm:p-5">

                {selectedConversation.status !== 'open' ? (
                  <div className="rounded-xl bg-gray-100 px-4 py-4 text-center">
                    <p className="text-sm font-semibold text-gray-500">
                      This conversation is closed.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-3"
                  >
                    <div className="min-w-0 flex-1">

                      <textarea
                        value={message}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter' &&
                            !e.shiftKey
                          ) {
                            e.preventDefault()
                            handleSendMessage(e)
                          }
                        }}
                        placeholder="Type your message..."
                        rows={2}
                        disabled={sending}
                        className="max-h-32 min-h-[52px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <p className="mt-2 text-[10px] text-gray-400">
                        Press Enter to send · Shift + Enter for a new line
                      </p>

                    </div>

                    <button
                      type="submit"
                      disabled={!message.trim() || sending || !connected}
                      className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#262626] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {sending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Sending
                        </>
                      ) : (
                        <>
                          Send
                          <FiSend size={16} />
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default ChatInbox
