import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { JerseyRow, User } from "@/types";
import { UserIcon } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


interface JerseyLeaderboardProps {
  jersey: JerseyRow;
  participants: {
    user: User;
    total: number;
    rank: number;
    trend: "up" | "down";
    change: string;
  }[];
}


const JerseyLeaderboard = ({
  jersey,
  participants,
}: JerseyLeaderboardProps) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const IconComponent = Icons[jersey.icon as keyof typeof Icons] as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Icons.Crown className="h-4 w-4 text-yellow-600" />;
      case 2:
        return <Icons.Medal className="h-4 w-4 text-gray-600" />;
      case 3:
        return <Icons.Award className="h-4 w-4 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-gray-700">#{rank}</span>;
    }
  };

  const visibleParticipants = expanded
    ? participants.slice(0, 50)
    : participants.slice(0, 5);

  return (
    <Card
      className={`${jersey.bg_color} ${jersey.border_color} border backdrop-blur-md`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${jersey.color} flex items-center justify-center shadow-md`}
            >
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base font-bold text-gray-800">
              {jersey.name}
            </CardTitle>
          </div>
          <Badge
            className={`bg-gradient-to-r ${jersey.color} text-white border-0 px-2 py-1 text-xs font-semibold`}
          >
            {expanded ? "Top 50" : "Top 5"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {visibleParticipants.map((participant) => (
            <div
              key={`${jersey.id}-${participant.user.id}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors border border-white/10
  ${
    participant.user.id === user?.id
      ? "ring-2 ring-blue-500 bg-white/40"
      : participant.rank === 1
      ? "bg-yellow-100/30"
      : "bg-white/20 hover:bg-white/30"
  }`}

            >
              <div className="flex items-center space-x-3">
                {getRankIcon(participant.rank)}
                <div className="flex items-center justify-center space-x-2">
                  {participant.user.avatar_url ? (
                    <img
                      src={participant.user.avatar_url}
                      alt={participant.user.displayname}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-semibold truncate">
                    {participant.user.displayname}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-700 font-medium">
                    {participant.total} pts
                  </span>
                  <div
                    className={`flex items-center space-x-1 ${
                      participant.trend === "up"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {participant.trend === "up" ? (
                      <Icons.TrendingUp className="h-3 w-3" />
                    ) : (
                      <Icons.TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {participant.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {participants.length > 5 && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-gray-600 hover:underline"
              >
                {expanded ? "Vis færre" : "Se  alle"}
              </button>
            </div>
          )}

          {participants.length === 0 && (
            <div className="text-center py-6 text-gray-600 text-sm">
              No participants yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JerseyLeaderboard;