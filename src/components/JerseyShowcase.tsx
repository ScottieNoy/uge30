"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useJerseyHolders } from "@/hooks/useJerseyHolders";

const JerseyShowcase = () => {
  const { data, loading, error } = useJerseyHolders();

  if (loading) {
    return (
      <section className="px-4 py-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Loading Jerseys...
        </h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
          Error Loading Jerseys
        </h2>
        <p className="text-red-300">Please try refreshing the page.</p>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="px-4 py-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          No Jerseys Available
        </h2>
        <p className="text-blue-100">Check back later for jersey updates!</p>
      </section>
    );
  }

  // ✅ Deduplicate by jersey_id
  const uniqueJerseys = Array.from(
    new Map(data.map((j) => [j.jersey_id, j])).values()
  );

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            UGE30{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Trøjer
            </span>
          </h2>
          <p className="text-blue-100">Current jersey holders</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {uniqueJerseys.map((jersey, index) => {
            const {
              jersey_id,
              jersey_name,
              jersey_icon,
              displayname,
              total_points,
              color,
              bg_color,
              border_color,
            } = jersey;

            const IconComponent = Icons[
              jersey_icon as keyof typeof Icons
            ] as React.FC<React.SVGProps<SVGSVGElement>>;

            return (
              <Card
                key={jersey_id}
                className={`${bg_color} ${border_color} border-2 backdrop-blur-md hover:scale-105 transform transition-all duration-300 hover:shadow-xl animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
                  >
                    {IconComponent ? (
                      <IconComponent className="h-6 w-6" />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold mb-2 leading-tight">
                    {jersey_name}
                  </h3>

                  <div className="mb-2">
                    <Badge
                      className={`bg-gradient-to-r ${color} border-0 px-2 py-1 text-xs`}
                    >
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="mb-1">
                    <div className="flex items-center justify-center space-x-2">
                      {jersey.avatar_url ? (
                        <img
                          src={jersey.avatar_url}
                          alt="User Avatar"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-semibold truncate">
                        {displayname}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg font-bold bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    {total_points}
                  </p>
                  <p className="text-xs">points</p>
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
