"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
  };
}

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentSection = ({ postId, isOpen, onClose }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchComments = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          users:user_id (
            displayname,
            firstname,
            lastname,
            avatar_url,
            emoji
          )
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      setComments(
        (data || []).map((item) => ({
          id: item.id,
          content: item.content ?? "",
          created_at: item.created_at ?? "",
          user_id: item.user_id ?? "",
          users: {
            displayname: item.users?.displayname ?? "",
            firstname: item.users?.firstname ?? "",
            lastname: item.users?.lastname ?? "",
            avatar_url: item.users?.avatar_url ?? "",
            emoji: item.users?.emoji ?? "",
          },
        }))
      );
    } catch (error) {
      console.error("Error in fetchComments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, isOpen]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        content: newComment.trim(),
        post_id: postId,
        user_id: user.id,
      });

      if (error) {
        console.error("Error creating comment:", error);
        toast("Failed to post comment. Please try again later.");
        return;
      }

      setNewComment("");
      fetchComments();
      toast("Comment posted successfully!");
    } catch (error) {
      console.error("Error in handleSubmitComment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayName = (user: Comment["users"]) => {
    return (
      user.displayname ||
      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
      "Anonymous User"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-white/60" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.users.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                    {comment.users.emoji || comment.users.firstname?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">
                      {getDisplayName(comment.users)}
                    </span>
                    <span className="text-white/40 text-xs">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}

        {user && (
          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 min-h-[60px] bg-white/5 border-white/20 text-white placeholder:text-white/60 text-sm"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
