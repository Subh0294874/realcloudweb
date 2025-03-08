import { type Comment, type InsertComment, type NewsPost, type InsertNewsPost, type PostLike } from "@shared/schema";

export interface IStorage {
  // Comments
  getComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // News Posts
  getNewsPosts(): Promise<NewsPost[]>;
  createNewsPost(newsPost: InsertNewsPost): Promise<NewsPost>;
  deleteNewsPost(id: number): Promise<boolean>;
  
  // Likes
  likeNewsPost(postId: number, userId: string): Promise<boolean>;
  unlikeNewsPost(postId: number, userId: string): Promise<boolean>;
  hasUserLikedPost(postId: number, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private comments: Map<number, Comment>;
  private newsPosts: Map<number, NewsPost>;
  private postLikes: Map<string, PostLike>; // key format: `${postId}-${userId}`
  private commentId: number;
  private newsPostId: number;
  private postLikeId: number;

  constructor() {
    this.comments = new Map();
    this.newsPosts = new Map();
    this.postLikes = new Map();
    this.commentId = 1;
    this.newsPostId = 1;
    this.postLikeId = 1;
  }

  // Comment methods
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }
  
  async deleteComment(id: number): Promise<boolean> {
    if (this.comments.has(id)) {
      this.comments.delete(id);
      return true;
    }
    return false;
  }
  
  // News Post methods
  async getNewsPosts(): Promise<NewsPost[]> {
    return Array.from(this.newsPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createNewsPost(insertNewsPost: InsertNewsPost): Promise<NewsPost> {
    const id = this.newsPostId++;
    const newsPost: NewsPost = {
      ...insertNewsPost,
      id,
      likes: 0,
      createdAt: new Date(),
    };
    this.newsPosts.set(id, newsPost);
    return newsPost;
  }
  
  async deleteNewsPost(id: number): Promise<boolean> {
    if (this.newsPosts.has(id)) {
      this.newsPosts.delete(id);
      // Also delete any likes for this post
      Array.from(this.postLikes.entries())
        .filter(([key]) => key.startsWith(`${id}-`))
        .forEach(([key]) => this.postLikes.delete(key));
      return true;
    }
    return false;
  }
  
  // Like methods
  async likeNewsPost(postId: number, userId: string): Promise<boolean> {
    const newsPost = this.newsPosts.get(postId);
    const likeKey = `${postId}-${userId}`;
    
    if (!newsPost || this.postLikes.has(likeKey)) {
      return false;
    }
    
    const like: PostLike = {
      id: this.postLikeId++,
      postId,
      userId,
      createdAt: new Date(),
    };
    
    this.postLikes.set(likeKey, like);
    
    // Update likes count on the post
    const updatedPost: NewsPost = {
      ...newsPost,
      likes: newsPost.likes + 1,
    };
    this.newsPosts.set(postId, updatedPost);
    
    return true;
  }
  
  async unlikeNewsPost(postId: number, userId: string): Promise<boolean> {
    const newsPost = this.newsPosts.get(postId);
    const likeKey = `${postId}-${userId}`;
    
    if (!newsPost || !this.postLikes.has(likeKey)) {
      return false;
    }
    
    this.postLikes.delete(likeKey);
    
    // Update likes count on the post
    const updatedPost: NewsPost = {
      ...newsPost,
      likes: Math.max(0, newsPost.likes - 1), // Ensure likes never go below 0
    };
    this.newsPosts.set(postId, updatedPost);
    
    return true;
  }
  
  async hasUserLikedPost(postId: number, userId: string): Promise<boolean> {
    const likeKey = `${postId}-${userId}`;
    return this.postLikes.has(likeKey);
  }
}

export const storage = new MemStorage();
