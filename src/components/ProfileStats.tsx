"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { ActivityRow, JerseyData } from "@/types";
import EnableNotifications from "@/components/EnableNotificationsButton";

interface ProfileStatsProps {
  totalPoints: number;
  rank: number | string;
  joinedDate: string;
  jerseyData: JerseyData[];
  userId: string;
  activityFeed?: ActivityRow[];
}

const ProfileStats = ({
  totalPoints,
  rank,
  joinedDate,
  jerseyData,
  userId,
  activityFeed = [], // Optional activity feed prop
}: ProfileStatsProps) => {
  // Build breakdown based on user's presence in each jersey
  const breakdown = jerseyData
    .map((jersey) => {
      const userEntry = jersey.participants.find((p) => p.user.id === userId);
      if (!userEntry) return null;

      const RawIcon = Icons[jersey.icon as keyof typeof Icons];
      const IconComponent =
        (RawIcon as React.FC<React.SVGProps<SVGSVGElement>>) ?? Icons.Star;

      return {
        name: jersey.name,
        points: userEntry.total,
        icon: IconComponent,
        color: `${jersey.bg_color} ${jersey.color}`,
      };
    })
    .filter(Boolean) as {
    name: string;
    points: number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
  }[];

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Points Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {breakdown.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {category.points} pts
                    </div>
                    <div className="text-white/60 text-sm">{category.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm mb-4">
            {activityFeed && activityFeed.length > 0 ? (
              activityFeed
                .filter((a) => a.target_id === userId)
                .slice(0, 5) // Limit to max 5 entries
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-white/80 truncate max-w-[70%]">
                      {activity.note || activity.category}
                    </span>
                    <span
                      className="font-semibold text-white"
                      style={{
                        color: activity.jersey_color || "#00bcd4",
                      }} // Default color if none provided
                    >
                      +{activity.value} pts
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-white/50 italic">No recent activity</div>
            )}
          </div>

          <div className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
            <EnableNotifications />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
