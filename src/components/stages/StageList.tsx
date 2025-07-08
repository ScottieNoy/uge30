"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import StageCard from "@/components/stages/StageCard";

interface StageListProps {
  data?:
    | {
        id: string;
        created_at: string;
        name: string;
        date: string;
      }[]
    | null;
}

const StageList: React.FC<StageListProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Ingen etaper tilgængelige</p>
      </div>
    );
  }


  // Sort data by date (descending), or use as is if no date
  const sortedData = [...data].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedData.map((stage) => (
        <StageCard
          key={stage.id}
          stage={{
            ...stage,
            date: stage.date ?? null, // or set to null if you don't have a date
          }}
        />
      ))}
    </div>
  );
};

export default StageList;
