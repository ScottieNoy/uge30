"use client";

import React, { useEffect, useState } from "react";
import PostCreation from "@/components/PostCreation";
import SocialFeed from "@/components/SocialFeed";
import ChatSection from "@/components/ChatSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const Social = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") === "chat" ? "chat" : "feed";
  const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
  const [showPostCreation, setShowPostCreation] = useState(false);

  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab === "chat" || newTab === "feed") {
      setActiveTab(newTab);
    }
  }, [searchParams]);

  return (
    <div className="h-[100dvh] flex flex-col px-4 pt-20 pb-4">
  {/* Header */}
  <div className="text-center mb-4">
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
      UGE30{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Social
      </span>
    </h1>
  </div>

  {/* Tab Navigation */}
  <div className="flex justify-center mb-4">
    <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
      <Button
        variant={activeTab === "feed" ? "default" : "ghost"}
        onClick={() => router.push("/social?tab=feed")}
        className={`rounded-full px-6 ${
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
        onClick={() => router.push("/social?tab=chat")}
        className={`rounded-full px-6 ${
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

  {/* Content */}
  <div className="flex-1 overflow-hidden">
    {activeTab === "feed" && (
      <div className="space-y-6 overflow-auto pr-2">
        {showPostCreation && (
          <PostCreation onClose={() => setShowPostCreation(false)} />
        )}
        <div className="text-center">
          <Button
            onClick={() => setShowPostCreation(!showPostCreation)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Post
          </Button>
        </div>
        <SocialFeed />
      </div>
    )}

    {activeTab === "chat" && <ChatSection />}
  </div>
</div>

  );
};

export default Social;
