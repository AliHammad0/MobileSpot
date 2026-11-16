import React from 'react'
import { motion } from 'framer-motion'
import {
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiHeadphones,
  FiShield,
  FiCheckCircle,
  FiPackage,
  FiSmartphone,
  FiCamera,
  FiGift,
  FiLock,
  FiMessageCircle,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi'

const services = [
  {
    title: 'PTA Approved',
    subtitle: '100% PTA Approved Mobiles',
    type: 'pta',
  },
  {
    title: '1 Year Warranty',
    subtitle: 'Official Brand Warranty',
    type: 'warranty',
  },
  {
    title: 'Packaging Video',
    subtitle: 'See Your Product Before Delivery',
    type: 'camera',
  },
  {
    title: 'Fast Delivery',
    subtitle: 'All Over Pakistan',
    type: 'delivery',
  },
  {
    title: 'Cash on Delivery',
    subtitle: 'Pay When You Receive',
    type: 'cod',
  },
  {
    title: 'Secure Payments',
    subtitle: 'Safe Online Transactions',
    type: 'payment',
  },
  {
    title: 'Easy Returns',
    subtitle: 'Hassle-Free Return Policy',
    type: 'returns',
  },
  {
    title: 'Customer Support',
    subtitle: 'We Are Here To Help',
    type: 'support',
  },
]


const ServiceAnimation = ({ type }) => {
  return (
    <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-[#f8f7f4] sm:h-36">

      {/* PTA MOBILE ANIMATION */}
      {type === 'pta' && (
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              y: [30, 0, 0],
              opacity: [0, 1, 1],
              scale: [0.7, 1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <FiSmartphone className="text-6xl text-gray-800" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute -right-8 -top-2 rounded-full bg-green-100 p-2"
          >
            <FiCheckCircle className="text-2xl text-green-600" />
          </motion.div>
        </div>
      )}

      {/* WARRANTY ANIMATION */}
      {type === 'warranty' && (
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          >
            <FiShield className="text-7xl text-[#a17c48]" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            className="absolute"
          >
            <FiCheckCircle className="text-3xl text-green-600" />
          </motion.div>

          <motion.div
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.9, 1.3, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute h-24 w-24 rounded-full border-2 border-[#c9a46c]"
          />
        </div>
      )}

      {/* PACKAGING VIDEO ANIMATION */}
      {type === 'camera' && (
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              rotate: [0, -4, 4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          >
            <FiCamera className="text-6xl text-gray-800" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0, 1.2, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute -right-5 -top-3 rounded-full bg-red-100 p-2"
          >
            <span className="block h-3 w-3 rounded-full bg-red-500" />
          </motion.div>

          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-3 -left-6 text-xs font-bold text-red-600"
          >
            REC
          </motion.div>
        </div>
      )}


      {/* FAST DELIVERY AIRPLANE */}
      {type === 'delivery' && (
        <div className="relative h-full w-full">

          {/* Clouds */}
          <motion.div
            animate={{ x: [-15, 20, -15] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute left-5 top-5 text-2xl text-gray-300"
          >
            ☁️
          </motion.div>

          <motion.div
            animate={{ x: [15, -15, 15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute right-5 top-8 text-xl text-gray-300"
          >
            ☁️
          </motion.div>

          {/* Airplane */}
          <motion.div
            animate={{
              x: [-100, 100],
              y: [15, -10],
              rotate: [-8, -8],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: 'easeInOut',
            }}
            className="absolute left-1/2 top-1/2 -translate-y-1/2 text-[#a17c48]"
          >
            <svg viewBox="0 0 100 100" className="h-16 w-16" fill="currentColor">
              <path d="M94 43L57 32 42 5c-2-4-8-2-8 3l3 27-24-7-7-12c-2-4-7-2-7 2l2 16-1 9 1 9-2 16c0 4 5 6 7 2l7-12 24-7-3 27c0 5 6 7 8 3l15-27 37-11c6-2 6-8 0-10Z" />
            </svg>
          </motion.div>

          {/* Parcel */}
          <motion.div
            animate={{
              y: [0, 25, 25, 0],
              opacity: [0, 1, 1, 0],
              rotate: [0, 20, 0, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              times: [0, 0.5, 0.8, 1],
            }}
            className="absolute bottom-2 right-10"
          >
            <FiPackage className="text-3xl text-amber-700" />
          </motion.div>

        </div>
      )}

      {/* CASH ON DELIVERY – TRUCK AND DELIVERY BOY */}
      {type === 'cod' && (
        <div className="relative h-full w-full overflow-hidden">

          {/* Road */}
          <div className="absolute bottom-5 left-0 h-1 w-full bg-gray-300" />

          <motion.div
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute bottom-6 left-2 text-xs text-gray-400"
          >
            ─ ─ ─ ─ ─
          </motion.div>

          {/* Truck */}
          <motion.div
            animate={{
              x: [-95, -5, -5, -95],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.35, 0.7, 1],
              ease: 'easeInOut',
            }}
            className="absolute bottom-6 left-1/2 z-20"
          >
            <div className="relative">
              <FiTruck className="text-5xl text-[#a17c48]" />

              {/* Truck Wheels */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute bottom-0 left-2 rounded-full border-2 border-gray-700 bg-white p-0.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gray-700" />
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute bottom-0 right-2 rounded-full border-2 border-gray-700 bg-white p-0.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gray-700" />
              </motion.div>
            </div>
          </motion.div>

          {/* Delivery Boy */}
          <motion.div
            animate={{
              x: [35, 0, 0, 35],
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, 10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.35, 0.7, 1],
            }}
            className="absolute bottom-7 right-5 z-10"
          >
            <div className="relative">
              <FiSmartphone className="absolute -top-3 left-2 text-xs text-[#a17c48]" />
              <span className="block text-3xl">🧍</span>
            </div>
          </motion.div>

          {/* Parcel Handover */}
          <motion.div
            animate={{
              x: [0, 15, 30, 15, 0],
              y: [0, -8, -3, -8, 0],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.4, 0.55, 0.75, 1],
            }}
            className="absolute bottom-12 right-12 z-30"
          >
            <FiPackage className="text-2xl text-amber-700" />
          </motion.div>

          {/* Payment Complete */}
          <motion.div
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.65, 0.8, 1],
            }}
            className="absolute right-2 top-2 rounded-full bg-green-100 p-1.5"
          >
            <FiCheckCircle className="text-xl text-green-600" />
          </motion.div>

        </div>
      )}


      {/* SECURE PAYMENT */}
      {type === 'payment' && (
        <div className="relative flex items-center justify-center">

          {/* Credit Card */}
          <motion.div
            animate={{
              x: [-45, 0, 0, -45],
              rotate: [-10, 0, 0, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex h-20 w-28 flex-col justify-between rounded-xl bg-gradient-to-br from-gray-800 to-black p-3 shadow-lg"
          >
            <div className="flex justify-between">
              <FiCreditCard className="text-xl text-white" />
              <span className="text-xs text-amber-300">●●●</span>
            </div>
            <div className="h-3 w-7 rounded bg-amber-300/70" />
            <div className="text-[8px] tracking-widest text-white">
              SECURE PAYMENT
            </div>
          </motion.div>

          {/* Lock */}
          <motion.div
            animate={{
              scale: [0, 1.2, 1, 0],
              rotate: [0, 0, 0, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -right-6 -top-5 rounded-full bg-green-100 p-3"
          >
            <FiLock className="text-2xl text-green-600" />
          </motion.div>

          {/* Check */}
          <motion.div
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
            }}
            className="absolute -bottom-3 right-0 rounded-full bg-green-500 p-1.5"
          >
            <FiCheckCircle className="text-lg text-white" />
          </motion.div>

        </div>
      )}

      {/* EASY RETURNS */}
      {type === 'returns' && (
        <div className="relative flex items-center justify-center">

          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <FiRefreshCw className="text-7xl text-[#a17c48]" />
          </motion.div>

          <motion.div
            animate={{
              y: [15, 0, -5, 0, 15],
              scale: [0.7, 1, 1, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute"
          >
            <FiPackage className="text-3xl text-gray-800" />
          </motion.div>

          <motion.div
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -right-6 -top-4 rounded-full bg-green-100 p-2"
          >
            <FiCheckCircle className="text-xl text-green-600" />
          </motion.div>

        </div>
      )}


      {/* CUSTOMER SUPPORT */}
      {type === 'support' && (
        <div className="relative flex items-center justify-center">

          {/* Headset Person */}
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="relative"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ead9c0]">
              <FiHeadphones className="text-5xl text-[#a17c48]" />
            </div>

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute -right-2 -top-1 rounded-full bg-green-100 p-1.5"
            >
              <FiCheckCircle className="text-lg text-green-600" />
            </motion.div>
          </motion.div>

          {/* Chat Bubble */}
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
              y: [10, 0, 0, 10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -right-9 -top-4 rounded-xl rounded-bl-none bg-white p-3 shadow-md"
          >
            <FiMessageCircle className="text-2xl text-[#a17c48]" />
            <div className="mt-1 flex gap-1">
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="h-1 w-1 rounded-full bg-gray-400" />
            </div>
          </motion.div>

        </div>
      )}

    </div>
  )
}


const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const Services = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f7f4] px-4 py-20 font-[Arial,sans-serif] sm:px-6 lg:px-10">

      {/* Background Effects */}
      <motion.div
        animate={{
          x: [0, 35, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-gray-300/30 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[4px] text-[#a17c48] sm:text-sm">
            MOBILESPOT SERVICES
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Why Shop With{' '}
            <span className="text-[#a17c48]">Us?</span>
          </h1>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 85 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mx-auto mt-5 h-1 rounded-full bg-[#a17c48]"
          />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Enjoy a premium smartphone shopping experience
            with trusted products, official warranty, fast
            delivery and excellent customer support.
          </p>
        </motion.div>

        {/* Animated Service Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.type}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.025,
                transition: { duration: 0.3 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#c5a477] hover:shadow-xl sm:p-5"
            >

              {/* Animated Illustration */}
              <ServiceAnimation type={service.type} />

              {/* Card Content */}
              <div className="relative z-10 px-1 pb-3 pt-5 text-center">
                <h3 className="text-sm font-bold text-gray-900 sm:text-lg">
                  {service.title}
                </h3>

                <p className="mt-2 min-h-9 text-xs leading-5 text-gray-500 sm:text-sm">
                  {service.subtitle}
                </p>
              </div>

              {/* Hover Bottom Border */}
              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-[#a17c48] transition-all duration-500 group-hover:w-2/3" />

            </motion.div>
          ))}
        </motion.div>


        {/* Delivery Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-16 overflow-hidden rounded-3xl bg-[#171717] px-6 py-14 text-center text-white sm:px-12 sm:py-16"
        >

          {/* Background Circles */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10"
          />

          <div className="relative z-10">

            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#a17c48]/20"
            >
              <FiPackage className="text-4xl text-[#d7b783]" />
            </motion.div>

            <p className="text-xs font-bold tracking-[4px] text-[#d7b783]">
              FAST & SAFE DELIVERY
            </p>

            <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">
              Your Order, Our Priority!
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              From our store to your doorstep. We make sure
              your favorite smartphone reaches you safely
              and quickly.
            </p>

            {/* Flying Airplane */}
            <div className="relative mx-auto mt-10 h-24 max-w-lg overflow-hidden border-b border-dashed border-gray-600">

              <motion.div
                animate={{
                  x: [-100, 450],
                  y: [20, -15],
                  rotate: [-8, -8],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
                className="absolute left-0 top-3 text-[#d7b783]"
              >
                <svg viewBox="0 0 100 100" className="h-16 w-16" fill="currentColor">
                  <path d="M94 43L57 32 42 5c-2-4-8-2-8 3l3 27-24-7-7-12c-2-4-7-2-7 2l2 16-1 9 1 9-2 16c0 4 5 6 7 2l7-12 24-7-3 27c0 5 6 7 8 3l15-27 37-11c6-2 6-8 0-10Z" />
                </svg>
              </motion.div>

            </div>

            {/* Trust Features */}
            <div className="mt-9 flex flex-wrap justify-center gap-5 text-xs font-semibold text-gray-300 sm:gap-8 sm:text-sm">

              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-[#d7b783]" />
                Trusted Service
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-[#d7b783]" />
                Secure Shopping
              </span>

              <span className="flex items-center gap-2">
                <FiTruck className="text-[#d7b783]" />
                Fast Delivery
              </span>

            </div>
          </div>
        </motion.div>


        {/* Warranty & Customer Support */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Warranty */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -7 }}
            className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f5ebdc]"
            >
              <FiShield className="text-4xl text-[#a17c48]" />
            </motion.div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Official Warranty
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Shop with confidence with official brand warranty coverage.
              </p>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -7 }}
            className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f5ebdc]"
            >
              <FiHeadphones className="text-4xl text-[#a17c48]" />
            </motion.div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Customer Support
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Our support team is ready to help with your shopping questions.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Final Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-14 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="mb-4 inline-flex"
          >
            <FiStar className="text-3xl text-[#a17c48]" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Experience The Difference
          </h2>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            MOBILESPOT – Your Trusted Mobile Shopping Partner.
          </p>
        </motion.div>

      </div>
    </section>
  )
}

export default Services