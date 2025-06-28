"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as Icons from "lucide-react";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { JERSEY_CATEGORIES, jerseyConfigs, User } from "@/types";

export default function Standings() {
  const [users, setUsers] = useState<User[]>([]);
  const [jerseyData, setJerseyData] = useState<Record<string, any[]>>({});
  const [visibleUsers, setVisibleUsers] = useState<string[]>(() =>
    users.map((u) => u.id)
  );
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [{ data: points }, { data: users }] = await Promise.all([
        supabase
          .from("points")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase.from("users").select("*"),
      ]);

      if (!points || !users) return;

      setUsers(users);
      setVisibleUsers(users.map((u) => u.id)); // Initialize with all users visible

      const userIds = users.map((u) => u.id);

      const jerseyChartData: Record<string, any[]> = {};

      const byJersey: Record<
        string,
        Record<string, Record<string, number>>
      > = {};

      points.forEach((p) => {
        const category = p.category;
        const time = new Date(p.created_at!).toLocaleTimeString("da-DK", {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!byJersey[category]) byJersey[category] = {};
        if (!byJersey[category][time]) byJersey[category][time] = {};
        byJersey[category][time][p.user_id] =
          (byJersey[category][time][p.user_id] || 0) + p.points;
      });

      for (const [category, timeData] of Object.entries(byJersey)) {
        const sortedTimes = Object.keys(timeData).sort(); // ensure chronological order

        const cumulative: Record<string, number> = {};
        userIds.forEach((id) => (cumulative[id] = 0));

        const data: any[] = [];

        // Start with zero row
        data.push({
          time: "00:00",
          ...Object.fromEntries(userIds.map((id) => [id, 0])),
        });

        for (const time of sortedTimes) {
          const row: any = { time };

          // Carry forward cumulative scores
          for (const id of userIds) {
            const earned = timeData[time]?.[id] ?? 0;
            cumulative[id] += earned;
            row[id] = cumulative[id];
          }

          data.push(row);
        }

        jerseyChartData[category] = data;
      }

      setJerseyData(jerseyChartData);
    };

    loadData();
  }, []);

  const chartConfig = users.reduce((acc, u) => {
    const colors = ["#f59e0b", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"];
    acc[u.id] = {
      label: u.firstname,
      color: colors[acc.length % colors.length],
    };
    return acc;
  }, [] as any);

  const chartColors: Record<string, string> = users.reduce(
    (acc: { [key: string]: string }, u) => {
      acc[u.id] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
      return acc;
    },
    {}
  );

  const toggleUserVisibility = (userId: string) => {
    setVisibleUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const hashColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 55%)`;
  };

  const getColorForUser = (userId: string) => hashColor(userId);

  return (
    <div className="pt-20 px-2 sm:px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <Icons.ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Detailed Standings
              </h1>
              <p className="text-sm sm:text-base text-blue-100">
                Jersey progression over time
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {JERSEY_CATEGORIES.map((j) => {
          const jersey = jerseyConfigs[j];
          const IconComponent = Icons[
            jersey.icon as keyof typeof Icons
          ] as React.FC<React.SVGProps<SVGSVGElement>>;
          return (
            <Card
              key={jersey.id}
              className="bg-white/10 backdrop-blur-md border-white/20"
            >
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${jersey.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base">{jersey.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ChartContainer className="h-48 sm:h-64" config={chartConfig}>
                  <LineChart
                    data={jerseyData[j]}
                    margin={{
                      top: 5,
                      right: (windowWidth ?? 1024) < 640 ? 10 : 20,
                      left: (windowWidth ?? 1024) < 640 ? 10 : 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      fontSize={(windowWidth ?? 1024) < 640 ? 10 : 12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={(windowWidth ?? 1024) < 640 ? 10 : 12}
                      tickLine={false}
                      axisLine={false}
                      width={(windowWidth ?? 1024) < 640 ? 30 : 60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />

                    {users.map((u) =>
                      visibleUsers.includes(u.id) ? (
                        <Line
                          key={u.id}
                          type="monotone"
                          dataKey={u.id}
                          stroke={getColorForUser(u.id)}
                          strokeWidth={(windowWidth ?? 1024) < 640 ? 1.5 : 2}
                          dot={{
                            fill: getColorForUser(u.id),
                            strokeWidth: 2,
                            r: (windowWidth ?? 1024) < 640 ? 3 : 4,
                          }}
                          isAnimationActive={false}
                        />
                      ) : null
                    )}
                  </LineChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-2 mb-4">
                  {users.map((user) => {
                    const isActive = visibleUsers.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => toggleUserVisibility(user.id)}
                        className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${
                          isActive
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getColorForUser(user.id) }}
                        />
                        {user.firstname}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
