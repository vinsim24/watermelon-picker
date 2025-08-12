const sharp = require('sharp');

class ImageProcessor {
  constructor() {
    this.maxSize = 400; // Max dimension for analysis
  }

  async analyzeImage(imageBuffer) {
    try {
      // Resize image for faster processing
      const { data, info } = await sharp(imageBuffer)
        .resize(this.maxSize, this.maxSize, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const analysis = this.performColorAnalysis(data, info);
      return analysis;

    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  }

  performColorAnalysis(data, info) {
    const { width, height, channels } = info;
    const pixels = data.length / channels;
    
    let totalR = 0, totalG = 0, totalB = 0;
    let darkPixels = 0, lightPixels = 0, greenPixels = 0;
    let yellowPixels = 0, whitePixels = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += channels * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalR += r;
      totalG += g;
      totalB += b;
      
      // Classify pixel colors
      const brightness = (r + g + b) / 3;
      const isGreen = g > r && g > b && g > 100;
      const isYellow = r > 200 && g > 200 && b < 150;
      const isWhite = r > 220 && g > 220 && b > 220;
      
      if (brightness < 100) darkPixels++;
      else if (brightness > 200) lightPixels++;
      
      if (isGreen) greenPixels++;
      if (isYellow) yellowPixels++;
      if (isWhite) whitePixels++;
    }
    
    const sampledPixels = pixels / 4;
    const avgR = totalR / sampledPixels;
    const avgG = totalG / sampledPixels;
    const avgB = totalB / sampledPixels;
    
    // Determine dominant colors and patterns
    const dominantColors = [];
    if (greenPixels / sampledPixels > 0.3) dominantColors.push('green');
    if (yellowPixels / sampledPixels > 0.1) dominantColors.push('yellow');
    if (whitePixels / sampledPixels > 0.1) dominantColors.push('white');
    if (darkPixels / sampledPixels > 0.2) dominantColors.push('dark');
    
    // Estimate field spot color based on yellow/white pixels
    let fieldSpotEstimate = 'unknown';
    const yellowRatio = yellowPixels / sampledPixels;
    const whiteRatio = whitePixels / sampledPixels;
    
    if (yellowRatio > 0.15) fieldSpotEstimate = 'creamy-yellow';
    else if (yellowRatio > 0.08) fieldSpotEstimate = 'pale-yellow';
    else if (whiteRatio > 0.15) fieldSpotEstimate = 'white';
    else if (greenPixels / sampledPixels > 0.6) fieldSpotEstimate = 'green';
    
    // Estimate stripe pattern based on color variation
    const hasStripes = this.detectStripePattern(data, width, height, channels);
    
    return {
      dominantColors,
      fieldSpotEstimate,
      hasStripes,
      avgColor: { 
        r: Math.round(avgR), 
        g: Math.round(avgG), 
        b: Math.round(avgB) 
      },
      colorRatios: {
        green: Math.round(greenPixels / sampledPixels * 100) / 100,
        yellow: Math.round(yellowPixels / sampledPixels * 100) / 100,
        white: Math.round(whitePixels / sampledPixels * 100) / 100,
        dark: Math.round(darkPixels / sampledPixels * 100) / 100
      },
      imageInfo: {
        width,
        height,
        channels
      }
    };
  }

  detectStripePattern(data, width, height, channels) {
    // Simple stripe detection by analyzing horizontal color variations
    let variations = 0;
    const sampleRows = Math.min(10, height);
    
    for (let row = 0; row < sampleRows; row++) {
      const y = Math.floor((row / sampleRows) * height);
      let lastBrightness = 0;
      let changes = 0;
      
      for (let x = 0; x < width; x += 10) {
        const i = (y * width + x) * channels;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        if (Math.abs(brightness - lastBrightness) > 30) {
          changes++;
        }
        lastBrightness = brightness;
      }
      
      variations += changes;
    }
    
    return variations > (sampleRows * 3); // Threshold for stripe detection
  }

  async getImageMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha
      };
    } catch (error) {
      console.error('Metadata extraction error:', error);
      return null;
    }
  }
}

module.exports = ImageProcessor;