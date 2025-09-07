# EchoBoard Kubernetes Deployment for Digital Ocean

This directory contains Kubernetes deployment manifests for deploying EchoBoard to Digital Ocean Kubernetes.

## Prerequisites

1. **Digital Ocean Kubernetes Cluster**: Create a DOKS cluster
2. **kubectl**: Configured to connect to your cluster
3. **Docker Hub Account**: Images are published to `ismaelmours/echoboard-*`
4. **NGINX Ingress Controller**: Install on your cluster

## Quick Start

### 1. Build and Push Images

```bash
# Make scripts executable
chmod +x build-and-push.sh deploy.sh

# Build and push Docker images to Docker Hub
./build-and-push.sh
```

### 2. Deploy to Kubernetes

```bash
# Deploy the application
./deploy.sh
```

### 3. Access the Application

- **External IP**: Check with `kubectl get ingress -n echoboard-dev`
- **Port Forward**: `kubectl port-forward service/client-srv 8080:8080 -n echoboard-dev`

## Configuration

### Environment Variables

Update `secrets.yaml` with your actual values:

```yaml
data:
  mongo-uri: <base64-encoded-mongodb-uri>
  jwt-key: <base64-encoded-jwt-secret>
  redis-password: <base64-encoded-redis-password>
  resend-api-key: <base64-encoded-resend-api-key>
```

To encode values:
```bash
echo -n "your-value" | base64
```

### Domain Configuration

Update `ingress.yaml` with your domain:
```yaml
rules:
  - host: echoboard-dev.your-domain.com  # Replace with your domain
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NGINX Ingress │    │   Client (2x)   │    │   Server (2x)   │
│                 │────│   React App     │────│   Express API   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Worker (1x)   │             │
                       │   Background    │             │
                       │   Jobs          │             │
                       └─────────────────┘             │
                                │                      │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis         │    │   MongoDB       │
                       │   Cache/Queue   │    │   Database      │
                       └─────────────────┘    └─────────────────┘
```

## Services

| Service | Image | Replicas | Port | Purpose |
|---------|-------|----------|------|---------|
| client | `ismaelmours/echoboard-client` | 2 | 8080 | React frontend |
| server | `ismaelmours/echoboard-server` | 2 | 3000 | Express API |
| worker | `ismaelmours/echoboard-worker` | 1 | - | Background jobs |
| mongodb | `mongo:7.0` | 1 | 27017 | Database |
| redis | `redis:7.2-alpine` | 1 | 6379 | Cache/Queue |

## Monitoring

### Health Checks

- **API Health**: `/api/health`
- **Pod Status**: `kubectl get pods -n echoboard-dev`
- **Service Status**: `kubectl get services -n echoboard-dev`

### Logs

```bash
# View all logs
kubectl logs -f deployment/server-depl -n echoboard-dev
kubectl logs -f deployment/worker-depl -n echoboard-dev
kubectl logs -f deployment/client-depl -n echoboard-dev

# View specific pod logs
kubectl logs -f <pod-name> -n echoboard-dev
```

## Scaling

### Horizontal Pod Autoscaler

```bash
# Scale server deployment
kubectl scale deployment server-depl --replicas=3 -n echoboard-dev

# Scale client deployment
kubectl scale deployment client-depl --replicas=3 -n echoboard-dev
```

## Troubleshooting

### Common Issues

1. **Images not pulling**: Check Docker Hub credentials and image names
2. **Pods not starting**: Check resource limits and secrets
3. **Ingress not working**: Verify NGINX ingress controller is installed
4. **Database connection**: Check MongoDB service and secrets

### Debug Commands

```bash
# Describe pods for detailed status
kubectl describe pod <pod-name> -n echoboard-dev

# Check events
kubectl get events -n echoboard-dev --sort-by='.lastTimestamp'

# Port forward for local testing
kubectl port-forward service/server-srv 3000:3000 -n echoboard-dev
kubectl port-forward service/client-srv 8080:8080 -n echoboard-dev
```

## Cleanup

```bash
# Delete the entire namespace
kubectl delete namespace echoboard-dev

# Or delete individual resources
kubectl delete -f .
```

## Production Considerations

1. **Resource Limits**: Adjust CPU/memory limits based on usage
2. **Persistent Volumes**: Use persistent volumes for MongoDB data
3. **SSL/TLS**: Configure SSL certificates for production
4. **Monitoring**: Add monitoring and alerting
5. **Backup**: Implement database backup strategy
6. **Security**: Use proper RBAC and network policies

## Support

For issues or questions:
- Check the main README.md
- Review Kubernetes logs
- Verify Docker Hub image availability
- Ensure all secrets are properly configured
