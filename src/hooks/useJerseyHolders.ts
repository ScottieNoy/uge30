// hooks/useJerseyHolders.ts
"use client";

import { createClient } from "@/lib/supabaseClient";
import useSWR from "swr";

// TypeScript type matching your view
export type JerseyHolder = {
  jersey_id: string;
  jersey_name: string;
  jersey_emoji: string | null;
  user_id: string;
  displayname: string;
  total_points: number;
};

// SWR fetcher using Supabase client
const fetchJerseyHolders = async (): Promise<JerseyHolder[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_jersey_overall_leaders")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }

  return (data || []).map(
    (item): JerseyHolder => ({
      jersey_id: item.jersey_id ?? "",
      jersey_name: item.jersey_name ?? "",
      jersey_emoji: item.jersey_emoji ?? null,
      user_id: item.user_id ?? "",
      displayname: item.displayname ?? "",
      total_points: item.total_points ?? 0,
    })
  );
};

// Hook
export function useJerseyHolders() {
  const { data, error, isLoading, mutate } = useSWR<JerseyHolder[]>(
    "v_jersey_overall_leaders",
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
