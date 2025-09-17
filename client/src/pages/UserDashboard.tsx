import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { FeedbackForm } from "@/components/ui/feedback-form";
import { FeedbackCard } from "@/components/ui/feedback-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { UserType, Feedback } from "@/types";
import { feedbackAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UserDashboardProps {
  user: UserType;
  onLogout: () => void;
  className?: string;
}

const UserDashboard = ({ user, onLogout, className }: UserDashboardProps) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const { toast } = useToast();

  // Get user's feedback
  const userFeedback = feedbackList.filter(fb => fb.author.email === user.email);

  // Calculate stats
  const stats = {
    total: userFeedback.length,
    pending: userFeedback.filter(fb => fb.status === "pending").length,
    approved: userFeedback.filter(fb => fb.status === "approved").length,
    rejected: userFeedback.filter(fb => fb.status === "rejected").length,
    avgRating: userFeedback.length > 0 
      ? Math.round((userFeedback.reduce((acc, fb) => acc + fb.rating, 0) / userFeedback.length) * 10) / 10
      : 0
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await feedbackAPI.getAll();
      setFeedbackList(response);
    } catch (error: any) {
      toast({
        title: "Error fetching feedback",
        description: error.response?.data?.message || "Failed to load feedback.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitFeedback = async (formData: { title: string; message: string; rating: number; userId: string }) => {
    setIsSubmitting(true);
    
    try {
      const feedbackDataWithUser = { ...formData, userId: user.id };
      const response = await feedbackAPI.create(feedbackDataWithUser);
      const newFeedback = response;
      setFeedbackList(prev => [newFeedback, ...prev]);
      
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. We'll review it soon.",
      });
      
      // Switch to history tab to show the new feedback
      setActiveTab("history");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshFeedback = async () => {
    await fetchFeedback();
    toast({
      title: "Refreshed",
      description: "Feedback list has been updated.",
    });
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Navbar 
        user={user} 
        onLogout={onLogout}
      />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Share your thoughts and help us improve. Your voice matters in shaping our product.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 animate-slide-up">
          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Feedback</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                </div>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-warning">{stats.pending}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-warning flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl sm:text-3xl font-bold text-success">{stats.approved}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-success flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">{stats.rejected}</p>
                </div>
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.avgRating}</p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="submit" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Submit Feedback
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              My Feedback
            </TabsTrigger>
          </TabsList>

          {/* Submit Feedback Tab */}
          <TabsContent value="submit" className="mt-8">
            <FeedbackForm 
              onSubmit={handleSubmitFeedback}
              isLoading={isSubmitting}
              userId={user.id}
            />
          </TabsContent>

          {/* Feedback History Tab */}
          <TabsContent value="history" className="mt-8">
            <Card className="bg-gradient-card border-card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Your Feedback History
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshFeedback}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {userFeedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by submitting your first feedback to see it here.
                    </p>
                    <Button 
                      variant="hero" 
                      onClick={() => setActiveTab("submit")}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Submit Your First Feedback
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userFeedback.map((feedback) => {
                      console.log("Feedback ID in UserDashboard map:", feedback.id);
                      return (
                      <FeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        className="animate-fade-in"
                      />
                    )})}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;