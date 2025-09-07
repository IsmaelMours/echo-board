import { Queue, ConnectionOptions } from 'bullmq';
import { EmailJobData } from '../types/email';

export class QueueClient {
  private emailQueue: Queue<EmailJobData>;
  private scheduledQueue: Queue;

  constructor() {
    const connection: ConnectionOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    };

    this.emailQueue = new Queue<EmailJobData>('emailQueue', { connection });
    this.scheduledQueue = new Queue('scheduledQueue', { connection });
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

  async close(): Promise<void> {
    await this.emailQueue.close();
    await this.scheduledQueue.close();
  }
}

