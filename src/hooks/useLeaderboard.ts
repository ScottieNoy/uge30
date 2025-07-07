"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  User,
  UserPoint,
  JerseyCategory,
  JerseyDisplay,
  JerseyCategoryConfig,
  Activity,
  JerseyData,
  jerseyConfigs,
} from "@/types";
import { SUBCATEGORY_META } from "@/lib/utils";

// Utility
const formatCopenhagenTime = (dateString: string) => {
  const utcDate = new Date(dateString);
  const offsetMs = 2 * 60 * 60 * 1000;
  const localTime = new Date(utcDate.getTime() + offsetMs);
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

type JerseyScoreMap = Record<string, Record<JerseyCategory, number>>;
type JerseyBoardEntry = { user: User; total: number };
type JerseyBoards = Record<JerseyCategory, JerseyBoardEntry[]>;

export const useLeaderboard = () => {
  const supabase = createClient();
  const [participants, setParticipants] = useState<User[]>([]);
  const [jerseyBoards, setJerseyBoards] = useState<JerseyBoards>(
    {} as JerseyBoards
  );
  const [jerseyData, setJerseyData] = useState<JerseyData[]>([]);
  const [activityFeed, setActivityFeed] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*");
      const { data: points } = await supabase
        .from("points")
        .select("*")
        .order("created_at", { ascending: true });

      if (!users || !points) return;

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
      const nonAdmins = users.filter((u) => !u.is_admin);
      setParticipants(
        users.map((u) => ({
          ...u,
          avatar_url: u.avatar_url ?? "",
          created_at: u.created_at ?? "",
          displayname: u.displayname ?? "",
          emoji: u.emoji ?? "",
          firstname: u.firstname ?? "",
          id: u.id,
          is_admin: u.is_admin ?? false,
          lastname: u.lastname ?? "",
          role: u.role ?? "",
          updated_at: u.updated_at ?? "",
        }))
      );

      const jerseyScores: JerseyScoreMap = {};
      for (const user of nonAdmins) {
        jerseyScores[user.id] = Object.fromEntries(
          Object.keys(jerseyConfigs).map((key) => [key, 0])
        ) as Record<JerseyCategory, number>;
      }

      for (const point of points) {
        if (
          point.user_id &&
          jerseyScores[point.user_id] &&
          point.category !== null &&
          point.category !== undefined
        ) {
          jerseyScores[point.user_id][point.category as JerseyCategory] +=
            point.value ?? 0;

          if (point.category !== "førertroje") {
            jerseyScores[point.user_id].førertroje += point.value ?? 0;
          }
        }

        if (
          point.submitted_by &&
          point.user_id !== point.submitted_by &&
          jerseyScores[point.submitted_by]
        ) {
          jerseyScores[point.submitted_by].flydende_haand += point.value ?? 0;
        }
      }

      const boards: JerseyBoards = {} as JerseyBoards;
      (Object.keys(jerseyConfigs) as JerseyCategory[]).forEach((category) => {
        boards[category] = nonAdmins
          .map((user) => ({
            user: {
              ...user,
              avatar_url: user.avatar_url ?? "",
              created_at: user.created_at ?? "",
              displayname: user.displayname ?? "",
              emoji: user.emoji ?? "",
              firstname: user.firstname ?? "",
              id: user.id,
              is_admin: user.is_admin ?? false,
              lastname: user.lastname ?? "",
              role: user.role ?? "",
              updated_at: user.updated_at ?? "",
            },
            total: jerseyScores[user.id][category] || 0,
          }))
          .sort((a, b) => b.total - a.total);
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

      const allowedTypes = [
        "beer",
        "wine",
        "vodka",
        "funnel",
        "shot",
        "beerpong",
        "cornhole",
        "dart",
        "billiard",
        "stigegolf",
        "bonus",
        "other",
      ] as const;

      const recentActivity = [...points]
        .reverse()
        .slice(0, 10)
        .map((point) => {
          const submitter = point.submitted_by
            ? userMap[point.submitted_by]
            : undefined;
          const target = point.user_id ? userMap[point.user_id] : undefined;
          const meta =
            point.category &&
            SUBCATEGORY_META[point.category as keyof typeof SUBCATEGORY_META]
              ? SUBCATEGORY_META[
                  point.category as keyof typeof SUBCATEGORY_META
                ]
              : { icon: "AlertCircle", color: "gray", label: "Ukendt" };

          // Ensure type is one of the allowed Activity types
          const type = allowedTypes.includes(point.category as any)
            ? (point.category as (typeof allowedTypes)[number])
            : "other";

          return {
            id: point.id,
            icon: meta.icon as Activity["icon"],
            color: meta.color,
            label: meta.label,
            user: `${submitter?.emoji || "👤"} ${
              submitter?.firstname || "Ukendt"
            }`,
            target: `${target?.emoji || "👤"} ${target?.firstname || "Ukendt"}`,
            points: point.value ?? 0,
            timestamp: formatCopenhagenTime(point.created_at || ""),
            type,
            message: `${submitter?.firstname || "Ukendt"} loggede ${
              point.category
            } for ${target?.firstname || "Ukendt"}`,
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
