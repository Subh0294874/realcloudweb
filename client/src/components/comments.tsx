import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommentSchema, type Comment } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, Send, Trash } from "lucide-react";

export default function Comments() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const form = useForm({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      author: "",
      content: ""
    }
  });

  // Check if user is admin
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const { data: comments = [], isLoading } = useQuery<Comment[]>({ 
    queryKey: ["/api/comments"]
  });
  
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
        // Refetch comments after deletion
        queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { author: string; content: string; }) => 
      apiRequest("POST", "/api/comments", data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      form.reset();
      toast({
        title: "Comment posted successfully",
        description: "Your comment has been added to the discussion."
      });
    },
    onError: () => {
      toast({
        title: "Error posting comment",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  return (
    <Card className="backdrop-blur-sm bg-card/50 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Community Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
                      className="bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="min-h-[100px] bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full transition-all duration-300 transform hover:scale-105"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        </Form>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Be the first to start the discussion!
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="bg-background/30 hover:bg-background/40 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-primary">{comment.author}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                      {isAdmin && (
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}