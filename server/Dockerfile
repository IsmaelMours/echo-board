# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy common package source
COPY common/ common/

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Build the common package
WORKDIR /app/common
RUN npm install
RUN npm run build

# Go back to server directory
WORKDIR /app

# Copy server source files
COPY server/ .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/common/build ./common/build

# Command to run the application
CMD ["node", "dist/index.js"]