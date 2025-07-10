"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { ActivityRow } from "@/types"; // Update path if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

const ActivityFeed = () => {
  const supabase = createClient();
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [showAll, setShowAll] = useState(false);
  

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from("v_activity_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setActivities(data as ActivityRow[]);
      }
    };

    fetchActivities();

    const channel = supabase
      .channel("realtime:points")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "points" }, fetchActivities)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const visibleActivities = showAll ? activities : activities.slice(0, 5);

  const getColorFromJersey = (color: string | null): string => {
    return color ?? "from-blue-500 to-purple-500";
  };

  const getActivityText = (activity: ActivityRow) => {
    if (activity.note) return activity.note;
    switch (activity.category) {
      case "beer":
        return `drak med ${activity.source_name}`;
      case "bonus":
        return `modtog bonus fra ${activity.source_name}`;
      default:
        return `interagerede med ${activity.target_name}`;
    }
  };

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Icons.Clock className="h-8 w-8 text-blue-400" />
              Seneste{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                aktiviteter
              </span>
            </CardTitle>
            <p className="text-blue-100">Point og interaktioner fra festivalen</p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {visibleActivities.map((activity, index) => {
                const IconComponent = Icons[activity.category_icon as keyof typeof Icons] as React.FC<React.SVGProps<SVGSVGElement>> || Icons.Activity;
                const colorGradient = getColorFromJersey(activity.jersey_color);

                return (
                  <div
                    key={activity.point_id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] animate-fade-in border border-white/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorGradient} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={activity.target_avatar ?? ""} />
                            <AvatarFallback>
                              {activity.target_name?.[0] ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-white">{activity.target_name}</span>
                          <span className="text-gray-300 text-sm">{getActivityText(activity)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {activity.jersey_name && (
                            <Badge
                              className={`bg-gradient-to-r ${colorGradient} text-white text-xs px-2 py-1`}
                            >
                              {activity.jersey_name}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Icons.Clock className="h-3 w-3" />
                            {activity.created_at && new Date(activity.created_at).toLocaleTimeString("da-DK", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorGradient}`}
                      >
                        +{activity.value}
                      </div>
                      <div className="text-xs text-gray-400">point</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length > 5 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {showAll ? "Skjul aktiviteter ↑" : "Vis alle aktiviteter →"}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ActivityFeed;
