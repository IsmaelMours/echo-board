#!/bin/bash

# EchoBoard Digital Ocean Kubernetes Deployment Script
# This script deploys the EchoBoard application to Digital Ocean Kubernetes

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

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if we're connected to a Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Not connected to a Kubernetes cluster. Please configure kubectl first."
    exit 1
fi

print_status "Connected to Kubernetes cluster: $(kubectl config current-context)"

# Apply Kubernetes manifests
print_status "Applying Kubernetes manifests..."

# Create namespace first
kubectl apply -f namespace.yaml

# Apply secrets
kubectl apply -f secrets.yaml

# Apply database services
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f redis-deployment.yaml

# Wait for databases to be ready
print_status "Waiting for databases to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb-depl -n echoboard-dev
kubectl wait --for=condition=available --timeout=300s deployment/redis-depl -n echoboard-dev

# Apply application services
kubectl apply -f server-deployment.yaml
kubectl apply -f worker-deployment.yaml
kubectl apply -f client-deployment.yaml

# Apply ingress
kubectl apply -f ingress.yaml

print_success "Kubernetes manifests applied successfully"

# Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/server-depl -n echoboard-dev
kubectl wait --for=condition=available --timeout=300s deployment/worker-depl -n echoboard-dev
kubectl wait --for=condition=available --timeout=300s deployment/client-depl -n echoboard-dev

print_success "All deployments are ready!"

# Get service information
print_status "Getting service information..."
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n echoboard-dev
echo ""
echo "🌐 Services:"
kubectl get services -n echoboard-dev
echo ""
echo "🔗 Ingress:"
kubectl get ingress -n echoboard-dev

# Get the external IP or hostname
INGRESS_HOST=$(kubectl get ingress echoboard-ingress -n echoboard-dev -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
if [ -z "$INGRESS_HOST" ]; then
    INGRESS_HOST=$(kubectl get ingress echoboard-ingress -n echoboard-dev -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
fi

if [ -n "$INGRESS_HOST" ]; then
    echo ""
    print_success "🎉 EchoBoard is deployed and accessible at:"
    echo "   http://$INGRESS_HOST"
    echo "   https://echoboard-dev.your-domain.com (if DNS is configured)"
else
    print_warning "Ingress external IP not available yet. Check with:"
    echo "   kubectl get ingress echoboard-ingress -n echoboard-dev"
fi

echo ""
print_success "Deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "   View logs: kubectl logs -f deployment/server-depl -n echoboard-dev"
echo "   View pods: kubectl get pods -n echoboard-dev"
echo "   Delete deployment: kubectl delete namespace echoboard-dev"
echo "   Port forward: kubectl port-forward service/server-srv 3000:3000 -n echoboard-dev"
echo ""
echo "🔧 Service URLs (when port-forwarding):"
echo "   Frontend: http://localhost:8080 (kubectl port-forward service/client-srv 8080:8080 -n echoboard-dev)"
echo "   API: http://localhost:3000 (kubectl port-forward service/server-srv 3000:3000 -n echoboard-dev)"
echo "   Health Check: http://localhost:3000/api/health"
echo ""
