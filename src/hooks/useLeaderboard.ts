"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  User,
  Jersey,
  JerseyData,
  ActivityRow,
  JerseyRow,
  CategoryRow,
  Category,
} from "@/types";

const formatCopenhagenTime = (dateString: string) => {
  const utcDate = new Date(dateString);
  const offsetMs = 2 * 60 * 60 * 1000;
  const localTime = new Date(utcDate.getTime() + offsetMs);
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const useLeaderboard = () => {
  const supabase = createClient();

  const [participants, setParticipants] = useState<User[]>([]);
  const [jerseyData, setJerseyData] = useState<JerseyData[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityRow[]>([]);
  const [allowedCategories, setAllowedCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: true });

      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      const { data: leaders } = await supabase
        .from("v_jersey_overall_leaders")
        .select("*");

      const { data: activities } = await supabase
        .from("v_activity_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!users || !categories || !leaders || !activities) {
        console.error("Failed to fetch one or more required tables");
        return;
      }

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
      const jerseyMap: Record<string, JerseyData> = {};

      for (const row of leaders) {
        if (row.jersey_id) {
          if (!jerseyMap[row.jersey_id]) {
            jerseyMap[row.jersey_id] = {
              id: row.jersey_id,
              name: row.jersey_name ?? "",
              icon: (row.jersey_icon as JerseyData["icon"]) ?? "Star",
              color: row.color ?? "text-gray-800",
              bg_color: row.bg_color ?? "bg-white",
              border_color: row.border_color ?? "border-gray-200",
              description: null,
              is_overall: row.is_overall,
              created_at: null,
              participants: [],
            };
          }

          const user = row.user_id ? userMap[row.user_id] : undefined;
          if (user) {
            jerseyMap[row.jersey_id].participants.push({
              user,
              total: row.total_points ?? 0,
              rank: row.rank ?? 0,
              trend: (row.rank ?? 0) <= 3 ? "up" : "down",
              change: `+${row.total_points}`,
            });
          }
        }
      }

      const recentActivity: ActivityRow[] = activities.map((activity) => ({
        ...activity,
        timestamp: formatCopenhagenTime(activity.created_at ?? ""),
        user: activity.target_name ?? "Ukendt", // 👈 display recipient
        target: activity.source_name ?? "Ukendt", // 👈 display assigner
        icon: "Activity",
        color: activity.jersey_color ?? "from-blue-500 to-cyan-500",
        points: activity.value ?? 0,
        message:
          activity.note ??
          `${activity.target_name ?? "Ukendt"} modtog ${activity.category} fra ${activity.source_name ?? "Ukendt"}`,
      }));

      setParticipants(users);
      setJerseyData(Object.values(jerseyMap));
      setAllowedCategories(categories);
      setActivityFeed(recentActivity);
    };

    fetchData();
  }, []);

  return {
    participants,
    jerseyBoards: jerseyData.reduce<Record<string, JerseyData["participants"]>>((acc, jersey) => {
      acc[jersey.id] = jersey.participants;
      return acc;
    }, {}),
    jerseyData,
    activityFeed,
    allowedCategories,
  };
};
