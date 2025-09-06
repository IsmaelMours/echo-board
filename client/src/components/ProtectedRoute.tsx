import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserType } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: UserType | null;
  isLoading: boolean;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  user, 
  isLoading, 
  requiredRole 
}) => {
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
