"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";

interface PostWithAuthor {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
  user_id: string;
  like_count: number;
  liked_by_user: boolean;
  comment_count: number;
  author: {
    id: string;
    displayname: string;
    avatar: string | null;
    emoji: string | null;
    jersey: string | null;
  };
}

interface CommentRecord {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  users: {
    displayname: string;
    avatar?: string | null;
  };
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  displayname: string;
  content: string;
  avatar: string | null;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    is_admin: boolean;
    displayname: string;
    avatar?: string | null;
  } | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const postIdToOpen = searchParams.get("post");

  const fetchAll = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setCurrentUser(null);

    const { data: profile } = await supabase
      .from("users")
      .select("id, is_admin, displayname, avatar")
      .eq("id", user.id)
      .single();

    if (profile) {
      setCurrentUser({
        id: profile.id,
        is_admin: profile.is_admin ?? false,
        displayname: profile.displayname,
        avatar: profile.avatar || null,
      });
    }

    const { data, error } = await supabase.rpc(
      "fetch_posts_with_likes_and_counts",
      {
        current_user_id: user.id,
      }
    );

    if (!error && data) {
      setPosts(
        data.map((p: any) => ({
          ...p,
          author: {
            id: p.user_id,
            displayname: p.displayname,
            avatar: p.avatar,
            emoji: p.emoji,
            jersey: null,
          },
        }))
      );
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, post_id, user_id, content, users(displayname, avatar)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments((prev) => ({
        ...prev,
        [postId]: (data as CommentRecord[]).map((c) => ({
          id: c.id,
          post_id: c.post_id,
          user_id: c.user_id,
          content: c.content,
          displayname: c.users.displayname,
          avatar: c.users.avatar || null,
        })),
      }));
    }
  };

  const toggleComments = (post: PostWithAuthor) => {
    if (showCommentsFor === post.id) {
      setShowCommentsFor(null);
    } else {
      fetchComments(post.id);
      setShowCommentsFor(post.id);
    }
  };

  const submitComment = async (postId: string) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment || !currentUser) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUser.id,
      content: comment,
    });

    if (error) {
      toast.error("Fejl ved tilføjelse af kommentar");
      return;
    }
    const post = posts.find((p) => p.id === postId);
    if (post && post.user_id !== currentUser.id) {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: post.user_id,
          title: "Ny kommentar 💬",
          body: `${
            currentUser.displayname
          } har kommenteret på dit opslag: "${comment.slice(0, 50)}..."`,
          url: `/social?post=${post.id}`, // or a link to the post if you support it
        }),
      });
    }
    toast.success("Kommentar tilføjet!");

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchAll();
    fetchComments(postId);
  };

  const togglePin = async (postId: string, pinned: boolean) => {
    const { error } = await supabase
      .from("posts")
      .update({ pinned: !pinned })
      .eq("id", postId);

    if (error) {
      toast.error("Kunne ikke opdatere pin-status.");
    } else {
      toast.success(pinned ? "Unpinnet" : "Pinnet");
    }
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      toast.error("Kunne ikke slette opslag.");
    } else {
      toast.success("Opslag slettet.");
    }
  };

  const handleLike = async (postId: string, liked: boolean) => {
    if (!currentUser) return;

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUser.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: currentUser.id,
      });

      // Send notification to post owner
      const post = posts.find((p) => p.id === postId);
      if (post && post.user_id !== currentUser.id) {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: post.user_id,
            title: "Nyt like ❤️",
            body: `${
              currentUser.displayname
            } har liket dit opslag: "${post.content.slice(0, 50)}..."`,
            url: `/social?post=${post.id}`, // or a link to the post if you support it
          }),
        });
      }
    }

    fetchAll();
  };

  useEffect(() => {
    fetchAll().then(() => {
      if (postIdToOpen) {
        setShowCommentsFor(postIdToOpen);
        fetchComments(postIdToOpen);
        const el = document.getElementById(`post-${postIdToOpen}`);
      }
    });

    const channel = supabase
      .channel("posts-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_likes" },
        fetchAll
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
  fetchAll().then(() => {
    if (postIdToOpen) {
      setShowCommentsFor(postIdToOpen);
      fetchComments(postIdToOpen);
      const el = document.getElementById(`post-${postIdToOpen}`);
      if (el) {
          el.classList.add("ring-2", "ring-cyan-500", "transition");
          el.scrollIntoView({ behavior: "smooth", block: "start" });

          setTimeout(() => {
            el.classList.remove("ring-2", "ring-cyan-500");
          }, 2000);
        }
    }
  });

  // Real-time subscriptions...
}, []);


  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const canDelete =
          currentUser?.is_admin || currentUser?.id === post.user_id;

        return (
          <Card
            key={post.id}
            id={`post-${post.id}`} // 👈 this is the fix
            className={`bg-white/10 border-white/20 ${
              post.pinned ? "border-cyan-500 shadow-lg" : ""
            }`}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span>{post.author.emoji || "👤"}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">
                        {post.author.displayname}
                      </span>
                      {post.author.jersey && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs border-0">
                          {post.author.jersey}
                        </Badge>
                      )}
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(post.created_at).toLocaleTimeString("da-DK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-white/10 text-white border-white/20 backdrop-blur-md">
                    {currentUser?.is_admin && (
                      <DropdownMenuItem
                        onClick={() => togglePin(post.id, post.pinned)}
                      >
                        {post.pinned ? (
                          <PinOff className="h-4 w-4" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                        {post.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem onClick={() => deletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content */}
              <div className="text-white mb-4 whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id, post.liked_by_user)}
                  className={`text-white ${
                    post.liked_by_user ? "text-red-400" : "hover:text-red-300"
                  }`}
                >
                  <Heart
                    className="h-4 w-4 mr-2"
                    fill={post.liked_by_user ? "currentColor" : "none"}
                  />{" "}
                  {post.like_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post)}
                  className="text-white hover:text-blue-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />{" "}
                  {post.comment_count}
                </Button>
              </div>

              {/* Comments */}
              {showCommentsFor === post.id && (
                <div className="mt-4 border-t border-white/20 pt-4">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="flex items-start gap-2 mb-2">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="text-white/80">
                        <strong>{c.displayname}</strong>: {c.content}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="flex-1 rounded bg-white/10 text-white p-2 placeholder-white/50"
                      placeholder="Skriv en kommentar..."
                    />
                    <Button
                      onClick={() => submitComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      variant="ghost"
                      className="text-white"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
