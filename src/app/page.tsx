"use client";

import { QrCode, Trophy, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JerseyLeaderboard from "@/components/JerseyLeaderboard";
import FestivalCountdown from "@/components/FestivalCountdown";
import Link from "next/link";
import ActivityFeed from "@/components/ActivityFeed";
import JerseyShowcase from "@/components/JerseyShowcase";

import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useRouter } from "next/navigation";
import { useJerseys } from "@/hooks/useJerseys";

export default function Home() {
  const { participants, jerseyBoards, jerseyData, activityFeed } =
    useLeaderboard();
  const router = useRouter();
  const { jerseys } = useJerseys();

  const jerseyDisplay = jerseys
    .map((jersey) => {
      const entries = jerseyBoards[jersey.id];
      if (!entries || entries.length === 0) return null;
      const topEntry = entries[0];

      return {
        id: jersey.id,
        name: jersey.name,
        color: jersey.color,
        icon: jersey.icon,
        points: topEntry.total,
        holder: {
          name: `${topEntry.user.firstname} ${topEntry.user.lastname}`,
          avatar: topEntry.user.avatar_url,
          displayName:
            topEntry.user.displayname ||
            `${topEntry.user.firstname} ${topEntry.user.lastname}`,
        },
      };
    })
    .filter(Boolean);

  const jerseyItems = jerseyData.map((jersey, i) => ({
    ...jersey,
    icon: jersey.icon,
    color: jersey.color,
    bgColor: jersey.bg_color,
    borderColor: jersey.border_color,
    animationDelay: `${i * 100}ms`,
    created_at: jersey.created_at ?? null,
    description: jersey.description ?? null,
    is_overall: jersey.is_overall ?? null,
  }));

  const sortedJerseyItems = jerseyItems
    .map((jersey) => {
      // Get the top participant (first in the array after sorting)
      const topParticipant = jersey.participants[0];
      const topPoints = topParticipant ? topParticipant.total : 0;

      return {
        ...jersey,
        topPoints,
      };
    })
    .sort((a, b) => b.topPoints - a.topPoints); // Sort by topPoints descending

  return (
    <div>
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
            {/* <span className="text-white font-black text-3xl">U</span> */}
            <img
              className="h-30 w-30 object-contain"
              src="/uge30-logo.webp"
              alt="UGE Icon"
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            Scan, Drik,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Gentag!
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              onClick={() => router.push("/scan")}
            >
              <QrCode className="mr-3 h-6 w-6" /> Vis/Scan QR-Kode
            </Button>
          </div>
        </div>
      </section>

      {/* Stats + Countdown */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FestivalCountdown />
          <Link
            href="/participants"
            className="text-sm text-cyan-200 hover:underline"
          >
            <Card className="bg-white/10 text-center p-4">
              <CardContent className="p-0 lg:mt-10">
                <Users className="h-6 w-6 text-cyan-300 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {participants.length}
                </div>
                <div className="text-cyan-200 text-sm">Ryttere</div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white/10 text-center p-4">
            <CardContent className="p-0 lg:mt-10">
              <Trophy className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {Object.keys(jerseyBoards).length}
              </div>
              <div className="text-cyan-200 text-sm">Trøjer</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <JerseyShowcase />

      {/* Leaderboards */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Live{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Stilling
            </span>
          </h2>
          <p className="text-blue-100">De bedste performere i hver kategori</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedJerseyItems.map((jersey, i) => (
            <div key={jersey.id} className="animate-fade-in">
              <JerseyLeaderboard
                jersey={jersey}
                participants={jersey.participants}
              />
            </div>
          ))}
        </div>
      </section>

      <ActivityFeed />
    </div>
  );
}
