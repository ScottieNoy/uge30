"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    images: string[] | null;
    users: {
      displayname: string;
      firstname: string;
      lastname: string;
      avatar_url: string;
      emoji: string;
    };
  };
  currentUserId: string | undefined;
}

const ChatMessage = ({ message, currentUserId }: ChatMessageProps) => {
  const isCurrentUser = currentUserId === message.user_id;

  const getDisplayName = (user: ChatMessageProps["message"]["users"]) => {
    return (
      user.displayname ||
      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
      "Anonymous User"
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } px-2 sm:px-0`}
    >
      <div
        className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-xs ${
          isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {!isCurrentUser && (
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
            <AvatarImage src={message.users?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
              {message.users?.emoji || message.users?.firstname?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
            isCurrentUser
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              : "bg-white/10 text-white"
          }`}
        >
          {!isCurrentUser && (
            <div className="text-xs sm:text-sm font-semibold mb-1">
              {getDisplayName(message.users)}
            </div>
          )}

          {/* Images - mobile optimized */}
          {message.images && message.images.length > 0 && (
            <div className="mb-2">
              {message.images.length === 1 ? (
                <img
                  src={message.images[0]}
                  alt="Shared image"
                  className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity max-h-40 sm:max-h-48"
                  onClick={() =>
                    message.images && window.open(message.images[0], "_blank")
                  }
                />
              ) : (
                <div className="grid grid-cols-2 gap-1 max-w-48">
                  {message.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Shared image ${index + 1}`}
                        className="w-full h-16 sm:h-20 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image, "_blank")}
                      />
                      {index === 3 &&
                        message.images &&
                        message.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-xs font-medium">
                            +{message.images.length - 4}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Text content - mobile optimized */}
          {message.content && (
            <div className="text-sm break-words">{message.content}</div>
          )}

          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-white/70" : "text-white/50"
            }`}
          >
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
