# Use latest Node.js Alpine for smaller image size
FROM node:alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Sharp (image processing)
RUN apk add --no-cache \
    vips-dev \
    build-base \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S watermelon -u 1001

# Change ownership of the app directory
RUN chown -R watermelon:nodejs /app
USER watermelon

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3010/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server.js"]