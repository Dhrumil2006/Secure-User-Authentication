import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Shield, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Clock,
  Lock,
  Crown,
  Users
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

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
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">SecureAuth</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" data-testid="button-admin">
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Admin Dashboard</span>
                </Button>
              </Link>
            )}
            <Link href="/profile">
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Button variant="outline" asChild data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={user?.profileImageUrl || undefined} 
                  alt={getDisplayName()}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold" data-testid="text-welcome">
                  Welcome back, {getDisplayName()}
                </h1>
                <p className="text-muted-foreground" data-testid="text-email">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button variant="outline" data-testid="button-view-profile">
                <Settings className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-6 text-xl font-semibold">Dashboard</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="card-auth-status">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authentication Status</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Authenticated
                </div>
                <p className="text-xs text-muted-foreground">
                  Your session is active and secure
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-member-since">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(user?.createdAt)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Account creation date
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-security">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Level</CardTitle>
                <Lock className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">Protected</div>
                <p className="text-xs text-muted-foreground">
                  End-to-end encryption enabled
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold">Protected Resources</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card data-testid="card-protected-data">
              <CardHeader>
                <CardTitle>Your Protected Data</CardTitle>
                <CardDescription>
                  This content is only visible to authenticated users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    You have successfully accessed protected content. This demonstrates 
                    that your authentication is working correctly and your session is valid.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-account-info">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Quick overview of your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User ID</span>
                    <span className="text-sm font-mono">{user?.id?.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm">{user?.email || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge 
                      variant={user?.role === "admin" ? "default" : "secondary"} 
                      className="capitalize"
                      data-testid="badge-user-role"
                    >
                      {user?.role === "admin" && <Crown className="mr-1 h-3 w-3" />}
                      {user?.role || "user"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{formatDate(user?.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
