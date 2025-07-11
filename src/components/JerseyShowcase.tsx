"use client";

import React from "react";
import * as Icons from "lucide-react";
import { useJerseyHolders } from "@/hooks/useJerseyHolders";
import FlipCard from "./FlipCard";

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
          <p className="text-blue-100">Nuværende trøje holdere</p>
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
              <FlipCard
                key={jersey_id}
                jersey={jersey}
                jersey_id={jersey_id}
                index={index}
                bg_color={
                  bg_color || "bg-gradient-to-r from-blue-500 to-purple-500"
                }
                border_color={border_color || "border-blue-500"}
                color={color || "from-blue-500 to-purple-500"}
                IconComponent={IconComponent}
                displayname={displayname}
                total_points={total_points}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JerseyShowcase;
