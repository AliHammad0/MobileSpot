
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FiMessageCircle,
  FiSend,
  FiUser,
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

const ChatInbox = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')

  const socketRef = useRef(null)
  const selectedRef = useRef(null)
  const joinedRef = useRef(false)
  const bottomRef = useRef(null)

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

  // Socket connection and real-time messages
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
      })

      socket.on('joined_conversation', (data) => {
        if (
          data.conversationId === selectedRef.current?._id
        ) {
          joinedRef.current = true
        }
      })

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
  }, [])

  // Join selected conversation
  useEffect(() => {
    const socket = socketRef.current

    if (!socket?.connected || !selectedConversation?._id) {
      joinedRef.current = false
      return
    }

    joinedRef.current = false

    socket.emit('join_conversation', selectedConversation._id)

    return () => {
      joinedRef.current = false
    }
  }, [selectedConversation?._id])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  // Select conversation
  const handleSelectConversation = (conversation) => {
    setError('')
    setSending(false)
    setMessage('')
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

      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-[#171717] sm:text-3xl">
              Customer Chats
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage customer support conversations.
            </p>
          </div>

          <button
            onClick={loadConversations}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-amber-500 hover:text-amber-700"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>

        </div>

        {/* Chat Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total Conversations
              </p>

              <FiMessageCircle size={21} className="text-amber-600" />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {conversations.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Open Conversations
              </p>

              <FiHeadphones size={21} className="text-green-600" />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {conversations.filter(
                (item) => item.status === 'open'
              ).length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Closed Conversations
              </p>

              <FiMessageCircle size={21} className="text-gray-500" />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {conversations.filter(
                (item) => item.status === 'closed'
              ).length}
            </h2>
          </div>

        </div>

        {/* Main Chat Layout */}
        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[350px_1fr]">

          {/* Conversation List */}
          <div className="flex flex-col border-b border-gray-200 lg:border-b-0 lg:border-r">

            <div className="border-b border-gray-100 px-5 py-5">
              <h2 className="font-bold text-gray-900">
                Conversations
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {conversations.length} customer chats
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">

              {loading ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <FiMessageCircle
                    size={35}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-600">
                    No conversations yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
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
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full border-b border-gray-100 p-4 text-left transition ${
                        isSelected
                          ? 'bg-amber-50'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#171717] text-amber-400">
                          <FiUser size={20} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-sm font-bold text-gray-900">
                              {getCustomerName(conversation)}
                            </h3>

                            <span className="shrink-0 text-[10px] text-gray-400">
                              {formatDate(conversation.lastMessageAt)}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {conversation.lastMessage || 'No messages yet'}
                          </p>

                          <div className="mt-2 flex items-center justify-between">

                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] capitalize text-gray-600">
                              {conversation.chatType}
                            </span>

                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                              conversation.status === 'open'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {conversation.status}
                            </span>

                          </div>

                        </div>
                      </div>
                    </button>
                  )
                })
              )}

            </div>
          </div>

          {/* Chat Window */}
          <div className="flex min-h-[550px] flex-col bg-[#fafafa]">

            {!selectedConversation ? (
              <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <FiMessageCircle size={36} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-gray-800">
                  Select a Conversation
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Choose a customer from the conversations list to view messages and reply.
                </p>

              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#171717] text-amber-400">
                      <FiUser size={20} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-gray-900">
                        {getCustomerName(selectedConversation)}
                      </h2>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {selectedConversation.customer?.email || 'Customer Support'}
                      </p>
                    </div>

                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-xs">

                    {connected ? (
                      <>
                        <FiWifi className="text-green-600" />
                        <span className="text-green-700">Online</span>
                      </>
                    ) : (
                      <>
                        <FiWifiOff className="text-gray-400" />
                        <span className="text-gray-500">Offline</span>
                      </>
                    )}

                  </div>

                </div>

                {/* Messages */}
                <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">

                  {messagesLoading ? (
                    <div className="py-10 text-center text-sm text-gray-500">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-12 text-center">
                      <FiMessageCircle
                        size={32}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        No messages in this conversation yet.
                      </p>
                    </div>
                  ) : (
                    messages.map((item) => {
                      const isAdmin = item.senderRole === 'admin'

                      return (
                        <div
                          key={item._id}
                          className={`flex ${
                            isAdmin ? 'justify-end' : 'justify-start'
                          }`}
                        >

                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                            isAdmin
                              ? 'rounded-br-sm bg-[#171717] text-white'
                              : 'rounded-bl-sm border border-gray-100 bg-white text-gray-800 shadow-sm'
                          }`}>

                            {!isAdmin && (
                              <p className="mb-1 text-[11px] font-bold text-amber-700">
                                {item.sender?.name || 'Customer'}
                              </p>
                            )}

                            {isAdmin && (
                              <p className="mb-1 text-[11px] font-bold text-amber-400">
                                You
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
                    })
                  )}

                  <div ref={bottomRef} />

                </div>

                {/* Error */}
                {error && (
                  <div className="border-t border-red-100 bg-red-50 px-5 py-2 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 border-t border-gray-200 bg-white p-4 sm:p-5"
                >

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      selectedConversation.status === 'open'
                        ? 'Write a reply...'
                        : 'This conversation is closed'
                    }
                    disabled={
                      selectedConversation.status !== 'open' || sending
                    }
                    className="h-12 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={
                      !message.trim() ||
                      sending ||
                      !connected ||
                      selectedConversation.status !== 'open'
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send reply"
                  >
                    <FiSend size={19} />
                  </button>

                </form>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default ChatInbox
