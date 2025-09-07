import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { StatusBadge } from "@/components/ui/status-badge";
import { FeedbackStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar, MoreHorizontal, CheckCircle, XCircle, Trash2, AlertCircle } from "lucide-react";
import { UserType, Feedback } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeedbackCardProps {
  feedback: Feedback;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: FeedbackStatus) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const FeedbackCard = ({
  feedback,
  isAdmin = false,
  onStatusChange,
  onDelete,
  className
}: FeedbackCardProps) => {
  const { id, title, message, rating, status, author } = feedback;
  const createdAtDate = new Date(feedback.createdAt);

  const handleStatusChange = (newStatus: FeedbackStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover-lift bg-gradient-card border-card-border",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-background flex-shrink-0">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-card-foreground group-hover:text-primary transition-colors truncate">
                {title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="truncate">{author.name}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{createdAtDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <StatusBadge status={status} />
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {status !== "rejected" && status !== "approved" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("approved")}
                      className="text-success hover:text-success"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                  )}
                  {status !== "approved" && status !== "rejected" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("rejected")}
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  )}
                  {status === "rejected" && (
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cannot approve rejected feedback
                    </DropdownMenuItem>
                  )}
                  {status === "approved" && (
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already approved
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          <StarRating rating={rating} readonly size="sm" />
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed break-words">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export { FeedbackCard };