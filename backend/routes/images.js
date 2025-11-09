// backend/src/routes/images.ts
// Add this new route file for handling image requests

const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { authMiddleware } = require("./auth");

// const prisma = new PrismaClient();

/**
 * POST /api/images/by-category
 * Fetch images matching the provided category hierarchy
 * Body: { categories: [category, subcategory, subSubcategory] }
 */
router.post('/by-category', authMiddleware, async (req, res) => {
  try {
    const { categories } = req.body;

    // Validate input
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ 
        error: 'Categories array is required',
        example: { categories: ['Mindfulness', 'Breathing', 'Deep Breathing'] }
      });
    }

    console.log('🔍 Searching for images with categories:', categories);

    // Query database for images that match all category levels in order
    // The categories field in DB is stored as a string array: [category, subcategory, sub-subcategory]
    const images = await prisma.images.findMany({
      where: {
        // Match images where the categories array contains all provided categories in order
        categories: {
          hasEvery: categories
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10 // Limit to 10 images for performance
    });

    console.log(`✅ Found ${images.length} images for categories:`, categories);

    res.json({
      success: true,
      count: images.length,
      images: images.map(img => ({
        id: img.id,
        image_url: img.image_url,
        categories: img.categories
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching images by category:', error);
    res.status(500).json({ 
      error: 'Failed to fetch images',
      message: error.message 
    });
  }
});

/**
 * GET /api/images/all
 * Fetch all images (for admin/debugging)
 */
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const images = await prisma.images.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('❌ Error fetching all images:', error);
    res.status(500).json({ 
      error: 'Failed to fetch images',
      message: error.message 
    });
  }
});

/**
 * POST /api/images/upload
 * Upload a new image with categories
 * Body: { image_url: string, categories: string[] }
 */
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    const { image_url, categories } = req.body;

    if (!image_url || !categories || !Array.isArray(categories)) {
      return res.status(400).json({ 
        error: 'image_url (string) and categories (array) are required' 
      });
    }

    // Validate categories array has exactly 3 elements
    if (categories.length !== 3) {
      return res.status(400).json({ 
        error: 'Categories must contain exactly 3 levels: [category, subcategory, sub-subcategory]' 
      });
    }

    const newImage = await prisma.images.create({
      data: {
        image_url,
        categories
      }
    });

    console.log('✅ Image uploaded successfully:', newImage.id);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image: newImage
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
});

module.exports = router;