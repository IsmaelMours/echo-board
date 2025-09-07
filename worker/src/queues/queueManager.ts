import { Worker, Queue, ConnectionOptions, Job } from 'bullmq';
import { EmailProcessor } from '../processors/emailProcessor';
import { ScheduledProcessor } from '../processors/scheduledProcessor';
import { EmailJobData } from '../types/email';

export class QueueManager {
  private emailQueue: Queue<EmailJobData>;
  private scheduledQueue: Queue;
  private emailWorker: Worker<EmailJobData>;
  private scheduledWorker: Worker;
  private emailProcessor: EmailProcessor;
  private scheduledProcessor: ScheduledProcessor;

  constructor() {
    const connection: ConnectionOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 1000,
      lazyConnect: true,
      connectTimeout: 30000, // Increased to 30 seconds
      commandTimeout: 30000, // Increased to 30 seconds
      retryDelayOnClusterDown: 1000,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3, // Limit retries to prevent infinite loops
      keepAlive: 30000, // Keep connection alive
      family: 4, // Force IPv4
    };

    // Initialize queues
    this.emailQueue = new Queue<EmailJobData>('emailQueue', { connection });
    this.scheduledQueue = new Queue('scheduledQueue', { connection });

    // Initialize processors
    this.emailProcessor = new EmailProcessor();
    this.scheduledProcessor = new ScheduledProcessor();

    // Initialize workers
    this.emailWorker = new Worker<EmailJobData>(
      'emailQueue',
      async (job: Job<EmailJobData>) => {
        await this.emailProcessor.processEmailJob(job);
      },
      { 
        connection,
        concurrency: 5, // Process up to 5 email jobs concurrently
        removeOnComplete: { count: 10 },
        removeOnFail: { count: 5 },
      }
    );

    this.scheduledWorker = new Worker(
      'scheduledQueue',
      async (job: Job) => {
        await this.scheduledProcessor.processScheduledJob(job);
      },
      { 
        connection,
        concurrency: 2, // Process up to 2 scheduled jobs concurrently
        removeOnComplete: { count: 10 },
        removeOnFail: { count: 5 },
      }
    );

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Email worker events
    this.emailWorker.on('completed', (job) => {
      console.log(`Email job ${job.id} completed successfully`);
    });

    this.emailWorker.on('failed', (job, err) => {
      console.error(`Email job ${job?.id} failed:`, err);
    });

    this.emailWorker.on('error', (err) => {
      console.error('Email worker error:', err);
      // Handle specific error types
      if (err.message.includes('Command timed out')) {
        console.warn('Email worker command timeout, will retry automatically');
      } else if (err.message.includes('Connection is closed')) {
        console.warn('Email worker connection closed, will reconnect automatically');
      } else if (err.message.includes('ECONNREFUSED')) {
        console.error('Email worker cannot connect to Redis server - check if Redis is running');
      } else if (err.message.includes('ETIMEDOUT')) {
        console.error('Email worker connection timed out - check network connectivity');
      }
      // Log the error but don't exit - let BullMQ handle reconnection
    });

    this.emailWorker.on('ready', () => {
      console.log('Email worker connected and ready');
    });

    this.emailWorker.on('closing', () => {
      console.log('Email worker is closing');
    });

    // Scheduled worker events
    this.scheduledWorker.on('completed', (job) => {
      console.log(`Scheduled job ${job.id} completed successfully`);
    });

    this.scheduledWorker.on('failed', (job, err) => {
      console.error(`Scheduled job ${job?.id} failed:`, err);
    });

    this.scheduledWorker.on('error', (err) => {
      console.error('Scheduled worker error:', err);
      // Handle specific error types
      if (err.message.includes('Command timed out')) {
        console.warn('Scheduled worker command timeout, will retry automatically');
      } else if (err.message.includes('Connection is closed')) {
        console.warn('Scheduled worker connection closed, will reconnect automatically');
      } else if (err.message.includes('ECONNREFUSED')) {
        console.error('Scheduled worker cannot connect to Redis server - check if Redis is running');
      } else if (err.message.includes('ETIMEDOUT')) {
        console.error('Scheduled worker connection timed out - check network connectivity');
      }
      // Log the error but don't exit - let BullMQ handle reconnection
    });

    this.scheduledWorker.on('ready', () => {
      console.log('Scheduled worker connected and ready');
    });

    this.scheduledWorker.on('closing', () => {
      console.log('Scheduled worker is closing');
    });
  }

  async addEmailJob(jobData: EmailJobData, options?: any): Promise<void> {
    await this.emailQueue.add('send-email', jobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      ...options,
    });
  }

  async addScheduledJob(jobData: any, options?: any): Promise<void> {
    await this.scheduledQueue.add('scheduled-task', jobData, {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
      ...options,
    });
  }

  async scheduleReminderJob(): Promise<void> {
    // Schedule reminder emails to run daily at 9 AM
    await this.scheduledQueue.add('scheduled-task', 
      { type: 'send_reminder_emails' },
      {
        repeat: { pattern: '0 9 * * *' }, // Daily at 9 AM
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );
    console.log('Reminder job scheduled to run daily at 9 AM');
  }

  async triggerReminderJob(): Promise<void> {
    // Manually trigger a reminder job for testing
    await this.scheduledQueue.add('scheduled-task', 
      { type: 'send_reminder_emails' },
      {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );
    console.log('Reminder job triggered manually');
  }

  async close(): Promise<void> {
    await this.emailWorker.close();
    await this.scheduledWorker.close();
    await this.emailQueue.close();
    await this.scheduledQueue.close();
  }

  // Health check methods
  async getQueueStats(): Promise<any> {
    try {
      const emailStats = await this.emailQueue.getJobCounts();
      const scheduledStats = await this.scheduledQueue.getJobCounts();

      return {
        email: emailStats,
        scheduled: scheduledStats,
        workers: {
          email: this.emailWorker.isRunning(),
          scheduled: this.scheduledWorker.isRunning(),
        }
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return {
        email: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
        scheduled: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
        workers: {
          email: false,
          scheduled: false,
        },
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Redis connection health check
  async checkRedisConnection(): Promise<boolean> {
    try {
      // Try to ping Redis through one of the queues
      await this.emailQueue.waitUntilReady();
      console.log('Redis connection is healthy');
      return true;
    } catch (error) {
      console.error('Redis connection health check failed:', error);
      return false;
    }
  }

  // Connection recovery method
  async reconnect(): Promise<void> {
    try {
      console.log('Attempting to reconnect workers...');
      
      // Close existing workers
      await this.emailWorker.close();
      await this.scheduledWorker.close();
      
      // Wait a bit before reconnecting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recreate workers with the same configuration
      const connection: ConnectionOptions = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 1000,
        lazyConnect: true,
        connectTimeout: 30000, // Increased to 30 seconds
        commandTimeout: 30000, // Increased to 30 seconds
        retryDelayOnClusterDown: 1000,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3, // Limit retries to prevent infinite loops
        keepAlive: 30000, // Keep connection alive
        family: 4, // Force IPv4
      };

      this.emailWorker = new Worker<EmailJobData>(
        'emailQueue',
        async (job: Job<EmailJobData>) => {
          await this.emailProcessor.processEmailJob(job);
        },
        { 
          connection,
          concurrency: 5,
          removeOnComplete: { count: 10 },
          removeOnFail: { count: 5 },
        }
      );

      this.scheduledWorker = new Worker(
        'scheduledQueue',
        async (job: Job) => {
          await this.scheduledProcessor.processScheduledJob(job);
        },
        { 
          connection,
          concurrency: 2,
          removeOnComplete: { count: 10 },
          removeOnFail: { count: 5 },
        }
      );

      this.setupEventHandlers();
      console.log('Workers reconnected successfully');
    } catch (error) {
      console.error('Failed to reconnect workers:', error);
      throw error;
    }
  }
}

