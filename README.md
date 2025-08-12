# 🍉 Watermelon Picker

[![Build and Push Docker Image](https://github.com/vinsim24/watermelon-picker/actions/workflows/docker-build.yml/badge.svg)](https://github.com/vinsim24/watermelon-picker/actions/workflows/docker-build.yml)
[![Docker Hub](https://img.shields.io/docker/pulls/vinsim24/watermelon-picker)](https://hub.docker.com/r/vinsim24/watermelon-picker)

An AI-powered web application that helps you choose the perfect watermelon using computer vision and expert knowledge.

🚀 **Now with automated Docker builds via GitHub Actions!**

## Features

- **AI Image Analysis**: Upload photos for automated watermelon quality assessment
- **Expert Scoring System**: Based on real watermelon selection criteria
- **Mobile-Friendly**: Responsive design with Tailwind CSS
- **Real-time Analysis**: Instant feedback on watermelon quality
- **Docker Ready**: Easy deployment with containerization

## Technology Stack

- **Backend**: Node.js (Latest), Express.js
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Image Processing**: Sharp (for server-side analysis)
- **Deployment**: Docker & Docker Compose

## Prerequisites

- **Node.js**: >= 18.0.0 (Latest recommended)
- **npm**: >= 8.0.0
- **Docker**: For containerized deployment

## Quick Start

### Using Docker (Recommended)

**Option 1: Use pre-built image from Docker Hub**:
```bash
docker run -d -p 3010:3010 --name watermelon-picker vinsim24/watermelon-picker:latest
```

**Option 2: Clone and build locally**:
```bash
git clone https://github.com/vinsim24/watermelon-picker.git
cd watermelon-picker
docker-compose up --build -d
```

**Access the app**: Open http://localhost:3010

### Local Development

1. **Check Node.js version** (should be >= 18.0.0):
   ```bash
   node --version
   ```

2. **Install/Update Node.js using nvm** (if needed):
   
   **Windows (nvm-windows)**:
   ```bash
   # Install nvm-windows from: https://github.com/coreybutler/nvm-windows
   nvm install latest
   nvm use latest
   ```
   
   **macOS/Linux**:
   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install latest Node.js
   nvm install node
   nvm use node
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   Open http://localhost:3010

## Project Structure

```
watermelon-picker/
├── src/
│   ├── routes/
│   │   └── api.js              # API endpoints
│   └── services/
│       ├── WatermelonAnalyzer.js # Core analysis logic
│       └── ImageProcessor.js    # Image processing service
├── public/
│   ├── index.html              # Main HTML page
│   └── js/
│       └── app.js              # Frontend JavaScript
├── server.js                   # Express server setup
├── package.json               # Dependencies
├── Dockerfile                 # Docker configuration
└── docker-compose.yml         # Docker Compose setup
```

## API Endpoints

### POST /api/analyze
Analyze a watermelon based on image and/or form data.

**Request**: Multipart form data
- `image` (optional): Image file
- `size`: Watermelon size
- `shape`: Watermelon shape
- `stripes`: Stripe pattern
- `fieldSpot`: Field spot color
- `stem`: Stem condition

**Response**:
```json
{
  "success": true,
  "recommendation": {
    "quality": "Excellent Choice!",
    "qualityClass": "excellent",
    "percentage": 85,
    "recommendation": "This watermelon shows all the signs...",
    "feedback": ["✅ Excellent field spot!", "..."],
    "tips": ["Look for a creamy yellow field spot", "..."]
  }
}
```

### GET /api/tips
Get general watermelon selection tips.

### GET /api/knowledge
Get the watermelon knowledge base.

## How It Works

### Image Analysis
1. **Upload Processing**: Images are resized and processed using Sharp
2. **Color Analysis**: Pixels are analyzed for dominant colors
3. **Pattern Detection**: Stripe patterns are detected through brightness variations
4. **Field Spot Detection**: Yellow/white areas are identified as potential field spots

### Scoring System
- **Field Spot (30 points)**: Most important ripeness indicator
- **Stem Condition (25 points)**: Shows if picked at right time
- **Size & Shape (20 points)**: Optimal combinations for sweetness
- **Stripe Pattern (15 points)**: Visual quality indicator
- **Image Analysis (20 points)**: AI-powered bonus scoring

## CI/CD Pipeline

This project uses GitHub Actions for automated building and deployment:

- **Automatic builds**: Every push to `main` branch triggers a Docker image build
- **Multi-platform support**: Images built for `linux/amd64` and `linux/arm64`
- **Docker Hub integration**: Images automatically pushed to [vinsim24/watermelon-picker](https://hub.docker.com/r/vinsim24/watermelon-picker)
- **Smart tagging**: Images tagged with branch name, commit SHA, and `latest` for main branch
- **Caching**: Build cache optimization for faster subsequent builds

### Available Docker Tags
- `latest` - Latest stable version from main branch
- `main-<sha>` - Specific commit from main branch
- `<branch>-<sha>` - Feature branch builds

## Deployment

### Docker Production Deployment

**Using Docker Hub image**:
```bash
# Pull and run latest image
docker pull vinsim24/watermelon-picker:latest
docker run -d -p 3010:3010 --name watermelon-picker vinsim24/watermelon-picker:latest

# View logs
docker logs -f watermelon-picker

# Stop and remove
docker stop watermelon-picker && docker rm watermelon-picker
```

**Using Docker Compose**:
```bash
# Build and run locally
docker-compose up --build -d

# View logs
docker-compose logs -f watermelon-picker

# Check status
docker-compose ps

# Stop
docker-compose down
```

### Docker Image Management

```bash
# View images
docker images | grep watermelon

# Remove old images
docker image prune

# Rebuild from scratch
docker-compose build --no-cache
```

### Environment Variables

- `PORT`: Server port (default: 3010)
- `NODE_ENV`: Environment (development/production)

### Custom Port Configuration

To use a different port, set the `PORT` environment variable:

```bash
# Local development
PORT=8080 npm start

# Docker Compose
# Edit docker-compose.yml and change both port mappings:
# ports:
#   - "8080:8080"
# environment:
#   - PORT=8080
```

## Development

### Adding New Features

1. **Backend Logic**: Add to `src/services/WatermelonAnalyzer.js`
2. **Image Processing**: Extend `src/services/ImageProcessor.js`
3. **API Endpoints**: Add to `src/routes/api.js`
4. **Frontend**: Update `public/js/app.js`

### Testing

```bash
# Health check
curl http://localhost:3010/health

# API test
curl -X POST http://localhost:3010/api/analyze \
  -F "size=medium" \
  -F "fieldSpot=creamy-yellow"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Made with 💚 for watermelon lovers everywhere!