import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Newspaper, Heart, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { NavBar } from "@/components/nav-bar"; // Updated import

type NewsPost = {
  id: number;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
};

export default function NewsPage() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Generate a unique ID for the current user if not exists
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }

    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Fetch news posts
  const { data: newsPosts = [], isLoading, refetch } = useQuery({
    queryKey: ["newsPosts"],
    queryFn: async () => {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news posts");
      }
      return response.json();
    }
  });

  // Check if user has liked each post
  const { data: likedPosts = {}, refetch: refetchLikes } = useQuery({
    queryKey: ["likedPosts", userId],
    queryFn: async () => {
      if (!userId || !newsPosts.length) return {};

      const likeStatuses: Record<number, boolean> = {};

      // Fetch like status for each post
      await Promise.all(
        newsPosts.map(async (post: NewsPost) => {
          try {
            const response = await fetch(`/api/news/${post.id}/liked?userId=${userId}`);
            if (response.ok) {
              const { hasLiked } = await response.json();
              likeStatuses[post.id] = hasLiked;
            }
          } catch (error) {
            console.error(`Error checking like status for post ${post.id}:`, error);
          }
        })
      );

      return likeStatuses;
    },
    enabled: !!userId && newsPosts.length > 0
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const response = await fetch(`/api/news/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to like post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    },
  });

  // Unlike post mutation
  const unlikeMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const response = await fetch(`/api/news/${postId}/unlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unlike post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unlike post",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const response = await fetch(`/api/news/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer admin"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const handleLikeToggle = (postId: number, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate({ postId });
    } else {
      likeMutation.mutate({ postId });
    }
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ postId });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <NavBar /> {/* Added NavBar component */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Newspaper className="mr-2" /> RealCloud News
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading news posts...</p>
        </div>
      ) : newsPosts.length === 0 ? (
        <Card className="bg-background/30 text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No news posts available yet.</p>
            {isAdmin && (
              <p className="mt-2">
                <Button variant="outline" onClick={() => window.location.href = "/admin"}>
                  Go to Admin Dashboard to create news
                </Button>
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {newsPosts.map((post: NewsPost) => (
            <Card key={post.id} className="overflow-hidden bg-background/30 hover:bg-background/40 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-primary">{post.title}</CardTitle>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                </div>
              </CardHeader>
              <CardContent>
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </CardContent>
              <CardFooter className="bg-muted/20 py-3 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className={likedPosts[post.id] ? "text-red-500" : "text-muted-foreground"}
                  onClick={() => handleLikeToggle(post.id, !!likedPosts[post.id])}
                >
                  <Heart className={`h-4 w-4 mr-1 ${likedPosts[post.id] ? "fill-current" : ""}`} />
                  <span>{post.likes}</span>
                </Button>
                <Badge variant="outline" className="pointer-events-none">
                  {post.likes === 1 ? "1 like" : `${post.likes} likes`}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}