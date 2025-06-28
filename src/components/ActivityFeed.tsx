"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Activity } from "@/types";

const ActivityFeed = ({ activities }: { activities: Activity[] }) => {
  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "scan":
        return `scanned ${activity.target}'s QR code`;
      case "challenge":
        return `completed ${activity.target}`;
      case "bonus":
        return `earned bonus from ${activity.target}`;
      case "group":
        return `completed ${activity.target}`;
      default:
        return `interacted with ${activity.target}`;
    }
  };

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Icons.Clock className="h-8 w-8 text-blue-400" />
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Activities
              </span>
            </CardTitle>
            <p className="text-blue-100">
              Recent points and interactions from the festival
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = Icons[
                  activity.icon as keyof typeof Icons
                ] as React.FC<React.SVGProps<SVGSVGElement>>;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-102 animate-fade-in border border-white/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-white">
                            {activity.user}
                          </span>
                          <span className="text-gray-300 text-sm">
                            {getActivityText(activity)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`bg-gradient-to-r ${activity.color} text-white border-0 text-xs px-2 py-1`}
                          >
                            {activity.type.charAt(0).toUpperCase() +
                              activity.type.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Icons.Clock className="h-3 w-3" />
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${activity.color}`}
                      >
                        +{activity.points}
                      </div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                View All Activities →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ActivityFeed;
