class WatermelonAnalyzer {
  constructor() {
    this.knowledgeBase = this.loadKnowledgeBase();
  }

  generateRecommendation(analysis) {
    let score = 0;
    let maxScore = 0;
    let feedback = [];

    // Analyze field spot (most important indicator)
    if (analysis.fieldSpot) {
      maxScore += 30;
      const fieldSpotScore = this.analyzeFieldSpot(analysis.fieldSpot);
      score += fieldSpotScore.score;
      feedback.push(fieldSpotScore.feedback);
    }

    // Analyze stem condition
    if (analysis.stem) {
      maxScore += 25;
      const stemScore = this.analyzeStem(analysis.stem);
      score += stemScore.score;
      feedback.push(stemScore.feedback);
    }

    // Analyze shape and size
    if (analysis.shape && analysis.size) {
      maxScore += 20;
      const sizeShapeScore = this.analyzeSizeShape(analysis.size, analysis.shape);
      score += sizeShapeScore.score;
      feedback.push(sizeShapeScore.feedback);
    }

    // Analyze stripe pattern
    if (analysis.stripes) {
      maxScore += 15;
      const stripeScore = this.analyzeStripes(analysis.stripes);
      score += stripeScore.score;
      feedback.push(stripeScore.feedback);
    }

    // Image analysis bonus
    if (analysis.hasImage) {
      maxScore += 20;
      const imageScore = this.analyzeImageData(analysis.imageAnalysis, analysis);
      score += imageScore.score;
      feedback.push(...imageScore.feedback);
    }

    // Generate quality rating
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const qualityAssessment = this.getQualityAssessment(percentage);

    return {
      ...qualityAssessment,
      percentage,
      feedback: feedback.filter(f => f), // Remove empty feedback
      tips: this.getGeneralTips(),
      score,
      maxScore
    };
  }

  analyzeFieldSpot(fieldSpot) {
    const fieldSpotMap = {
      'creamy-yellow': { score: 30, feedback: "✅ Excellent field spot! The creamy yellow indicates perfect ripeness." },
      'pale-yellow': { score: 25, feedback: "✅ Good field spot color, should be ripe." },
      'white': { score: 15, feedback: "⚠️ White field spot suggests it might be underripe." },
      'green': { score: 5, feedback: "❌ Green or missing field spot is a red flag - likely underripe." }
    };
    return fieldSpotMap[fieldSpot] || { score: 0, feedback: "" };
  }

  analyzeStem(stem) {
    const stemMap = {
      'dry-brown': { score: 25, feedback: "✅ Perfect! Dry brown stem means it ripened naturally on the vine." },
      'missing': { score: 15, feedback: "⚠️ Missing stem is okay, but harder to judge ripeness." },
      'green': { score: 5, feedback: "❌ Green stem suggests it was picked too early." }
    };
    return stemMap[stem] || { score: 0, feedback: "" };
  }

  analyzeSizeShape(size, shape) {
    const optimalCombinations = [
      { size: 'medium', shape: 'round' },
      { size: 'large', shape: 'round' },
      { size: 'large', shape: 'oblong' },
      { size: 'extra-large', shape: 'oblong' }
    ];

    const isOptimal = optimalCombinations.some(combo => 
      combo.size === size && combo.shape === shape
    );

    if (isOptimal) {
      return { score: 20, feedback: "✅ Great size and shape combination for optimal sweetness." };
    } else if (size === 'small') {
      return { score: 10, feedback: "⚠️ Small watermelons can be sweet but have less flesh." };
    } else {
      return { score: 15, feedback: "✅ Decent size and shape." };
    }
  }

  analyzeStripes(stripes) {
    const stripeMap = {
      'dark-light': { score: 15, feedback: "✅ Classic stripe pattern looks good!" },
      'solid-dark': { score: 12, feedback: "✅ Solid dark pattern is acceptable." },
      'light-dark': { score: 13, feedback: "✅ Light with dark stripes looks good." },
      'mottled': { score: 10, feedback: "⚠️ Mottled pattern is less ideal but okay." }
    };
    return stripeMap[stripes] || { score: 10, feedback: "✅ Stripe pattern is acceptable." };
  }

  analyzeImageData(imageAnalysis, userAnalysis) {
    let imageScore = 10; // Base score for having image
    let feedback = [];

    if (!imageAnalysis) {
      return { score: imageScore, feedback: ["✅ Great job providing a photo for visual analysis!"] };
    }

    // Field spot analysis from image
    if (!userAnalysis.fieldSpot && imageAnalysis.fieldSpotEstimate !== 'unknown') {
      const fieldSpotScore = this.analyzeFieldSpot(imageAnalysis.fieldSpotEstimate);
      imageScore += Math.min(fieldSpotScore.score * 0.3, 10); // 30% weight for AI detection
      feedback.push(`🤖 AI detected ${imageAnalysis.fieldSpotEstimate.replace('-', ' ')} field spot in image`);
    }

    // Stripe pattern detection
    if (!userAnalysis.stripes && imageAnalysis.hasStripes) {
      imageScore += 5;
      feedback.push("🤖 AI detected stripe patterns in the image - good visual indicator!");
    }

    // Color analysis feedback
    if (imageAnalysis.dominantColors && imageAnalysis.dominantColors.length > 0) {
      feedback.push(`🤖 AI analysis: Detected ${imageAnalysis.dominantColors.join(', ')} tones`);
    }

    feedback.push("✅ Image analysis provided additional insights!");

    return { score: Math.min(imageScore, 20), feedback };
  }

  getQualityAssessment(percentage) {
    if (percentage >= 80) {
      return {
        quality: "Excellent Choice!",
        qualityClass: "excellent",
        recommendation: "This watermelon shows all the signs of being perfectly ripe and delicious. Go for it!"
      };
    } else if (percentage >= 65) {
      return {
        quality: "Good Choice",
        qualityClass: "good",
        recommendation: "This watermelon looks promising. It should be sweet and juicy."
      };
    } else if (percentage >= 45) {
      return {
        quality: "Fair Choice",
        qualityClass: "fair",
        recommendation: "This watermelon might be okay, but there are some concerns about ripeness."
      };
    } else {
      return {
        quality: "Poor Choice",
        qualityClass: "poor",
        recommendation: "I'd recommend looking for a different watermelon with better ripeness indicators."
      };
    }
  }

  getGeneralTips() {
    return [
      "Look for a creamy yellow field spot where the watermelon sat on the ground",
      "The stem should be dry and brown, not green",
      "A ripe watermelon should sound hollow when tapped",
      "The watermelon should feel heavy for its size",
      "Look for a dull, matte skin rather than shiny",
      "Avoid watermelons with soft spots, bruises, or cuts",
      "The best watermelons have prominent stripes and uniform shape",
      "A good watermelon should have a sweet aroma at the blossom end"
    ];
  }

  getKnowledgeBase() {
    return this.knowledgeBase;
  }

  loadKnowledgeBase() {
    return {
      ripeness_indicators: {
        field_spot: {
          creamy_yellow: { score: 10, description: "Perfect ripeness" },
          pale_yellow: { score: 8, description: "Good ripeness" },
          white: { score: 5, description: "Possibly underripe" },
          green: { score: 2, description: "Likely underripe" }
        },
        stem: {
          dry_brown: { score: 10, description: "Naturally ripened" },
          missing: { score: 6, description: "Cannot determine" },
          green: { score: 2, description: "Picked too early" }
        }
      },
      varieties: {
        sugar_baby: { size: "small", shape: "round", sweetness: 9 },
        crimson_sweet: { size: "large", shape: "oblong", sweetness: 8 },
        charleston_gray: { size: "large", shape: "oblong", sweetness: 7 }
      }
    };
  }
}

module.exports = WatermelonAnalyzer;