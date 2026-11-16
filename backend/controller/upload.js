
import uploadToCloudinary from '../utils/cloudinaryUpload.js'

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: 'Please select an image.'
      })
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer)

    return res.status(200).json({
      ok: true,
      message: 'Image uploaded successfully!',
      image: {
        url: imageUrl
      }
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Image upload failed.'
    })
  }
}
