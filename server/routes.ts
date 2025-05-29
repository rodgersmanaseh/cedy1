import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCommentSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { limit = "20", offset = "0", category, status = "published" } = req.query;
      const articles = await storage.getArticles(
        parseInt(limit as string),
        parseInt(offset as string),
        category as string,
        status as string
      );
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const { limit = "3" } = req.query;
      const articles = await storage.getFeaturedArticles(parseInt(limit as string));
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query is required" });
      }
      const articles = await storage.searchArticles(q);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      // Increment view count
      await storage.incrementViewCount(article.id);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(parseInt(id), articleData);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteArticle(parseInt(id));
      if (!success) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Comments routes
  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getCommentsByArticle(parseInt(id));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/articles/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        articleId: parseInt(id)
      });
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comment data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(newsletterData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email address", details: error.errors });
      }
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // In a real app, you would use proper JWT tokens
      res.json({ 
        user: { id: user.id, username: user.username, role: user.role },
        token: `admin-token-${user.id}`
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
