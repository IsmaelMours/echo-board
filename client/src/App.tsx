import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserType } from "@/types";
import { authAPI } from "@/lib/api";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        const { currentUser: user } = response.data as { currentUser: UserType | null };
        setCurrentUser(user);
      } catch (error) {
        // User is not authenticated
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - Only accessible when not authenticated */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute user={currentUser} isLoading={isLoading}>
                  <Auth onAuthSuccess={setCurrentUser} />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes - Require authentication */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute user={currentUser} isLoading={isLoading}>
                  {currentUser?.role === 'admin' ? (
                    <AdminDashboard user={currentUser} onLogout={handleLogout} />
                  ) : (
                    <UserDashboard user={currentUser!} onLogout={handleLogout} />
                  )}
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={currentUser} isLoading={isLoading}>
                  <UserDashboard user={currentUser!} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={currentUser} isLoading={isLoading} requiredRole="admin">
                  <AdminDashboard user={currentUser!} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
