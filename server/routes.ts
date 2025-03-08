
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommentSchema, insertNewsPostSchema } from "@shared/schema";
import { getGuildInfo } from "./discord";

export async function registerRoutes(app: Express): Promise<Server> {
  // Comment routes
  app.get("/api/comments", async (_req, res) => {
    const comments = await storage.getComments();
    res.json(comments);
  });

  app.post("/api/comments", async (req, res) => {
    const result = insertCommentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid comment data" });
    }

    const comment = await storage.createComment(result.data);
    res.status(201).json(comment);
  });
  
  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const deleted = await storage.deleteComment(commentId);
      
      if (deleted) {
        res.json({ success: true, message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete comment",
        error: (error as Error).message 
      });
    }
  });

  // News post routes
  app.get("/api/news", async (_req, res) => {
    const newsPosts = await storage.getNewsPosts();
    res.json(newsPosts);
  });

  app.post("/api/news", async (req, res) => {
    // Verify admin authentication
    if (!req.headers.authorization || req.headers.authorization !== "Bearer admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const result = insertNewsPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid news post data" });
    }

    const newsPost = await storage.createNewsPost(result.data);
    res.status(201).json(newsPost);
  });
  
  app.delete("/api/news/:id", async (req, res) => {
    // Verify admin authentication
    if (!req.headers.authorization || req.headers.authorization !== "Bearer admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const postId = parseInt(req.params.id);
      const deleted = await storage.deleteNewsPost(postId);
      
      if (deleted) {
        res.json({ success: true, message: "News post deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "News post not found" });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete news post",
        error: (error as Error).message 
      });
    }
  });
  
  // Like routes
  app.post("/api/news/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const hasLiked = await storage.hasUserLikedPost(postId, userId);
      
      if (hasLiked) {
        return res.status(400).json({ message: "User has already liked this post" });
      }
      
      const success = await storage.likeNewsPost(postId, userId);
      
      if (success) {
        res.json({ success: true, message: "Post liked successfully" });
      } else {
        res.status(404).json({ success: false, message: "News post not found" });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to like post",
        error: (error as Error).message 
      });
    }
  });
  
  app.post("/api/news/:id/unlike", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const success = await storage.unlikeNewsPost(postId, userId);
      
      if (success) {
        res.json({ success: true, message: "Post unliked successfully" });
      } else {
        res.status(404).json({ success: false, message: "News post not found or not liked by user" });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to unlike post",
        error: (error as Error).message 
      });
    }
  });
  
  app.get("/api/news/:id/liked", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const hasLiked = await storage.hasUserLikedPost(postId, userId);
      res.json({ hasLiked });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to check like status",
        error: (error as Error).message 
      });
    }
  });

  // Discord guild info
  app.get("/api/discord-guild", async (req, res) => {
    try {
      const guildId = "1327590678019964981";
      const guildInfo = await getGuildInfo(guildId);
      res.json({ 
        memberCount: guildInfo.approximate_member_count || guildInfo.member_count,
        name: guildInfo.name,
        id: guildInfo.id
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch Discord guild information",
        error: (error as Error).message 
      });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "subh" && password === "subh@000") {
      res.json({ success: true, message: "Authentication successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
