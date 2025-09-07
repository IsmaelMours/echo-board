import dotenv from 'dotenv';
import pino from 'pino';
import { QueueManager } from './queues/queueManager';

// Load environment variables
dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

class WorkerService {
  private queueManager: QueueManager;
  private isShuttingDown = false;

  constructor() {
    this.queueManager = new QueueManager();
    this.setupGracefulShutdown();
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting EchoBoard Worker Service...');
      
      // Check required environment variables
      this.validateEnvironment();
      
      // Schedule reminder job to run daily at 9 AM
      await this.queueManager.scheduleReminderJob();
      
      logger.info('Worker service started successfully');
      logger.info('Listening for jobs on email and scheduled queues...');
      
      // Keep the process alive
      this.keepAlive();
      
    } catch (error) {
      logger.error({ error }, 'Failed to start worker service');
      process.exit(1);
    }
  }

  private validateEnvironment(): void {
    const required = ['REDIS_HOST', 'RESEND_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      
      this.isShuttingDown = true;
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      try {
        await this.queueManager.close();
        logger.info('Worker service shut down successfully');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon
  }

  private keepAlive(): void {
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 3;
    
    // Send periodic health check
    setInterval(async () => {
      try {
        // Check Redis connection first
        const redisHealthy = await this.queueManager.checkRedisConnection();
        if (!redisHealthy) {
          logger.warn('Redis connection is unhealthy, attempting reconnection...');
          await this.queueManager.reconnect();
          return;
        }

        const stats = await this.queueManager.getQueueStats();
        logger.info('Queue stats:', stats);
        
        // Reset error counter on successful health check
        consecutiveErrors = 0;
        
        // Check if workers are running
        if (stats.workers && (!stats.workers.email || !stats.workers.scheduled)) {
          logger.warn('One or more workers are not running, attempting reconnection...');
          await this.queueManager.reconnect();
        }
      } catch (error) {
        consecutiveErrors++;
        logger.error({ error }, `Health check failed (${consecutiveErrors}/${maxConsecutiveErrors})`);
        
        // If we have too many consecutive errors, try to reconnect
        if (consecutiveErrors >= maxConsecutiveErrors) {
          logger.warn('Too many consecutive errors, attempting to reconnect...');
          try {
            await this.queueManager.reconnect();
            consecutiveErrors = 0; // Reset on successful reconnection
          } catch (reconnectError) {
            logger.error({ error: reconnectError }, 'Failed to reconnect, will retry on next health check');
          }
        }
      }
    }, 30000); // Every 30 seconds
  }
}

// Start the worker service
const workerService = new WorkerService();
workerService.start().catch((error) => {
  logger.error('Worker service failed to start:', error);
  process.exit(1);
});