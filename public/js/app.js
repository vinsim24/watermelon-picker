class WatermelonPickerApp {
    constructor() {
        this.selectedImage = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const analyzeBtn = document.getElementById('analyzeBtn');

        // File upload handling
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        imageInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Analysis button
        analyzeBtn.addEventListener('click', this.analyzeWatermelon.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-watermelon-400', 'bg-gray-100');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-watermelon-400', 'bg-gray-100');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    processImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image size must be less than 10MB');
            return;
        }

        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageSrc) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <div class="bg-white rounded-2xl p-4 shadow-lg inline-block">
                <img src="${imageSrc}" alt="Watermelon preview" class="max-w-full max-h-80 rounded-xl shadow-md">
                <p class="text-sm text-green-600 mt-2">✅ Image uploaded successfully!</p>
                <p class="text-xs text-gray-500 mt-1">AI analysis will be performed during evaluation</p>
            </div>
        `;
        preview.classList.remove('hidden');
    }

    async analyzeWatermelon() {
        const form = document.getElementById('watermelonForm');
        const formData = new FormData(form);
        
        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.setLoadingState(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.displayResults(result.recommendation);
            } else {
                throw new Error(result.message || 'Analysis failed');
            }

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Failed to analyze watermelon. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const analyzeText = document.getElementById('analyzeText');
        const loadingText = document.getElementById('loadingText');

        analyzeBtn.disabled = loading;
        
        if (loading) {
            analyzeText.classList.add('hidden');
            loadingText.classList.remove('hidden');
        } else {
            analyzeText.classList.remove('hidden');
            loadingText.classList.add('hidden');
        }
    }

    displayResults(recommendation) {
        const resultsDiv = document.getElementById('results');
        const recommendationDiv = document.getElementById('recommendation');
        const tipsDiv = document.getElementById('tips');

        // Quality score styling based on rating
        const qualityStyles = {
            excellent: 'bg-green-500 text-white',
            good: 'bg-yellow-500 text-white', 
            fair: 'bg-orange-500 text-white',
            poor: 'bg-red-500 text-white'
        };

        recommendationDiv.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">🎯</span>Quality Assessment
            </h3>
            <div class="inline-block px-4 py-2 rounded-full font-bold text-lg mb-4 ${qualityStyles[recommendation.qualityClass]}">
                ${recommendation.quality} (${recommendation.percentage}%)
            </div>
            <p class="text-lg font-semibold text-gray-800 mb-4">${recommendation.recommendation}</p>
            <div class="space-y-3">
                ${recommendation.feedback.map(item => `
                    <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-sm text-gray-700">${item}</div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 text-xs text-gray-500">
                Score: ${recommendation.score}/${recommendation.maxScore} points
            </div>
        `;

        tipsDiv.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">💡</span>Expert Tips for Choosing Watermelons
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${recommendation.tips.map(tip => `
                    <div class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                        <span class="text-mint-500 font-bold">•</span>
                        <span class="text-sm text-gray-700">${tip}</span>
                    </div>
                `).join('')}
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WatermelonPickerApp();
});