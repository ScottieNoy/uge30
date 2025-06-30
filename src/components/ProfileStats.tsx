"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Flame, Star, Crown, Zap } from "lucide-react";

interface ProfileStatsProps {
  totalPoints: number;
  rank: number;
  joinedDate: string;
}

const ProfileStats = ({ totalPoints, rank, joinedDate }: ProfileStatsProps) => {
  // Mock data for different categories - in real app this would come from props/API
  const categoryStats = [
    {
      name: "Competition",
      points: 150,
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Drink",
      points: 75,
      icon: Flame,
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Challenge",
      points: 50,
      icon: Target,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Bonus",
      points: 20,
      icon: Star,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const achievements = [
    {
      name: "First Win",
      description: "Won your first competition",
      earned: true,
    },
    {
      name: "Party Animal",
      description: "Completed 10 drink challenges",
      earned: true,
    },
    {
      name: "Champion",
      description: "Reached top 3 in rankings",
      earned: true,
    },
    { name: "Legend", description: "Earned 500+ points", earned: false },
  ];

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Points Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {categoryStats.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
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

      {/* Achievements */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.earned
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {achievement.earned ? (
                    <Star className="h-4 w-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold ${
                      achievement.earned ? "text-green-400" : "text-white/60"
                    }`}
                  >
                    {achievement.name}
                  </div>
                  <div className="text-white/50 text-sm">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
