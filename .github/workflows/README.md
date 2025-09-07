# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the EchoBoard project's CI/CD pipeline.

## Workflows Overview

### 🔄 CI (Continuous Integration) - `ci.yml`
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Build, lint, and validate code changes

**Jobs:**
- **Client Build**: Lint and build React frontend
- **Server Build**: Lint and build Express API
- **Worker Build**: Lint and build background worker
- **Build Images**: Build and push Docker images to Docker Hub
- **Security Scan**: Run Trivy vulnerability scanner

### 🚀 CD (Continuous Deployment) - `cd.yml`
**Triggers:** Push to main, Manual dispatch
**Purpose:** Deploy to Digital Ocean Kubernetes

**Environments:**
- **Development**: Auto-deploy on main branch push
- **Staging**: Manual deployment via workflow dispatch
- **Production**: Manual deployment via workflow dispatch

**Features:**
- Automatic image tag updates
- Health checks
- Deployment status reporting
- Rollback capabilities

### 🔒 Security - `security.yml`
**Triggers:** Push, PR, Daily schedule
**Purpose:** Comprehensive security scanning

**Scans:**
- **Dependency Scan**: npm audit for all packages
- **Code Scan**: CodeQL analysis for JavaScript
- **Container Scan**: Trivy vulnerability scanning
- **Secrets Scan**: TruffleHog for secret detection

### 📦 Release - `release.yml`
**Triggers:** Git tags, Manual dispatch
**Purpose:** Create releases and push tagged images

**Features:**
- Automatic changelog generation
- Docker image tagging
- GitHub release creation
- Deployment file updates

### 🔍 Pull Request - `pr.yml`
**Triggers:** PR opened/updated
**Purpose:** PR validation and preview deployments

**Checks:**
- Conventional commits format
- Sensitive file detection
- Kubernetes manifest validation
- Dockerfile syntax check
- Preview deployment creation

### 🤖 Dependabot - `dependabot.yml`
**Triggers:** Dependabot PRs
**Purpose:** Auto-merge dependency updates

**Features:**
- Auto-approve patch/minor updates
- Auto-merge after CI passes
- Manual review for major updates

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Docker Hub
- `DOCKER_HUB_USERNAME`: Your Docker Hub username (ismaelmours)
- `DOCKER_HUB_TOKEN`: Docker Hub access token

### Digital Ocean
- `DIGITALOCEAN_ACCESS_TOKEN`: DO API token
- `DO_CLUSTER_NAME`: Name of your DOKS cluster

### Optional
- `GITHUB_TOKEN`: Automatically provided by GitHub

## Workflow Features

### 🏷️ Image Tagging Strategy
- **Latest**: `ismaelmours/echoboard-*:latest`
- **Commit SHA**: `ismaelmours/echoboard-*:abc1234`
- **Branch**: `ismaelmours/echoboard-*:main`
- **Release**: `ismaelmours/echoboard-*:v1.0.0`

### 🔄 Deployment Strategy
- **Blue-Green**: Zero-downtime deployments
- **Rolling Updates**: Gradual pod replacement
- **Health Checks**: Automatic rollback on failure
- **Resource Limits**: CPU/Memory constraints

### 📊 Monitoring & Observability
- **Health Endpoints**: `/api/health`
- **Log Aggregation**: Structured logging
- **Metrics**: Resource usage tracking
- **Alerts**: Failure notifications

## Usage Examples

### Manual Deployment
```bash
# Deploy to development
gh workflow run cd.yml -f environment=development

# Deploy to staging
gh workflow run cd.yml -f environment=staging

# Deploy to production
gh workflow run cd.yml -f environment=production
```

### Create Release
```bash
# Create a new release
gh workflow run release.yml -f version=v1.0.0

# Or create a git tag
git tag v1.0.0
git push origin v1.0.0
```

### View Workflow Status
```bash
# List recent workflow runs
gh run list

# View specific workflow run
gh run view <run-id>

# Download workflow logs
gh run download <run-id>
```

## Troubleshooting

### Common Issues

1. **Docker Build Fails**
   - Check Dockerfile syntax
   - Verify build context
   - Check resource limits

2. **Kubernetes Deployment Fails**
   - Verify cluster connectivity
   - Check image availability
   - Review resource constraints

3. **Security Scan Fails**
   - Review vulnerability reports
   - Update dependencies
   - Check for false positives

### Debug Commands

```bash
# Check workflow logs
gh run view --log

# Re-run failed workflow
gh run rerun <run-id>

# Cancel running workflow
gh run cancel <run-id>
```

## Best Practices

### 🔐 Security
- Use least-privilege secrets
- Regular dependency updates
- Vulnerability scanning
- Secret detection

### 🚀 Performance
- Parallel job execution
- Docker layer caching
- Resource optimization
- Build optimization

### 📝 Documentation
- Clear workflow names
- Descriptive job steps
- Comprehensive comments
- Status reporting

### 🔄 Reliability
- Retry mechanisms
- Health checks
- Rollback strategies
- Monitoring alerts

## Contributing

When adding new workflows:

1. Follow naming conventions
2. Add proper documentation
3. Include error handling
4. Test thoroughly
5. Update this README

## Support

For workflow issues:
- Check GitHub Actions documentation
- Review workflow logs
- Test locally when possible
- Ask for help in discussions
