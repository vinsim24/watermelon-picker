const express = require('express');
const multer = require('multer');
const WatermelonAnalyzer = require('../services/WatermelonAnalyzer');
const ImageProcessor = require('../services/ImageProcessor');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Analyze watermelon endpoint
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { size, shape, stripes, fieldSpot, stem } = req.body;
    
    let imageAnalysis = null;
    if (req.file) {
      const imageProcessor = new ImageProcessor();
      imageAnalysis = await imageProcessor.analyzeImage(req.file.buffer);
    }

    const analyzer = new WatermelonAnalyzer();
    const analysis = {
      size,
      shape,
      stripes,
      fieldSpot,
      stem,
      hasImage: !!req.file,
      imageAnalysis
    };

    const recommendation = analyzer.generateRecommendation(analysis);
    
    res.json({
      success: true,
      analysis,
      recommendation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze watermelon',
      message: error.message
    });
  }
});

// Get watermelon tips
router.get('/tips', (req, res) => {
  const analyzer = new WatermelonAnalyzer();
  res.json({
    success: true,
    tips: analyzer.getGeneralTips()
  });
});

// Get watermelon knowledge base
router.get('/knowledge', (req, res) => {
  const analyzer = new WatermelonAnalyzer();
  res.json({
    success: true,
    knowledge: analyzer.getKnowledgeBase()
  });
});

module.exports = router;