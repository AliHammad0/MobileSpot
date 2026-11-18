
import React, { useEffect, useState } from 'react'
import { FiUsers, FiTrash2, FiRefreshCw } from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/users'

const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  // Get authentication token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Please login first.')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }

  // Get all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/all`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      setUsers(data.users || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmDelete) return

    try {
      setDeleting(id)
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      )

      alert(data.message || 'User deleted successfully')
    } catch (error) {
      setError(error.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] p-6 font-[Arial]">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage registered users
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Total Users */}
      <div className="mb-6 max-w-xs rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-[#f1eee7] p-3">
            <FiUsers size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              {users.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            onClick={() => setError('')}
            className="font-semibold"
          >
            Close
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Registered Users
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            View and manage all registered accounts
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <FiRefreshCw className="mx-auto mb-3 animate-spin" size={22} />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FiUsers className="mx-auto mb-3" size={30} />
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">

              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isAdmin
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deleting === user._id}
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <FiTrash2 size={15} />

                        {deleting === user._id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllUsers
