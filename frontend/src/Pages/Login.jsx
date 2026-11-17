
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
  FiGift,
  FiHeart,
  FiUser,
} from 'react-icons/fi'
import { setCartForUser } from '../redux/slices/cartSlice'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/users'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const floatingIcons = [
  { Icon: FiShoppingBag, x: -125, y: -90, delay: 0 },
  { Icon: FiShield, x: 125, y: -85, delay: 0.15 },
  { Icon: FiStar, x: -145, y: 65, delay: 0.3 },
  { Icon: FiGift, x: 145, y: 65, delay: 0.45 },
  { Icon: FiHeart, x: 0, y: -135, delay: 0.6 },
  { Icon: FiZap, x: 0, y: 115, delay: 0.75 },
]

const LoginCharacter = () => {
  const [cardInserted, setCardInserted] = useState(false)

  return (
    <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center">

      {/* Animation Area */}

      <div className="relative flex h-[340px] w-full items-center justify-center sm:h-[390px]">

        {/* Background Glow */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute h-64 w-64 rounded-full bg-amber-500 blur-[75px] sm:h-80 sm:w-80"
        />

        {/* Slot */}

        <div className="absolute right-3 top-10 z-10 flex flex-col items-center sm:right-8 sm:top-12">

          <div className="relative flex h-24 w-32 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl sm:h-28 sm:w-36">

            <div className="absolute inset-x-5 top-4 h-2 rounded-full bg-white/10" />

            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(245,158,11,0)',
                  '0 0 25px rgba(245,158,11,0.8)',
                  '0 0 0px rgba(245,158,11,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-9 w-20 items-center justify-center rounded-lg border-2 border-amber-500 bg-black sm:w-24"
            >
              <div className="h-1.5 w-12 rounded-full bg-amber-500" />
            </motion.div>

            <div className="absolute -bottom-2 h-3 w-20 rounded-full bg-amber-500/20 blur-md" />
          </div>

          <p className="mt-3 text-[9px] font-bold tracking-[0.25em] text-amber-400">
            LOGIN SLOT
          </p>
        </div>

        {/* Character */}

        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-3 left-1/2 z-20 h-[235px] w-[185px] -translate-x-1/2 sm:bottom-2 sm:h-[260px] sm:w-[210px]"
        >

          {/* Head */}

          <div className="absolute left-1/2 top-0 z-20 h-[85px] w-[85px] -translate-x-1/2 rounded-[35px] border-4 border-[#d9a16e] bg-[#f0bd91] shadow-xl sm:h-[95px] sm:w-[95px]">

            {/* Hair */}

            <div className="absolute -top-3 left-1/2 h-9 w-[88px] -translate-x-1/2 rounded-t-[35px] bg-[#26201c] sm:w-[98px]" />

            <div className="absolute left-4 top-9 flex gap-5">
              <span className="h-2 w-2 rounded-full bg-[#25201c]" />
              <span className="h-2 w-2 rounded-full bg-[#25201c]" />
            </div>

            <div className="absolute bottom-5 left-1/2 h-2 w-5 -translate-x-1/2 rounded-full border-b-2 border-[#a45e48]" />
          </div>

          {/* Body */}

          <div className="absolute bottom-0 left-1/2 h-[145px] w-[145px] -translate-x-1/2 rounded-t-[55px] rounded-b-2xl border-2 border-white/10 bg-gradient-to-b from-amber-500 to-amber-700 shadow-2xl sm:h-[160px] sm:w-[165px]">

            <div className="absolute left-1/2 top-7 h-16 w-16 -translate-x-1/2 rounded-full border border-white/20 bg-white/10" />

            <FiUser
              size={30}
              className="absolute left-1/2 top-11 -translate-x-1/2 text-white/80"
            />

            {/* Left Arm */}

            <motion.div
              animate={{ rotate: [-12, 0, -12] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -left-8 top-8 h-16 w-12 origin-top rounded-full border-2 border-[#d9a16e] bg-[#f0bd91]"
            />

            {/* Right Arm */}

            <motion.div
              animate={{
                rotate: cardInserted ? [0, -15, 0] : [-20, -40, -20],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute -right-7 top-5 h-16 w-12 origin-top rounded-full border-2 border-[#d9a16e] bg-[#f0bd91]"
            />
          </div>

          {/* Legs */}

          <div className="absolute -bottom-2 left-[35px] h-8 w-12 rounded-b-xl bg-[#252525] sm:left-[40px]" />
          <div className="absolute -bottom-2 right-[35px] h-8 w-12 rounded-b-xl bg-[#252525] sm:right-[40px]" />
        </motion.div>

        {/* Login Card */}

        <motion.div
          initial={{ x: -110, y: 100, rotate: -15, opacity: 0 }}
          animate={{
            x: cardInserted ? 65 : -35,
            y: cardInserted ? -112 : 15,
            rotate: cardInserted ? 0 : -12,
            opacity: 1,
            scale: cardInserted ? 0.5 : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: 'easeInOut',
          }}
          onAnimationComplete={() => setCardInserted(true)}
          onAnimationStart={() => setCardInserted(false)}
          className="absolute left-2 top-[115px] z-30 flex h-[100px] w-[135px] flex-col items-center justify-center rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_15px_40px_rgba(245,158,11,0.35)] sm:left-5 sm:top-[130px] sm:h-[115px] sm:w-[155px]"
        >
          <FiLock size={24} className="mb-2 text-black" />

          <span className="text-lg font-black tracking-widest text-black">
            LOGIN
          </span>

          <span className="mt-1 text-[8px] font-bold tracking-[0.2em] text-black/70">
            MOBILESPOT
          </span>
        </motion.div>

        {/* Success Icons */}

        <AnimatePresence>
          {cardInserted && (
            <>
              {floatingIcons.map(({ Icon, x, y, delay }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.7],
                    x,
                    y,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.3,
                    delay,
                    ease: 'easeOut',
                  }}
                  className="absolute left-1/2 top-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/40 bg-white shadow-xl sm:h-12 sm:w-12"
                >
                  <Icon size={21} className="text-amber-600" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Welcome Message */}

      <motion.div
        animate={{
          opacity: cardInserted ? 1 : 0.65,
          y: cardInserted ? 0 : 8,
        }}
        transition={{ duration: 0.5 }}
        className="relative z-40 mt-1 text-center"
      >
        <motion.div
          animate={{
            scale: cardInserted ? [1, 1.08, 1] : 1,
          }}
          transition={{ duration: 0.6 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2"
        >
          <FiCheck className="text-amber-400" size={14} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-amber-300">
            {cardInserted ? 'ACCESS GRANTED' : 'WELCOME TO MOBILESPOT'}
          </span>
        </motion.div>

        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          {cardInserted ? 'Welcome Back!' : 'Your Tech Journey'}
        </h2>

        <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-gray-400 sm:text-sm">
          {cardInserted
            ? 'Your premium shopping experience is waiting for you.'
            : 'Premium smartphones, exclusive deals and more.'}
        </p>
      </motion.div>
    </div>
  )
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f6f3] font-[Arial]">

      {/* Background */}

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-center justify-center p-3 sm:p-6 lg:p-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="grid w-full max-w-6xl overflow-hidden rounded-[24px] bg-white shadow-[0_25px_90px_rgba(0,0,0,0.10)] sm:rounded-[30px] lg:grid-cols-2"
        >

          {/* LEFT SIDE */}

          <div className="relative flex min-h-[490px] flex-col overflow-hidden bg-[#171717] px-5 py-7 text-white sm:min-h-[550px] sm:px-10 sm:py-9 lg:min-h-[750px] lg:justify-between lg:p-10 xl:p-14">

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

            {/* Brand */}

            <Link to="/" className="relative z-10 inline-block w-fit">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                MOBILE<span className="text-amber-500">SPOT</span>
              </h2>
              <p className="mt-1 text-[9px] tracking-[0.3em] text-gray-400 sm:text-xs">
                PREMIUM MOBILE STORE
              </p>
            </Link>

            {/* Character Animation */}

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-5">
              <LoginCharacter />
            </div>

            {/* Features */}

            <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 sm:gap-3 sm:pt-7">

              <div className="text-center">
                <FiShield className="mx-auto mb-2 text-amber-500" size={21} />
                <p className="text-[10px] font-semibold sm:text-xs">
                  Secure Shopping
                </p>
              </div>

              <div className="text-center">
                <FiTruck className="mx-auto mb-2 text-amber-500" size={21} />
                <p className="text-[10px] font-semibold sm:text-xs">
                  Fast Delivery
                </p>
              </div>

              <div className="text-center">
                <FiZap className="mx-auto mb-2 text-amber-500" size={21} />
                <p className="text-[10px] font-semibold sm:text-xs">
                  Best Deals
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex min-w-0 flex-col justify-center px-5 py-9 sm:px-10 sm:py-12 lg:min-h-[750px] lg:px-10 xl:px-16">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-md"
            >

              {/* Mobile Brand */}

              <motion.div
                variants={itemVariants}
                className="mb-8 text-center lg:hidden"
              >
                <Link to="/" className="text-2xl font-extrabold sm:text-3xl">
                  MOBILE<span className="text-amber-600">SPOT</span>
                </Link>

                <p className="mt-1 text-[9px] tracking-[0.3em] text-gray-400 sm:text-[10px]">
                  PREMIUM MOBILE STORE
                </p>
              </motion.div>

              {/* Heading */}

              <motion.div variants={itemVariants} className="mb-7 sm:mb-8">

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 sm:h-12 sm:w-12">
                  <FiLock size={22} />
                </div>

                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700 sm:text-xs">
                  Welcome Back
                </p>

                <h1 className="text-[29px] font-extrabold leading-tight tracking-tight text-[#171717] sm:text-4xl">
                  Login to Your
                  <span className="block text-amber-600">
                    Account.
                  </span>
                </h1>

                <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm">
                  Enter your details to continue your shopping journey.
                </p>

              </motion.div>

              {/* Error */}

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

              {/* Success */}

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

              {/* Login Form */}

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5"
              >

                {/* Email */}

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                    Email Address
                  </label>

                  <div className="group flex items-center rounded-xl border border-gray-200 bg-[#fafafa] px-3 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(217,119,6,0.08)] sm:px-4">

                    <FiMail
                      className="shrink-0 text-gray-400 transition-colors group-focus-within:text-amber-600"
                      size={19}
                    />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full min-w-0 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
                    />

                  </div>
                </div>

                {/* Password */}

                <div>
                  <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                    Password
                  </label>

                  <div className="group flex items-center rounded-xl border border-gray-200 bg-[#fafafa] px-3 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(217,119,6,0.08)] sm:px-4">

                    <FiLock
                      className="shrink-0 text-gray-400 transition-colors group-focus-within:text-amber-600"
                      size={19}
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="w-full min-w-0 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
                    />

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-gray-400 transition hover:text-amber-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword
                        ? <FiEyeOff size={19} />
                        : <FiEye size={19} />
                      }
                    </motion.button>

                  </div>
                </div>

                {/* Remember / Forgot */}

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">

                  <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-amber-600"
                    />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-bold text-amber-700 transition hover:text-black"
                  >
                    Forgot Password?
                  </Link>

                </div>

                {/* Submit */}

                <motion.button
                  type="submit"
                  disabled={loading || googleLoading || !!success}
                  whileHover={{
                    scale: 1.015,
                    boxShadow: '0 12px 25px rgba(180,120,35,0.25)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#171717] py-4 text-sm font-bold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
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

              {/* Divider */}

              <motion.div
                variants={itemVariants}
                className="my-6 flex items-center gap-4 sm:my-7"
              >
                <div className="h-px flex-1 bg-gray-200" />

                <span className="whitespace-nowrap text-[9px] font-bold tracking-[0.15em] text-gray-400 sm:text-[10px]">
                  OR CONTINUE WITH
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </motion.div>

              {/* Google Login */}

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-3"
              >

                <div
                  className={`flex max-w-full justify-center transition-opacity ${
                    loading || googleLoading || success
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }`}
                >
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
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-amber-600"
                    />
                    Signing in with Google...
                  </div>
                )}

              </motion.div>

              {/* Signup */}

              <motion.p
                variants={itemVariants}
                className="mt-7 text-center text-xs text-gray-500 sm:text-sm"
              >
                Don't have an account?{' '}

                <Link
                  to="/signup"
                  className="font-extrabold text-amber-700 transition hover:text-black"
                >
                  Create Account
                </Link>
              </motion.p>

              {/* Back Home */}

              <motion.div
                variants={itemVariants}
                className="mt-6 border-t border-gray-100 pt-5 text-center"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 transition hover:text-black"
                >
                  <FiArrowRight className="rotate-180" />
                  Back to Home
                </Link>
              </motion.div>

              {/* Security */}

              <motion.div
                variants={itemVariants}
                className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 sm:text-[11px]"
              >
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
