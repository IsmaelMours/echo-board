export type FeedbackStatus = "pending" | "approved" | "rejected" | "archived";

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Feedback {
  id: string;
  title: string;
  message: string;
  rating: number;
  status: FeedbackStatus;
  userId: string;
  author: UserType;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  message: string;
  user: UserType;
  redirectToLogin: boolean;
}
