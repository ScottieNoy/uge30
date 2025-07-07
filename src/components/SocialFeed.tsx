"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  Trash2,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import CommentSection from "./commentSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  images: string[];
  users: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
  };
  likes: { id: string; user_id: string }[];
  comments: { id: string }[];
}

export interface SocialFeedRef {
  refreshPosts: () => void;
}

const SocialFeed = forwardRef<SocialFeedRef>((props, ref) => {
  const { user } = useAuth();
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          images,
          users:user_id (
            displayname,
            firstname,
            lastname,
            avatar_url,
            emoji
          ),
          likes (id, user_id),
          comments (id)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        toast("Failed to load posts. Please try again later.");
        return;
      }

      setPosts(
        (postsData || []).map((post: any) => ({
          id: post.id,
          content: post.content ?? "",
          created_at: post.created_at ?? "",
          user_id: post.user_id ?? "",
          images: post.images ?? [],
          users: {
            displayname: post.users?.displayname ?? "",
            firstname: post.users?.firstname ?? "",
            lastname: post.users?.lastname ?? "",
            avatar_url: post.users?.avatar_url ?? "",
            emoji: post.users?.emoji ?? "",
          },
          likes: post.likes ?? [],
          comments: post.comments ?? [],
        }))
      );
    } catch (error) {
      console.error("Error in fetchPosts:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshPosts: fetchPosts,
  }));

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find((p) => p.id === postId);
      const userLike = post?.likes.find((like) => like.user_id === user.id);

      if (userLike) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("id", userLike.id);

        if (error) {
          console.error("Error unliking post:", error);
          return;
        }
      } else {
        const { error } = await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        if (error) {
          console.error("Error liking post:", error);
          return;
        }
      }

      fetchPosts();
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting post:", error);
        toast("Failed to delete post. Please try again later.");
        return;
      }

      toast("Post deleted successfully!");

      fetchPosts();
    } catch (error) {
      console.error("Error in handleDeletePost:", error);
    }
  };

  const handleComment = (postId: string) => {
    setOpenComments(openComments === postId ? null : postId);
  };

  const handleShare = (postId: string) => {
    console.log(`Share post ${postId}`);
    // TODO: Implement share functionality
  };

  const getDisplayName = (user: Post["users"]) => {
    return (
      user.displayname ||
      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
      "Anonymous User"
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center text-white/60 py-8">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center text-white/60 py-8">
          No posts yet. Be the first to share something!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const userLike = post.likes.find((like) => like.user_id === user?.id);
        const isLiked = !!userLike;
        const isOwnPost = user?.id === post.user_id;

        return (
          <Card
            key={post.id}
            className="bg-white/10 backdrop-blur-md border-white/20"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.users.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      {post.users.emoji || post.users.firstname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">
                        {getDisplayName(post.users)}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {getTimeAgo(post.created_at)}
                    </div>
                  </div>
                </div>

                {isOwnPost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/10 backdrop-blur-md border-white/20">
                      <DropdownMenuItem
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {post.content && (
                <div className="text-white mb-4 leading-relaxed">
                  {post.content}
                </div>
              )}

              {post.images && post.images.length > 0 && (
                <div
                  className={`mb-4 grid gap-2 ${
                    post.images.length === 1
                      ? "grid-cols-1"
                      : post.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-6 border-t border-white/10 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`text-white hover:bg-white/10 transition-colors ${
                    isLiked
                      ? "text-red-400 hover:text-red-300"
                      : "hover:text-red-300"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likes.length}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(post.id)}
                  className="text-white hover:bg-white/10 hover:text-blue-300 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {post.comments.length}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post.id)}
                  className="text-white hover:bg-white/10 hover:text-green-300 transition-colors"
                >
                  <Share className="h-4 w-4 mr-2" />0
                </Button>
              </div>

              <CommentSection
                postId={post.id}
                isOpen={openComments === post.id}
                onClose={() => setOpenComments(null)}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

SocialFeed.displayName = "SocialFeed";

export default SocialFeed;