"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, UserIcon, Users as UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  user_id: string;
  displayname: string;
  avatar: string | null;
  message: string;
  created_at: string;
}

const ChatSection = () => {
  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then((u) => {
      setCurrentUserId(u.data.user?.id);
    });

    // Load latest 100 messages with author info
    supabase
      .from("chat_messages")
      .select(
        `
        id, message, created_at, user_id,
        users(displayname, avatar)
      `
      )
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data, error }) => {
        if (!error && data) {
          setMessages(
            data.map((msg: any) => ({
              id: msg.id,
              user_id: msg.user_id,
              message: msg.message,
              created_at: msg.created_at,
              displayname: msg.users.displayname,
              avatar: msg.users.avatar,
            }))
          );
          scrollToBottom();
        }
      });

    // Subscribe to new messages
    const channel = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload: any) => {
          const msg = payload.new;
          const { data: u } = await supabase
            .from("users")
            .select("displayname, avatar")
            .eq("id", msg.user_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              user_id: msg.user_id,
              message: msg.message,
              created_at: msg.created_at,
              displayname: u?.displayname ?? "Unknown",
              avatar: u?.avatar ?? null,
            },
          ]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || !currentUserId) return;

    await supabase.from("chat_messages").insert({
      user_id: currentUserId,
      message: text,
    });
    toast.success("Message sent!");
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .neq("id", currentUserId);

    if (users) {
      await Promise.all(
        users.map(async (user) => {
          const { data: userInfo } = await supabase
        .from("users")
        .select("displayname")
        .eq("id", user.id)
        .single();

          await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: `New Message from ${userInfo?.displayname || "Someone"} 🎉`,
          body: `${text.slice(0, 50)}...`,
          url: "/social?tab=chat", // Adjust URL as needed
        }),
          });
        })
      );
    }

    setMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Window */}
      <div className="lg:col-span-3">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Festival Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
  <div className="space-y-4">
    {messages.map((m) => {
      const isMe = m.user_id === currentUserId;
      return (
        <div
          key={m.id}
          className={`flex items-end gap-2 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          {/* Avatar on left for others*/}
          {!isMe && (
            <div className="flex-shrink-0">
              {m.avatar ? (
                <img
                  src={m.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              isMe
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <div className="text-sm">{m.message}</div>
            <div
              className={`text-xs mt-1 ${
                isMe ? "text-white/70" : "text-white/50"
              }`}
            >
              {new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</ScrollArea>


            {/* Input Field */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSend} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users Placeholder */}
      {/* <div className="lg:col-span-1">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Online (–)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="text-sm text-white/60">Coming soon…</Badge>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default ChatSection;
