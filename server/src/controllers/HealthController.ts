import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { QueueService } from '../services/queue/QueueService';

class HealthController {
  static async getHealthStatus(req: Request, res: Response) {
    try {
      const healthStatus = {
        timestamp: new Date().toISOString(),
        services: {
          feedbackSystem: {
            status: 'operational',
            message: 'Feedback system is running normally'
          },
          database: {
            status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
            message: mongoose.connection.readyState === 1 
              ? 'Database connection is active' 
              : 'Database connection is not established',
            readyState: mongoose.connection.readyState
          },
          emailNotifications: {
            status: 'unknown',
            message: 'Email service status unknown'
          },
          apiResponse: {
            status: 'operational',
            message: 'API is responding normally',
            responseTime: req.startTime ? Date.now() - req.startTime : 0
          }
        }
      };

      // Check Redis/Email service health
      try {
        const queueService = QueueService.getInstance();
        const redisHealthy = await queueService.checkRedisConnection();
        
        healthStatus.services.emailNotifications = {
          status: redisHealthy ? 'operational' : 'degraded',
          message: redisHealthy 
            ? 'Email service is operational' 
            : 'Email service is experiencing issues'
        };
      } catch (error) {
        healthStatus.services.emailNotifications = {
          status: 'degraded',
          message: 'Email service is unavailable'
        };
      }

      // Determine overall system status
      const allServices = Object.values(healthStatus.services);
      const hasUnhealthy = allServices.some(service => service.status === 'unhealthy');
      const hasDegraded = allServices.some(service => service.status === 'degraded');

      let overallStatus = 'operational';
      if (hasUnhealthy) {
        overallStatus = 'unhealthy';
      } else if (hasDegraded) {
        overallStatus = 'degraded';
      }

      res.status(200).json({
        status: overallStatus,
        ...healthStatus
      });

    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        services: {
          feedbackSystem: { status: 'unknown', message: 'Unable to determine status' },
          database: { status: 'unknown', message: 'Unable to determine status' },
          emailNotifications: { status: 'unknown', message: 'Unable to determine status' },
          apiResponse: { status: 'unknown', message: 'Unable to determine status' }
        }
      });
    }
  }
}

export { HealthController };
