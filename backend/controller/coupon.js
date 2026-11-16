
import Coupon from '../model/coupon.js'

// CREATE COUPON (Admin)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      expiryDate,
      usageLimit
    } = req.body

    if (
      !code ||
      !discountType ||
      !discountValue ||
      !expiryDate
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide all required coupon fields.'
      })
    }

    const existingCoupon = await Coupon.findOne({
      code: code.trim().toUpperCase()
    })

    if (existingCoupon) {
      return res.status(400).json({
        ok: false,
        message: 'Coupon code already exists.'
      })
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid discount type.'
      })
    }

    if (Number(discountValue) <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'Discount must be greater than zero.'
      })
    }

    if (
      discountType === 'percentage' &&
      Number(discountValue) > 100
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Percentage discount cannot exceed 100%.'
      })
    }

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        ok: false,
        message: 'Expiry date must be in the future.'
      })
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minimumOrderAmount: Number(minimumOrderAmount || 0),
      maximumDiscount:
        maximumDiscount !== undefined && maximumDiscount !== ''
          ? Number(maximumDiscount)
          : null,
      expiryDate,
      usageLimit:
        usageLimit !== undefined && usageLimit !== ''
          ? Number(usageLimit)
          : null
    })

    res.status(201).json({
      ok: true,
      message: 'Coupon created successfully.',
      coupon
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// GET ALL COUPONS (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })

    res.status(200).json({
      ok: true,
      count: coupons.length,
      coupons
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// VALIDATE COUPON (User)
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Coupon code and subtotal are required.'
      })
    }

    const orderSubtotal = Number(subtotal)

    if (!Number.isFinite(orderSubtotal) || orderSubtotal <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid order subtotal.'
      })
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase()
    })

    if (!coupon) {
      return res.status(404).json({
        ok: false,
        message: 'Invalid coupon code.'
      })
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        ok: false,
        message: 'This coupon is inactive.'
      })
    }

    if (new Date(coupon.expiryDate) <= new Date()) {
      return res.status(400).json({
        ok: false,
        message: 'This coupon has expired.'
      })
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Coupon usage limit has been reached.'
      })
    }

    if (orderSubtotal < coupon.minimumOrderAmount) {
      return res.status(400).json({
        ok: false,
        message: `Minimum order amount is Rs. ${coupon.minimumOrderAmount}.`
      })
    }

    let discount = 0

    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * coupon.discountValue) / 100
    } else {
      discount = coupon.discountValue
    }

    if (coupon.maximumDiscount !== null) {
      discount = Math.min(discount, coupon.maximumDiscount)
    }

    discount = Math.min(discount, orderSubtotal)

    res.status(200).json({
      ok: true,
      message: 'Coupon applied successfully.',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// DELETE COUPON (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)

    if (!coupon) {
      return res.status(404).json({
        ok: false,
        message: 'Coupon not found.'
      })
    }

    res.status(200).json({
      ok: true,
      message: 'Coupon deleted successfully.'
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
