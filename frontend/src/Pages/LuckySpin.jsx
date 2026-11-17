
import React, { useEffect, useState } from 'react'
import {
  FiGift,
  FiRefreshCw,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiAward
} from 'react-icons/fi'

const API_URL = 'https://mobilespot-backend.vercel.app/api/v1/lucky-spin'

const rewards = [
  { label: '5% OFF', color: '#d6ad50' },
  { label: 'FREE SHIPPING', color: '#292929' },
  { label: '10% OFF', color: '#d6ad50' },
  { label: 'BETTER LUCK', color: '#292929' },
  { label: '15% OFF', color: '#d6ad50' },
  { label: '20% OFF', color: '#292929' }
]

const LuckySpin = () => {
  const [spins, setSpins] = useState([])
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [selectedSpin, setSelectedSpin] = useState('')
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const token = localStorage.getItem('token')

  const fetchSpins = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/my-spins`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load spins')
      }

      setSpins(data.spins || [])
    } catch (err) {
      setError(err.message || 'Unable to load Lucky Spin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpins()
  }, [])

  const handleSpin = async (spin) => {
    if (spinning || spin.status !== 'pending') return

    try {
      setSpinning(true)
      setResult(null)
      setError('')
      setSelectedSpin(spin._id)

      const response = await fetch(`${API_URL}/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          spinId: spin._id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Spin failed')
      }

      const reward = data.reward
      const rewardIndex = rewards.findIndex(
        (item) => item.label === reward.label
      )

      const index = rewardIndex >= 0 ? rewardIndex : 0
      const segmentAngle = 360 / rewards.length
      const targetAngle = 360 - (index * segmentAngle + segmentAngle / 2)

      const finalRotation =
        rotation + 360 * 6 + ((targetAngle - (rotation % 360) + 360) % 360)

      setRotation(finalRotation)

      setTimeout(() => {
        setResult(reward)
        setSpinning(false)
        fetchSpins()
      }, 5500)

    } catch (err) {
      setError(err.message || 'Unable to spin the wheel')
      setSpinning(false)
      fetchSpins()
    }
  }

  const copyCoupon = async () => {
    if (!result?.couponCode) return

    try {
      await navigator.clipboard.writeText(result.couponCode)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setError('Unable to copy coupon code')
    }
  }

  const availableSpins = spins.filter(
    (spin) => spin.status === 'pending'
  )

  const completedSpins = spins.filter(
    (spin) => spin.status !== 'pending'
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <div className="text-5xl animate-bounce">🎡</div>
        <h2 className="mt-5 text-lg font-bold tracking-widest text-gray-800">
          LOADING LUCKY SPIN
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Preparing your rewards...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] px-4 py-12 font-[Arial]">

      <style>{`
        .spin-wheel {
          transition: transform 5.5s cubic-bezier(.12,.75,.12,1);
          will-change: transform;
        }

        .spin-card {
          animation: spinCardAppear .7s ease both;
        }

        @keyframes spinCardAppear {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reward-glow {
          animation: rewardGlow 2s ease-in-out infinite;
        }

        @keyframes rewardGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(214,173,80,.15);
          }
          50% {
            box-shadow: 0 0 35px rgba(214,173,80,.4);
          }
        }

        .spin-button {
          background-size: 200% 100%;
          background-position: left center;
          transition: all .4s ease;
        }

        .spin-button:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-3px);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-12 spin-card">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f2e8d0] text-[#a47a29] mb-5">
          <FiGift size={30} />
        </div>

        <p className="text-xs font-bold tracking-[5px] text-[#a58b57] mb-3">
          EXCLUSIVE CUSTOMER REWARDS
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
          Lucky Spin
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Your delivered orders unlock exciting rewards.
          Spin the wheel and discover your next surprise!
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="max-w-3xl mx-auto mb-7 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* SPIN CONTENT */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* WHEEL */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10 flex flex-col items-center spin-card">

          <div className="relative w-full max-w-[390px] aspect-square">

            {/* POINTER */}
            <div className="absolute z-20 top-[-9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[17px] border-r-[17px] border-t-[35px] border-l-transparent border-r-transparent border-t-[#292929] drop-shadow-md" />

            {/* WHEEL */}
            <div
              className="spin-wheel relative w-full h-full rounded-full border-[10px] border-[#292929] shadow-[0_12px_35px_rgba(0,0,0,.15)] overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(
                  ${rewards.map((reward, index) =>
                    `${reward.color} ${index * 60}deg ${(index + 1) * 60}deg`
                  ).join(', ')}
                )`
              }}
            >
              {rewards.map((reward, index) => (
                <div
                  key={reward.label}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${index * 60 + 30}deg)`
                  }}
                >
                  <span
                    className="absolute top-[13%] left-1/2 -translate-x-1/2 text-center text-white font-black text-[10px] sm:text-xs tracking-wide w-20"
                  >
                    {reward.label}
                  </span>
                </div>
              ))}

              {/* CENTER */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white border-[7px] border-[#292929] flex items-center justify-center shadow-lg z-10">
                <FiGift size={28} className="text-[#a47a29]" />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-7 text-center">
            {spinning
              ? 'Your reward is being selected...'
              : 'Select an available order to unlock your spin.'}
          </p>

          <div className="flex items-center gap-2 mt-4 text-[#9a7427] font-bold text-sm">
            <FiAward size={18} />
            {availableSpins.length} Available Spins
          </div>
        </div>

        {/* SPIN OPTIONS */}
        <div className="space-y-5 spin-card">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs tracking-widest text-[#a58b57] font-bold">
                  YOUR REWARDS
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Available Spins
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#f5f1e8] flex items-center justify-center text-[#9a7a3d]">
                <FiGift size={23} />
              </div>
            </div>

            {availableSpins.length === 0 ? (
              <div className="rounded-2xl bg-[#faf9f6] border border-dashed border-[#d9cba9] p-8 text-center">
                <FiLock size={30} className="mx-auto text-[#a58b57]" />

                <h3 className="font-bold text-gray-800 mt-4">
                  No Available Spins
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Complete an order and wait until its status becomes Delivered to unlock your reward.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSpins.map((spin) => (
                  <div
                    key={spin._id}
                    className="border border-[#eadfc6] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">
                        DELIVERED ORDER
                      </p>

                      <h3 className="font-bold text-gray-900 mt-1">
                        #{spin.order?._id?.slice(-8).toUpperCase() || 'ORDER'}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {spin.order?.orderStatus || 'Delivered'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSpin(spin)}
                      disabled={spinning}
                      className="spin-button bg-gradient-to-r from-[#9b6b16] to-[#d6ad50] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiGift size={17} />
                      {spinning && selectedSpin === spin._id
                        ? 'Spinning...'
                        : 'Spin Now'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RESULT */}
          {result && (
            <div className="bg-white rounded-3xl border border-[#e6d3a5] p-7 text-center reward-glow spin-card">

              <div className="w-16 h-16 rounded-full bg-[#f8efd9] text-[#a47a29] flex items-center justify-center mx-auto">
                <FiAward size={32} />
              </div>

              <p className="text-xs tracking-[4px] text-[#a58b57] font-bold mt-5">
                YOUR SPIN RESULT
              </p>

              <h2 className="text-3xl font-black text-gray-900 mt-3">
                {result.label}
              </h2>

              {result.couponCode ? (
                <div className="mt-6 bg-[#faf9f6] border border-dashed border-[#d6ad50] rounded-2xl p-4">
                  <p className="text-xs text-gray-500 font-bold tracking-widest mb-2">
                    YOUR COUPON CODE
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-black tracking-wider text-[#91691f]">
                      {result.couponCode}
                    </span>

                    <button
                      onClick={copyCoupon}
                      className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100"
                      title="Copy coupon"
                    >
                      {copied
                        ? <FiCheckCircle className="text-green-600" />
                        : <FiCopy />}
                    </button>
                  </div>

                  {result.expiresAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Expires: {new Date(result.expiresAt).toLocaleDateString('en-PK')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-3">
                  Better luck next time. Your next delivered order can unlock another spin!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SPIN HISTORY */}
      <div className="max-w-6xl mx-auto mt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#f2e8d0] flex items-center justify-center text-[#a47a29]">
            <FiClock size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Spin History
            </h2>

            <p className="text-sm text-gray-500">
              Your previous rewards and results
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {completedSpins.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                Your spin history will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {completedSpins.map((spin) => (
                <div
                  key={spin._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {spin.rewardLabel || 'Reward'}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Order #{spin.order?._id?.slice(-8).toUpperCase() || 'ORDER'}
                    </p>

                    {spin.couponCode && (
                      <p className="text-sm text-[#9a7427] font-bold mt-2">
                        {spin.couponCode}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <FiCheckCircle className="text-green-600" />
                    <span className="text-green-700">
                      {spin.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-6xl mx-auto mt-8 text-center">
        <p className="text-xs text-gray-400">
          Each delivered order gives you one Lucky Spin opportunity.
        </p>
      </div>
    </div>
  )
}

export default LuckySpin
