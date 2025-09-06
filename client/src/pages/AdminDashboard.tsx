import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { FeedbackCard } from "@/components/ui/feedback-card";
import { Feedback } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { FeedbackStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Search, 
  Filter, 
  RefreshCw,
  BarChart3,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  TrendingUp,
  Calendar
} from "lucide-react";
import { UserType } from "@/types";
import { feedbackAPI, healthAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
  className?: string;
}

const AdminDashboard = ({ user, onLogout, className }: AdminDashboardProps) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const { toast } = useToast();

  // Calculate stats
  const stats = {
    total: feedbackList.length,
    pending: feedbackList.filter(fb => fb.status === "pending").length,
    approved: feedbackList.filter(fb => fb.status === "approved").length,
    rejected: feedbackList.filter(fb => fb.status === "rejected").length,
    avgRating: feedbackList.length > 0 
      ? Math.round((feedbackList.reduce((acc, fb) => acc + fb.rating, 0) / feedbackList.length) * 10) / 10
      : 0,
    uniqueUsers: new Set(feedbackList.map(fb => fb.author.email)).size
  };

  useEffect(() => {
    const fetchAllFeedback = async () => {
      try {
        const response = await feedbackAPI.getAll();
        setFeedbackList(response.data);
      } catch (error: any) {
        toast({
          title: "Error fetching feedback",
          description: error.response?.data?.message || "Failed to load all feedback.",
          variant: "destructive",
        });
      }
    };

    const fetchHealthData = async () => {
      try {
        const response = await healthAPI.getStatus();
        setHealthData(response.data);
      } catch (error: any) {
        console.error("Failed to fetch health data:", error);
        // Set fallback health data
        setHealthData({
          services: {
            feedbackSystem: { status: 'unknown', message: 'Unable to determine status' },
            database: { status: 'unknown', message: 'Unable to determine status' },
            emailNotifications: { status: 'unknown', message: 'Unable to determine status' },
            apiResponse: { status: 'unknown', message: 'Unable to determine status' }
          }
        });
      } finally {
        setHealthLoading(false);
      }
    };

    fetchAllFeedback();
    fetchHealthData();
  }, []);

  // Filter feedback based on search and status
  useEffect(() => {
    let filtered = feedbackList;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(feedback =>
        feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(feedback => feedback.status === statusFilter);
    }

    setFilteredFeedback(filtered);
  }, [feedbackList, searchQuery, statusFilter]);

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatus) => {
    try {
      const response = await feedbackAPI.update(feedbackId, { status: newStatus });
      
      // Check if the status actually changed
      const currentFeedback = feedbackList.find(fb => fb.id === feedbackId);
      if (currentFeedback && currentFeedback.status === newStatus) {
        toast({
          title: "No change needed",
          description: `Feedback is already ${newStatus}`,
          variant: "default",
        });
        return;
      }
      
      setFeedbackList(prev => prev.map(fb => 
        fb.id === feedbackId 
          ? { ...fb, status: newStatus, updatedAt: new Date() } 
          : fb
      ));
      toast({
        title: "Status updated",
        description: `Feedback has been ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Status update failed",
        description: error.response?.data?.message || "Failed to update feedback status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (feedbackId: string) => {
    setFeedbackToDelete(feedbackId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (feedbackToDelete) {
      try {
        await feedbackAPI.delete(feedbackToDelete);
        setFeedbackList(prev => prev.filter(fb => fb.id !== feedbackToDelete));
        toast({
          title: "Feedback deleted",
          description: "The feedback has been permanently removed",
        });
      } catch (error: any) {
        toast({
          title: "Deletion failed",
          description: error.response?.data?.message || "Failed to delete feedback.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setFeedbackToDelete(null);
  };

  const refreshData = async () => {
    try {
      const response = await feedbackAPI.getAll();
      setFeedbackList(response.data);
      setSearchQuery("");
      setStatusFilter("all");
      toast({
        title: "Data refreshed",
        description: "All feedback data has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Refresh failed",
        description: error.response?.data?.message || "Failed to refresh data.",
        variant: "destructive",
      });
    }
  };

  const getRecentFeedback = () => {
    return feedbackList
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Navbar 
        user={user} 
        onLogout={onLogout}
      />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Admin Header */}
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Manage feedback, monitor system health, and ensure quality user experiences.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 animate-slide-up">
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
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Review</p>
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

          <Card className="bg-gradient-card border-card-border hover-lift">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-secondary">{stats.uniqueUsers}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-secondary flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="manage" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="manage" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Manage Feedback
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Manage Feedback Tab */}
          <TabsContent value="manage" className="mt-8">
            <Card className="bg-gradient-card border-card-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Feedback Management
                  </CardTitle>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FeedbackStatus | "all")}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm" onClick={refreshData} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>Showing {filteredFeedback.length} of {feedbackList.length} feedback items</p>
                  {(searchQuery || statusFilter !== "all") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredFeedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search or filter criteria"
                        : "No feedback has been submitted yet"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredFeedback.map((feedback) => (
                      <FeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        isAdmin={true}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteClick}
                        className="animate-fade-in"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Feedback */}
              <Card className="bg-gradient-card border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecentFeedback().map((feedback) => (
                      <div key={feedback.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {feedback.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{feedback.title}</p>
                            <p className="text-xs text-muted-foreground">{feedback.author.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-xs text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                          <StatusBadge status={feedback.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-gradient-card border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    System Health
                    {healthLoading && (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin ml-2" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthData ? (
                      <>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              healthData.services.feedbackSystem.status === 'operational' ? 'bg-success' :
                              healthData.services.feedbackSystem.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                            }`}></div>
                            <span className="font-medium">Feedback System</span>
                          </div>
                          <span className={`font-semibold ${
                            healthData.services.feedbackSystem.status === 'operational' ? 'text-success' :
                            healthData.services.feedbackSystem.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          }`}>
                            {healthData.services.feedbackSystem.status === 'operational' ? 'Operational' :
                             healthData.services.feedbackSystem.status === 'degraded' ? 'Degraded' : 'Unhealthy'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              healthData.services.database.status === 'healthy' ? 'bg-success' :
                              healthData.services.database.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                            }`}></div>
                            <span className="font-medium">Database</span>
                          </div>
                          <span className={`font-semibold ${
                            healthData.services.database.status === 'healthy' ? 'text-success' :
                            healthData.services.database.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          }`}>
                            {healthData.services.database.status === 'healthy' ? 'Healthy' :
                             healthData.services.database.status === 'degraded' ? 'Degraded' : 'Unhealthy'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              healthData.services.emailNotifications.status === 'operational' ? 'bg-success' :
                              healthData.services.emailNotifications.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                            }`}></div>
                            <span className="font-medium">Email Notifications</span>
                          </div>
                          <span className={`font-semibold ${
                            healthData.services.emailNotifications.status === 'operational' ? 'text-success' :
                            healthData.services.emailNotifications.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          }`}>
                            {healthData.services.emailNotifications.status === 'operational' ? 'Operational' :
                             healthData.services.emailNotifications.status === 'degraded' ? 'Degraded' : 'Unhealthy'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              healthData.services.apiResponse.status === 'operational' ? 'bg-success' :
                              healthData.services.apiResponse.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                            }`}></div>
                            <span className="font-medium">API Response</span>
                          </div>
                          <span className={`font-semibold ${
                            healthData.services.apiResponse.status === 'operational' ? 'text-success' :
                            healthData.services.apiResponse.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          }`}>
                            {healthData.services.apiResponse.responseTime ? 
                              `Fast (~${Math.round(healthData.services.apiResponse.responseTime)}ms)` : 
                              'Unknown'
                            }
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading health data...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete Feedback
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone and will permanently remove the feedback from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive-hover"
            >
              Delete Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;