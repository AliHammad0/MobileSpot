
import mongoose from 'mongoose'
import LuckySpin from '../model/luckySpin.js'
import Order from '../model/order.js'
import Coupon from '../model/coupon.js'

// Lucky Spin Rewards
const rewards = [
  {
    type: 'discount',
    value: 5,
    label: '5% OFF',
    probability: 30
  },
  {
    type: 'discount',
    value: 10,
    label: '10% OFF',
    probability: 25
  },
  {
    type: 'discount',
    value: 15,
    label: '15% OFF',
    probability: 15
  },
  {
    type: 'discount',
    value: 20,
    label: '20% OFF',
    probability: 5
  },
  {
    type: 'free_shipping',
    value: 0,
    label: 'FREE SHIPPING',
    probability: 10
  },
  {
    type: 'try_again',
    value: 0,
    label: 'TRY AGAIN',
    probability: 15
  }
]

// Random Reward Selection
const getRandomReward = () => {
  const totalProbability = rewards.reduce(
    (total, reward) => total + reward.probability,
    0
  )

  let random = Math.random() * totalProbability

  for (const reward of rewards) {
    random -= reward.probability

    if (random < 0) {
      return reward
    }
  }

  return rewards[0]
}

// Generate Unique Coupon Code
const generateCouponCode = () => {
  const randomCode = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()

  return `SPIN-${randomCode}`
}

// Get Available Spins
export const getMyLuckySpins = async (req, res) => {
  try {
    const spins = await LuckySpin.find({
      user: req.user._id
    })
      .populate('order', 'orderStatus totalPrice deliveredAt')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalSpins: spins.length,
      availableSpins: spins.filter(
        spin => spin.status === 'pending'
      ).length,
      spins
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Spin the Wheel
export const spinLuckyWheel = async (req, res) => {
  try {
    const { spinId } = req.body

    if (!mongoose.Types.ObjectId.isValid(spinId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid spin ID.'
      })
    }

    const spin = await LuckySpin.findOne({
      _id: spinId,
      user: req.user._id,
      status: 'pending'
    })

    if (!spin) {
      return res.status(404).json({
        ok: false,
        message: 'No available spin found.'
      })
    }

    const order = await Order.findOne({
      _id: spin.order,
      user: req.user._id,
      orderStatus: 'Delivered'
    })

    if (!order) {
      return res.status(400).json({
        ok: false,
        message: 'Lucky Spin is available only after order delivery.'
      })
    }

    const reward = getRandomReward()

    let couponCode = null
    let expiresAt = null

    // Generate coupon for winning rewards
    if (
      reward.type === 'discount' ||
      reward.type === 'free_shipping'
    ) {
      couponCode = generateCouponCode()

      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const couponData = {
        code: couponCode,
        discountType: 'fixed',
        discountValue: reward.type === 'free_shipping' ? 250 : reward.value,
        minimumOrderAmount: 0,
        maximumDiscount: null,
        expiryDate: expiresAt,
        usageLimit: 1,
        usedCount: 0,
        isActive: true
      }

      // Discount coupon uses percentage
      if (reward.type === 'discount') {
        couponData.discountType = 'percentage'
        couponData.discountValue = reward.value
      }

      await Coupon.create(couponData)
    }

    // Atomically claim spin so it cannot be used twice
    const updatedSpin = await LuckySpin.findOneAndUpdate(
      {
        _id: spin._id,
        user: req.user._id,
        status: 'pending'
      },
      {
        $set: {
          rewardType: reward.type,
          rewardValue: reward.value,
          rewardLabel: reward.label,
          couponCode,
          status: reward.type === 'try_again' ? 'used' : 'active',
          spunAt: new Date(),
          expiresAt
        }
      },
      {
        new: true
      }
    )

    if (!updatedSpin) {
      // Remove generated coupon if spin was already claimed
      if (couponCode) {
        await Coupon.deleteOne({ code: couponCode })
      }

      return res.status(409).json({
        ok: false,
        message: 'This spin has already been used.'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Lucky Spin completed successfully.',
      reward: {
        type: reward.type,
        label: reward.label,
        value: reward.value,
        couponCode,
        expiresAt
      },
      spin: updatedSpin
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
