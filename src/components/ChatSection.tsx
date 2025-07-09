"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatMessage from "@/components/chatMessage";
import ChatInput from "@/components/chatInput";
import OnlineUsersList from "@/components/OnlineUsersList";
import { toast } from "sonner";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { ScrollArea } from "./ui/scroll-area";

const ChatSection = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChatMessages();
  const { onlineUsers } = useOnlineUsers(user?.id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async (content: string, images?: File[]) => {
    if (!user) return;
    try {
      await sendMessage(content, user.id, images);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 h-full">
      {/* Main chat area */}
      <div className="lg:col-span-3 flex flex-col h-full">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 flex flex-col flex-1 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">UGE30 Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
            {/* Chat message area */}
            
            <ScrollArea
              className="h-[calc(100vh-400px)] sm:h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]"
              ref={scrollAreaRef}
            >
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-white/60 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <ChatMessage
                          key={msg.id}
                          message={msg}
                          currentUserId={user?.id}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

            </ScrollArea>
            {/* Input stays fixed below */}
              <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm flex-shrink-0">
                <ChatInput onSendMessage={handleSendMessage} disabled={!user} />
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Online users on larger screens */}
      <div className="hidden lg:block lg:col-span-1">
        <OnlineUsersList onlineUsers={onlineUsers} />
      </div>
    </div>
  );
};

export default ChatSection;
