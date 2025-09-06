import { Resend } from 'resend';
import { EmailJobData, EmailTemplate } from '../types/email';

export class EmailService {
  private resend: Resend;

  constructor() {
    console.log('Initializing EmailService with API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(jobData: EmailJobData): Promise<void> {
    try {
      const template = this.getEmailTemplate(jobData.template, jobData.data);
      
      // For testing mode, send to verified email address
      const verifiedEmail = process.env.VERIFIED_EMAIL || 'monnapuleismaelmours@gmail.com';
      const recipientEmail = process.env.NODE_ENV === 'production' ? jobData.to : verifiedEmail;
      
      const result = await this.resend.emails.send({
        from: process.env.FROM_EMAIL || 'EchoBoard <noreply@resend.dev>',
        to: [recipientEmail],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Email sent successfully:`, result);
      console.log(`Email ID: ${result.data?.id}`);
      console.log(`Email to: ${recipientEmail} (original: ${jobData.to})`);
      console.log(`Email from: ${process.env.FROM_EMAIL || 'EchoBoard <noreply@resend.dev>'}`);
      
      if (recipientEmail !== jobData.to) {
        console.log(`⚠️  Email redirected to verified address due to Resend testing mode`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private getEmailTemplate(template: string, data: any): EmailTemplate {
    switch (template) {
      case 'feedback_created':
        return {
          subject: `Feedback Received: ${data.feedbackTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Thank you for your feedback!</h2>
              <p>Hi ${data.userName},</p>
              <p>We've received your feedback and our team will review it shortly.</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your Feedback:</h3>
                <p><strong>Title:</strong> ${data.feedbackTitle}</p>
                <p><strong>Rating:</strong> ${data.feedbackRating}/5 ⭐</p>
                <p><strong>Message:</strong> ${data.feedbackMessage}</p>
              </div>
              <p>We appreciate you taking the time to help us improve!</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            Thank you for your feedback!
            
            Hi ${data.userName},
            
            We've received your feedback and our team will review it shortly.
            
            Your Feedback:
            Title: ${data.feedbackTitle}
            Rating: ${data.feedbackRating}/5
            Message: ${data.feedbackMessage}
            
            We appreciate you taking the time to help us improve!
            
            Best regards,
            The EchoBoard Team
          `
        };

      case 'feedback_updated':
        return {
          subject: `Feedback Updated: ${data.feedbackTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Your feedback has been updated</h2>
              <p>Hi ${data.userName},</p>
              <p>Your feedback has been reviewed and updated by our admin team.</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Updated Feedback:</h3>
                <p><strong>Title:</strong> ${data.feedbackTitle}</p>
                <p><strong>Rating:</strong> ${data.feedbackRating}/5 ⭐</p>
                <p><strong>Message:</strong> ${data.feedbackMessage}</p>
              </div>
              <p>Thank you for your continued engagement!</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            Your feedback has been updated
            
            Hi ${data.userName},
            
            Your feedback has been reviewed and updated by our admin team.
            
            Updated Feedback:
            Title: ${data.feedbackTitle}
            Rating: ${data.feedbackRating}/5
            Message: ${data.feedbackMessage}
            
            Thank you for your continued engagement!
            
            Best regards,
            The EchoBoard Team
          `
        };

      case 'welcome_email':
        return {
          subject: 'Welcome to EchoBoard!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Welcome to EchoBoard!</h2>
              <p>Hi ${data.userName},</p>
              <p>Welcome to EchoBoard! We're excited to have you on board.</p>
              <p>EchoBoard is a modern feedback management platform that helps teams collect, organize, and act on feedback effectively.</p>
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Getting Started:</h3>
                <ul>
                  <li>Share your feedback through our intuitive dashboard</li>
                  <li>Track the status of your submissions</li>
                  <li>View analytics and insights</li>
                </ul>
              </div>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            Welcome to EchoBoard!
            
            Hi ${data.userName},
            
            Welcome to EchoBoard! We're excited to have you on board.
            
            EchoBoard is a modern feedback management platform that helps teams collect, organize, and act on feedback effectively.
            
            Getting Started:
            - Share your feedback through our intuitive dashboard
            - Track the status of your submissions
            - View analytics and insights
            
            If you have any questions, feel free to reach out to our support team.
            
            Best regards,
            The EchoBoard Team
          `
        };

      case 'reminder_email':
        return {
          subject: 'Reminder: Share Your Feedback on EchoBoard',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">We'd Love to Hear from You!</h2>
              <p>Hi ${data.userName},</p>
              <p>It's been a while since you last shared feedback with us. Your input is valuable and helps us improve our services.</p>
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-top: 0;">Why Your Feedback Matters:</h3>
                <ul style="color: #856404;">
                  <li>Helps us identify areas for improvement</li>
                  <li>Shapes our product roadmap</li>
                  <li>Creates a better experience for everyone</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl || 'https://echoboard.dev'}" 
                   style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Share Your Feedback Now
                </a>
              </div>
              <p>It only takes a few minutes, and your voice makes a difference!</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            We'd Love to Hear from You!
            
            Hi ${data.userName},
            
            It's been a while since you last shared feedback with us. Your input is valuable and helps us improve our services.
            
            Why Your Feedback Matters:
            - Helps us identify areas for improvement
            - Shapes our product roadmap
            - Creates a better experience for everyone
            
            Share your feedback at: ${data.dashboardUrl || 'https://echoboard.dev'}
            
            It only takes a few minutes, and your voice makes a difference!
            
            Best regards,
            The EchoBoard Team
          `
        };

      case 'feedback_approved':
        return {
          subject: 'Great News! Your Feedback Has Been Approved',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #10B981; color: white; padding: 20px; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">✓</span>
                </div>
              </div>
              <h2 style="color: #333; text-align: center;">Your Feedback Has Been Approved!</h2>
              <p>Hi ${data.userName},</p>
              <p>Great news! Your feedback has been reviewed and approved by our team.</p>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
                <h3 style="color: #065f46; margin-top: 0;">Feedback Details:</h3>
                <p><strong>Title:</strong> ${data.feedbackTitle}</p>
                <p><strong>Rating:</strong> ${data.feedbackRating}/5 ⭐</p>
                <p><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">Approved</span></p>
              </div>
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #065f46; margin-top: 0;">What happens next?</h3>
                <ul style="color: #065f46;">
                  <li>Your feedback will be shared with the relevant team</li>
                  <li>We'll work on implementing your suggestions</li>
                  <li>You'll receive updates on our progress</li>
                </ul>
              </div>
              
              <p>Thank you for taking the time to share your thoughts with us. Your input helps us create a better experience for everyone!</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            Great News! Your Feedback Has Been Approved!
            
            Hi ${data.userName},
            
            Great news! Your feedback has been reviewed and approved by our team.
            
            Feedback Details:
            - Title: ${data.feedbackTitle}
            - Rating: ${data.feedbackRating}/5 ⭐
            - Status: Approved
            
            What happens next?
            - Your feedback will be shared with the relevant team
            - We'll work on implementing your suggestions
            - You'll receive updates on our progress
            
            Thank you for taking the time to share your thoughts with us. Your input helps us create a better experience for everyone!
            
            Best regards,
            The EchoBoard Team
          `
        };

      case 'feedback_rejected':
        return {
          subject: 'Feedback Update: Your Submission Status',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #EF4444; color: white; padding: 20px; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">✗</span>
                </div>
              </div>
              <h2 style="color: #333; text-align: center;">Feedback Status Update</h2>
              <p>Hi ${data.userName},</p>
              <p>Thank you for your feedback submission. After careful review, we've decided not to move forward with this particular suggestion.</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
                <h3 style="color: #991b1b; margin-top: 0;">Feedback Details:</h3>
                <p><strong>Title:</strong> ${data.feedbackTitle}</p>
                <p><strong>Rating:</strong> ${data.feedbackRating}/5 ⭐</p>
                <p><strong>Status:</strong> <span style="color: #EF4444; font-weight: bold;">Not Approved</span></p>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">We still value your input!</h3>
                <p style="color: #6b7280;">While this particular feedback wasn't a fit for our current priorities, we encourage you to continue sharing your thoughts and suggestions. Every piece of feedback helps us understand our users better.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.dashboardUrl || 'https://echoboard.dev'}" 
                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Submit New Feedback
                </a>
              </div>
              
              <p>Thank you for your continued engagement with EchoBoard.</p>
              <p>Best regards,<br>The EchoBoard Team</p>
            </div>
          `,
          text: `
            Feedback Status Update
            
            Hi ${data.userName},
            
            Thank you for your feedback submission. After careful review, we've decided not to move forward with this particular suggestion.
            
            Feedback Details:
            - Title: ${data.feedbackTitle}
            - Rating: ${data.feedbackRating}/5 ⭐
            - Status: Not Approved
            
            We still value your input!
            While this particular feedback wasn't a fit for our current priorities, we encourage you to continue sharing your thoughts and suggestions. Every piece of feedback helps us understand our users better.
            
            Submit new feedback at: ${data.dashboardUrl || 'https://echoboard.dev'}
            
            Thank you for your continued engagement with EchoBoard.
            
            Best regards,
            The EchoBoard Team
          `
        };

      default:
        throw new Error(`Unknown email template: ${template}`);
    }
  }
}
