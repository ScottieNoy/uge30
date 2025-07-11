"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PostCreation from "@/components/PostCreation";
import SocialFeed from "@/components/SocialFeed";
import ChatSection from "@/components/ChatSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface SocialFeedProps {
  // your props here
  onPostCreated?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ref?: React.Ref<SocialFeedHandle>;
  postId?: string; // optional post ID for direct linking

  [key: string]: any; // allow additional props
}

export interface SocialFeedHandle {
  refreshPosts: () => void;
}

const Social = forwardRef<SocialFeedHandle, SocialFeedProps>((props, ref) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
  const [postId, setPostId] = useState<string | null>(null);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const socialFeedRef = useRef<{ refreshPosts: () => void }>(null);

  const handlePostCreated = () => {
    // Trigger a refresh of the social feed
    if (socialFeedRef.current?.refreshPosts) {
      socialFeedRef.current.refreshPosts();
    }
  };
  // Extract postId from searchParams at the top level
  useEffect(() => {
    const newTab = searchParams.get("tab");
    const newPostId = searchParams.get("post");
    if (newPostId) {
      setPostId(newPostId);
      // Optionally, you can scroll to the post or highlight it
      // e.g., socialFeedRef.current?.scrollToPost(newPostId);
    } else {
      setPostId(null);
    }
    if (newTab === "chat" || newTab === "feed") {
      setActiveTab(newTab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewImage]);

  useEffect(() => {
    const handleEscKey = (event: { key: string }) => {
      if (event.key === "Escape" && previewImage) {
        setPreviewImage(null);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [previewImage]);

  useImperativeHandle(ref, () => ({
    refreshPosts: () => {
      // implement refresh logic here
    },
  }));

  return (
    <div className="flex-1 flex flex-col pt-20 px-4 pb-4 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Header - Mobile optimized */}
        <div className="text-center mb-4 sm:mb-8 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            UGE30{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Social
            </span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Her kan du dele UGE30 relateret indhold, chatte med andre deltagere
            og finde information om festivalen.
          </p>
        </div>

        {/* Tab Navigation - Mobile first */}
        <div className="flex justify-center mb-4 sm:mb-6 flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <Button
              variant={activeTab === "feed" ? "default" : "ghost"}
              onClick={() => setActiveTab("feed")}
              className={`rounded-full px-4 sm:px-6 text-sm sm:text-base ${
                activeTab === "feed"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Feed
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              onClick={() => setActiveTab("chat")}
              className={`rounded-full px-4 sm:px-6 text-sm sm:text-base ${
                activeTab === "chat"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Content - Full height for mobile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "feed" && (
            <div className="space-y-6 h-full overflow-auto">
              {/* Post Creation Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowPostCreation(!showPostCreation)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Opret Indlæg
                </Button>
              </div>

              {/* Post Creation Form */}
              {showPostCreation && (
                <PostCreation
                  onClose={() => setShowPostCreation(false)}
                  onPostCreated={handlePostCreated}
                />
              )}

              {/* Social Feed */}
              <SocialFeed
                ref={socialFeedRef}
                highlightedPostId={postId ?? undefined}
              />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="h-full">
              <ChatSection onImageClick={setPreviewImage} />
            </div>
          )}
        </div>
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-preview-title"
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container with loading state */}
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={previewImage}
                alt="Preview"
                className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                onLoad={(e) => {
                  // Optional: handle load success
                  e.currentTarget.classList.add("animate-fade-in");
                }}
                onError={(e) => {
                  // Optional: handle load error
                  console.error("Failed to load image:", previewImage);
                }}
              />

              {/* Subtle overlay gradient for better button visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none rounded-xl" />
            </div>

            {/* Close button - repositioned and improved */}
            <Button
              onClick={() => setPreviewImage(null)}
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-black shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent border border-gray-200/50"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Social;
