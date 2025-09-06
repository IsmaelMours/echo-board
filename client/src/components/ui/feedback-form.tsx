import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

interface FeedbackFormData {
  title: string;
  message: string;
  rating: number;
  userId: string;
}

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  userId: string;
}

const FeedbackForm = ({ onSubmit, isLoading = false, className, userId }: FeedbackFormProps) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    title: "",
    message: "",
    rating: 0,
    userId: userId,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, userId: userId }));
  }, [userId]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please provide a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset form only after successful submission
        setFormData({ title: "", message: "", rating: 0, userId: userId });
        setErrors({});
      } catch (error) {
        // Form reset is handled by the parent component on error
        console.error('Form submission error:', error);
      }
    }
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing  
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto bg-gradient-card border-card-border", className)}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl font-bold gradient-text">Share Your Feedback</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Help us improve by sharing your thoughts and experiences
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Feedback Title *
            </Label>
            <Input
              id="title"
              placeholder="Brief summary of your feedback..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={cn(
                "transition-all duration-200",
                errors.title && "border-destructive focus:border-destructive"
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive animate-fade-in">{errors.title}</p>
            )}
          </div>

          {/* Rating Field */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Overall Rating *
            </Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => handleInputChange("rating", rating)}
                size="lg"
              />
              <span className="text-sm text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}` : 'Click to rate'}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive animate-fade-in">{errors.rating}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">
              Your Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Share your detailed feedback, suggestions, or concerns..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={5}
              className={cn(
                "resize-none transition-all duration-200",
                errors.message && "border-destructive focus:border-destructive"
              )}
            />
            {errors.message && (
              <p className="text-sm text-destructive animate-fade-in">{errors.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Feedback
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { FeedbackForm };