import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import OnlineUsersList from "@/components/OnlineUsersList";
import { toast } from "sonner";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

const ChatSection = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChatMessages();
  const { onlineUsers } = useOnlineUsers(user?.id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
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

  // Scroll to bottom when messages change
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

  console.log("ChatSection: Current messages count:", messages.length);
  console.log("ChatSection: Messages:", messages);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 h-full max-h-full">
      {/* Chat Messages - Mobile first approach with fixed height */}
      <div className="lg:col-span-3 flex flex-col h-full max-h-full">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 flex flex-col h-full max-h-full">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-white text-lg">Festival Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0 max-h-full overflow-hidden">
            {/* Messages area with fixed height and scroll */}
            <div className="flex-1 min-h-0 max-h-full overflow-hidden">
              <ScrollArea
                className="h-[calc(100vh-400px)] sm:h-[calc(100vh-350px)] lg:h-[calc(100vh-250px)]"
                ref={scrollAreaRef}
              >
                <div className="px-4 py-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                    </div>
                  ) : (
                    <div className="space-y-3 pb-4">
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
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed input at bottom - always visible */}
            <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <ChatInput onSendMessage={handleSendMessage} disabled={!user} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block lg:col-span-1">
        <OnlineUsersList onlineUsers={onlineUsers} />
      </div>
    </div>
  );
};

export default ChatSection;
