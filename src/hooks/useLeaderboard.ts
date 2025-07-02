"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { User, JerseyCategory, JerseyBoardEntry, JerseyCategoryConfig, Activity, JerseyData, jerseyConfigs } from "@/types";
import { SUBCATEGORY_META } from "@/lib/utils";

// Utility function to format Copenhagen time
const formatCopenhagenTime = (dateString: string) => {
  const utcDate = new Date(dateString);
  const offsetMs = 2 * 60 * 60 * 1000; // Adjust for Copenhagen time zone (UTC +2)
  const localTime = new Date(utcDate.getTime() + offsetMs);
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

type JerseyScoreMap = Record<string, Record<JerseyCategory, number>>;
type JerseyBoards = Record<JerseyCategory, JerseyBoardEntry[]>;

export const useLeaderboard = () => {
  const supabase = createClient();
  const [participants, setParticipants] = useState<User[]>([]);
  const [jerseyBoards, setJerseyBoards] = useState<JerseyBoards>({} as JerseyBoards);
  const [jerseyData, setJerseyData] = useState<JerseyData[]>([]);
  const [activityFeed, setActivityFeed] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*");
      const { data: points } = await supabase.from("points").select("*").order("created_at", { ascending: true });

      if (!users || !points) return;

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
      const nonAdmins = users.filter((u) => !u.is_admin); // Exclude admins
      setParticipants(users);

      const jerseyScores: JerseyScoreMap = {};
      for (const user of nonAdmins) {
        jerseyScores[user.id] = Object.fromEntries(
          Object.keys(jerseyConfigs).map((key) => [key, 0])
        ) as Record<JerseyCategory, number>;
      }

      for (const point of points) {
        if (jerseyScores[point.user_id]) {
          jerseyScores[point.user_id][point.category] += point.value;
              console.log(`Assigning ${point.value} points to ${point.user_id} in category ${point.category}`);

          
          // Add the points to "førertroje"
          if (point.category !== "førertroje") {
            jerseyScores[point.user_id].førertroje += point.value;
                  console.log(`Adding ${point.value} points to "førertroje" for ${point.user_id}`);

          }
        }

        // Handle points submitted by others
        if (
          point.submitted_by &&
          point.user_id !== point.submitted_by &&
          jerseyScores[point.submitted_by]
        ) {
              console.log(`Adding points to flydende_haand for ${point.submitted_by}`);

          jerseyScores[point.submitted_by].flydende_haand += point.value;
        }
      }

      const boards: JerseyBoards = {} as JerseyBoards;
      (Object.keys(jerseyConfigs) as JerseyCategory[]).forEach((category) => {
        boards[category] = nonAdmins
          .map((user) => ({
            user,
            total: jerseyScores[user.id][category] || 0,
          }))
          .sort((a, b) => b.total - a.total); // Sort by total points
      });

      setJerseyBoards(boards);

      const transformedJerseyData: JerseyData[] = (
        Object.keys(boards) as JerseyCategory[]
      ).map((category) => ({
        id: category,
        name: jerseyConfigs[category].name ?? category,
        participants: boards[category].map((entry, idx) => ({
          user: entry.user,
          total: entry.total,
          rank: idx + 1,
          trend: idx < 3 ? "up" : "down",
          change: entry.total > 0 ? `+${entry.total}` : `${entry.total}`,
        })),
      }));

      setJerseyData(transformedJerseyData);

      const recentActivity = [...points]
        .reverse()
        .slice(0, 10)
        .map((point) => {
          const submitter = point.submitted_by ? userMap[point.submitted_by] : undefined;
          const target = userMap[point.user_id];
          const meta = SUBCATEGORY_META[point.subcategory];

          return {
            id: point.id,
            icon: meta.icon,
            color: meta.color,
            label: meta.label,
            user: `${submitter?.emoji || "👤"} ${submitter?.firstname || "Ukendt"}`,
            target: `${target?.emoji || "👤"} ${target?.firstname || "Ukendt"}`,
            points: point.value ?? 0,
            timestamp: formatCopenhagenTime(point.created_at || ""),
            type: point.subcategory,
            message: `${submitter?.firstname || "Ukendt"} loggede ${point.subcategory} for ${target?.firstname || "Ukendt"}`,
          };
        });

      setActivityFeed(recentActivity);
    };

    fetchData();
  }, []);

  return {
    participants,
    jerseyBoards,
    jerseyData,
    activityFeed,
  };
};
