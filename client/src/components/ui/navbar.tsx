import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, MessageSquare, Shield, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole = "user" | "admin";

interface UserType {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

interface NavbarProps {
  user?: UserType;
  onLogout?: () => void;
  className?: string;
}

const Navbar = ({ user, onLogout, className }: NavbarProps) => {
  if (!user) return null;

  const roleConfig = {
    user: {
      label: "USER",
      icon: UserIcon,
      color: "bg-gradient-primary text-primary-foreground"
    },
    admin: {
      label: "ADMIN", 
      icon: Shield,
      color: "bg-gradient-secondary text-secondary-foreground"
    }
  };

  const currentRoleConfig = roleConfig[user.role];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-hero">
              <img src="/echoboard-logo.svg" alt="EchoBoard" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-lg sm:text-xl gradient-text truncate">EchoBoard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Feedback Management</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge className={cn("gap-1.5 sm:gap-2 text-xs font-bold px-3 py-1.5 rounded-full", currentRoleConfig.color)}>
              <RoleIcon className="w-3 h-3" />
              <span className="font-bold">{currentRoleConfig.label}</span>
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 sm:h-12 px-2 sm:px-3 gap-2 sm:gap-3 hover-lift">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback> 
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="gap-3">
                  <Settings className="w-4 h-4" />
                  Account Settings
                </DropdownMenuItem>

                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="gap-3 text-destructive focus:text-destructive"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };