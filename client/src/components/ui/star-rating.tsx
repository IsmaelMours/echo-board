import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= (hoverRating || rating);
        
        return (
          <button
            key={starIndex}
            type="button"
            className={cn(
              "transition-all duration-200",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                isFilled
                  ? "fill-warning text-warning"
                  : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export { StarRating };