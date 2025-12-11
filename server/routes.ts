import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { updateProfileSchema, updateUserRoleSchema, type UserRole } from "@shared/schema";

// Middleware to check if user has required role
const requireRole = (...allowedRoles: UserRole[]): RequestHandler => {
  return async (req: any, res, next) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!allowedRoles.includes(user.role as UserRole)) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }
      req.dbUser = user;
      next();
    } catch (error) {
      console.error("Error checking role:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

export async function registerRoutes(
  app: Express
): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile update route
  app.patch("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = updateProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }
      const user = await storage.updateUserProfile(userId, result.data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Admin routes - Get all users
  app.get("/api/admin/users", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin routes - Update user role
  app.patch("/api/admin/users/:userId/role", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.claims.sub;
      
      // Prevent admin from changing their own role
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot change your own role" });
      }

      const result = updateUserRoleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.flatten() });
      }

      // Get target user to check their current role
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent changing another admin's role (admins can't demote each other)
      if (targetUser.role === "admin") {
        return res.status(403).json({ message: "Cannot change another admin's role" });
      }

      // Log role change for audit purposes
      console.log(`[AUDIT] Role change: User ${currentUserId} changed user ${userId} role from ${targetUser.role} to ${result.data.role}`);
      
      const user = await storage.updateUserRole(userId, result.data.role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
