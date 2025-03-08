import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments)
  .omit({ id: true, createdAt: true })
  .extend({
    author: z.string().min(2).max(50),
    content: z.string().min(1).max(500),
  });

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// News posts schema
export const newsPosts = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsPostSchema = createInsertSchema(newsPosts)
  .omit({ id: true, likes: true, createdAt: true })
  .extend({
    title: z.string().min(2).max(100),
    content: z.string().min(1).max(2000),
  });

// Track which users have liked which posts to prevent multiple likes
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: text("user_id").notNull(), // Use browser fingerprint or session ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;
export type NewsPost = typeof newsPosts.$inferSelect;
export type PostLike = typeof postLikes.$inferSelect;
