"use client";

import {
  QrCode,
  Trophy,
  Users,
  Flame,
  Crown,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JerseyLeaderboard from "@/components/JerseyLeaderboard";
import FestivalCountdown from "@/components/FestivalCountdown";
import Link from "next/link";
import ActivityFeed from "@/components/ActivityFeed";
import JerseyShowcase from "@/components/JerseyShowcase";

import { JerseyCategory, jerseyConfigs, JerseyDisplay } from "@/types"; // adjust path as needed
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const { participants, jerseyBoards, jerseyData, activityFeed } =
    useLeaderboard();
  const router = useRouter();

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

  const jerseyItems = jerseyData.map((jersey, i) => ({
    ...jersey,
    animationDelay: `${i * 100}ms`,
  }));

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
              onClick={() => router.push("/scan")}
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
              <CalendarDays className="h-6 w-6 text-orange-300 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">Soon</div>
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
          {jerseyItems.map((jersey, i) => (
            <div key={jersey.id} className="animate-fade-in">
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
