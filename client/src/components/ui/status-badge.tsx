import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { FeedbackStatus } from "@/types";

interface StatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20"
  },
  approved: {
    label: "Approved", 
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20"
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20"
  },
  archived: {
    label: "Archived",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-border"
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        "transition-all duration-200",
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export { StatusBadge };