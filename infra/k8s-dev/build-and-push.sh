#!/bin/bash

# EchoBoard Docker Build and Push Script for Digital Ocean
# This script builds and pushes Docker images to Docker Hub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Docker Hub configuration
DOCKER_HUB_USERNAME="ismaelmours"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

print_status "Building and pushing EchoBoard Docker images..."
print_status "Docker Hub Username: $DOCKER_HUB_USERNAME"
print_status "Timestamp: $TIMESTAMP"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Login to Docker Hub (optional - will prompt if needed)
print_status "Logging into Docker Hub..."
echo "Please enter your Docker Hub credentials if prompted:"
docker login

# Build and push server image
print_status "Building server image..."
docker build -f server/Dockerfile -t $DOCKER_HUB_USERNAME/echoboard-server:latest .
docker tag $DOCKER_HUB_USERNAME/echoboard-server:latest $DOCKER_HUB_USERNAME/echoboard-server:$TIMESTAMP

print_status "Pushing server image to Docker Hub..."
docker push $DOCKER_HUB_USERNAME/echoboard-server:latest
docker push $DOCKER_HUB_USERNAME/echoboard-server:$TIMESTAMP

print_success "Server image built and pushed successfully"

# Build and push client image
print_status "Building client image..."
docker build -f client/Dockerfile -t $DOCKER_HUB_USERNAME/echoboard-client:latest ./client
docker tag $DOCKER_HUB_USERNAME/echoboard-client:latest $DOCKER_HUB_USERNAME/echoboard-client:$TIMESTAMP

print_status "Pushing client image to Docker Hub..."
docker push $DOCKER_HUB_USERNAME/echoboard-client:latest
docker push $DOCKER_HUB_USERNAME/echoboard-client:$TIMESTAMP

print_success "Client image built and pushed successfully"

# Build and push worker image
print_status "Building worker image..."
docker build -f worker/Dockerfile -t $DOCKER_HUB_USERNAME/echoboard-worker:latest ./worker
docker tag $DOCKER_HUB_USERNAME/echoboard-worker:latest $DOCKER_HUB_USERNAME/echoboard-worker:$TIMESTAMP

print_status "Pushing worker image to Docker Hub..."
docker push $DOCKER_HUB_USERNAME/echoboard-worker:latest
docker push $DOCKER_HUB_USERNAME/echoboard-worker:$TIMESTAMP

print_success "Worker image built and pushed successfully"

print_success "All images built and pushed to Docker Hub!"
print_status "Images available at:"
echo "  - $DOCKER_HUB_USERNAME/echoboard-server:latest"
echo "  - $DOCKER_HUB_USERNAME/echoboard-client:latest"
echo "  - $DOCKER_HUB_USERNAME/echoboard-worker:latest"
echo ""
echo "Tagged versions:"
echo "  - $DOCKER_HUB_USERNAME/echoboard-server:$TIMESTAMP"
echo "  - $DOCKER_HUB_USERNAME/echoboard-client:$TIMESTAMP"
echo "  - $DOCKER_HUB_USERNAME/echoboard-worker:$TIMESTAMP"
