import { Job } from 'bullmq';
import { EmailService } from '../services/emailService';
import { EmailJobData } from '../types/email';

export class EmailProcessor {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async processEmailJob(job: Job<EmailJobData>): Promise<void> {
    const { type, to, subject, template, data } = job.data;

    console.log(`Processing email job: ${type} to ${to}`);

    try {
      await this.emailService.sendEmail({
        type,
        to,
        subject,
        template,
        data
      });

      console.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      console.error(`Email job ${job.id} failed:`, error);
      throw error; // This will mark the job as failed
    }
  }
}







