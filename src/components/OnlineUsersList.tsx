"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface OnlineUser {
  user_id: string;
  online_at: string;
  user: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
  };
}

interface OnlineUsersListProps {
  onlineUsers: OnlineUser[];
}

const OnlineUsersList = ({ onlineUsers }: OnlineUsersListProps) => {
  const getDisplayName = (user: OnlineUser["user"]) => {
    return (
      user?.displayname ||
      `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
      "Anonymous User"
    );
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Online ({onlineUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onlineUsers.map((onlineUser, index) => (
            <div
              key={`${onlineUser.user_id}-${index}`}
              className="flex items-center space-x-3"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={onlineUser.user?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                  {onlineUser.user?.emoji ||
                    onlineUser.user?.firstname?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {getDisplayName(onlineUser.user)}
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Online
                </Badge>
              </div>
            </div>
          ))}
          {onlineUsers.length === 0 && (
            <div className="text-white/60 text-sm text-center py-4">
              No users online
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineUsersList;
