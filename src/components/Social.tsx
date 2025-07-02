"use client";

import React, { useState } from "react";
import PostCreation from "@/components/PostCreation";
import SocialFeed from "@/components/SocialFeed";
import ChatSection from "@/components/ChatSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

const Social = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
  const [showPostCreation, setShowPostCreation] = useState(false);

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Social{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Hub
            </span>
          </h1>
          <p className="text-blue-100">Connect with fellow festival-goers</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <Button
              variant={activeTab === "feed" ? "default" : "ghost"}
              onClick={() => setActiveTab("feed")}
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
              onClick={() => setActiveTab("chat")}
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
        {activeTab === "feed" && (
          <div className="space-y-6">
            {/* Post Creation Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowPostCreation(!showPostCreation)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Post
              </Button>
            </div>

            {/* Post Creation Form */}
            {showPostCreation && (
              <PostCreation onClose={() => setShowPostCreation(false)} />
            )}

            {/* Social Feed */}
            <SocialFeed />
          </div>
        )}

        {activeTab === "chat" && <ChatSection />}
      </div>
    </div>
  );
};

export default Social;
