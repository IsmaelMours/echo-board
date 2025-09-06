export interface EmailJobData {
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

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}


