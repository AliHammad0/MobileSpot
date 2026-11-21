
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMessageCircle,
  FiSend,
  FiArrowLeft,
  FiHeadphones,
  FiShield,
  FiWifi,
  FiWifiOff
} from 'react-icons/fi'

import {
  createConversation,
  getMessages,
  connectChatSocket
} from '../services/chatApi'

// Customer Support Intro Animation
const SupportIntroAnimation = () => {
  return (
    <div className="support-intro-overlay">
      <style>{`
        .support-intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f7f6f3;
          font-family: Arial, sans-serif;
          animation: supportOverlayOut .7s ease 3.6s forwards;
        }

        .support-intro-content {
          width: min(100%, 420px);
          text-align: center;
          animation: supportContentIn .7s ease both;
        }

        .support-icon-scene {
          position: relative;
          width: 190px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 22px;
        }

        .support-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 1px solid #d9c9a8;
          border-radius: 50%;
          animation: supportRing 2.5s ease-out infinite;
        }

        .support-ring.second {
          animation-delay: 1.2s;
        }

        .support-main-icon {
          position: relative;
          z-index: 2;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          color: #d6a43a;
          background: #171717;
          box-shadow: 0 18px 40px #17171725;
          animation: supportFloat 2s ease-in-out infinite;
        }

        .support-small-icon {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 15px;
          color: #171717;
          background: white;
          border: 1px solid #e8e3d9;
          box-shadow: 0 8px 24px #17171712;
          opacity: 0;
        }

        .support-small-icon.left {
          top: 15px;
          left: -3px;
          animation: supportBubbleLeft .6s ease .8s forwards;
        }

        .support-small-icon.right {
          right: -3px;
          bottom: 17px;
          color: #c18a25;
          animation: supportBubbleRight .6s ease 1.5s forwards;
        }

        .support-chat-preview {
          width: min(100%, 340px);
          margin: 0 auto;
          padding: 15px;
          border: 1px solid #e8e4dc;
          border-radius: 18px;
          background: white;
          box-shadow: 0 15px 45px #1717170d;
          animation: supportPreviewIn .7s ease 1s both;
        }

        .support-preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0eee9;
          text-align: left;
        }

        .support-preview-avatar {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #d6a43a;
          background: #171717;
        }

        .support-preview-name {
          color: #171717;
          font-size: 12px;
          font-weight: 700;
        }

        .support-preview-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 4px;
          color: #16834b;
          font-size: 10px;
        }

        .support-preview-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
        }

        .support-preview-messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 14px;
        }

        .support-preview-message {
          width: 68%;
          height: 27px;
          border-radius: 12px;
          background: #f1f0ed;
          opacity: 0;
          animation: supportMessageIn .5s ease forwards;
        }

        .support-preview-message.reply {
          width: 58%;
          align-self: flex-end;
          background: #171717;
          animation-delay: 2s;
        }

        .support-preview-message.question {
          animation-delay: 1.6s;
        }

        .support-preview-message.last {
          width: 75%;
          animation-delay: 2.4s;
        }

        .support-intro-title {
          margin-top: 24px;
          color: #171717;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -.6px;
          animation: supportTextIn .6s ease 1.2s both;
        }

        .support-intro-description {
          margin-top: 8px;
          color: #77736d;
          font-size: 13px;
          animation: supportTextIn .6s ease 1.4s both;
        }

        .support-loader {
          width: 105px;
          height: 3px;
          margin: 22px auto 0;
          overflow: hidden;
          border-radius: 10px;
          background: #e5e2dc;
        }

        .support-loader span {
          display: block;
          width: 35%;
          height: 100%;
          border-radius: 10px;
          background: #c58b22;
          animation: supportLoader 1.6s ease-in-out infinite;
        }

        @keyframes supportContentIn {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes supportFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }

        @keyframes supportRing {
          0% { opacity: .7; transform: scale(.75); }
          100% { opacity: 0; transform: scale(1.35); }
        }

        @keyframes supportBubbleLeft {
          from { opacity: 0; transform: translate(-12px, 10px) scale(.7); }
          to { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        @keyframes supportBubbleRight {
          from { opacity: 0; transform: translate(12px, -10px) scale(.7); }
          to { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        @keyframes supportPreviewIn {
          from { opacity: 0; transform: translateY(18px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes supportMessageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes supportTextIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes supportLoader {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(320%); }
        }

        @keyframes supportOverlayOut {
          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        @media (max-width: 480px) {
          .support-icon-scene {
            transform: scale(.88);
            margin-bottom: 5px;
          }

          .support-intro-title {
            font-size: 21px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .support-intro-overlay *,
          .support-intro-overlay {
            animation-duration: .01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      <div className="support-intro-content">
        <div className="support-icon-scene">
          <div className="support-ring" />
          <div className="support-ring second" />

          <div className="support-main-icon">
            <FiHeadphones size={54} />
          </div>

          <div className="support-small-icon left">
            <FiMessageCircle size={22} />
          </div>

          <div className="support-small-icon right">
            <FiSend size={20} />
          </div>
        </div>

        <div className="support-chat-preview">
          <div className="support-preview-header">
            <div className="support-preview-avatar">
              <FiHeadphones size={20} />
            </div>

            <div>
              <p className="support-preview-name">
                MobileSpot Support
              </p>

              <p className="support-preview-status">
                <span />
                Here to help you
              </p>
            </div>
          </div>

          <div className="support-preview-messages">
            <div className="support-preview-message question" />
            <div className="support-preview-message reply" />
            <div className="support-preview-message last" />
          </div>
        </div>

        <h2 className="support-intro-title">
          We're Here to Help!
        </h2>

        <p className="support-intro-description">
          Connect with the MobileSpot support team.
        </p>

        <div className="support-loader">
          <span />
        </div>
      </div>
    </div>
  )
}

const SupportChat = () => {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [showIntro, setShowIntro] = useState(true)

  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const conversationRef = useRef(null)
  const currentMessagesRef = useRef([])
  const pendingMessageRef = useRef(null)

  let currentUser = null

  try {
    currentUser = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    currentUser = null
  }

  const currentUserId = currentUser?._id || currentUser?.id

  // Keep latest conversation available to socket callbacks
  useEffect(() => {
    conversationRef.current = conversation?._id || null
  }, [conversation?._id])

  useEffect(() => {
    currentMessagesRef.current = messages
  }, [messages])

  // Intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 4300)

    return () => clearTimeout(timer)
  }, [])

  // Start Socket.IO immediately
  useEffect(() => {
    let socket

    const handleConnect = () => {
      setConnected(true)
      setError('')

      const conversationId = conversationRef.current

      if (conversationId) {
        socket.emit('join_conversation', conversationId)
      }
    }

    const handleDisconnect = () => {
      setConnected(false)
      setSending(false)
    }

    const handleJoined = () => {
      setConnected(socket.connected)
    }

    const handleNewMessage = (newMessage) => {
      const activeConversationId = conversationRef.current

      const messageConversationId =
        newMessage.conversation?._id || newMessage.conversation

      if (
        !activeConversationId ||
        String(messageConversationId) !== String(activeConversationId)
      ) {
        return
      }

      setMessages(previous => {
        const exists = previous.some(
          item => String(item._id) === String(newMessage._id)
        )

        if (exists) return previous

        const updated = [...previous, newMessage]
        currentMessagesRef.current = updated

        return updated
      })

      setSending(false)
      pendingMessageRef.current = null
    }

    const handleChatError = (errorMessage) => {
      setError(
        typeof errorMessage === 'string'
          ? errorMessage
          : 'Unable to process chat request.'
      )

      setSending(false)
    }

    const handleConnectError = (err) => {
      setConnected(false)
      setError(err.message || 'Chat connection failed.')
    }

    try {
      socket = connectChatSocket()
      socketRef.current = socket

      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      socket.on('joined_conversation', handleJoined)
      socket.on('new_message', handleNewMessage)
      socket.on('chat_error', handleChatError)
      socket.on('connect_error', handleConnectError)

      if (socket.connected) {
        setConnected(true)

        if (conversationRef.current) {
          socket.emit('join_conversation', conversationRef.current)
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to chat.')
    }

    return () => {
      if (socket) {
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
        socket.off('joined_conversation', handleJoined)
        socket.off('new_message', handleNewMessage)
        socket.off('chat_error', handleChatError)
        socket.off('connect_error', handleConnectError)
        socket.disconnect()
      }

      if (socketRef.current === socket) {
        socketRef.current = null
      }

      setConnected(false)
    }
  }, [])

  // Load or create conversation
  useEffect(() => {
    let active = true

    const initializeChat = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await createConversation('support')
        const chat = response.conversation

        if (!chat?._id) {
          throw new Error('Conversation could not be created.')
        }

        if (!active) return

        conversationRef.current = chat._id
        setConversation(chat)

        if (socketRef.current?.connected) {
          socketRef.current.emit('join_conversation', chat._id)
        }

        const messagesResponse = await getMessages(chat._id)

        if (!active) return

        const fetchedMessages = messagesResponse.messages || []

        setMessages(previous => {
          const combined = [...fetchedMessages]

          previous.forEach(item => {
            const exists = combined.some(
              existing => String(existing._id) === String(item._id)
            )

            if (!exists) combined.push(item)
          })

          combined.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt)
          })

          currentMessagesRef.current = combined

          return combined
        })
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load support chat.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    initializeChat()

    return () => {
      active = false
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  // Generate a unique ID for each new message
  const createClientMessageId = () => {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  // Send message with backend acknowledgement
  const handleSend = (e) => {
    e.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || !conversation?._id || sending) return

    const socket = socketRef.current

    if (!socket?.connected) {
      setError('Chat is reconnecting. Please wait a moment.')
      return
    }

    // Reuse the same ID when retrying the same message
    let pendingMessage = pendingMessageRef.current

    if (
      !pendingMessage ||
      pendingMessage.message !== trimmedMessage ||
      pendingMessage.conversationId !== conversation._id
    ) {
      pendingMessage = {
        conversationId: conversation._id,
        message: trimmedMessage,
        clientMessageId: createClientMessageId()
      }

      pendingMessageRef.current = pendingMessage
    }

    setError('')
    setSending(true)

    socket.timeout(15000).emit(
      'send_message',
      pendingMessage,
      (timeoutError, response) => {
        if (timeoutError) {
          setError(
            'Confirmation nahi mili. Internet check karke same message dobara send karein.'
          )
          setSending(false)
          return
        }

        if (!response?.ok) {
          setError(response?.message || 'Message could not be sent.')
          setSending(false)
          return
        }

        const savedMessage = response.message

        if (savedMessage?._id) {
          setMessages(previous => {
            const exists = previous.some(
              item => String(item._id) === String(savedMessage._id)
            )

            if (exists) return previous

            const updated = [...previous, savedMessage]
            currentMessagesRef.current = updated

            return updated
          })
        }

        pendingMessageRef.current = null
        setMessage('')
        setSending(false)
        setError('')
      }
    )
  }

  const formatTime = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-3 py-8 font-[Arial,sans-serif] sm:px-6">

      {showIntro && <SupportIntroAnimation />}

      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-amber-700"
        >
          <FiArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

          {/* Chat Header */}
          <div className="flex items-center justify-between gap-3 bg-[#171717] px-5 py-5 text-white sm:px-7">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-black">
                <FiHeadphones size={25} />
              </div>

              <div>
                <h1 className="text-lg font-bold">
                  Customer Support
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                  MobileSpot Support Team
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
              {connected ? (
                <FiWifi className="text-green-400" size={15} />
              ) : (
                <FiWifiOff className="text-gray-400" size={15} />
              )}

              <span className="text-xs font-medium">
                {connected
                  ? 'Connected'
                  : socketRef.current?.active
                    ? 'Reconnecting'
                    : 'Connecting'}
              </span>
            </div>

          </div>

          {/* Security Info */}
          <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-5 py-3 text-xs text-amber-800 sm:px-7">
            <FiShield size={16} />
            Your conversation is private and secure.
          </div>

          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto bg-[#fafafa] px-4 py-6 sm:px-7">

            {loading ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-100 border-t-amber-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading your conversation...
                </p>
              </div>
            ) : error && !conversation ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FiMessageCircle size={40} className="text-gray-300" />

                <p className="mt-4 text-sm font-semibold text-gray-700">
                  Unable to open chat
                </p>

                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-7 text-center">
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-500">
                    Start of conversation
                  </span>

                  <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-gray-500">
                    Welcome to MobileSpot! Send us your question.
                    Our support team will assist you.
                  </p>
                </div>

                <div className="space-y-5">
                  {messages.map(item => {
                    const senderId =
                      item.sender?._id || item.sender

                    const isMine =
                      String(senderId) === String(currentUserId)

                    return (
                      <div
                        key={item._id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 sm:max-w-[70%] ${
                            isMine
                              ? 'rounded-2xl rounded-br-sm bg-[#171717] text-white'
                              : 'rounded-2xl rounded-bl-sm border border-gray-100 bg-white text-gray-800 shadow-sm'
                          }`}
                        >
                          {!isMine && (
                            <p className="mb-1 text-[11px] font-bold text-amber-700">
                              Support Team
                            </p>
                          )}

                          <p className="break-words text-sm leading-6">
                            {item.message}
                          </p>

                          <p className="mt-2 text-right text-[10px] text-gray-400">
                            {formatTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                  {messages.length === 0 && (
                    <div className="py-8 text-center">
                      <FiMessageCircle
                        size={32}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        No messages yet. Start chatting with us!
                      </p>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </>
            )}

          </div>

          {/* Error */}
          {error && conversation && (
            <div className="border-t border-red-100 bg-red-50 px-5 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-gray-100 bg-white p-4 sm:p-5"
          >
            <input
              type="text"
              value={message}
              onChange={e => {
                setMessage(e.target.value)

                if (
                  pendingMessageRef.current &&
                  pendingMessageRef.current.message !== e.target.value.trim()
                ) {
                  pendingMessageRef.current = null
                }
              }}
              placeholder="Type your message..."
              disabled={!conversation || sending}
              className="h-12 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!message.trim() || sending || !connected}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <FiSend size={19} />
            </button>
          </form>

          <div className="border-t border-gray-100 px-5 py-3 text-center text-[11px] text-gray-400">
            MobileSpot Customer Support
          </div>

        </div>
      </div>
    </div>
  )
}

export default SupportChat
