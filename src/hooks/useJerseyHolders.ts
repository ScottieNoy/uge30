// hooks/useJerseyHolders.ts
"use client";

import { createClient } from "@/lib/supabaseClient";
import useSWR from "swr";

// TypeScript type matching your view
export type JerseyHolder = {
  jersey_id: string;
  jersey_name: string;
  jersey_icon: string | null;
  user_id: string;
  displayname: string;
  total_points: number;
  color?: string; // Optional, if you want to include color
  bg_color?: string; // Optional, if you want to include background color
  border_color?: string; // Optional, if you want to include border color
  avatar_url?: string | null; // Optional avatar URL
  description?: string | null; // Optional description
};

// SWR fetcher using Supabase client
const fetchJerseyHolders = async (): Promise<JerseyHolder[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_jersey_holders_showcase")
    .select("*")
    .order("rank", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }

  return (data || []).map(
    (item): JerseyHolder => ({
      jersey_id: item.jersey_id ?? "",
      jersey_name: item.jersey_name ?? "",
      jersey_icon: item.jersey_icon ?? null,
      user_id: item.user_id ?? "",
      displayname: item.displayname ?? "",
      total_points: item.total_points ?? 0,
      color: item.color ?? "text-gray-800", // Default color if not provided
      bg_color: item.bg_color ?? "bg-white", // Default background color if not provided
      border_color: item.border_color ?? "border-gray-200", // Default border color if
      avatar_url: item.avatar_url ?? null, // Optional avatar URL
      description: item.jersey_description, // Optional description
    })
  );
};

// Hook
export function useJerseyHolders() {
  const { data, error, isLoading, mutate } = useSWR<JerseyHolder[]>(
    "v_jersey_holders_showcase",
    fetchJerseyHolders,
    {
      refreshInterval: 15000, // auto-refresh every 15s
      revalidateOnFocus: true, // revalidate on tab focus
    }
  );

  return {
    data: data ?? [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
