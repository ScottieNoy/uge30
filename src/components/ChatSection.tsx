"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "./ui/scroll-area";

// Mock data for chat
const mockMessages = [
  {
    id: 1,
    author: "Emma",
    avatar: "🏆",
    message: "Hey everyone! Great festival so far!",
    timestamp: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: 2,
    author: "You",
    avatar: "⚡",
    message: "Absolutely! The main stage was incredible last night",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: 3,
    author: "Mike",
    avatar: "🍺",
    message: "Anyone going to the food court challenge at 2 PM?",
    timestamp: "10:35 AM",
    isCurrentUser: false,
  },
  {
    id: 4,
    author: "Sarah",
    avatar: "⚡",
    message: "Count me in! Need those sprinter points 😄",
    timestamp: "10:37 AM",
    isCurrentUser: false,
  },
];

const onlineUsers = [
  { name: "Emma", avatar: "🏆", status: "Leading" },
  { name: "Mike", avatar: "🍺", status: "Drinking" },
  { name: "Sarah", avatar: "⚡", status: "Active" },
  { name: "Alex", avatar: "🎯", status: "Competing" },
  { name: "John", avatar: "🌟", status: "Online" },
];

const ChatSection = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      author: "You",
      avatar: "⚡",
      message: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Messages */}
      <div className="lg:col-span-3">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Festival Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isCurrentUser
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {!msg.isCurrentUser && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">{msg.avatar}</span>
                          <span className="text-sm font-semibold">
                            {msg.author}
                          </span>
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.isCurrentUser ? "text-white/70" : "text-white/50"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
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

      {/* Online Users */}
      <div className="lg:col-span-1">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Online ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{user.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {user.name}
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatSection;
