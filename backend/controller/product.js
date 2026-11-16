
import Product from '../model/product.js'
import uploadToCloudinary from '../utils/cloudinaryUpload.js'

// Helper: Parse JSON fields from FormData
const parseField = (value, fallback = {}) => {
  if (!value) return fallback

  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}


// Add Product (Admin)

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      category,
      description,
      price,
      oldPrice,
      discount,
      stock,
      rating,
      images,
      specifications,
      colors,
      expressDelivery,
      isFeatured
    } = req.body

    if (
      !name ||
      !brand ||
      !model ||
      !category ||
      !description ||
      price === undefined ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide all required product details and image URLs.'
      })
    }

    if (images.length > 5) {
      return res.status(400).json({
        ok: false,
        message: 'Maximum 5 product images are allowed.'
      })
    }

    const product = await Product.create({
      name,
      brand,
      model,
      category,
      description,
      price,
      oldPrice,
      discount,
      stock,
      rating,
      images,
      specifications,
      colors,
      expressDelivery,
      isFeatured
    })

    return res.status(201).json({
      ok: true,
      message: 'Product added successfully!',
      product
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}



// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalProducts: products.length,
      products
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.'
      })
    }

    return res.status(200).json({
      ok: true,
      product
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Invalid product ID.'
    })
  }
}


// Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.'
      })
    }

    const {
      name,
      brand,
      model,
      category,
      description,
      price,
      oldPrice,
      discount,
      stock,
      rating,
      specifications,
      colors,
      expressDelivery,
      isFeatured
    } = req.body

    // Update only provided fields
    const fields = {
      name,
      brand,
      model,
      category,
      description,
      price,
      oldPrice,
      discount,
      stock,
      rating,
      expressDelivery,
      isFeatured
    }

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        product[key] = value
      }
    })

    if (specifications !== undefined) {
      product.specifications = parseField(specifications)
    }

    if (colors !== undefined) {
      product.colors = parseField(colors, [])
    }

    // Upload new images only when provided
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({
          ok: false,
          message: 'Maximum 5 product images are allowed.'
        })
      }

      const newImages = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      )

      product.images = newImages
    }

    await product.save()

    return res.status(200).json({
      ok: true,
      message: 'Product updated successfully!',
      product
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Product deleted successfully!'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Search Products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || !q.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Please enter a search keyword.'
      })
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { model: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalProducts: products.length,
      products
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}


// Get Recommended Products
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      stock: { $gt: 0 }
    })
      .sort({ createdAt: -1 })
      .limit(10)

    return res.status(200).json({
      ok: true,
      totalProducts: products.length,
      products
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
