import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";
import type { Comment } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments"); // Add state for tab selection
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsPosts, setNewsPosts] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);


  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/comments");
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewsPosts = async () => {
    try {
      setIsLoadingNews(true);
      const response = await fetch("/api/news"); // Assuming API endpoint for news posts
      if (!response.ok) throw new Error("Failed to fetch news posts");
      const data = await response.json();
      setNewsPosts(data);
    } catch (error) {
      console.error("Error fetching news posts:", error);
      toast({
        title: "Error",
        description: "Failed to load news posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchComments();
      fetchNewsPosts();
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // Store admin authentication in localStorage
        localStorage.setItem('isAdmin', 'true');
        toast({
          title: "Success",
          description: "You are now logged in",
        });
        // Redirect to admin dashboard after login
        setIsAuthenticated(true);
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to authenticate",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
        fetchComments();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  // Handle create news post
  const handleCreateNewsPost = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin', // Add the authorization header
        },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
        }),
      });
      if (!response.ok) throw new Error('Failed to create news post');
      setNewsTitle('');
      setNewsContent('');
      fetchNewsPosts();
      toast({ title: 'Success', description: 'News post created successfully' });
    } catch (error) {
      console.error('Error creating news post:', error);
      toast({ title: 'Error', description: 'Failed to create news post', variant: 'destructive' });
    }
  };

  // Handle delete news post
  const handleDeleteNewsPost = async (id) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin', // Add the authorization header
        },
      });
      if (!response.ok) throw new Error("Failed to delete news post");
      fetchNewsPosts();
      toast({ title: "Success", description: "News post deleted successfully" });
    } catch (error) {
      console.error("Error deleting news post:", error);
      toast({
        title: "Error",
        description: "Failed to delete news post",
        variant: "destructive",
      });
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button onClick={() => setActiveTab("comments")}>Comments</Button>
              <Button onClick={() => setActiveTab("news")}>News</Button>
            </div>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem('isAdmin');
              setIsAuthenticated(false);
            }}>
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "comments" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Manage Comments</h2>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No comments to display.
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="bg-background/30 hover:bg-background/40 transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-primary">{comment.author}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2">{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* News tab */}
          {activeTab === "news" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Create News Post</h2>
              <form onSubmit={handleCreateNewsPost} className="space-y-4 mb-8">
                <div>
                  <label htmlFor="newsTitle" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    id="newsTitle"
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Enter news title"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label htmlFor="newsContent" className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    id="newsContent"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Enter news content"
                    maxLength={2000}
                  />
                </div>
                <div>
                  <Button 
                    type="submit" 
                    className="w-full"
                  >
                    Create News Post
                  </Button>
                </div>
              </form>

              <h2 className="text-xl font-semibold mb-4">Manage News Posts</h2>
              {isLoadingNews ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading news posts...
                </div>
              ) : newsPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No news posts to display.
                </div>
              ) : (
                <div className="space-y-4">
                  {newsPosts.map((post: any) => (
                    <Card key={post.id} className="bg-background/30 hover:bg-background/40 transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-primary text-lg">{post.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()} - {post.likes} likes
                            </div>
                          </div>
                          <Button 
                            variant="destructive"
                            size="sm" 
                            onClick={() => handleDeleteNewsPost(post.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 text-sm max-h-24 overflow-hidden relative">
                          {post.content.substring(0, 150)}
                          {post.content.length > 150 && (
                            <>... <span className="text-primary">See more</span></>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}