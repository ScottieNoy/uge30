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
    audio_url?: string | null;
    users: {
      displayname: string;
      firstname: string;
      lastname: string;
      avatar_url: string;
      emoji: string;
    };
  };
  currentUserId: string | undefined;
  onImageClick: (imageUrl: string) => void;
}

const ChatMessage = ({
  message,
  currentUserId,
  onImageClick,
}: ChatMessageProps) => {
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

  const PlayIcon = ({
    className = "",
    id,
  }: {
    className?: string;
    id: string;
  }) => (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-5.197-3.028A1 1 0 008 9v6a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z"
      />
    </svg>
  );

  return (
    <>
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

            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className="mb-2">
                {message.images.length === 1 ? (
                  <img
                    src={message.images[0]}
                    alt="Shared"
                    className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity max-h-40 sm:max-h-48"
                    onClick={() =>
                      message.images && onImageClick(message.images[0])
                    }
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-1 max-w-48">
                    {message.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Shared ${index + 1}`}
                          className="w-full h-16 sm:h-20 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => onImageClick(image)}
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

            {/* Message Text */}
            {message.content && (
              <div className="text-sm break-words">{message.content}</div>
            )}
            {message.audio_url && (
              <div className="mt-2 flex items-center gap-3 w-full max-w-xs sm:max-w-sm bg-white/10 backdrop-blur rounded-lg p-2">
                <button
                  onClick={() => {
                    const audio = document.getElementById(
                      `audio-${message.id}`
                    ) as HTMLAudioElement;
                    if (audio?.paused) {
                      audio?.play();
                    } else {
                      audio?.pause();
                    }
                  }}
                  className="text-white hover:text-cyan-300 transition-colors duration-200"
                >
                  <PlayIcon
                    id={`play-icon-${message.id}`}
                    className="w-6 h-6"
                  />
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={0}
                  id={`seek-${message.id}`}
                  className="w-full accent-cyan-400 h-1 rounded-lg cursor-pointer"
                  onInput={(e) => {
                    const audio = document.getElementById(
                      `audio-${message.id}`
                    ) as HTMLAudioElement;
                    const input = e.target as HTMLInputElement;
                    if (audio?.duration) {
                      const time = (+input.value / 100) * audio.duration;
                      audio.currentTime = time;
                    }
                  }}
                />

                <audio
                  id={`audio-${message.id}`}
                  src={message.audio_url}
                  preload="metadata"
                  onTimeUpdate={(e) => {
                    const audio = e.currentTarget;
                    const seek = document.getElementById(
                      `seek-${message.id}`
                    ) as HTMLInputElement;
                    if (seek && audio.duration) {
                      seek.value = (
                        (audio.currentTime / audio.duration) *
                        100
                      ).toString();
                    }

                    const icon = document.getElementById(
                      `play-icon-${message.id}`
                    );
                    if (icon) {
                      icon.className = audio.paused
                        ? "w-6 h-6"
                        : "w-6 h-6 animate-pulse";
                    }
                  }}
                />
              </div>
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
    </>
  );
};

export default ChatMessage;
