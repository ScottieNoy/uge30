"use client";
import React from "react";
import * as Icons from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JerseyCategoryConfig, JerseyDisplay } from "@/types";

const jerseys = [
  {
    id: 1,
    name: "Gyldne Blærer",
    icon: Icons.Crown,
    color: "from-yellow-400 to-orange-500",
    holder: "Mike",
    points: 1247,
    bgColor: "bg-gradient-to-br from-yellow-400/20 to-orange-500/20",
    borderColor: "border-yellow-400/50",
  },
  {
    id: 2,
    name: "Sprinter",
    icon: Icons.Zap,
    color: "from-blue-400 to-cyan-400",
    holder: "Sarah",
    points: 1156,
    bgColor: "bg-gradient-to-br from-blue-400/20 to-cyan-400/20",
    borderColor: "border-blue-400/50",
  },
  {
    id: 3,
    name: "Flydende Hånd",
    icon: Icons.Flame,
    color: "from-red-500 to-pink-500",
    holder: "Alex",
    points: 1089,
    bgColor: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
    borderColor: "border-red-400/50",
  },
  {
    id: 4,
    name: "Førertrøje",
    icon: Icons.Trophy,
    color: "from-green-500 to-emerald-500",
    holder: "Emma",
    points: 967,
    bgColor: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-400/50",
  },
  {
    id: 5,
    name: "Måne",
    icon: Icons.Star,
    color: "from-purple-500 to-indigo-500",
    holder: "John",
    points: 834,
    bgColor: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-400/50",
  },
  {
    id: 6,
    name: "Prikket",
    icon: Icons.Target,
    color: "from-orange-500 to-red-500",
    holder: "Lisa",
    points: 756,
    bgColor: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-400/50",
  },
  {
    id: 7,
    name: "Punkttrøje",
    icon: Icons.Heart,
    color: "from-pink-500 to-rose-500",
    holder: "David",
    points: 623,
    bgColor: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-400/50",
  },
  {
    id: 8,
    name: "Ungdom",
    icon: Icons.Gem,
    color: "from-cyan-400 to-blue-500",
    holder: "Maria",
    points: 589,
    bgColor: "bg-gradient-to-br from-cyan-400/20 to-blue-500/20",
    borderColor: "border-cyan-400/50",
  },
];

const JerseyShowcase = ({
  jerseyDisplay,
}: {
  jerseyDisplay?: JerseyDisplay[] | null;
}) => {
  if (!jerseyDisplay || jerseyDisplay.length === 0) {
    return (
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            No Jerseys Available
          </h2>
          <p className="text-blue-100">Check back later for jersey updates!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Festival{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Jerseys
            </span>
          </h2>
          <p className="text-blue-100">Current jersey holders</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jerseyDisplay.map((jersey, index) => {
            const IconComponent = Icons[
              jersey.icon as keyof typeof Icons
            ] as React.FC<React.SVGProps<SVGSVGElement>>;
            return (
              <Card
                key={jersey.id}
                className={`${jersey.bgColor} ${jersey.borderColor} border-2 backdrop-blur-md hover:scale-105 transform transition-all duration-300 hover:shadow-xl animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${jersey.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-tight">
                    {jersey.name}
                  </h3>

                  <div className="mb-2">
                    <Badge
                      className={`bg-gradient-to-r ${jersey.color} text-white border-0 px-2 py-1 text-xs`}
                    >
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="text-white">
                    <p className="font-semibold text-sm mb-1">
                      {jersey.points > 0 ? jersey.holder : "No Holder"}
                    </p>
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                      {jersey.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-300">points</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JerseyShowcase;
