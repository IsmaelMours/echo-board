import { Queue, ConnectionOptions } from 'bullmq';

interface EmailJobData {
  type: 'feedback_created' | 'feedback_updated' | 'feedback_deleted' | 'welcome_email' | 'reminder_email' | 'feedback_approved' | 'feedback_rejected';
  to: string;
  subject: string;
  template: string;
  data: {
    userName?: string;
    feedbackTitle?: string;
    feedbackMessage?: string;
    feedbackRating?: number;
    feedbackId?: string;
    adminName?: string;
    dashboardUrl?: string;
  };
}

export class QueueService {
  private emailQueue: Queue<EmailJobData>;
  private static instance: QueueService;
  private isConnected: boolean = false;

  private constructor() {
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

    this.emailQueue = new Queue<EmailJobData>('emailQueue', { connection });
    this.setupEventHandlers();
  }

  // Singleton pattern
  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  private setupEventHandlers(): void {
    this.emailQueue.on('error', (error) => {
      console.error('Email queue error:', error);
      this.isConnected = false;
    });

    // Note: Queue doesn't have 'ready' event, we'll check connection status differently
    this.emailQueue.on('waiting', () => {
      console.log('Email queue is waiting for connection');
    });
  }

  async addEmailJob(jobData: EmailJobData): Promise<void> {
    try {
      // Check if we need to wait for connection
      if (!this.isConnected) {
        console.log('Waiting for Redis connection before queuing email...');
        await this.emailQueue.waitUntilReady();
        this.isConnected = true;
      }

      // Add timeout to prevent hanging - increased to 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email queue timeout')), 30000);
      });

      const queuePromise = this.emailQueue.add('send-email', jobData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      await Promise.race([queuePromise, timeoutPromise]);
      console.log(`Email job queued for ${jobData.to}`);
    } catch (error) {
      console.error('Failed to queue email job:', error);
      this.isConnected = false;
      // Don't throw the error to prevent breaking the main flow
      // The email will be retried by the worker
      console.warn('Email job failed to queue, but continuing with request processing');
    }
  }

  async sendFeedbackCreatedEmail(userEmail: string, userName: string, feedbackData: any): Promise<void> {
    const jobData: EmailJobData = {
      type: 'feedback_created',
      to: userEmail,
      subject: `Feedback Received: ${feedbackData.title}`,
      template: 'feedback_created',
      data: {
        userName,
        feedbackTitle: feedbackData.title,
        feedbackMessage: feedbackData.message,
        feedbackRating: feedbackData.rating,
        feedbackId: feedbackData.id,
      },
    };

    await this.addEmailJob(jobData);
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const jobData: EmailJobData = {
      type: 'welcome_email',
      to: userEmail,
      subject: 'Welcome to EchoBoard!',
      template: 'welcome_email',
      data: {
        userName,
      },
    };

    await this.addEmailJob(jobData);
  }

  async sendFeedbackApprovedEmail(userEmail: string, userName: string, feedbackData: any): Promise<void> {
    const jobData: EmailJobData = {
      type: 'feedback_approved',
      to: userEmail,
      subject: `Great News! Your Feedback Has Been Approved`,
      template: 'feedback_approved',
      data: {
        userName,
        feedbackTitle: feedbackData.title,
        feedbackMessage: feedbackData.message,
        feedbackRating: feedbackData.rating,
        feedbackId: feedbackData.id,
        dashboardUrl: 'https://echoboard.dev'
      },
    };

    await this.addEmailJob(jobData);
  }

  async sendFeedbackRejectedEmail(userEmail: string, userName: string, feedbackData: any): Promise<void> {
    const jobData: EmailJobData = {
      type: 'feedback_rejected',
      to: userEmail,
      subject: `Feedback Update: Your Submission Status`,
      template: 'feedback_rejected',
      data: {
        userName,
        feedbackTitle: feedbackData.title,
        feedbackMessage: feedbackData.message,
        feedbackRating: feedbackData.rating,
        feedbackId: feedbackData.id,
        dashboardUrl: 'https://echoboard.dev'
      },
    };

    await this.addEmailJob(jobData);
  }

  async close(): Promise<void> {
    await this.emailQueue.close();
  }

  // Redis connection health check
  async checkRedisConnection(): Promise<boolean> {
    try {
      await this.emailQueue.waitUntilReady();
      console.log('Redis connection is healthy');
      return true;
    } catch (error) {
      console.error('Redis connection health check failed:', error);
      return false;
    }
  }
}

