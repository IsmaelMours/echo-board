import axios from "axios";
import { AuthResponse, UserType, Feedback } from "@/types";

const instance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8080",
});

const authAPI = {
  signIn: async (loginData): Promise<AuthResponse> => {
    const response = await instance.post("/api/users/login", loginData);
    return response.data as AuthResponse;
  },
  signUp: async (registerData): Promise<AuthResponse> => {
    const response = await instance.post("/api/users/register", registerData);
    return response.data as AuthResponse;
  },
  logout: async () => {
    const response = await instance.post("/api/users/logout");
    return response.data as any;
  },
  currentUser: async (): Promise<{ user: UserType | null }> => {
    const response = await instance.get("/api/users/currentuser");
    return response.data as { user: UserType | null };
  },
};

const feedbackAPI = {
  // Placeholder for feedback API methods
  getAll: async (): Promise<Feedback[]> => {
    const response = await instance.get("/feedback");
    return response.data as Feedback[];
  },
  create: async (feedbackData): Promise<Feedback> => {
    const response = await instance.post("/feedback", feedbackData);
    return response.data as Feedback;
  },
  update: async (id: string, updateData: Partial<Feedback>): Promise<Feedback> => {
    const response = await instance.put(`/feedback/${id}`, updateData);
    return response.data as Feedback;
  },
  delete: async (id: string): Promise<void> => {
    await instance.delete(`/feedback/${id}`);
  },
};

const healthAPI = {
  getHealth: async (): Promise<any> => {
    const response = await instance.get("/health");
    return response.data as any;
  },
};

export { authAPI, feedbackAPI, healthAPI };