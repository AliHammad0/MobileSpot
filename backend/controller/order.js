
import mongoose from 'mongoose'
import Order from '../model/order.js'
import LuckySpin from '../model/luckySpin.js'
import Coupon from '../model/coupon.js'

// Create Order
export const createOrder = async (req, res) => {
  let claimedCouponId = null

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice = 250,
      couponCode = '',
      email
    } = req.body

    // Validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Please add products to your order.'
      })
    }

    for (const item of orderItems) {
      if (
        !item.product ||
        !mongoose.Types.ObjectId.isValid(item.product) ||
        !item.name ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1 ||
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) < 0
      ) {
        return res.status(400).json({
          ok: false,
          message: 'Invalid product information in order.'
        })
      }
    }

    // Validate shipping address
    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Complete shipping address is required.'
      })
    }

    // Validate payment method
    if (!['COD', 'Stripe'].includes(paymentMethod)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid payment method.'
      })
    }

    // Validate shipping price
    const shipping = Number(shippingPrice)

    if (!Number.isFinite(shipping) || shipping < 0) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid shipping amount.'
      })
    }

    // Calculate products total on backend
    const itemsPrice = orderItems.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    )

    let discount = 0
    let finalCouponCode = ''

    // Validate and apply coupon
    const normalizedCouponCode = String(couponCode || '')
      .trim()
      .toUpperCase()

    if (normalizedCouponCode) {
      const now = new Date()

      const coupon = await Coupon.findOne({
        code: normalizedCouponCode
      })

      if (!coupon) {
        return res.status(400).json({
          ok: false,
          message: 'Invalid coupon code.'
        })
      }

      if (!coupon.isActive) {
        return res.status(400).json({
          ok: false,
          message: 'This coupon is currently inactive.'
        })
      }

      if (new Date(coupon.expiryDate) <= now) {
        return res.status(400).json({
          ok: false,
          message: 'This coupon has expired.'
        })
      }

      if (itemsPrice < coupon.minimumOrderAmount) {
        return res.status(400).json({
          ok: false,
          message: `Minimum order amount for this coupon is Rs. ${coupon.minimumOrderAmount}.`
        })
      }

      if (
        coupon.usageLimit !== null &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({
          ok: false,
          message: 'This coupon usage limit has been reached.'
        })
      }

      // Calculate discount on backend
      if (coupon.discountType === 'percentage') {
        discount = (itemsPrice * coupon.discountValue) / 100

        if (coupon.maximumDiscount !== null) {
          discount = Math.min(discount, coupon.maximumDiscount)
        }
      } else if (coupon.discountType === 'fixed') {
        discount = coupon.discountValue
      } else {
        return res.status(400).json({
          ok: false,
          message: 'Invalid coupon discount type.'
        })
      }

      // Discount cannot exceed products total
      discount = Math.min(discount, itemsPrice)

      discount = Math.round(discount * 100) / 100

      // Atomically reserve one coupon use.
      // This prevents two simultaneous orders from exceeding usageLimit.
      const claimedCoupon = await Coupon.findOneAndUpdate(
        {
          _id: coupon._id,
          isActive: true,
          expiryDate: { $gt: now },
          minimumOrderAmount: { $lte: itemsPrice },
          $or: [
            { usageLimit: null },
            {
              $expr: {
                $lt: ['$usedCount', '$usageLimit']
              }
            }
          ]
        },
        {
          $inc: { usedCount: 1 }
        },
        {
          new: true
        }
      )

      if (!claimedCoupon) {
        return res.status(400).json({
          ok: false,
          message: 'This coupon is no longer available. Please try another coupon.'
        })
      }

      claimedCouponId = claimedCoupon._id
      finalCouponCode = claimedCoupon.code
    }

    // Calculate final total on backend
    const totalPrice = Math.max(
      0,
      itemsPrice + shipping - discount
    )

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      email: email ? email.trim().toLowerCase() : '',
      orderItems: orderItems.map(item => ({
        product: item.product,
        name: item.name,
        quantity: Number(item.quantity),
        image: item.image || '',
        price: Number(item.price)
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: shipping,
      couponCode: finalCouponCode,
      discountAmount: discount,
      totalPrice
    })

    // Order successfully created, no rollback needed
    claimedCouponId = null

    return res.status(201).json({
      ok: true,
      message: 'Order placed successfully.',
      order
    })
  } catch (error) {
    // If order creation fails, release the reserved coupon use
    if (claimedCouponId) {
      try {
        await Coupon.updateOne(
          { _id: claimedCouponId },
          { $inc: { usedCount: -1 } }
        )
      } catch (rollbackError) {
        console.error(
          'Coupon usage rollback failed:',
          rollbackError.message
        )
      }
    }

    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    })
      .populate('orderItems.product', 'name images brand model')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalOrders: orders.length,
      orders
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images brand model')

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found.'
      })
    }

    if (
      !req.user.isAdmin &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        ok: false,
        message: 'You are not authorized to view this order.'
      })
    }

    return res.status(200).json({
      ok: true,
      order
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images brand model')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalOrders: orders.length,
      orders
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid order status.'
      })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found.'
      })
    }

    const wasDelivered = order.orderStatus === 'Delivered'

    order.orderStatus = orderStatus

    if (orderStatus === 'Delivered') {
      if (!order.deliveredAt) {
        order.deliveredAt = new Date()
      }
    }

    await order.save()

    // Unlock one Lucky Spin for this delivered order
    if (orderStatus === 'Delivered' && !wasDelivered) {
      await LuckySpin.updateOne(
        { order: order._id },
        {
          $setOnInsert: {
            user: order.user,
            order: order._id,
            status: 'pending'
          }
        },
        { upsert: true }
      )
    }

    return res.status(200).json({
      ok: true,
      message: 'Order status updated successfully.',
      order
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Cancel My Order
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found.'
      })
    }

    if (!['Pending', 'Processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        ok: false,
        message: 'This order can no longer be cancelled.'
      })
    }

    order.orderStatus = 'Cancelled'
    await order.save()

    return res.status(200).json({
      ok: true,
      message: 'Order cancelled successfully.',
      order
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Delete Cancelled Order
export const deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found.'
      })
    }

    if (order.orderStatus !== 'Cancelled') {
      return res.status(400).json({
        ok: false,
        message: 'Only cancelled orders can be deleted.'
      })
    }

    await Order.findByIdAndDelete(order._id)

    return res.status(200).json({
      ok: true,
      message: 'Order deleted successfully.'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
