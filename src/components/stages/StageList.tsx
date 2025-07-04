"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import StageCard from "@/components/stages/StageCard";

interface StageListProps {
  data?:
    | {
        id: string;
        title: string;
        description: string | null;
        emoji: string | null;
        position: number;
        created_at: string | null;
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

  // Sort by position to ensure correct order
  const sortedData = [...data].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4">
      {sortedData.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
};

export default StageList;
