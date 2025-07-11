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
import { sendNotification } from "@/lib/sendNotification";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  images: string[];
  pinned: boolean;
  users: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
    is_admin?: boolean;
  };
  likes: { id: string; user_id: string }[];
  comments: { id: string }[];
  shares: { id: string; user_id: string }[];
}

export interface SocialFeedRef {
  refreshPosts: () => void;
}

interface SocialFeedProps {
  highlightedPostId?: string;
}

const SocialFeed = forwardRef<SocialFeedRef, SocialFeedProps>(
  ({ highlightedPostId }, ref) => {
    const { user, profile } = useAuth();
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [openComments, setOpenComments] = useState<string | null>(null);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

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
          pinned,
          users:user_id (
            displayname,
            firstname,
            lastname,
            avatar_url,
            emoji,
            is_admin
          ),
          likes (id, user_id),
          comments (id),
          shares (id, user_id)
        `
          )
          .order("pinned", { ascending: false }) // Show pinned posts first
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
          toast("Failed to load posts.");
          return;
        }

        setPosts(
          (postsData || []).map((post: any) => ({
            id: post.id,
            content: post.content ?? "",
            created_at: post.created_at ?? "",
            user_id: post.user_id ?? "",
            images: post.images ?? [],
            pinned: post.pinned ?? false,
            users: {
              displayname: post.users?.displayname ?? "",
              firstname: post.users?.firstname ?? "",
              lastname: post.users?.lastname ?? "",
              avatar_url: post.users?.avatar_url ?? "",
              emoji: post.users?.emoji ?? "",
              is_admin: post.users?.is_admin ?? false,
            },
            likes: post.likes ?? [],
            comments: post.comments ?? [],
            shares: post.shares ?? [],
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
      const checkAdmin = async () => {
        if (!user) return;
        const { data, error } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (data?.is_admin) setIsAdmin(true);
      };
      checkAdmin();
    }, [user]);

    useEffect(() => {
      fetchPosts();
    }, []);

    useEffect(() => {
      if (!highlightedPostId || posts.length === 0) return;
      const el = document.getElementById(`post-${highlightedPostId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(highlightedPostId);
        const timeout = setTimeout(() => {
          setHighlightedId(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }, [highlightedPostId, posts]);

    const handleLike = async (postId: string) => {
      if (!user) return;
      const post = posts.find((p) => p.id === postId);
      const userLike = post?.likes.find((like) => like.user_id === user.id);

      try {
        if (userLike) {
          await supabase.from("likes").delete().eq("id", userLike.id);
        } else {
          await supabase.from("likes").insert({
            post_id: postId,
            user_id: user.id,
          });

          if (post?.user_id !== user.id) {
            await sendNotification({
              userId: post?.user_id ?? "",
              title: "Nyt like på dit opslag",
              body: `${
                profile.displayname || "Nogen"
              } synes godt om dit opslag.`,
              url: `/social?tab=feed&post=${postId}`,
            });
          }
        }

        fetchPosts();
      } catch (err) {
        console.error("Like error:", err);
      }
    };

    const handleDeletePost = async (postId: string) => {
      if (!user) return;
      const post = posts.find((p) => p.id === postId);
      const isOwner = post?.user_id === user.id;

      if (!isAdmin && !isOwner) {
        toast("Du har ikke tilladelse til at slette dette opslag.");
        return;
      }

      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) {
        toast("Kunne ikke slette opslag.");
        return;
      }

      toast("Opslag slettet.");
      fetchPosts();
    };

    const handleTogglePin = async (postId: string, current: boolean) => {
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        toast("Du har ikke tilladelse til at pinne opslag.");
        return;
      }

      const { error } = await supabase
        .from("posts")
        .update({ pinned: !current })
        .eq("id", postId);

      if (error) {
        toast("Kunne ikke opdatere pin status.");
        return;
      }

      fetchPosts();
    };

    const handleComment = (postId: string) => {
      setOpenComments(openComments === postId ? null : postId);
    };

    const handleShare = async (postId: string) => {
      const shareUrl = `${window.location.origin}/social?tab=feed&post=${postId}`;
      const post = posts.find((p) => p.id === postId);

      const shareData = {
        title: "Tjek dette opslag ud",
        text: post?.content || "Se dette opslag i UGE30 appen",
        url: shareUrl,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast("Link kopieret til udklipsholder");
        }

        if (user) {
          await supabase
            .from("shares")
            .upsert(
              { post_id: postId, user_id: user.id },
              { onConflict: "user_id,post_id" }
            );
          fetchPosts();
        }
      } catch (err) {
        console.error("Share failed:", err);
        toast("Deling mislykkedes.");
      }
    };

    const getDisplayName = (user: Post["users"]) =>
      user.displayname ||
      `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() ||
      "Anonym";

    const getTimeAgo = (dateStr: string) => {
      const diff =
        (new Date().getTime() - new Date(dateStr).getTime()) / 3600000;
      if (diff < 1) return "Lige nu";
      if (diff < 24) return `${Math.floor(diff)}t siden`;
      return `${Math.floor(diff / 24)}d siden`;
    };

    if (loading)
      return (
        <div className="text-center text-white/60 py-8">Indlæser opslag…</div>
      );
    if (posts.length === 0)
      return (
        <div className="text-center text-white/60 py-8">
          Ingen opslag endnu.
        </div>
      );

    return (
      <div className="space-y-4">
        {posts.map((post) => {
          const isOwnPost = user?.id === post.user_id;
          const isLiked = !!post.likes.find((l) => l.user_id === user?.id);

          return (
            <Card
              key={post.id}
              id={`post-${post.id}`}
              className="bg-white/10 backdrop-blur-md border-white/20"
            >
              <CardContent
                className={`p-6 rounded-lg transition-all ${
                  (highlightedId === post.id || post.pinned) ? "ring-2 ring-cyan-400" : ""
                }`}
              >
                {post.pinned && (
                  <div className="absolute top-2 right-2 bg-cyan-500/20 text-cyan-500 text-xs px-2 py-1 rounded-full">
                    Pinned
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.users.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                        {post.users.emoji || post.users.firstname?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {getDisplayName(post.users)}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm">
                        {getTimeAgo(post.created_at)}
                      </div>
                    </div>
                  </div>

                  {(isOwnPost || isAdmin) && (
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
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleTogglePin(post.id, post.pinned)
                            }
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {post.pinned ? "Fjern pin" : "Pin opslag"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Slet opslag
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

                {post.images?.length > 0 && (
                  <div
                    className={`mb-4 grid gap-2 ${
                      post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {post.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Billede ${i + 1}`}
                        className="w-full rounded-lg object-cover max-h-96"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`text-white hover:bg-white/10 ${
                      isLiked ? "text-red-400" : ""
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        isLiked ? "fill-current" : ""
                      }`}
                    />
                    {post.likes.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleComment(post.id)}
                    className="text-white hover:bg-white/10 hover:text-blue-300"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post.id)}
                    className="text-white hover:bg-white/10 hover:text-green-300"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    {post.shares.length}
                  </Button>
                </div>

                <CommentSection
                  postId={post.id}
                  postAuthorId={post.user_id}
                  isOpen={openComments === post.id}
                  onClose={() => setOpenComments(null)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
);

SocialFeed.displayName = "SocialFeed";
export default SocialFeed;
