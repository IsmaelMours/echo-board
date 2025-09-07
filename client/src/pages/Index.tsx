import React, { useState, useEffect } from "react";
import Auth from "./Auth";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import { UserType } from "@/types";
import { authAPI } from "@/lib/api";

const Index = () => {
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
        // User is not authenticated, will show login screen
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthSuccess = (user: UserType) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setCurrentUser(null);
    }
  };


  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-neutral/20 to-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show appropriate dashboard based on user role
  if (currentUser.role === "admin") {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <UserDashboard
      user={currentUser}
      onLogout={handleLogout}
    />
  );
};

export default Index;
