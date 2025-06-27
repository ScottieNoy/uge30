import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Tables } from "../../database.types";
import { JerseyCategoryConfig, User } from "@/types";

interface JerseyLeaderboardProps {
  jersey: JerseyCategoryConfig;
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
  const IconComponent = Icons[jersey.icon as keyof typeof Icons] as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Icons.Crown className="h-3 w-3 text-yellow-400" />;
      case 2:
        return <Icons.Medal className="h-3 w-3 text-gray-400" />;
      case 3:
        return <Icons.Award className="h-3 w-3 text-orange-400" />;
      default:
        return <span className="text-xs font-bold text-gray-400">#{rank}</span>;
    }
  };

  const topParticipants = participants.slice(0, 5);

  return (
    <Card
      className={`${jersey.bgColor} ${jersey.borderColor} border backdrop-blur-md`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${jersey.color} flex items-center justify-center shadow-md`}
            >
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-bold text-white">
              {jersey.name}
            </CardTitle>
          </div>
          <Badge
            className={`bg-gradient-to-r ${jersey.color} text-white border-0 px-2 py-1 text-xs`}
          >
            Top 5
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="space-y-1">
          {topParticipants.map((participant) => (
            <div
              key={participant.rank}
              className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {getRankIcon(participant.rank)}
                <div className="text-xs">{participant.user.emoji || "🙂"}</div>

                <div>
                  <span className="text-white text-xs font-medium">
                    {participant.user.firstname} {participant.user.lastname}
                  </span>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-gray-300">{participant.total}</span>
                    <div
                      className={`flex items-center ${
                        participant.trend === "up"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {participant.trend === "up" ? (
                        <Icons.TrendingUp className="h-2 w-2" />
                      ) : (
                        <Icons.TrendingDown className="h-2 w-2" />
                      )}
                      <span className="text-xs">{participant.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {topParticipants.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-xs">
              No participants yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JerseyLeaderboard;
