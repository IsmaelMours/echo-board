import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserType } from '@/types';

interface PublicRouteProps {
  children: React.ReactNode;
  user: UserType | null;
  isLoading: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  user, 
  isLoading 
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

  // Redirect to appropriate dashboard if already authenticated
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
