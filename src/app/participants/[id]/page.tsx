"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { User } from "@/types";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileStats from "@/components/ProfileStats";
import { Button } from "@/components/ui/button";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useJerseyHolders } from "@/hooks/useJerseyHolders";

export default function ParticipantProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const { jerseyBoards, jerseyData, activityFeed } = useLeaderboard();
  const { data: jerseyHolders } = useJerseyHolders();

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const loadUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Deltageren blev ikke fundet.");
        router.push("/participants");
        return;
      }

      setUser(data);
    };

    loadUser();
  }, [id]);

  const maillotJaune = jerseyData.find((j) => j.name === "Maillot Jaune");
  const userStats = maillotJaune?.participants.find(
    (p) => p.user.id === user?.id
  );

  const totalPoints = userStats?.total ?? 0;
  const rank = userStats?.rank ?? "N/A";

  const participantJerseys = jerseyHolders.filter(
    (j) => j.user_id === user?.id
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Indlæser deltager...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900">
      <div className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbage
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.firstname} {user.lastname}
            </h1>
            <p className="text-blue-100">{user.displayname}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Deltagerprofil</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.avatar_url || ""}
                    alt={user.displayname}
                  />
                  <AvatarFallback className="bg-gray-600 text-white text-2xl">
                    {user.firstname?.[0] ?? ""}
                    {user.lastname?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold text-xl">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-blue-200">{user.displayname}</p>
                  <p className="text-white/50 text-sm mt-1">
                    Medlem siden{" "}
                    {new Date(user.created_at || "").toLocaleDateString(
                      "da-DK"
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ProfileStats
              totalPoints={totalPoints}
              rank={rank}
              joinedDate={user.created_at || ""}
              jerseyData={jerseyData}
              userId={user.id}
              activityFeed={activityFeed}
            />
          </div>

          {/* Right column: Jersey badges */}
          {participantJerseys.length > 0 && (
            <div className="space-y-6">
              {/* ✅ Overall Stats Card */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Samlet Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-200">
      {totalPoints}
    </div>
    <div className="text-gray-300 text-sm">Point i alt</div>
  </div>
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-400">
      #{rank}
    </div>
    <div className="text-gray-300 text-sm">Nuværende placering</div>
  </div>
  <div className="text-center">
    <div className="text-lg font-semibold text-teal-300">
      {new Date(user.created_at || "").toLocaleDateString("da-DK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}
    </div>
    <div className="text-gray-300 text-sm">Deltager siden</div>
  </div>
</CardContent>

              </Card>

              {/* ✅ Jersey badges (if any) */}
              {participantJerseys.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Aktive trøjer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {participantJerseys.map((j) => (
                      <div
                        key={j.jersey_id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-white/80">{j.jersey_name}</span>
                        <span
                          className="font-semibold text-white"
                          style={{ color: j.color }}
                        >
                          {j.total_points} pts
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
