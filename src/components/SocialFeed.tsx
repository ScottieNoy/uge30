"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    author: {
      name: "Emma Johnson",
      avatar: "🏆",
      jersey: "Førertrøjen",
    },
    content: "Just hit 1000 points! This festival is incredible! 🎉",
    timestamp: "2 hours ago",
    likes: 15,
    comments: 3,
    shares: 1,
  },
  {
    id: 2,
    author: {
      name: "Mike Chen",
      avatar: "🍺",
      jersey: "Gyldne Blærer",
    },
    content:
      "Anyone else loving the main stage lineup tonight? The energy is unreal! 🔥",
    timestamp: "4 hours ago",
    likes: 8,
    comments: 7,
    shares: 2,
  },
  {
    id: 3,
    author: {
      name: "Sarah Williams",
      avatar: "⚡",
      jersey: "Sprinter",
    },
    content:
      "Quick challenge completed at the food court! Who's joining me for the next one?",
    timestamp: "6 hours ago",
    likes: 12,
    comments: 5,
    shares: 0,
  },
];

const SocialFeed = () => {
  const handleLike = (postId: number) => {
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: number) => {
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId: number) => {
    console.log(`Share post ${postId}`);
  };

  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <Card
          key={post.id}
          className="bg-white/10 backdrop-blur-md border-white/20"
        >
          <CardContent className="p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">
                    {post.author.avatar}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {post.author.name}
                    </span>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                      {post.author.jersey}
                    </Badge>
                  </div>
                  <div className="text-white/60 text-sm">{post.timestamp}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Content */}
            <div className="text-white mb-4 leading-relaxed">
              {post.content}
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className="text-white hover:bg-white/10 hover:text-red-300 transition-colors"
              >
                <Heart className="h-4 w-4 mr-2" />
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleComment(post.id)}
                className="text-white hover:bg-white/10 hover:text-blue-300 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(post.id)}
                className="text-white hover:bg-white/10 hover:text-green-300 transition-colors"
              >
                <Share className="h-4 w-4 mr-2" />
                {post.shares}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialFeed;
