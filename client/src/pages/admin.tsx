import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { 
  Shield, 
  ArrowLeft, 
  LogOut, 
  Users,
  RefreshCw,
  Crown,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User } from "@shared/schema";

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [pendingRoleChange, setPendingRoleChange] = useState<{userId: string; userName: string; currentRole: string; newRole: string} | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
      setPendingRoleChange(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
      setPendingRoleChange(null);
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, authLoading, toast, setLocation]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, authLoading, isAuthenticated, toast, setLocation]);

  if (authLoading || usersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const getInitials = (u: User) => {
    if (u?.firstName && u?.lastName) {
      return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
    }
    if (u?.email) {
      return u.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (u: User) => {
    if (u?.firstName && u?.lastName) {
      return `${u.firstName} ${u.lastName}`;
    }
    if (u?.firstName) {
      return u.firstName;
    }
    if (u?.email) {
      return u.email.split("@")[0];
    }
    return "Unknown";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "user":
        return "secondary";
      case "guest":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleRoleChange = (u: User, newRole: string) => {
    if (newRole === u.role) return;
    
    const isEscalatingToAdmin = newRole === "admin" && u.role !== "admin";
    if (isEscalatingToAdmin) {
      setPendingRoleChange({
        userId: u.id,
        userName: getDisplayName(u),
        currentRole: u.role,
        newRole: newRole,
      });
    } else {
      updateRoleMutation.mutate({ userId: u.id, role: newRole });
    }
  };

  const confirmRoleChange = () => {
    if (pendingRoleChange) {
      updateRoleMutation.mutate({ userId: pendingRoleChange.userId, role: pendingRoleChange.newRole });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-admin">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SecureAuth</span>
              <Badge variant="default" className="ml-2">
                <Crown className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-logout-admin">
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
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-admin-title">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage user accounts and roles
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-users">
                  {users?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Crown className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-admin-count">
                  {users?.filter(u => u.role === "admin").length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                <UserIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-user-count">
                  {users?.filter(u => u.role === "user").length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users && users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((u) => (
                    <div 
                      key={u.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-md bg-muted p-4"
                      data-testid={`user-row-${u.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage 
                            src={u.profileImageUrl || undefined} 
                            alt={getDisplayName(u)}
                          />
                          <AvatarFallback>{getInitials(u)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium" data-testid={`text-user-name-${u.id}`}>
                            {getDisplayName(u)}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-user-email-${u.id}`}>
                            {u.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
                          {u.role}
                        </Badge>
                        {u.id !== user?.id && u.role !== "admin" && (
                          <Select
                            value={u.role}
                            onValueChange={(value) => handleRoleChange(u, value)}
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-32" data-testid={`select-role-${u.id}`}>
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="guest">Guest</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {u.id !== user?.id && u.role === "admin" && (
                          <Badge variant="outline" className="text-muted-foreground">
                            <ShieldAlert className="mr-1 h-3 w-3" />
                            Protected
                          </Badge>
                        )}
                        {u.id === user?.id && (
                          <Badge variant="outline" className="text-muted-foreground">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <AlertDialog open={!!pendingRoleChange} onOpenChange={() => setPendingRoleChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Confirm Admin Promotion
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to promote <strong>{pendingRoleChange?.userName}</strong> from{" "}
              <strong className="capitalize">{pendingRoleChange?.currentRole}</strong> to{" "}
              <strong className="capitalize">{pendingRoleChange?.newRole}</strong>.
              <br /><br />
              Admin users have full access to manage all users and their roles. 
              This action should only be performed for trusted individuals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-promotion">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              disabled={updateRoleMutation.isPending}
              data-testid="button-confirm-promotion"
            >
              {updateRoleMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Crown className="mr-2 h-4 w-4" />
              )}
              Confirm Promotion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
