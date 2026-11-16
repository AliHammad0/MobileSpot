import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiZap,
} from 'react-icons/fi'
import { setCartForUser } from '../redux/slices/cartSlice'

const API_URL = 'http://localhost:8080/api/v1/users'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const saveLoginData = (data) => {
    if (!data.token || !data.user) {
      throw new Error('Login response does not contain a token or user.')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    dispatch(setCartForUser(data.user))

    if (!localStorage.getItem('token') || !localStorage.getItem('user')) {
      throw new Error('Unable to save login session.')
    }
  }

  const redirectAfterLogin = () => {
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 1200)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Login failed.')
      }

      saveLoginData(data)
      setSuccess('Login successful!')
      redirectAfterLogin()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    setError('')
    setSuccess('')

    const credential = credentialResponse?.credential

    if (!credential) {
      setError('Google credential was not received.')
      return
    }

    setGoogleLoading(true)

    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Google login failed.')
      }

      saveLoginData(data)
      setSuccess('Google login successful!')
      redirectAfterLogin()
    } catch (err) {
      console.error('Google Login Error:', err)
      setError(err.message || 'Google login failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f6f3] font-[Arial]">

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-center justify-center p-4 sm:p-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_25px_90px_rgba(0,0,0,0.10)] lg:grid-cols-2"
        >

          {/* LEFT SIDE */}

          <div className="relative hidden min-h-[750px] overflow-hidden bg-[#171717] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 9, repeat: Infinity }}
              className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-amber-500/20 blur-[90px]"
            />

            <motion.div
              animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-orange-600/20 blur-[100px]"
            />

            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '25px 25px',
              }}
            />

            <Link to="/" className="relative z-10 inline-block w-fit">
              <h2 className="text-3xl font-extrabold tracking-tight">
                MOBILE<span className="text-amber-500">SPOT</span>
              </h2>
              <p className="mt-1 text-xs tracking-[0.3em] text-gray-400">
                PREMIUM MOBILE STORE
              </p>
            </Link>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center">

              <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="relative"
              >
                <div className="absolute inset-0 scale-125 rounded-full bg-amber-500/20 blur-[60px]" />

                <div className="relative h-[350px] w-[185px] rounded-[35px] border-[7px] border-[#555] bg-[#080808] p-2 shadow-2xl">

                  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-[#333] via-[#181818] to-[#080808]">

                    <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <FiSmartphone size={90} className="text-amber-500" />
                    </motion.div>

                    <h3 className="mt-5 text-xl font-extrabold">
                      MOBILE<span className="text-amber-500">SPOT</span>
                    </h3>

                    <p className="mt-2 text-[9px] tracking-[0.3em] text-gray-400">
                      YOUR TECH DESTINATION
                    </p>

                    <div className="mt-7 flex gap-2">
                      {[1, 2, 3].map((item) => (
                        <motion.span
                          key={item}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: item * 0.3,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                </div><motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -left-20 top-16 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg"
                >
                  <FiShoppingBag size={27} className="text-amber-400" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -right-16 top-32 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg"
                >
                  <FiShield size={25} className="text-green-400" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -12, 0],
                    rotate: 360,
                  }}
                  transition={{
                    y: { duration: 2.5, repeat: Infinity },
                    rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                  }}
                  className="absolute -bottom-5 -right-12 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500"
                >
                  <FiStar size={22} className="text-black" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-14 text-center"
              >
                <h2 className="text-3xl font-extrabold leading-tight">
                  Technology Meets
                  <span className="block text-amber-500">
                    Your Lifestyle.
                  </span>
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-gray-400">
                  Discover premium smartphones, amazing deals
                  and an incredible shopping experience.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-7">
              <div className="text-center">
                <FiShield className="mx-auto mb-2 text-amber-500" size={23} />
                <p className="text-xs font-semibold">Secure Shopping</p>
              </div>

              <div className="text-center">
                <FiTruck className="mx-auto mb-2 text-amber-500" size={23} />
                <p className="text-xs font-semibold">Fast Delivery</p>
              </div>

              <div className="text-center">
                <FiZap className="mx-auto mb-2 text-amber-500" size={23} />
                <p className="text-xs font-semibold">Best Deals</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex min-h-[700px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-16">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-md"
            >

              <motion.div variants={itemVariants} className="mb-10 text-center lg:hidden">
                <Link to="/" className="text-3xl font-extrabold">
                  MOBILE<span className="text-amber-600">SPOT</span>
                </Link>
                <p className="mt-1 text-[10px] tracking-[0.3em] text-gray-400">
                  PREMIUM MOBILE STORE
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <FiLock size={23} />
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
                  Welcome Back
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-[#171717] sm:text-4xl">
                  Login to Your
                  <span className="block text-amber-600">
                    Account.
                  </span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter your details to continue your shopping journey.
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 250 }}
                    >
                      <FiCheck size={22} />
                    </motion.div>
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Email Address
                  </label>

                  <div className="group flex items-center rounded-xl border border-gray-200 bg-[#fafafa] px-4 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(217,119,6,0.08)]">
                    <FiMail className="text-gray-400 transition-colors group-focus-within:text-amber-600" size={19} />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Password
                  </label>

                  <div className="group flex items-center rounded-xl border border-gray-200 bg-[#fafafa] px-4 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(217,119,6,0.08)]">
                    <FiLock className="text-gray-400 transition-colors group-focus-within:text-amber-600" size={19} />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
                    />

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 transition hover:text-amber-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                    <input type="checkbox" className="h-4 w-4 accent-amber-600" />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-bold text-amber-700 transition hover:text-black"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || googleLoading || !!success}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 12px 25px rgba(180,120,35,0.25)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#171717] py-4 text-sm font-bold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Logging in...
                    </>
                  ) : (
                    <>
                      {success ? 'Login Successful' : 'Login to Account'}
                      <FiArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </motion.form>
              <motion.div variants={itemVariants} className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400">
                  OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
                <div className={`flex justify-center transition-opacity ${
                  loading || googleLoading || success ? 'pointer-events-none opacity-50' : ''
                }`}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      setError('Google login failed. Please try again.')
                    }}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="320"
                  />
                </div>

                {googleLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-amber-600"
                    />
                    Signing in with Google...
                  </div>
                )}
              </motion.div>

              <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-extrabold text-amber-700 transition hover:text-black"
                >
                  Create Account
                </Link>
              </motion.p>

              <motion.div variants={itemVariants} className="mt-6 border-t border-gray-100 pt-5 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 transition hover:text-black"
                >
                  <FiArrowRight className="rotate-180" />
                  Back to Home
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-7 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <FiShield className="text-green-600" size={15} />
                Your account information is protected.
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
