import { Job } from 'bullmq';
import { EmailService } from '../services/emailService';

export class ScheduledProcessor {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async processScheduledJob(job: Job): Promise<void> {
    const { type } = job.data;

    console.log(`Processing scheduled job: ${type}`);

    switch (type) {
      case 'cleanup_old_feedback':
        await this.cleanupOldFeedback();
        break;
      case 'generate_daily_report':
        await this.generateDailyReport();
        break;
      case 'send_reminder_emails':
        await this.sendReminderEmails();
        break;
      default:
        console.log(`Unknown scheduled job type: ${type}`);
    }
  }

  private async cleanupOldFeedback(): Promise<void> {
    console.log('Cleaning up old feedback...');
    // This would typically connect to the database and clean up old feedback
    // For now, we'll just log the action
    console.log('Old feedback cleanup completed');
  }

  private async generateDailyReport(): Promise<void> {
    console.log('Generating daily report...');
    // This would typically generate a report of daily feedback activity
    // For now, we'll just log the action
    console.log('Daily report generated');
  }

  private async sendReminderEmails(): Promise<void> {
    console.log('Sending reminder emails...');
    
    try {
      // For now, we'll send a test reminder to the verified email address
      // In a real implementation, you would:
      // 1. Connect to the database
      // 2. Find users who haven't provided feedback in the last 7 days
      // 3. Send reminder emails to those users
      
      const verifiedEmail = process.env.VERIFIED_EMAIL || 'monnapuleismaelmours@gmail.com';
      
      await this.emailService.sendEmail({
        type: 'reminder_email',
        to: verifiedEmail,
        subject: 'Reminder: Share Your Feedback on EchoBoard',
        template: 'reminder_email',
        data: {
          userName: 'EchoBoard User',
          dashboardUrl: 'https://echoboard.dev'
        }
      });
      
      console.log(`Reminder email sent to ${verifiedEmail}`);
    } catch (error) {
      console.error('Failed to send reminder emails:', error);
      throw error;
    }
  }
}


