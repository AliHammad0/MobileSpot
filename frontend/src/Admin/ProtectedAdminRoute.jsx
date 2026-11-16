
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    user = null
  }

  // Login nahi hai
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Normal user hai
  if (user.isAdmin !== true) {
    return <Navigate to="/" replace />
  }

  // Admin hai
  return <Outlet />
}

export default ProtectedAdminRoute
