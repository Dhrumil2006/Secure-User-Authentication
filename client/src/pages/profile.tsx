import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Shield, 
  ArrowLeft, 
  LogOut, 
  Mail, 
  Calendar, 
  User as UserIcon,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SecureAuth</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-logout-profile">
              <a href="/api/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mx-auto max-w-2xl">
          <Card data-testid="card-profile">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={user?.profileImageUrl || undefined} 
                    alt={getDisplayName()}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl" data-testid="text-profile-name">
                {getDisplayName()}
              </CardTitle>
              <CardDescription data-testid="text-profile-email">
                {user?.email || "No email provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Account Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-md bg-muted p-4">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-full-name">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-md bg-muted p-4">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Email Address</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-email-detail">
                          {user?.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-md bg-muted p-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-member-since">
                          {formatDate(user?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-md bg-muted p-4">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-last-updated">
                          {formatDate(user?.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-semibold">Security</h3>
                  <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          Account Secured
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Your account is protected with secure authentication
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full" data-testid="button-back-dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Button variant="destructive" className="flex-1" asChild data-testid="button-signout">
                    <a href="/api/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
