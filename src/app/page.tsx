"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as Icons from "lucide-react";
import { QrCode, Trophy, Users, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JerseyLeaderboard from "@/components/JerseyLeaderboard";
import FestivalCountdown from "@/components/FestivalCountdown";
import Link from "next/link";
import ActivityFeed from "@/components/ActivityFeed";
import JerseyShowcase from "@/components/JerseyShowcase";

import {
  JerseyCategory,
  User,
  UserPoint,
  JerseyCategoryConfig,
  jerseyConfigs,
  JerseyDisplay,
  Activity,
} from "@/types"; // adjust path as needed
import { SUBCATEGORY_META } from "@/lib/utils";

// Example jerseyNames object typed
const jerseyNames: Record<JerseyCategory, string> = {
  gyldne_blaerer: "Gyldne Blærer",
  sprinter: "Sprinter",
  flydende_haand: "Flydende Hånd",
  førertroje: "Førertøj",
  maane: "Måne",
  prikket: "Prikket",
  punkttroje: "Punkttøj",
  ungdom: "Ungdom",
};

type JerseyScoreMap = Record<string, Record<JerseyCategory, number>>;

type JerseyBoardEntry = {
  user: User;
  total: number;
};

type JerseyBoards = Record<JerseyCategory, JerseyBoardEntry[]>;

function formatCopenhagenTime(dateString: string) {
  const utcDate = new Date(dateString);
  const offsetMs = 2 * 60 * 60 * 1000;
  const localTime = new Date(utcDate.getTime() + offsetMs);
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [activityFeed, setActivityFeed] = useState<Activity[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [jerseyBoards, setJerseyBoards] = useState<JerseyBoards>(
    {} as JerseyBoards
  );
  const [jerseyData, setJerseyData] = useState<
    {
      id: JerseyCategory;
      name: string;
      participants: {
        user: User;
        total: number;
        rank: number;
        trend: "up" | "down";
        change: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*");
      const { data: points } = await supabase
        .from("points")
        .select("*")
        .order("created_at", { ascending: true });

      if (!users || !points) return;

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
      setParticipants(users);
      const nonAdmins = users.filter((u) => !u.is_admin);

      // Initialize jerseyScores map with zeros
      const jerseyScores: JerseyScoreMap = {};
      for (const u of nonAdmins) {
        jerseyScores[u.id] = {
          gyldne_blaerer: 0,
          sprinter: 0,
          flydende_haand: 0,
          førertroje: 0,
          maane: 0,
          prikket: 0,
          punkttroje: 0,
          ungdom: 0,
        };
      }

      // Calculate scores
      for (const p of points) {
        if (jerseyScores[p.user_id]) {
          jerseyScores[p.user_id][p.category] += p.points;

          // Assuming 'førertroje' includes all points but dont add the points for 'førertroje' category twice
          if (p.category !== "førertroje") {
            jerseyScores[p.user_id].førertroje += p.points;
          }
        }
        if (
          p.submitted_by &&
          p.user_id !== p.submitted_by &&
          jerseyScores[p.submitted_by]
        ) {
          jerseyScores[p.submitted_by].flydende_haand += p.points;
        }
      }

      // Build leaderboard boards
      const boards: JerseyBoards = {} as JerseyBoards;
      (Object.keys(jerseyNames) as JerseyCategory[]).forEach((category) => {
        boards[category] = nonAdmins
          .map((u) => ({
            user: {
              ...u,
              emoji: u.emoji ?? "", // Ensure emoji is always a string
              is_admin: u.is_admin === null ? undefined : u.is_admin, // Ensure is_admin is boolean | undefined
              created_at: u.created_at ?? "", // Ensure created_at is always a string
              updated_at: u.updated_at ?? "", // Ensure updated_at is always a string
            },
            total: jerseyScores[u.id][category] || 0,
          }))
          .sort((a, b) => b.total - a.total);
      });

      setJerseyBoards(boards);

      // Transform for jerseyData state
      setJerseyData(
        (Object.keys(boards) as JerseyCategory[]).map((category) => ({
          id: category,
          name: jerseyNames[category] || "Unknown Jersey",
          participants: boards[category].map((entry, idx) => ({
            user: entry.user,
            total: entry.total,
            rank: idx + 1,
            trend: idx < 3 ? "up" : "down",
            change: entry.total > 0 ? `+${entry.total}` : `${entry.total}`,
          })),
        }))
      );

      const activityFeed = [...points]
        .reverse()
        .map((point) => {
          const target = userMap[point.user_id];
          const submitter = point.submitted_by
            ? userMap[point.submitted_by]
            : undefined;

          const meta = SUBCATEGORY_META[point.subcategory];

          return {
            id: point.id,
            icon: meta.icon,
            color: meta.color,
            label: meta.label,
            user: `${submitter?.emoji || "👤"} ${
              submitter?.firstname || "Ukendt"
            }`,
            target: `${target?.emoji || "👤"} ${target?.firstname || "Ukendt"}`,
            points: point.points ?? 0,
            timestamp: formatCopenhagenTime(point.created_at || ""),
            type: point.subcategory,
            message: `${submitter?.firstname} logged ${point.subcategory} for ${target?.firstname}`,
          };
        })
        .slice(0, 10); // Limit to last 10 activities
      setActivityFeed(activityFeed);
    };

    fetchData();
  }, []);

  // Construct jerseyDisplay for JerseyShowcase
  const jerseyDisplay = Object.entries(jerseyBoards)
    .map(([category, entries]) => {
      const topEntry = entries[0];
      if (!topEntry) return null;
      const jerseyConfig = jerseyConfigs[category as JerseyCategory];
      return {
        ...jerseyConfig,
        holder: `${topEntry.user.emoji}
          ${topEntry.user.firstname} ${topEntry.user.lastname}`,
        points: topEntry.total,
        icon: jerseyConfig.icon,
        // Ensure name is the category key, not the display string
        name: category as JerseyCategory,
      };
    })
    .filter(Boolean) as unknown as JerseyDisplay[];

  console.log(jerseyBoards);

  return (
    <div>
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-black text-3xl">U</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            UGE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              30
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Scan, Compete, Conquer the Festival!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            >
              <QrCode className="mr-3 h-6 w-6" /> Start Scanning
            </Button>
            <Link href="/standings">
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-300 text-cyan-100"
              >
                <Crown className="mr-2 h-5 w-5" /> View Standings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats + Countdown */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/10 text-center p-4">
            <CardContent className="p-0">
              <Users className="h-6 w-6 text-cyan-300 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {participants.length}
              </div>
              <div className="text-cyan-200 text-sm">Participants</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-center p-4">
            <CardContent className="p-0">
              <Trophy className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {Object.keys(jerseyBoards).length}
              </div>
              <div className="text-cyan-200 text-sm">Jerseys</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-center p-4">
            <CardContent className="p-0">
              <Flame className="h-6 w-6 text-orange-300 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">Live</div>
              <div className="text-cyan-200 text-sm">Competition</div>
            </CardContent>
          </Card>
          <FestivalCountdown />
        </div>
      </section>

      <JerseyShowcase jerseyDisplay={jerseyDisplay} />

      {/* Leaderboards */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Live{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Jersey Standings
            </span>
          </h2>
          <p className="text-blue-100">Top performers in each category</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jerseyData.map((jersey, i) => (
            <div
              key={jersey.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <JerseyLeaderboard
                jersey={jerseyConfigs[jersey.id as JerseyCategory]}
                participants={jersey.participants}
              />
            </div>
          ))}
        </div>
      </section>

      <ActivityFeed activities={activityFeed} />
    </div>
  );
}
