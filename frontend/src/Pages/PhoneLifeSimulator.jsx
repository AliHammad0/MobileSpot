
import React, { useMemo, useState } from 'react'

const activities = [
  { key: 'gaming', name: 'Gaming', icon: '🎮', drain: 750, description: 'High performance gaming' },
  { key: 'youtube', name: 'YouTube & Video', icon: '▶️', drain: 450, description: 'Video streaming' },
  { key: 'social', name: 'Social Media', icon: '📱', drain: 350, description: 'Instagram, Facebook, TikTok' },
  { key: 'camera', name: 'Camera', icon: '📸', drain: 650, description: 'Photos and video recording' },
  { key: 'calls', name: 'Calls', icon: '📞', drain: 250, description: 'Voice and video calls' },
  { key: 'standby', name: 'Standby', icon: '🔋', drain: 40, description: 'Background battery usage' }
]

const presets = [
  { name: 'Standard Phone', battery: 5000 },
  { name: 'Compact Phone', battery: 4000 },
  { name: 'Large Battery Phone', battery: 6000 },
  { name: 'Gaming Phone', battery: 7000 }
]

const initialHours = {
  gaming: 2,
  youtube: 2,
  social: 3,
  camera: 1,
  calls: 1,
  standby: 8
}

export default function PhoneLifeSimulator() {
  const [phoneName, setPhoneName] = useState('My Smartphone')
  const [batteryCapacity, setBatteryCapacity] = useState(5000)
  const [batteryHealth, setBatteryHealth] = useState(100)
  const [hours, setHours] = useState(initialHours)
  const [showDetails, setShowDetails] = useState(false)

  const results = useMemo(() => {
    const usableCapacity = batteryCapacity * (batteryHealth / 100)

    const totalDrain = activities.reduce((total, activity) => {
      return total + activity.drain * hours[activity.key]
    }, 0)

    const usedPercentage = (totalDrain / usableCapacity) * 100
    const remainingPercentage = Math.max(0, 100 - usedPercentage)
    const remainingMah = Math.max(0, usableCapacity - totalDrain)

    const totalHours = Object.values(hours).reduce(
      (total, value) => total + Number(value),
      0
    )

    const estimatedDays =
      totalHours > 0 ? usableCapacity / (totalDrain || 1) : 0

    return {
      usableCapacity,
      totalDrain,
      usedPercentage: Math.min(100, usedPercentage),
      remainingPercentage,
      remainingMah,
      totalHours,
      estimatedDays
    }
  }, [batteryCapacity, batteryHealth, hours])

  const updateHours = (key, value) => {
    setHours(previous => ({
      ...previous,
      [key]: Number(value)
    }))
  }

  const getBatteryColor = percentage => {
    if (percentage <= 15) return '#ef4444'
    if (percentage <= 35) return '#f59e0b'
    return '#16a34a'
  }

  const batteryColor = getBatteryColor(results.remainingPercentage)

  const resetSimulator = () => {
    setPhoneName('My Smartphone')
    setBatteryCapacity(5000)
    setBatteryHealth(100)
    setHours(initialHours)
    setShowDetails(false)
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 text-[#171717] sm:px-6 lg:px-10"
      style={{ fontFamily: 'Arial, sans-serif' }}>

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e2dc] bg-white px-4 py-2 text-sm font-medium text-[#666]">
            <span>🔋</span>
            MobileSpot Interactive Tool
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Phone Life Simulator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#777] sm:text-base">
            Discover how long your smartphone battery can last based on
            your everyday usage habits.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Settings */}
          <section className="space-y-6">

            {/* Phone Setup */}
            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Your Phone Setup</h2>
                <p className="mt-1 text-sm text-[#888]">
                  Enter your smartphone battery details.
                </p>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Name
                  </label>
                  <input
                    type="text"
                    value={phoneName}
                    onChange={e => setPhoneName(e.target.value)}
                    placeholder="Enter your phone name"
                    className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Quick Battery Presets
                  </label>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {presets.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setBatteryCapacity(preset.battery)}
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                          batteryCapacity === preset.battery
                            ? 'border-black bg-black text-white'
                            : 'border-[#e5e5e5] bg-[#fafafa] hover:border-black'
                        }`}
                      >
                        <span className="block text-xs opacity-75">
                          {preset.name}
                        </span>
                        <span className="mt-1 block text-sm font-bold">
                          {preset.battery} mAh
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      Battery Capacity
                    </label>
                    <span className="text-sm font-bold">
                      {batteryCapacity} mAh
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2500"
                    max="10000"
                    step="100"
                    value={batteryCapacity}
                    onChange={e => setBatteryCapacity(Number(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />

                  <div className="mt-1 flex justify-between text-xs text-[#999]">
                    <span>2500 mAh</span>
                    <span>10000 mAh</span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      Battery Health
                    </label>
                    <span className="text-sm font-bold">
                      {batteryHealth}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="60"
                    max="100"
                    step="1"
                    value={batteryHealth}
                    onChange={e => setBatteryHealth(Number(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />

                  <div className="mt-1 flex justify-between text-xs text-[#999]">
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Usage */}
            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Your Daily Activities</h2>
                <p className="mt-1 text-sm text-[#888]">
                  How many hours do you use each activity daily?
                </p>
              </div>

              <div className="space-y-6">
                {activities.map(activity => (
                  <div key={activity.key}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f4f1] text-xl">
                          {activity.icon}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold">
                            {activity.name}
                          </h3>
                          <p className="text-xs text-[#999]">
                            {activity.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-lg font-bold">
                          {hours[activity.key]}
                        </span>
                        <span className="ml-1 text-xs text-[#999]">hrs</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={hours[activity.key]}
                      onChange={e =>
                        updateHours(activity.key, e.target.value)
                      }
                      className="w-full cursor-pointer accent-black"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f7f7f5] p-4">
                <span className="text-sm text-[#777]">
                  Total daily usage
                </span>
                <span className="font-bold">
                  {results.totalHours} hours
                </span>
              </div>
            </div>

          </section>

          {/* Results */}
          <section className="space-y-6">

            {/* Main Battery Result */}
            <div className="rounded-3xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#aaa]">Battery prediction for</p>
                  <h2 className="mt-1 text-xl font-bold">
                    {phoneName || 'My Smartphone'}
                  </h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-2 text-xs">
                  LIVE RESULT
                </span>
              </div>

              <div className="my-10 flex flex-col items-center">

                {/* Battery Illustration */}
                <div className="relative w-36">
                  <div className="mx-auto mb-1 h-3 w-10 rounded-t-md bg-[#888]" />

                  <div className="relative h-64 overflow-hidden rounded-3xl border-[5px] border-[#777] bg-[#292929] p-2">
                    <div
                      className="absolute bottom-2 left-2 right-2 rounded-2xl transition-all duration-500"
                      style={{
                        height: `${Math.max(0, results.remainingPercentage - 2)}%`,
                        backgroundColor: batteryColor
                      }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">
                        {results.remainingPercentage.toFixed(0)}%
                      </span>
                      <span className="mt-1 text-xs text-white/75">
                        Remaining
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 text-4xl font-bold">
                  {results.remainingPercentage.toFixed(1)}%
                </h3>

                <p className="mt-2 text-sm text-[#aaa]">
                  Estimated battery remaining after your daily usage
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-[#aaa]">Battery Used</p>
                  <p className="mt-2 text-2xl font-bold">
                    {results.usedPercentage.toFixed(1)}%
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-[#aaa]">Remaining Capacity</p>
                  <p className="mt-2 text-2xl font-bold">
                    {Math.round(results.remainingMah)} mAh
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Summary */}
            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold">Battery Usage Breakdown</h2>
              <p className="mt-1 text-sm text-[#888]">
                Estimated battery consumption by activity.
              </p>

              <div className="mt-6 space-y-5">
                {activities.map(activity => {
                  const consumed = activity.drain * hours[activity.key]
                  const percentage = results.usableCapacity
                    ? Math.min(100, (consumed / results.usableCapacity) * 100)
                    : 0

                  return (
                    <div key={activity.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {activity.icon} {activity.name}
                        </span>
                        <span className="text-sm font-bold">
                          {Math.round(consumed)} mAh
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#eee]">
                        <div
                          className="h-full rounded-full bg-[#222] transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 border-t border-[#eee] pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Total estimated drain</span>
                  <strong>{Math.round(results.totalDrain)} mAh</strong>
                </div>
              </div>
            </div>

            {/* Battery Status */}
            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold">Your Battery Status</h2>

              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                  style={{ backgroundColor: `${batteryColor}20` }}
                >
                  {results.remainingPercentage > 35
                    ? '😊'
                    : results.remainingPercentage > 15
                    ? '😐'
                    : '🪫'}
                </div>

                <div>
                  <h3 className="font-bold">
                    {results.remainingPercentage > 35
                      ? 'Healthy Battery Level'
                      : results.remainingPercentage > 15
                      ? 'Battery Getting Low'
                      : 'Low Battery Warning'}
                  </h3>

                  <p className="mt-1 text-xs text-[#888]">
                    Based on your selected daily activities
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="mt-6 w-full rounded-xl border border-[#ddd] py-3 text-sm font-semibold transition hover:bg-[#f7f7f5]"
              >
                {showDetails ? 'Hide Calculation Details' : 'View Calculation Details'}
              </button>

              {showDetails && (
                <div className="mt-4 rounded-xl bg-[#f7f7f5] p-4 text-sm leading-7 text-[#666]">
                  <p>
                    Effective battery capacity: {Math.round(results.usableCapacity)} mAh
                  </p>
                  <p>
                    Estimated consumption: {Math.round(results.totalDrain)} mAh
                  </p>
                  <p>
                    Battery health: {batteryHealth}%
                  </p>
                  <p>
                    Remaining capacity: {Math.round(results.remainingMah)} mAh
                  </p>
                  <p>
                    Calculation is an estimate, not a real-time measurement.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={resetSimulator}
              className="w-full rounded-xl bg-[#ded9cf] px-5 py-4 text-sm font-bold text-[#222] transition hover:bg-[#d0c9bc]"
            >
              Reset Simulator
            </button>

          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-[#e8e6e1] bg-white p-5 text-center">
          <p className="text-xs leading-6 text-[#999]">
            Note: Battery consumption rates are illustrative estimates.
            Actual battery life depends on screen brightness, network signal,
            background apps, processor efficiency, temperature and other factors.
            This simulator does not read your phone's actual battery.
          </p>
        </div>

      </div>
    </main>
  )
}
