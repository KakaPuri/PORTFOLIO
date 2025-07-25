import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertArticleSchema, insertSkillSchema, insertExperienceSchema,
  insertEducationSchema, insertActivitySchema, insertValueSchema, insertProfileSchema,
  insertMessageSchema, socialLinks, insertSocialLinkSchema 
} from "@shared/schema";
import multer from "multer";

// Simple admin credentials (in production, use environment variables)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Session storage for admin authentication
const adminSessions = new Set<string>();

// Generate simple session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !adminSessions.has(sessionId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
}

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (simple, no database dependency)
  app.get("/api/health", async (req, res) => {
    try {
      res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        message: "Server is running" 
      });
    } catch (error) {
      res.status(500).json({ message: "Health check failed" });
    }
  });

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const sessionId = generateSessionId();
        adminSessions.add(sessionId);
        
        res.json({ 
          message: "Login successful",
          sessionId 
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        adminSessions.delete(sessionId);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/status", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      
      if (sessionId && adminSessions.has(sessionId)) {
        res.json({ authenticated: true });
      } else {
        res.status(401).json({ authenticated: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Auth check failed" });
    }
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile || {});
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.json({});
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const result = insertProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid profile data", errors: result.error.errors });
      }
      
      const profile = await storage.updateProfile(result.data);
      res.json(profile);
    } catch (error) {
      console.error("Profile update error:", error, req.body);
      res.status(500).json({ message: "Failed to update profile", error: error?.message });
    }
  });

  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles || []);
    } catch (error) {
      console.error("Articles fetch error:", error);
      res.json([]);
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", requireAuth, async (req, res) => {
    try {
      const result = insertArticleSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid article data", errors: result.error.errors });
      }
      
      const article = await storage.createArticle(result.data);
      res.status(201).json(article);
    } catch (error) {
      console.error("Article create error:", error, req.body);
      res.status(500).json({ message: "Failed to create article", error: error?.message });
    }
  });

  app.put("/api/articles/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertArticleSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid article data", errors: result.error.errors });
      }
      
      const article = await storage.updateArticle(id, result.data);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Article update error:", error, req.body);
      res.status(500).json({ message: "Failed to update article", error: error?.message });
    }
  });

  app.delete("/api/articles/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Article delete error:", error, req.params);
      res.status(500).json({ message: "Failed to delete article", error: error?.message });
    }
  });

  // Skill routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills || []);
    } catch (error) {
      console.error("Skills fetch error:", error);
      res.json([]);
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const result = insertSkillSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid skill data", errors: result.error.errors });
      }
      
      const skill = await storage.createSkill(result.data);
      res.status(201).json(skill);
    } catch (error) {
      console.error("Skill create error:", error, req.body);
      res.status(500).json({ message: "Failed to create skill", error: error?.message });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSkillSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid skill data", errors: result.error.errors });
      }
      
      const skill = await storage.updateSkill(id, result.data);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      console.error("Skill update error:", error, req.body);
      res.status(500).json({ message: "Failed to update skill", error: error?.message });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(id);
      if (!deleted) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("Skill delete error:", error, req.params);
      res.status(500).json({ message: "Failed to delete skill", error: error?.message });
    }
  });

  // Experience routes
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences || []);
    } catch (error) {
      console.error("Experiences fetch error:", error);
      res.json([]);
    }
  });

  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const result = insertExperienceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid experience data", errors: result.error.errors });
      }
      
      const experience = await storage.createExperience(result.data);
      res.status(201).json(experience);
    } catch (error) {
      console.error("Experience create error:", error, req.body);
      res.status(500).json({ message: "Failed to create experience", error: error?.message });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education || []);
    } catch (error) {
      console.error("Education fetch error:", error);
      res.json([]);
    }
  });

  app.post("/api/education", requireAuth, async (req, res) => {
    try {
      const result = insertEducationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid education data", errors: result.error.errors });
      }
      
      const education = await storage.createEducation(result.data);
      res.status(201).json(education);
    } catch (error) {
      console.error("Education create error:", error, req.body);
      res.status(500).json({ message: "Failed to create education", error: error?.message });
    }
  });

  app.put("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertEducationSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid education data", errors: result.error.errors });
      }
      
      const education = await storage.updateEducation(id, result.data);
      if (!education) {
        return res.status(404).json({ message: "Education not found" });
      }
      res.json(education);
    } catch (error) {
      console.error("Education update error:", error, req.body);
      res.status(500).json({ message: "Failed to update education", error: error?.message });
    }
  });

  app.delete("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEducation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Education not found" });
      }
      res.json({ message: "Education deleted successfully" });
    } catch (error) {
      console.error("Education delete error:", error, req.params);
      res.status(500).json({ message: "Failed to delete education", error: error?.message });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities || []);
    } catch (error) {
      console.error("Activities fetch error:", error);
      res.json([]);
    }
  });

  app.post("/api/activities", requireAuth, async (req, res) => {
    try {
      const result = insertActivitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid activity data", errors: result.error.errors });
      }
      
      const activity = await storage.createActivity(result.data);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Activity create error:", error, req.body);
      res.status(500).json({ message: "Failed to create activity", error: error?.message });
    }
  });

  app.put("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertActivitySchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid activity data", errors: result.error.errors });
      }
      
      const activity = await storage.updateActivity(id, result.data);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Activity update error:", error, req.body);
      res.status(500).json({ message: "Failed to update activity", error: error?.message });
    }
  });

  app.delete("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteActivity(id);
      if (!deleted) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.error("Activity delete error:", error, req.params);
      res.status(500).json({ message: "Failed to delete activity", error: error?.message });
    }
  });

  // Values routes
  app.get("/api/values", async (req, res) => {
    try {
      const values = await storage.getValues();
      res.json(values || []);
    } catch (error) {
      console.error("Values fetch error:", error);
      res.json([]);
    }
  });

  app.post("/api/values", requireAuth, async (req, res) => {
    try {
      const result = insertValueSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid value data", errors: result.error.errors });
      }
      
      const value = await storage.createValue(result.data);
      res.status(201).json(value);
    } catch (error) {
      console.error("Value create error:", error, req.body);
      res.status(500).json({ message: "Failed to create value", error: error?.message });
    }
  });

  app.put("/api/values/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertValueSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid value data", errors: result.error.errors });
      }
      
      const value = await storage.updateValue(id, result.data);
      if (!value) {
        return res.status(404).json({ message: "Value not found" });
      }
      res.json(value);
    } catch (error) {
      console.error("Value update error:", error, req.body);
      res.status(500).json({ message: "Failed to update value", error: error?.message });
    }
  });

  app.delete("/api/values/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteValue(id);
      if (!deleted) {
        return res.status(404).json({ message: "Value not found" });
      }
      res.json({ message: "Value deleted successfully" });
    } catch (error) {
      console.error("Value delete error:", error, req.params);
      res.status(500).json({ message: "Failed to delete value", error: error?.message });
    }
  });

  // Message routes
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      // Prevent caching for messages
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/sender/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const messages = await storage.getMessagesByEmail(email);
      // Prevent caching for messages
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid message data", errors: result.error.errors });
      }
      
      const message = await storage.createMessage(result.data);
      res.status(201).json(message);
    } catch (error) {
      console.error('Failed to create message:', error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.put("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const marked = await storage.markMessageAsRead(id);
      if (!marked) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log('DELETE /api/messages/:id - Attempting to delete message with ID:', id);
      
      const deleted = await storage.deleteMessage(id);
      console.log('Delete result:', deleted);
      
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error('Failed to delete message:', error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  app.delete("/api/messages/:id/sender", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const deleted = await storage.deleteMessageByEmail(id, email);
      if (!deleted) {
        return res.status(404).json({ message: "Message not found or unauthorized" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Tambahkan endpoint upload gambar
  app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Simpan path/URL ke database sesuai kebutuhan
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // CRUD Social Links
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json(links || []);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  app.post("/api/social-links", requireAuth, async (req, res) => {
    try {
      const result = insertSocialLinkSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.errors });
      }
      const link = await storage.createSocialLink(result.data);
      res.status(201).json(link);
    } catch (error) {
      res.status(500).json({ message: "Failed to create social link" });
    }
  });

  app.put("/api/social-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSocialLinkSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.errors });
      }
      const link = await storage.updateSocialLink(id, result.data);
      res.json(link);
    } catch (error) {
      res.status(500).json({ message: "Failed to update social link" });
    }
  });

  app.delete("/api/social-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSocialLink(id);
      if (!deleted) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ message: "Social link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social link" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
